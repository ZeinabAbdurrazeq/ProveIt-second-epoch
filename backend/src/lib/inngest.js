import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import CandidateProfile from "../models/CandidateProfile.js";
import AIInterviewSession from "../models/AIInterviewSession.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";

export const inngest = new Inngest({ id: "Provelt" });

const syncUser = inngest.createFunction(
  { id: "sync-user", triggers: [{ event: "clerk/user.created" }] },
  async ({ event }) => {
    await connectDB();

    const { id, email_addresses, first_name, last_name, image_url } =
      event.data;

    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim() || "Anonymous",
      profileImage: image_url,
    };

    await User.create(newUser);

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImage,
    });

    // sned a welcome email here later note for me to not forgot it later
  },
);

const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db", triggers: [{ event: "clerk/user.deleted" }] },
  async ({ event }) => {
    await connectDB();

    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  },
);

// After an AI interview is marked completed (ai-interview/completed event),
// update the candidate's profile so future interviews adapt: adjust difficulty,
// never repeat asked questions, bump counts, and keep a running average score.
const updateCandidateProfile = inngest.createFunction(
  {
    id: "update-candidate-profile",
    triggers: [{ event: "ai-interview/completed" }],
  },
  async ({ event }) => {
    await connectDB();

    const { sessionId } = event.data;
    if (!sessionId) return;

    const session = await AIInterviewSession.findById(sessionId);
    if (!session) return;

    const profile = await CandidateProfile.findOne({ userId: session.userId });
    if (!profile) return;

    const questions = session.questions || [];

    // Average score across this session's questions.
    const scored = questions.filter((q) => typeof q.score === "number");
    const sessionAverage =
      scored.length > 0
        ? scored.reduce((sum, q) => sum + q.score, 0) / scored.length
        : 0;

    // Aggregate weakness/strength signals by question topic so future
    // interviews can bias generation toward the candidate's weak areas.
    // Questions scored below 6 add to the topic's weakness; questions scored
    // above 7 add to its strength (and relax any prior weakness for it).
    const topicWeaknesses = { ...(profile.topicWeaknesses || {}) };
    const topicStrengths = { ...(profile.topicStrengths || {}) };

    for (const q of questions) {
      const topic = (q.topic || "").trim();
      if (!topic) continue;
      if (typeof q.score !== "number") continue;

      if (q.score < 6) {
        topicWeaknesses[topic] = (topicWeaknesses[topic] || 0) + 1;
      } else if (q.score > 7) {
        topicStrengths[topic] = (topicStrengths[topic] || 0) + 1;
        // A topic the candidate now does well in should weigh less as a
        // weakness; decrement and drop it once it is no longer a concern.
        if (topicWeaknesses[topic]) {
          topicWeaknesses[topic] -= 1;
          if (topicWeaknesses[topic] <= 0) delete topicWeaknesses[topic];
        }
      }
    }

    // Adjust preferred difficulty from this session's average.
    let preferredDifficulty = "medium";
    if (sessionAverage < 5) preferredDifficulty = "easy";
    else if (sessionAverage <= 7) preferredDifficulty = "medium";
    else preferredDifficulty = "hard";

    // Running average across all interviews, computed before incrementing count.
    const prevCount = profile.totalInterviewsCompleted || 0;
    const prevAvg = profile.overallAverageScore || 0;
    const newAverage =
      (prevAvg * prevCount + sessionAverage) / (prevCount + 1);

    // Questions are now generated on the fly (no questionId), so we only
    // append ids for any legacy questions that still carry one.
    const askedIds = questions.map((q) => q.questionId).filter(Boolean);
    const existing = new Set(
      (profile.questionsAskedIds || []).map((id) => id.toString()),
    );
    for (const id of askedIds) existing.add(id.toString());

    profile.preferredDifficulty = preferredDifficulty;
    profile.questionsAskedIds = Array.from(existing);
    profile.totalInterviewsCompleted = prevCount + 1;
    profile.overallAverageScore = Math.round(newAverage * 10) / 10;
    profile.topicWeaknesses = topicWeaknesses;
    profile.topicStrengths = topicStrengths;
    // Object/Map fields need to be flagged so Mongoose persists the changes.
    profile.markModified("topicWeaknesses");
    profile.markModified("topicStrengths");

    await profile.save();
  },
);

export const functions = [syncUser, deleteUserFromDB, updateCandidateProfile];
