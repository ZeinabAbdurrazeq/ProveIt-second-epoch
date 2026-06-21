import OpenAI from "openai";
import { ENV } from "./env.js";

const MOCK_MODE =
  String(ENV.OPENAI_MOCK_MODE || "").toLowerCase() === "true" ||
  ENV.OPENAI_MOCK_MODE === "1";

// Single shared OpenAI client. The key lives in .env as OPENAI_API_KEY.
export const openai =
  !MOCK_MODE && ENV.OPENAI_API_KEY
    ? new OpenAI({ apiKey: ENV.OPENAI_API_KEY })
    : null;

const MODEL = "gpt-4o-mini";

const MOCK_FIELD_TEMPLATES = {
  frontend: {
    yearsOfExperience: 3,
    keySkills: ["React", "JavaScript", "UI development"],
    strongestAreas: ["component design", "state management", "frontend workflows"],
    notableTechnologies: ["React", "HTML", "CSS", "JavaScript"],
  },
  backend: {
    yearsOfExperience: 4,
    keySkills: ["Node.js", "APIs", "databases"],
    strongestAreas: ["server-side development", "API design", "database modeling"],
    notableTechnologies: ["Node.js", "Express", "MongoDB", "REST"],
  },
  fullstack: {
    yearsOfExperience: 4,
    keySkills: ["React", "Node.js", "APIs"],
    strongestAreas: ["end-to-end delivery", "integration", "feature ownership"],
    notableTechnologies: ["React", "Node.js", "MongoDB", "TypeScript"],
  },
  "data science": {
    yearsOfExperience: 3,
    keySkills: ["Python", "data analysis", "model evaluation"],
    strongestAreas: ["data exploration", "modeling", "statistics"],
    notableTechnologies: ["Python", "Pandas", "NumPy", "scikit-learn"],
  },
  mobile: {
    yearsOfExperience: 3,
    keySkills: ["mobile UI", "app architecture", "API integration"],
    strongestAreas: ["cross-platform development", "UX", "state handling"],
    notableTechnologies: ["React Native", "Flutter", "Swift", "Kotlin"],
  },
  devops: {
    yearsOfExperience: 5,
    keySkills: ["CI/CD", "deployment", "infrastructure"],
    strongestAreas: ["automation", "reliability", "release pipelines"],
    notableTechnologies: ["Docker", "Kubernetes", "AWS", "Terraform"],
  },
};

function normalizeText(value) {
  return String(value || "").toLowerCase();
}

function isArabicLanguage(language) {
  return String(language || "").toLowerCase().startsWith("ar");
}

function inferPrimaryField(text) {
  const value = normalizeText(text);
  if (
    value.includes("react") ||
    value.includes("vue") ||
    value.includes("angular") ||
    value.includes("html") ||
    value.includes("css") ||
    value.includes("frontend")
  ) {
    return "frontend";
  }
  if (
    value.includes("docker") ||
    value.includes("kubernetes") ||
    value.includes("terraform") ||
    value.includes("devops") ||
    value.includes("ci/cd") ||
    value.includes("aws")
  ) {
    return "devops";
  }
  if (
    value.includes("python") ||
    value.includes("pandas") ||
    value.includes("numpy") ||
    value.includes("machine learning") ||
    value.includes("data science")
  ) {
    return "data science";
  }
  if (
    value.includes("android") ||
    value.includes("ios") ||
    value.includes("flutter") ||
    value.includes("react native") ||
    value.includes("mobile")
  ) {
    return "mobile";
  }
  if (
    value.includes("node") ||
    value.includes("express") ||
    value.includes("api") ||
    value.includes("mongodb") ||
    value.includes("sql") ||
    value.includes("backend")
  ) {
    return "backend";
  }
  return "fullstack";
}

function inferYearsOfExperience(text) {
  const match = normalizeText(text).match(/(\d+)\+?\s+(?:years?|yrs?)/);
  if (match?.[1]) return Number(match[1]);
  return 3;
}

function buildMockAnalysis(sourceText) {
  const primaryField = inferPrimaryField(sourceText);
  const template = MOCK_FIELD_TEMPLATES[primaryField] || MOCK_FIELD_TEMPLATES.fullstack;

  return {
    primaryField,
    yearsOfExperience: inferYearsOfExperience(sourceText) || template.yearsOfExperience,
    keySkills: template.keySkills,
    strongestAreas: template.strongestAreas,
    notableTechnologies: template.notableTechnologies,
  };
}

