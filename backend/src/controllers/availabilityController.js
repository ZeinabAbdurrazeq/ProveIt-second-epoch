import Availability from "../models/Availability.js";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Validate that every slot has startTime strictly before endTime.
// Times are "HH:MM" strings which compare correctly lexicographically.
function validateSchedule(weeklySchedule) {
  if (!weeklySchedule || typeof weeklySchedule !== "object") {
    return "weeklySchedule is required";
  }

  for (const day of DAYS) {
    const slots = weeklySchedule[day];
    if (!slots) continue;
    if (!Array.isArray(slots)) return `${day} must be an array of slots`;

    for (const slot of slots) {
      if (!slot?.startTime || !slot?.endTime) {
        return `Each slot in ${day} needs a startTime and endTime`;
      }
      if (slot.startTime >= slot.endTime) {
        return `In ${day}, startTime must be before endTime`;
      }
    }
  }

  return null;
}

export async function getMyAvailability(req, res) {
  try {
    const userId = req.user._id;
    const availability = await Availability.findOne({ userId });

    res.status(200).json({ availability });
  } catch (error) {
    console.error("Error in getMyAvailability Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function updateMyAvailability(req, res) {
  try {
    const userId = req.user._id;
    const { weeklySchedule } = req.body;

    const validationError = validateSchedule(weeklySchedule);
    if (validationError) {
      return res.status(400).json({ msg: validationError });
    }

    const availability = await Availability.findOneAndUpdate(
      { userId },
      {
        userId,
        weeklySchedule,
        timezone: "Africa/Cairo",
        updatedAt: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    res.status(200).json({ availability });
  } catch (error) {
    console.error("Error in updateMyAvailability Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}

export async function getUserAvailability(req, res) {
  try {
    const { userId } = req.params;
    const availability = await Availability.findOne({ userId });

    if (!availability) {
      return res.status(200).json({ availability: null, weeklySchedule: null });
    }

    res.status(200).json({
      availability,
      weeklySchedule: availability.weeklySchedule,
    });
  } catch (error) {
    console.error("Error in getUserAvailability Controller:", error.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
}
