import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "session-invitation",
        "invitation-accepted",
        "invitation-declined",
        "session-reminder",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["unread", "read"],
      default: "unread",
    },
    relatedInvitationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invitation",
      default: null,
    },
    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

notificationSchema.index({ recipientId: 1, status: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