// Deterministic mock question set for MOCK_MODE. Biases toward weakTopics when
// provided so the adaptive behaviour can be tested without calling OpenAI.
function buildMockQuestions(primaryField, weakTopics = [], language = "en") {
  const field = normalizeText(primaryField) || "fullstack";
  const arabic = isArabicLanguage(language);
  const base = [
    {
      questionText: arabic
        ? `حدثني عن مشروع استخدمت فيه ${field} وما الذي كنت مسؤولًا عنه.`
        : `Tell me about a project where you used ${field} and what you owned.`,
      topic: `${field}-experience`,
      difficulty: "easy",
    },
    {
      questionText: arabic
        ? "اشرح لي كيف تتعامل مع مشكلة لا يمكنك إعادة إنتاجها محليًا."
        : "Walk me through how you debug an issue you cannot reproduce locally.",
      topic: "debugging",
      difficulty: "medium",
    },
    {
      questionText: arabic
        ? "كيف تقرر بين حلين تقنيين متنافسين؟"
        : "How do you decide between two competing technical approaches?",
      topic: "trade-offs",
      difficulty: "medium",
    },
    {
      questionText: arabic
        ? "صف موقفًا حسّنت فيه أداء شيء قمت ببنائه."
        : "Describe a time you improved the performance of something you built.",
      topic: "performance",
      difficulty: "hard",
    },
    {
      questionText: arabic
        ? "كيف تجعل الكود سهل الصيانة مع نمو المشروع؟"
        : "How do you keep your code maintainable as a project grows?",
      topic: "maintainability",
      difficulty: "medium",
    },
  ];

  // Prepend a weak-topic question for each provided weak topic (capped).
  const weakQuestions = (weakTopics || []).slice(0, 2).map((topic) => ({
    questionText: arabic
      ? `دعنا نتعمق في ${topic}. هل يمكنك شرحه مع مثال؟`
      : `Let's go deeper on ${topic}. Can you explain it and give an example?`,
    topic,
    difficulty: "medium",
  }));

  return [...weakQuestions, ...base].slice(0, 7);
}

function mockEvaluation(questionText, userAnswer, language = "en") {
  const answer = String(userAnswer || "").trim();
  const answerLength = answer.length;

  let score = 2;
  if (answerLength > 200) score = 8;
  else if (answerLength > 120) score = 7;
  else if (answerLength > 60) score = 6;
  else if (answerLength > 20) score = 4;

  if (!answer) score = 0;

  const askFollowUp = score >= 4 && score <= 6 && answerLength < 180;

  return {
    score,
    feedback: isArabicLanguage(language)
      ? `تقييم تجريبي للاختبار. إجابتك على "${questionText}" ${
          answer
            ? "تم استلامها وتقييمها بناءً على الطول والاكتمال."
            : "كانت فارغة، لذلك حصلت على درجة منخفضة."
        }`
      : `Simulated evaluation for testing. Your answer to "${questionText}" ` +
        (answer
          ? "was received and scored based on length and completeness."
          : "was empty, so it received a low score."),
    askFollowUp,
    followUpQuestion: askFollowUp
      ? isArabicLanguage(language)
        ? "هل يمكنك إعطائي مثالًا عمليًا أو توضيح المفاضلة هنا؟"
        : "Can you walk me through a concrete example or trade-off?"
      : "",
  };
}

function mockFinalScorecard(questions, language = "en") {
  const scored = (questions || []).map((q) => Number(q.score || 0));
  const overallScore =
    scored.length > 0
      ? Math.round((scored.reduce((sum, score) => sum + score, 0) / scored.length) * 10) / 10
      : 0;

  return {
    overallScore,
    overallFeedback: isArabicLanguage(language)
      ? "ملخص تجريبي للمقابلة للاختبار. الجلسة اكتملت بنجاح، وعمل مسار الإجابة والتقييم والمتابعة وشاشة النتائج بشكل كامل."
      : "Simulated interview summary for testing. The flow completed successfully, and the response handling, scoring, follow-up, and results screen all worked end-to-end.",
    strengths: isArabicLanguage(language)
      ? [
          "أكملت إجاباتك داخل مسار المقابلة",
          "تم حفظ وتقييم الإجابات بنجاح",
          "وصلت إلى شاشة النتائج النهائية",
        ]
      : [
          "Answered the questions within the interview flow",
          "Completed the submission and scoring pipeline",
          "Reached the final results screen successfully",
        ],
    weaknesses: isArabicLanguage(language)
      ? [
          "الدرجات تجريبية أثناء تفعيل وضع mock",
          "الملاحظات هنا مجرد نص مؤقت للاختبار",
        ]
      : [
          "Scores are simulated while OpenAI mock mode is enabled",
          "Feedback is placeholder output for testing only",
        ],
  };
}

