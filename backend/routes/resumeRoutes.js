import express from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import {
  analyzeResume,
  createResume,
  updateResume,
  getResume,
  parseUploadedResume,
  advancedAnalyzeResume,
  matchJobDescription,
  getInterviewQuestions,
} from "../controllers/resumeController.js";

const router = express.Router();

// In-memory file storage for resume uploads (max 10 MB for larger files)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, Word documents, and TXT files are allowed."), false);
    }
  },
});

// AI calls are expensive — throttle these routes independently
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many analysis requests. Please slow down." },
});

router.post("/analyze", analyzeLimiter, analyzeResume);
router.post("/advanced-analyze", analyzeLimiter, advancedAnalyzeResume);
router.post("/interview-questions", analyzeLimiter, getInterviewQuestions);
router.post("/match-jd", analyzeLimiter, matchJobDescription);
router.post("/parse-upload", analyzeLimiter, upload.single("resume"), parseUploadedResume);

router.post("/", createResume);
router.get("/:id", getResume);
router.put("/:id", updateResume);

export default router;
