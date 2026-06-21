import { streamClient, chatClient } from "../lib/stream.js";
import Invitation from "../models/Invitation.js";
import Notification from "../models/Notification.js";
import Availability from "../models/Availability.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import {
  sendInvitationEmail,
  sendDeclineEmail,
  sendAcceptedEmail,
} from "../lib/email.js";
import { ENV } from "../lib/env.js";

const DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// Returns true if scheduledTime (HH:MM) falls within any slot for the given
// weekday in the recipient's weekly schedule. A time matches if
// startTime <= scheduledTime < endTime (string compare works for HH:MM).
function isWithinAvailability(weeklySchedule, scheduledDate, scheduledTime) {
  if (!weeklySchedule) return false;

  // Interpret the date in a fixed way; day-of-week from the YYYY-MM-DD string.
  const dayIndex = new Date(`${scheduledDate}T00:00:00`).getDay();
  const dayName = DAYS[dayIndex];
  const slots = weeklySchedule[dayName] || [];

  return slots.some(
    (slot) =>
      slot.startTime <= scheduledTime && scheduledTime < slot.endTime,
  );
}

export async function searchUsers(req, res) {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.status(200).json({ users: [] });

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [{ name: regex }, { email: regex }],
    })
      .select("name email profileImage")
      .limit(10);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error in searchUsers Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function sendInvitation(req, res) {
  try {
    const senderId = req.user._id;
    const {
      recipientId,
      scheduledDate,
      scheduledTime,
      duration,
      problem,
      difficulty,
      message,
    } = req.body;

    if (!recipientId || !scheduledDate || !scheduledTime || !problem || !difficulty) {
      return res.status(400).json({ msg: "Missing required invitation fields" });
    }

    if (recipientId.toString() === senderId.toString()) {
      return res.status(400).json({ msg: "You cannot invite yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ msg: "Recipient not found" });

    // Verify the slot is within the recipient's availability.
    const availability = await Availability.findOne({ userId: recipientId });
    if (
      !isWithinAvailability(
        availability?.weeklySchedule,
        scheduledDate,
        scheduledTime,
      )
    ) {
      return res
        .status(400)
        .json({ msg: "This user is not available at the selected time" });
    }

    const invitation = await Invitation.create({
      senderId,
      recipientId,
      scheduledDate,
      scheduledTime,
      duration: duration || 60,
      problem,
      difficulty: String(difficulty).toLowerCase(),
      message: message || "",
    });

    await Notification.create({
      recipientId,
      senderId,
      type: "session-invitation",
      relatedInvitationId: invitation._id,
      message: `${req.user.name} invited you to a session on ${scheduledDate} at ${scheduledTime}`,
    });

    await sendInvitationEmail(recipient.email, {
      senderName: req.user.name,
      problem,
      difficulty,
      scheduledDate,
      scheduledTime,
      message,
    });

    res.status(201).json({ invitation });
  } catch (error) {
    console.error("Error in sendInvitation Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getMyInvitations(req, res) {
  try {
    const userId = req.user._id;

    const invitations = await Invitation.find({
      $or: [{ senderId: userId }, { recipientId: userId }],
    })
      .populate("senderId", "name profileImage")
      .populate("recipientId", "name profileImage")
      .populate("sessionId", "status")
      .sort({ createdAt: -1 });

    // Attach a reliable direction flag so the frontend can split
    // Received vs Sent without inspecting populated ids.
    const withDirection = invitations.map((inv) => {
      const obj = inv.toObject();
      const senderObjectId = inv.senderId?._id || inv.senderId;
      obj.direction = userId.equals(senderObjectId) ? "sent" : "received";
      return obj;
    });

    res.status(200).json({ invitations: withDirection });
  } catch (error) {
    console.error("Error in getMyInvitations Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getMyInvitationsCount(req, res) {
  try {
    const count = await Invitation.countDocuments({
      recipientId: req.user._id,
      status: "pending",
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error("Error in getMyInvitationsCount Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function respondToInvitation(req, res) {
  try {
    const { invitationId } = req.params;
    const { action } = req.body;
    const userId = req.user._id;

    if (!["accepted", "declined"].includes(action)) {
      return res.status(400).json({ msg: "Invalid action" });
    }

    const invitation = await Invitation.findById(invitationId)
      .populate("senderId", "name email clerkId")
      .populate("recipientId", "name email clerkId");

    if (!invitation) return res.status(404).json({ msg: "Invitation not found" });

    if (invitation.recipientId._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ msg: "Only the recipient can respond to this invitation" });
    }

    if (invitation.status !== "pending") {
      return res
        .status(400)
        .json({ msg: `Invitation already ${invitation.status}` });
    }

    const sender = invitation.senderId;
    const recipient = invitation.recipientId;

    // Mark the recipient's original invitation notification as read so its
    // Accept/Decline buttons disappear everywhere (not just in the tab that
    // responded).
    await Notification.updateMany(
      {
        recipientId: recipient._id,
        relatedInvitationId: invitation._id,
        type: "session-invitation",
      },
      { status: "read" },
    );

    if (action === "declined") {
      invitation.status = "declined";
      await invitation.save();

      await Notification.create({
        recipientId: sender._id,
        senderId: recipient._id,
        type: "invitation-declined",
        relatedInvitationId: invitation._id,
        message: `${recipient.name} declined your session invitation`,
      });

      await sendDeclineEmail(sender.email, {
        recipientName: recipient.name,
        problem: invitation.problem,
        scheduledDate: invitation.scheduledDate,
        scheduledTime: invitation.scheduledTime,
      });

      return res.status(200).json({ invitation });
    }

    // action === "accepted": create the Session exactly like createSession does.
    const callId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;

    const session = await Session.create({
      problem: invitation.problem,
      difficulty: invitation.difficulty,
      host: sender._id,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: sender.clerkId,
        custom: {
          problem: invitation.problem,
          difficulty: invitation.difficulty,
          sessionId: session._id.toString(),
        },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${invitation.problem} session`,
      created_by_id: sender.clerkId,
      members: [sender.clerkId, recipient.clerkId],
    });
    await channel.create();

    invitation.status = "accepted";
    invitation.sessionId = session._id;
    await invitation.save();

    await Notification.create({
      recipientId: sender._id,
      senderId: recipient._id,
      type: "invitation-accepted",
      relatedInvitationId: invitation._id,
      message: `${recipient.name} accepted your invitation — the session is ready`,
    });

    const clientUrl = ENV.CLIENT_URL || "";
    const sessionUrl = `${clientUrl}/session/${session._id}`;
    const emailData = {
      problem: invitation.problem,
      scheduledDate: invitation.scheduledDate,
      scheduledTime: invitation.scheduledTime,
      sessionUrl,
    };
    await sendAcceptedEmail(sender.email, emailData);
    await sendAcceptedEmail(recipient.email, emailData);

    const populated = await Invitation.findById(invitation._id)
      .populate("senderId", "name profileImage")
      .populate("recipientId", "name profileImage")
      .populate("sessionId");

    res.status(200).json({ invitation: populated });
  } catch (error) {
    console.error("Error in respondToInvitation Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
