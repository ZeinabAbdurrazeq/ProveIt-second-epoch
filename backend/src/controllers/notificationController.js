import Notification from "../models/Notification.js";

export async function getMyNotifications(req, res) {
  try {
    const notifications = await Notification.find({
      recipientId: req.user._id,
    })
      .populate("senderId", "name profileImage")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = notifications.filter((n) => n.status === "unread").length;

    res.status(200).json({ notifications, unreadCount });
  } catch (error) {
    console.error("Error in getMyNotifications Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