// GPT sometimes wraps JSON in ```json ... ``` fences even when asked not to.
// Strip any leading/trailing markdown code fences before parsing.
function stripCodeFences(text) {
  if (!text) return "";
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// Parse a GPT chat completion's text content into an object, throwing a clear
// error if it is not valid JSON.
function parseJsonResponse(completion, context) {
  const raw = completion.choices?.[0]?.message?.content ?? "";
  const cleaned = stripCodeFences(raw);

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error(`Failed to parse ${context} JSON from GPT:`, raw);
    throw new Error(`OpenAI returned invalid JSON while ${context}`);
  }
}

/**
 * Analyze a candidate's CV text and return a structured profile.
 *
 * @param {string} cvText Raw text extracted from the uploaded PDF.
 * @returns {Promise<object>}
 */
export async function analyzeCv(cvText) {
  try {
    if (MOCK_MODE) {
      return buildMockAnalysis(cvText);
    }

    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical recruiter. You analyze software " +
            "engineering CVs and extract a concise structured summary. " +
            "Respond with ONLY valid JSON and nothing else.",
        },
        {
          role: "user",
          content:
            "Analyze the following CV and return a JSON object with this exact " +
            "structure:\n" +
            "{\n" +
            '  "primaryField": string (one of: frontend, backend, fullstack, "data science", mobile, devops),\n' +
            '  "yearsOfExperience": number,\n' +
            '  "keySkills": string[],\n' +
            '  "strongestAreas": string[],\n' +
            '  "notableTechnologies": string[]\n' +
            "}\n\n" +
            "Respond with ONLY valid JSON and nothing else.\n\n" +
            "CV:\n" +
            cvText,
        },
      ],
    });

    return parseJsonResponse(completion, "analyzing the CV");
  } catch (error) {
    console.error("analyzeCv error:", error.message);
    throw error;
  }
}

/**
 * Analyze a candidate's CV from page images (used when the PDF has no text
 * layer, e.g. scanned or image-based CVs). Sends the page images to gpt-4o-mini,
 * which is multimodal, and returns the same structured profile as analyzeCv.
 *
 * @param {Buffer[]} imageBuffers PNG buffers, one per CV page.
 * @returns {Promise<object>}
 */
export async function analyzeCvFromImages(imageBuffers) {
  try {
    if (MOCK_MODE) {
      return buildMockAnalysis(`mock image cv with ${imageBuffers?.length || 0} pages`);
    }

    // Cap the number of pages we send to keep the request reasonable.
    const pages = (imageBuffers || []).slice(0, 5);
    if (pages.length === 0) {
      throw new Error("No CV page images to analyze");
    }

    const imageContent = pages.map((buffer) => ({
      type: "image_url",
      image_url: {
        url: `data:image/png;base64,${buffer.toString("base64")}`,
      },
    }));

    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are an expert technical recruiter. You read software " +
            "engineering CVs from page images and extract a concise structured " +
            "summary. Respond with ONLY valid JSON and nothing else.",
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text:
                "Read the CV shown in the following image(s) and return a JSON " +
                "object with this exact structure:\n" +
                "{\n" +
                '  "primaryField": string (one of: frontend, backend, fullstack, "data science", mobile, devops),\n' +
                '  "yearsOfExperience": number,\n' +
                '  "keySkills": string[],\n' +
                '  "strongestAreas": string[],\n' +
                '  "notableTechnologies": string[]\n' +
                "}\n\n" +
                "Respond with ONLY valid JSON and nothing else.",
            },
            ...imageContent,
          ],
        },
      ],
    });

    return parseJsonResponse(completion, "analyzing the CV images");
  } catch (error) {
    console.error("analyzeCvFromImages error:", error.message);
    throw error;
  }
}

/**
 * Generate a personalized set of spoken interview questions from the
 * candidate's CV summary and primary field, using GPT's own knowledge
 * (no external web calls). Questions are conversational and meant to be read
 * aloud and answered by voice, so they must NOT ask the candidate to write
 * code. When weakTopics are provided, the set is biased to probe those areas
 * more so future interviews adapt to the candidate's weaknesses.
 *
 * @param {object} params
 * @param {string} params.cvSummary   Short summary of the candidate's CV.
 * @param {string} params.primaryField The candidate's primary field.
 * @param {string[]} [params.weakTopics] Topics to emphasise (from past results).
 * @returns {Promise<Array<{questionText: string, topic: string, difficulty: string}>>}
 */
