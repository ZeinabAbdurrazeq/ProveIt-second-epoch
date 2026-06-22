import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protectRoute, getMyNotifications);
// read-all before /:id/read so it is not captured by the param route.
router.patch("/read-all", protectRoute, markAllAsRead);
router.patch("/:id/read", protectRoute, markAsRead);

export default router;