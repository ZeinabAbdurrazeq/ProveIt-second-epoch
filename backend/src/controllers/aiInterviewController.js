import { createRequire } from "module";
import CandidateProfile from "../models/CandidateProfile.js";
import AIInterviewSession from "../models/AIInterviewSession.js";
import Subscription from "../models/Subscription.js";
import {
  analyzeCv,
  analyzeCvFromImages,
  evaluateAnswer,
  generateInterviewFeedback,
  generateInterviewQuestions,
} from "../lib/openai.js";
import { inngest } from "../lib/inngest.js";

// Minimum number of questions an interview must have to be valid.
const MIN_QUESTIONS = 5;

// pdf-parse runs debug code at the top of its index.js when imported directly,
// which throws in some environments. Import the internal implementation module
// to avoid that, using createRequire so it works under ESM.
const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse/lib/pdf-parse.js");

// Convert a PDF buffer into an array of PNG page buffers. Used as an OCR
// fallback (via gpt-4o-mini vision) when a PDF has no extractable text layer.
// Uses mupdf (WebAssembly) so there is no native canvas dependency.
async function pdfToPngBuffers(pdfBuffer) {
  const mupdf = await import("mupdf");

  // Open the PDF from the in-memory buffer.
  const doc = mupdf.Document.openDocument(pdfBuffer, "application/pdf");

  const pageCount = doc.countPages();
  // Cap pages to keep the vision request reasonable.
  const maxPages = Math.min(pageCount, 5);

  // Render at ~2x (DPI 144) for crisp text the model can read reliably.
  const scale = 2;
  const matrix = mupdf.Matrix.scale(scale, scale);

  const buffers = [];
  for (let i = 0; i < maxPages; i++) {
    const page = doc.loadPage(i);
    const pixmap = page.toPixmap(
      matrix,
      mupdf.ColorSpace.DeviceRGB,
      false, // no alpha
    );
    const png = pixmap.asPNG();
    buffers.push(Buffer.from(png));
  }

  return buffers;
}

// POST /api/ai-interview/upload-cv
// Accepts a single PDF (multer memory storage, field name "cv"), extracts the
// text, sends it to GPT for analysis, and upserts the user's CandidateProfile.
export async function uploadCV(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: "No CV file uploaded" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ msg: "Only PDF files are allowed" });
    }

    // Extract text from the uploaded PDF buffer.
    let cvText = "";
    try {
      const parsed = await pdfParse(req.file.buffer);
      cvText = (parsed.text || "").trim();
    } catch (error) {
      // A parse failure here is not fatal: we can still try the image fallback.
      console.error("Failed to parse PDF text layer:", error.message);
    }

    // Analyze the CV. Prefer the extracted text; if the PDF has no text layer
    // (scanned / image-based), fall back to rendering the pages to images and
    // reading them with gpt-4o-mini vision.
    let analysis;
    if (cvText) {
      analysis = await analyzeCv(cvText);
    } else {
      try {
        const imageBuffers = await pdfToPngBuffers(req.file.buffer);
        analysis = await analyzeCvFromImages(imageBuffers);
      } catch (error) {
        console.error("Image-based CV analysis failed:", error.message);
        return res.status(400).json({
          msg:
            "We couldn't read this PDF. Please make sure it is a valid CV and " +
            "try again, ideally a PDF where the text can be selected.",
        });
      }
    }

    // Build a short text summary we feed back into GPT during the interview.
    const cvSummary = [
      `Primary field: ${analysis.primaryField}`,
      `Years of experience: ${analysis.yearsOfExperience}`,
      `Key skills: ${(analysis.keySkills || []).join(", ")}`,
      `Strongest areas: ${(analysis.strongestAreas || []).join(", ")}`,
      `Notable technologies: ${(analysis.notableTechnologies || []).join(", ")}`,
    ].join("\n");

    // Upsert the profile (keep interview-progress fields intact on re-upload).
    const profile = await CandidateProfile.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          primaryField: analysis.primaryField,
          yearsOfExperience: analysis.yearsOfExperience,
          keySkills: analysis.keySkills || [],
          strongestAreas: analysis.strongestAreas || [],
          notableTechnologies: analysis.notableTechnologies || [],
          cvSummary,
        },
        $setOnInsert: { userId: req.user._id },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({ profile });
  } catch (error) {
    console.error("Error in uploadCV controller:", error.message);
    res.status(500).json({ msg: "Failed to analyze CV" });
  }
}

