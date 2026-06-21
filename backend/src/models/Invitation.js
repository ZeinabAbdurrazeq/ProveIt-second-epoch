import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledDate: {
      type: String, // "YYYY-MM-DD"
      required: true,
    },
    scheduledTime: {
      type: String, // "HH:MM"
      required: true,
    },
    duration: {
      type: Number, // minutes
      default: 60,
    },
    problem: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: true,
    },
    message: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
    },
  },
  { timestamps: true },
);

invitationSchema.index({ recipientId: 1, status: 1 });
invitationSchema.index({ senderId: 1 });

const Invitation = mongoose.model("Invitation", invitationSchema);

export default Invitation;
