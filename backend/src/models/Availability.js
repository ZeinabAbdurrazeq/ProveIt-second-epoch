import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    startTime: {
      type: String, // "HH:MM"
      required: true,
    },
    endTime: {
      type: String, // "HH:MM"
      required: true,
    },
  },
  { _id: false },
);

const availabilitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    weeklySchedule: {
      monday: { type: [slotSchema], default: [] },
      tuesday: { type: [slotSchema], default: [] },
      wednesday: { type: [slotSchema], default: [] },
      thursday: { type: [slotSchema], default: [] },
      friday: { type: [slotSchema], default: [] },
      saturday: { type: [slotSchema], default: [] },
      sunday: { type: [slotSchema], default: [] },
    },
    timezone: {
      type: String,
      default: "Africa/Cairo",
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Availability = mongoose.model("Availability", availabilitySchema);

export default Availability;