export async function generateInterviewQuestions({
  cvSummary,
  primaryField,
  weakTopics = [],
  language = "en",
} = {}) {
  try {
    if (MOCK_MODE) {
      return buildMockQuestions(primaryField, weakTopics, language);
    }

    const weakTopicsLine =
      weakTopics && weakTopics.length > 0
        ? `The candidate has previously been weaker in these topics, so ask MORE questions about them: ${weakTopics.join(", ")}.\n\n`
        : "";

    const arabic = isArabicLanguage(language);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            arabic
              ? "أنت محاور تقني خبير. أنت تُنشئ أسئلة مقابلة شفهية باللغة العربية. يجب أن تكون الأسئلة طبيعية ومناسبة للعرض الصوتي، ولا تطلب من المرشح كتابة الكود. أجب فقط بصيغة JSON صحيحة."
              : "You are an expert technical interviewer preparing a SPOKEN interview. You generate up-to-date, relevant questions tailored to the candidate's tech stack using your own knowledge. The questions are read aloud and answered by voice, so they must be conversational and must NEVER ask the candidate to write or type code. Respond with ONLY valid JSON and nothing else.",
        },
        {
          role: "user",
          content:
            arabic
              ? `المجال الأساسي للمرشح: ${primaryField}\n\n` +
                `الخلفية:\n${cvSummary}\n\n` +
                weakTopicsLine +
                "أنشئ بين 5 و7 أسئلة مقابلة شفهية مناسبة لهذا المرشح، من الأسهل إلى الأصعب. أرجع JSON بالمبنى التالي:\n" +
                "{\n" +
                '  "questions": [\n' +
                "    {\n" +
                '      "questionText": string,\n' +
                '      "topic": string,\n' +
                '      "difficulty": string (one of: easy, medium, hard)\n' +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "أجب فقط بصيغة JSON صحيحة."
              : `Candidate primary field: ${primaryField}\n\n` +
                `Candidate background:\n${cvSummary}\n\n` +
                weakTopicsLine +
                "Generate between 5 and 7 spoken interview questions tailored to " +
                "this candidate's tech stack and experience, ramping from easier " +
                "to harder. Return a JSON object with this exact structure:\n" +
                "{\n" +
                '  "questions": [\n' +
                "    {\n" +
                '      "questionText": string (a spoken question, no code writing),\n' +
                '      "topic": string (a short kebab-case tag, e.g. "react-hooks", "system-design", "sql-indexing"),\n' +
                '      "difficulty": string (one of: easy, medium, hard)\n' +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "Respond with ONLY valid JSON and nothing else.",
        },
      ],
    });

    const parsed = parseJsonResponse(completion, "generating interview questions");
    const questions = Array.isArray(parsed) ? parsed : parsed.questions;

    return (questions || [])
      .filter((q) => q && q.questionText)
      .map((q) => ({
        questionText: String(q.questionText),
        topic: String(q.topic || "general"),
        difficulty: String(q.difficulty || "medium").toLowerCase(),
      }))
      .slice(0, 7);
  } catch (error) {
    console.error("generateInterviewQuestions error:", error.message);
    throw error;
  }
}

/**
 * Evaluate a candidate's answer to a single interview question.
 *
 * @param {string} questionText The question that was asked.
 * @param {string} userAnswer   The candidate's transcribed answer.
 * @param {string} cvSummary    Short summary of the candidate's background.
 * @param {string} userField    The candidate's primary field.
 * @returns {Promise<{
 *   score: number,
 *   feedback: string,
 *   askFollowUp: boolean,
 *   followUpQuestion: string
 * }>}
 */
