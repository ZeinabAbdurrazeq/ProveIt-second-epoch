import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getMyAvailability,
  updateMyAvailability,
  getUserAvailability,
} from "../controllers/availabilityController.js";

const router = express.Router();

router.get("/me", protectRoute, getMyAvailability);
router.put("/me", protectRoute, updateMyAvailability);

// Lets an authenticated User A view User B's availability when scheduling.
// Declared last so /me is not shadowed by the :userId param.
router.get("/:userId", protectRoute, getUserAvailability);

export default router;
