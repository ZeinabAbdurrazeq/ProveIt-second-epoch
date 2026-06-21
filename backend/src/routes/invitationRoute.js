import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  searchUsers,
  sendInvitation,
  getMyInvitations,
  getMyInvitationsCount,
  respondToInvitation,
} from "../controllers/invitationController.js";

const router = express.Router();

// Static paths first so they are not shadowed by /:invitationId routes.
router.get("/search-users", protectRoute, searchUsers);
router.get("/me", protectRoute, getMyInvitations);
router.get("/pending-count", protectRoute, getMyInvitationsCount);

router.post("/", protectRoute, sendInvitation);
router.post("/:invitationId/respond", protectRoute, respondToInvitation);

export default router;
