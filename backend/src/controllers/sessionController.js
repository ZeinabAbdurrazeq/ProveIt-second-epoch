import { streamClient, chatClient } from "../lib/stream.js";
import Session from "../models/Session.js";

export async function createSession(req, res) {
  try {
    const { problem } = req.body;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    if (!problem || !req.body.difficulty) {
      return res
        .status(400)
        .json({ msg: "Problem or Difficulty are Required" });
    }

    // Normalize difficulty to lowercase to match the Session schema enum
    const difficulty = String(req.body.difficulty).toLowerCase();

    const callId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await Session.create({
      problem,
      difficulty,
      host: userId,
      callId,
    });

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: clerkId,
        custom: { problem, difficulty, sessionId: session._id.toString() },
      },
    });

    const channel = chatClient.channel("messaging", callId, {
      name: `${problem} session`,
      created_by_id: clerkId,
      members: [clerkId],
    });

    await channel.create();

    res.status(201).json({ session });
  } catch (error) {
    console.error("Error in CreateSession Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getActiveSession(_, res) {
  try {
    const sessions = await Session.find({ status: "active" })
      .populate("host", "name profileImage email clerkId")
      .populate("participant", "name profileImage")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in GetActiveSessions Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getMyRecentSession(req, res) {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({
      status: "completed",
      $or: [{ host: userId }, { participant: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error in getMyRecentSession Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getSessionById(req, res) {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("host", "name email profileImage clerkId")
      .populate("participant", "name email profileImage clerkId");

    if (!session) return res.status(404).json({ msg: "Session not found" });

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in getSessionById Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function joinSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ msg: "session is not found" });

    if (session.status !== "active") {
      return res.status(400).json({ msg: "Cannot join a completed session" });
    }

    if (session.host.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ msg: "Host cannot join their own session as participant" });
    }

    if (session.participant)
      return res.status(409).json({ msg: "session is full" });

    session.participant = userId;
    await session.save();

    const channel = chatClient.channel("messaging", session.callId);
    await channel.addMembers([clerkId]);

    res.status(200).json({ session });
  } catch (error) {
    console.error("Error in joinSession Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function leaveSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const clerkId = req.user.clerkId;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ msg: "session is not found" });

    if (session.status !== "active") {
      return res.status(400).json({ msg: "Session is already completed" });
    }

    // Hosts do not occupy the participant slot, so leaving is just a no-op.
    if (session.host.toString() === userId.toString()) {
      return res.status(200).json({ session, msg: "Host left the call" });
    }

    if (!session.participant || session.participant.toString() !== userId.toString()) {
      return res.status(200).json({ session, msg: "User is not in this session" });
    }

    session.participant = null;
    await session.save();

    try {
      const channel = chatClient.channel("messaging", session.callId);
      await channel.removeMembers([clerkId]);
    } catch (chatError) {
      console.error("Error removing session member from chat:", chatError.message);
    }

    res.status(200).json({ session, msg: "Left session successfully" });
  } catch (error) {
    console.error("Error in leaveSession Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function endSession(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const session = await Session.findById(id);

    if (!session) return res.status(404).json({ msg: "session is not found" });

    if (session.host.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ msg: "only the host who can end the session" });
    }

    if (session.status === "completed") {
      return res.status(400).json({ msg: "Session is already completed" });
    }

    // Mark the session completed first so a partial Stream cleanup failure
    // does not leave an active, unjoinable zombie session in the DB.
    session.status = "completed";
    await session.save();

    const call = streamClient.video.call("default", session.callId);
    await call.delete({ hard: true });

    const channel = chatClient.channel("messaging", session.callId);
    await channel.delete();

    res.status(200).json({ session, msg: "Session ended successfully" });
  } catch (error) {
    console.error("Error in endSession Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
