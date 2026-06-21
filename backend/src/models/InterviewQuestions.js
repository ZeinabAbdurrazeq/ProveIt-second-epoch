import mongoose from "mongoose";

// A bank of interview questions the RAG layer (Feature 2) retrieves from to
// personalize each AI interview. Seeded via scripts/seedQuestions.js.
const interviewQuestionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },
    // e.g. javascript, react, nodejs, python, "system design", algorithms, css, sql
    category: {
      type: String,
      required: true,
    },
    // Which candidate primaryField values this question is relevant to.
    // e.g. frontend, backend, fullstack, "data science", mobile, devops
    fieldRelevance: {
      type: [String],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    followUpQuestions: {
      type: [String],
      default: [],
    },
    // Signals of a good answer, used to guide GPT's evaluation.
    expectedKeywords: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// Speeds up the RAG query which filters by fieldRelevance and sorts by difficulty.
interviewQuestionSchema.index({ fieldRelevance: 1, difficulty: 1 });

const InterviewQuestions = mongoose.model(
  "InterviewQuestions",
  interviewQuestionSchema,
);

export default InterviewQuestions;
