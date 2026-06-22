import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { executeCode } from "../controllers/codeController.js";

const router = express.Router();

router.post("/execute", protectRoute, executeCode);

export default router;