// GET /api/ai-interview/profile
// Returns the current user's CandidateProfile, or null if none exists yet.
export async function getProfile(req, res) {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user._id });
    res.status(200).json({ profile: profile || null });
  } catch (error) {
    console.error("Error in getProfile controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

// --- Paywall hook (Feature 6 of the subscription branch) -------------------
// The subscription branch already ships checkAiInterviewLimit /
// incrementAiInterviewUsage as Express handlers. Those can't be called
// directly from here without refactoring them into services, so we mirror the
// free=3/month + pro/premium=unlimited logic against the Subscription model.
//
// Kept behind a flag so it is a no-op until the subscription and AI-interview
// branches are merged into main together.
// TODO: set PAYWALL_ENABLED = true once both branches are merged.
const PAYWALL_ENABLED = false;

async function checkAndConsumeInterviewQuota(userId) {
  if (!PAYWALL_ENABLED) return { canProceed: true };

  const subscription = await Subscription.findOne({ userId });
  // No subscription record yet => treat as free with full allowance.
  if (!subscription) return { canProceed: true };

  // Monthly reset if the billing period has passed.
  const now = new Date();
  if (subscription.currentPeriodEnd && now > subscription.currentPeriodEnd) {
    subscription.aiInterviewsUsedThisMonth = 0;
    subscription.currentPeriodStart = now;
    subscription.currentPeriodEnd = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    );
  }

  const unlimited =
    subscription.plan === "pro" || subscription.plan === "premium";

  if (!unlimited && subscription.aiInterviewsUsedThisMonth >= 3) {
    return {
      canProceed: false,
      message: "You have used all 3 free AI interviews this month",
      upgradeRequired: true,
    };
  }

  subscription.aiInterviewsUsedThisMonth += 1;
  await subscription.save();
  return { canProceed: true };
}

// POST /api/ai-interview/start
// Creates a new AIInterviewSession using the RAG question selection, and
// returns the sessionId, the question list, and the first question text.
export async function startInterview(req, res) {
  try {
    const profile = await CandidateProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "Please upload your CV before starting an interview" });
    }

    // Paywall (no-op until enabled).
    const quota = await checkAndConsumeInterviewQuota(req.user._id);
    if (!quota.canProceed) {
      return res.status(402).json({
        msg: quota.message,
        upgradeRequired: true,
      });
    }

    // Generate fresh, stack-specific spoken questions with GPT, biased toward
    // the candidate's previously weak topics so the interview adapts over time.
    const weakTopics = profile.topicWeaknesses
      ? Object.keys(profile.topicWeaknesses)
      : [];
    const language = String(req.body.language || "en").toLowerCase().startsWith("ar")
      ? "ar"
      : "en";

    let selected;
    try {
      selected = await generateInterviewQuestions({
        cvSummary: profile.cvSummary,
        primaryField: profile.primaryField,
        weakTopics,
        language,
      });
    } catch (genError) {
      console.error("Question generation failed:", genError.message);
      return res
        .status(500)
        .json({ msg: "Could not prepare your interview, please try again" });
    }

    if (!selected || selected.length < MIN_QUESTIONS) {
      return res.status(404).json({
        msg: "No questions available, please contact support",
      });
    }

    const session = await AIInterviewSession.create({
      userId: req.user._id,
      cvAnalysis: {
        primaryField: profile.primaryField,
        yearsOfExperience: profile.yearsOfExperience,
        keySkills: profile.keySkills,
        strongestAreas: profile.strongestAreas,
        notableTechnologies: profile.notableTechnologies,
        cvSummary: profile.cvSummary,
      },
      questions: selected.map((q) => ({
        questionText: q.questionText,
        topic: q.topic || "general",
        difficulty: q.difficulty || "medium",
      })),
      language,
      status: "in-progress",
    });

    res.status(201).json({
      sessionId: session._id,
      totalQuestions: session.questions.length,
      firstQuestion: session.questions[0].questionText,
    });
  } catch (error) {
    console.error("Error in startInterview controller:", error.message);
    res.status(500).json({ msg: "Failed to start interview" });
  }
}