export async function evaluateAnswer(
  questionText,
  userAnswer,
  cvSummary,
  userField,
  language = "en",
) {
  try {
    if (MOCK_MODE) {
      void cvSummary;
      void userField;
      return mockEvaluation(questionText, userAnswer, language);
    }

    const arabic = isArabicLanguage(language);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            arabic
              ? "أنت محاور تقني خبير. قيّم إجابة المرشح بعدالة وباختصار باللغة العربية. أجب فقط بصيغة JSON صحيحة."
              : "You are an expert technical interviewer conducting a spoken interview. You evaluate the candidate's answer fairly and concisely. Respond with ONLY valid JSON and nothing else.",
        },
        {
          role: "user",
          content:
            arabic
              ? `خلفية المرشح:\n${cvSummary}\n\n` +
                `المجال الأساسي للمرشح: ${userField}\n\n` +
                `السؤال المطروح:\n${questionText}\n\n` +
                `إجابة المرشح المنطوقة (مكتوبة نصيًا):\n${userAnswer}\n\n` +
                "قيّم الإجابة وأعد JSON بالمبنى التالي:\n" +
                "{\n" +
                '  "score": number from 1 to 10,\n' +
                '  "feedback": a 2-3 sentence specific response to their answer,\n' +
                '  "askFollowUp": boolean,\n' +
                '  "followUpQuestion": string\n' +
                "}\n\n" +
                "أجب فقط بصيغة JSON صحيحة."
              : `Candidate background:\n${cvSummary}\n\n` +
                `Candidate's primary field: ${userField}\n\n` +
                `Question that was asked:\n${questionText}\n\n` +
                `Candidate's spoken answer (transcribed):\n${userAnswer}\n\n` +
                "Evaluate the answer and return a JSON object with this exact " +
                "structure:\n" +
                "{\n" +
                '  "score": number from 1 to 10,\n' +
                '  "feedback": a 2-3 sentence specific response to their answer,\n' +
                '  "askFollowUp": boolean (true only if a follow-up would meaningfully probe deeper),\n' +
                '  "followUpQuestion": string (the follow-up question if askFollowUp is true, else an empty string)\n' +
                "}\n\n" +
                "Respond with ONLY valid JSON and nothing else.",
        },
      ],
    });

    return parseJsonResponse(completion, "evaluating the answer");
  } catch (error) {
    console.error("evaluateAnswer error:", error.message);
    throw error;
  }
}

/**
 * Generate the overall interview scorecard from all questions and answers.
 *
 * @param {Array<{questionText: string, userAnswer: string, score: number,
 *   aiFeedback: string}>} questions The completed question/answer records.
 * @param {string} cvSummary Short summary of the candidate's background.
 * @returns {Promise<{
 *   overallScore: number,
 *   overallFeedback: string,
 *   strengths: string[],
 *   weaknesses: string[]
 * }>}
 */
export async function generateInterviewFeedback(questions, cvSummary, language = "en") {
  try {
    if (MOCK_MODE) {
      void cvSummary;
      return mockFinalScorecard(questions, language);
    }

    const transcript = (questions || [])
      .map(
        (q, i) =>
          `Q${i + 1}: ${q.questionText}\n` +
          `Answer: ${q.userAnswer || "(no answer / skipped)"}\n` +
          `Score given: ${q.score ?? "n/a"}`,
      )
      .join("\n\n");

    const arabic = isArabicLanguage(language);
    const completion = await openai.chat.completions.create({
      model: MODEL,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            arabic
              ? "أنت محاور تقني خبير تكتب تقريرًا نهائيًا للمقابلة باللغة العربية. كن دقيقًا وبناءً. أجب فقط بصيغة JSON صحيحة."
              : "You are an expert technical interviewer writing a final interview scorecard. Be specific and constructive. Respond with ONLY valid JSON and nothing else.",
        },
        {
          role: "user",
          content:
            arabic
              ? `خلفية المرشح:\n${cvSummary}\n\n` +
                `النص الكامل للمقابلة مع الدرجات:\n${transcript}\n\n` +
                "لخّص المقابلة وأعد JSON بالمبنى التالي:\n" +
                "{\n" +
                '  "overallScore": number,\n' +
                '  "overallFeedback": string,\n' +
                '  "strengths": string[],\n' +
                '  "weaknesses": string[]\n' +
                "}\n\n" +
                "أجب فقط بصيغة JSON صحيحة."
              : `Candidate background:\n${cvSummary}\n\n` +
                `Full interview transcript with per-question scores:\n${transcript}\n\n` +
                "Summarize the interview and return a JSON object with this exact " +
                "structure:\n" +
                "{\n" +
                '  "overallScore": number (the average score across all questions, 1 to 10),\n' +
                '  "overallFeedback": a 3-4 sentence overall assessment,\n' +
                '  "strengths": string[] of up to 3 specific strong areas observed,\n' +
                '  "weaknesses": string[] of up to 3 specific areas to improve\n' +
                "}\n\n" +
                "Respond with ONLY valid JSON and nothing else.",
        },
      ],
    });

    return parseJsonResponse(completion, "generating interview feedback");
  } catch (error) {
    console.error("generateInterviewFeedback error:", error.message);
    throw error;
  }
}
