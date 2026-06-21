import mongoose from "mongoose";

// Stores the AI analysis of a user's CV plus running interview-progress data.
// Created/updated on CV upload (Feature 1) and updated after each completed
// AI interview (Feature 6).
const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    // --- CV analysis (from analyzeCv) ---
    primaryField: {
      type: String,
      // e.g. frontend, backend, fullstack, data science, mobile, devops
      default: "fullstack",
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
    },
    keySkills: {
      type: [String],
      default: [],
    },
    strongestAreas: {
      type: [String],
      default: [],
    },
    notableTechnologies: {
      type: [String],
      default: [],
    },

    // Raw text of the CV summary we feed back into GPT during the interview.
    cvSummary: {
      type: String,
      default: "",
    },

    // --- Interview progress (used by Features 2 & 6) ---
    // Difficulty the RAG layer starts from; adjusted after each interview.
    preferredDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    // Questions already asked to this user so we never repeat them.
    questionsAskedIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "InterviewQuestions" }],
      default: [],
    },
    totalInterviewsCompleted: {
      type: Number,
      default: 0,
    },
    overallAverageScore: {
      type: Number,
      default: 0,
    },

    // --- Topic-level adaptive tracking (Feature 6) ---
    // Map of topic -> accumulated weakness score. Future interviews bias
    // question generation toward the topics with the highest values.
    topicWeaknesses: {
      type: Object,
      default: {},
    },
    // Map of topic -> accumulated strength score, for the inverse signal.
    topicStrengths: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema,
);

export default CandidateProfile;
