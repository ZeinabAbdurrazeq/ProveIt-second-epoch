import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  uploadCV,
  getProfile,
  startInterview,
  submitAnswer,
  getResults,
  getHistory,
  getSession,
} from "../controllers/aiInterviewController.js";

const router = express.Router();

// In-memory upload: PDF only, 15MB max. The buffer goes straight to pdf-parse,
// nothing is written to disk.
const MAX_CV_SIZE_MB = 50;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_CV_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Translate multer/upload errors into clean 400 JSON responses so an oversized
// or invalid file never bubbles up as a generic 500.
function handleUploadErrors(err, req, res, next) {
  if (!err) return next();
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ msg: `File is too large (max ${MAX_CV_SIZE_MB}MB)` });
  }
  return res.status(400).json({ msg: err.message || "Upload failed" });
}

router.post(
  "/upload-cv",
  protectRoute,
  upload.single("cv"),
  handleUploadErrors,
  uploadCV,
);
router.get("/profile", protectRoute, getProfile);

// Static paths before param routes.
router.post("/start", protectRoute, startInterview);
router.get("/history", protectRoute, getHistory);

router.post("/:sessionId/answer", protectRoute, submitAnswer);
router.get("/:sessionId/results", protectRoute, getResults);

// Read-only session fetch (resume / refresh). Declared after the more specific
// /:sessionId/* routes so it does not shadow them.
router.get("/:sessionId", protectRoute, getSession);

export default router;