// POST /api/ai-interview/:sessionId/answer
// Body: { questionIndex, answer, timeSpent, isFollowUp, skipped }
// Evaluates the answer with GPT, stores score + feedback, and returns either
// the next question or a completion signal, plus a follow-up flag.
export async function submitAnswer(req, res) {
  try {
    const { sessionId } = req.params;
    const {
      questionIndex,
      answer = "",
      timeSpent = 0,
      isFollowUp = false,
      skipped = false,
    } = req.body;

    const session = await AIInterviewSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ msg: "Session not found" });
    if (session.status === "completed") {
      return res.status(400).json({ msg: "Interview already completed" });
    }

    const index = Number(questionIndex);
    const current = session.questions[index];
    if (!current) {
      return res.status(400).json({ msg: "Invalid question index" });
    }

    // Skipped question: zero score, no GPT call, no follow-up.
    if (skipped) {
      current.userAnswer = "";
      current.aiFeedback = "Question skipped.";
      current.score = 0;
      current.timeSpent = Number(timeSpent) || 0;
      current.followUpAsked = false;
      await session.save();
    } else if (isFollowUp) {
      // Store the follow-up answer against the same question (no re-scoring).
      current.followUpAnswer = answer;
      current.timeSpent += Number(timeSpent) || 0;
      await session.save();
    } else {
      // Main answer: evaluate with GPT.
      const cvSummary = session.cvAnalysis?.cvSummary || "";
      const userField = session.cvAnalysis?.primaryField || "fullstack";

      const evaluation = await evaluateAnswer(
        current.questionText,
        answer,
        cvSummary,
        userField,
        session.language || "en",
      );

      current.userAnswer = answer;
      current.aiFeedback = evaluation.feedback || "";
      current.score = Math.max(0, Math.min(10, Number(evaluation.score) || 0));
      current.timeSpent = Number(timeSpent) || 0;
      current.followUpAsked = !!evaluation.askFollowUp;
      await session.save();

      if (evaluation.askFollowUp && evaluation.followUpQuestion) {
        return res.status(200).json({
          askFollowUp: true,
          followUpQuestion: evaluation.followUpQuestion,
          questionIndex: index,
          isComplete: false,
        });
      }
    }

    // Move to the next main question, if any.
    const nextIndex = index + 1;
    if (nextIndex < session.questions.length) {
      return res.status(200).json({
        askFollowUp: false,
        isComplete: false,
        questionIndex: nextIndex,
        nextQuestion: session.questions[nextIndex].questionText,
      });
    }

    // No more questions: the interview is complete.
    return res.status(200).json({ askFollowUp: false, isComplete: true });
  } catch (error) {
    console.error("Error in submitAnswer controller:", error.message);
    res.status(500).json({ msg: "Failed to submit answer" });
  }
}

// GET /api/ai-interview/:sessionId
// Read-only fetch of a session (used to resume/refresh an interview without
// mutating it). Never generates the scorecard or changes the status.
export async function getSession(req, res) {
  try {
    const { sessionId } = req.params;

    const session = await AIInterviewSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ msg: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in getSession controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

// GET /api/ai-interview/:sessionId/results
// Generates the overall scorecard, marks the session completed, fires the
// progress-tracking Inngest event, and returns the full results.
export async function getResults(req, res) {
  try {
    const { sessionId } = req.params;

    const session = await AIInterviewSession.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!session) return res.status(404).json({ msg: "Session not found" });

    // If already finalized, just return it (idempotent).
    if (session.status === "completed") {
      return res.status(200).json({ session });
    }

    const cvSummary = session.cvAnalysis?.cvSummary || "";
    const scorecard = await generateInterviewFeedback(
      session.questions,
      cvSummary,
      session.language || "en",
    );

    // Trust our own per-question average for overallScore rather than GPT's,
    // so it always matches the displayed per-question scores.
    const scored = session.questions.filter((q) => typeof q.score === "number");
    const computedAverage =
      scored.length > 0
        ? scored.reduce((sum, q) => sum + q.score, 0) / scored.length
        : 0;

    session.overallScore = Math.round(computedAverage * 10) / 10;
    session.overallFeedback = scorecard.overallFeedback || "";
    session.strengths = scorecard.strengths || [];
    session.weaknesses = scorecard.weaknesses || [];
    session.status = "completed";
    await session.save();

    // Fire the background progress-tracking job (Feature 6).
    try {
      await inngest.send({
        name: "ai-interview/completed",
        data: { sessionId: session._id.toString() },
      });
    } catch (sendError) {
      // Don't fail the request if the event can't be queued.
      console.error(
        "Failed to send ai-interview/completed event:",
        sendError.message,
      );
    }

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in getResults controller:", error.message);
    res.status(500).json({ msg: "Failed to generate results" });
  }
}

// GET /api/ai-interview/history
// Returns all of the current user's past interview sessions, newest first.
export async function getHistory(req, res) {
  try {
    const sessions = await AIInterviewSession.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getHistory controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
