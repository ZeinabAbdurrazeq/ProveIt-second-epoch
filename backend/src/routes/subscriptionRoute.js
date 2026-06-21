import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getMySubscription,
  simulatePayment,
  cancelSubscription,
  checkAiInterviewLimit,
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.get("/me", protectRoute, getMySubscription);
router.post("/simulate-payment", protectRoute, simulatePayment);
router.post("/cancel", protectRoute, cancelSubscription);
router.get("/check-limit", protectRoute, checkAiInterviewLimit);

export default router;
