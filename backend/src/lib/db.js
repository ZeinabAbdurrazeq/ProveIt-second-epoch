import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(ENV.DB_URL);
    console.log("Connected Successfully To DB");
  } catch (error) {
    console.error("Something Went Wrong: ", error);
    process.exit(1);
  }
};
