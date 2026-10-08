import asyncHandler from "express-async-handler";
import Resume from "../models/Resume.js";
import { isDbConnected } from "../config/db.js";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import {
  analyzeResumeWithAI,
  extractResumeDataWithAI,
  runFullAdvancedAnalysis,
  analyzeATSCompatibility,
  generateInterviewQuestions,
} from "../utils/aiService.js";

const ensureDb = (res) => {
  if (!isDbConnected()) {
    res.status(503);
    throw new Error("Database is unavailable. Resume save/load requires a MongoDB connection.");
  }
};

/**
 * @desc    Analyze a resume payload via AI and return structured feedback.
 *          Accepts either a raw resume JSON body, or { resumeId } to load
 *          a previously saved resume from MongoDB.
 * @route   POST /api/resumes/analyze
 * @access  Public (wire up auth middleware once user accounts exist)
 */
export const analyzeResume = asyncHandler(async (req, res) => {
  let resumeData = req.body;
  let resumeDoc = null;

  // Allow analyzing an already-saved resume by id, or an ad-hoc payload.
  if (req.body.resumeId) {
    resumeDoc = await Resume.findById(req.body.resumeId);
    if (!resumeDoc) {
      res.status(404);
      throw new Error("Resume not found");
    }
    resumeData = resumeDoc.toObject();
  }

  if (!resumeData?.personalInfo?.fullName) {
    res.status(400);
    throw new Error("A valid resume payload with personalInfo is required");
  }

  let analysis;
  try {
    analysis = await analyzeResumeWithAI(resumeData);
  } catch (err) {
    console.error("[AI Service Error]", err);
    res.status(502);
    throw new Error(
      "The AI analysis service is temporarily unavailable. Please try again shortly."
    );
  }

  // Basic shape validation on the AI response before trusting it.
  if (
    typeof analysis.overallScore !== "number" ||
    !Array.isArray(analysis.improvements) ||
    !Array.isArray(analysis.missingKeywords)
  ) {
    res.status(502);
    throw new Error("AI response was malformed. Please retry the analysis.");
  }

  // Persist the analysis if we're working against a saved resume.
  if (resumeDoc) {
    resumeDoc.lastAnalysis = { ...analysis, analyzedAt: new Date() };
    await resumeDoc.save();
  }

  res.status(200).json({
    success: true,
    data: analysis,
  });
});

/**
 * @desc    Create a new resume
 * @route   POST /api/resumes
 */
export const createResume = asyncHandler(async (req, res) => {
  ensureDb(res);
  const resume = await Resume.create(req.body);
  res.status(201).json({ success: true, data: resume });
});

/**
 * @desc    Update an existing resume (used for live-save from the wizard)
 * @route   PUT /api/resumes/:id
 */
export const updateResume = asyncHandler(async (req, res) => {
  ensureDb(res);
  const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  res.status(200).json({ success: true, data: resume });
});

/**
 * @desc    Get a single resume by id
 * @route   GET /api/resumes/:id
 */
export const getResume = asyncHandler(async (req, res) => {
  ensureDb(res);
  const resume = await Resume.findById(req.params.id);
  if (!resume) {
    res.status(404);
    throw new Error("Resume not found");
  }
  res.status(200).json({ success: true, data: resume });
});

/**
 * @desc    Parse an uploaded resume file (PDF, Word, or TXT) using AI and return
 *          structured resume JSON to pre-fill the wizard fields.
 * @route   POST /api/resumes/parse-upload
 */
export const parseUploadedResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded. Please upload a PDF, Word, or TXT document.");
  }

  const { originalname, buffer, mimetype } = req.file;
  let rawText = "";

  try {
    if (mimetype === "application/pdf") {
      const pdfParser = new PDFParse({
        verbosity: "WARNINGS",
        worker: null,
        data: new Uint8Array(buffer),
      });
      const result = await pdfParser.getText();
      rawText = result.text || "";
    } else if (
      mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      mimetype === "application/msword"
    ) {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    } else if (mimetype === "text/plain") {
      rawText = buffer.toString("utf-8");
    } else {
      res.status(400);
      throw new Error(
        "Unsupported file format. Please upload a .pdf, .doc, .docx, or .txt file."
      );
    }
  } catch (parseErr) {
    // Re-throw if it's our own controlled error
    if (res.statusCode === 400) throw parseErr;
    console.error("[File Parse Error]", parseErr);
    res.status(500);
    throw new Error("Failed to read the uploaded file. It may be corrupted.");
  }

  if (!rawText || rawText.trim().length < 20) {
    res.status(400);
    throw new Error(
      "Could not extract enough text from the file. The document may be image-based or empty."
    );
  }

  let parsed;
  try {
    parsed = await extractResumeDataWithAI(rawText);
  } catch (aiErr) {
    console.error("[AI Parse Error]", aiErr);
    res.status(502);
    throw new Error(
      "The AI parsing service is temporarily unavailable. Please try again shortly."
    );
  }

  res.status(200).json({ success: true, data: parsed });
});

/**
 * @desc    Run advanced analysis on a resume: ATS score, skill gaps, keyword
 *          density, context quality, and tech stack recommendations.
 * @route   POST /api/resumes/advanced-analyze
 */
export const advancedAnalyzeResume = asyncHandler(async (req, res) => {
  let resumeData = req.body;
  let resumeDoc = null;

  if (req.body.resumeId) {
    resumeDoc = await Resume.findById(req.body.resumeId);
    if (!resumeDoc) {
      res.status(404);
      throw new Error("Resume not found");
    }
    resumeData = resumeDoc.toObject();
  }

  if (!resumeData?.personalInfo?.fullName) {
    res.status(400);
    throw new Error("A valid resume payload with personalInfo is required");
  }

  const jobDescription = req.body.jobDescription || null;

  let analysis;
  try {
    analysis = await runFullAdvancedAnalysis(resumeData, jobDescription);
  } catch (err) {
    console.error("[Advanced AI Analysis Error]", err);
    res.status(502);
    throw new Error(
      "The AI analysis service is temporarily unavailable. Please try again shortly."
    );
  }

  // Persist the analysis if we're working against a saved resume.
  if (resumeDoc) {
    resumeDoc.advancedAnalysis = { ...analysis, analyzedAt: new Date() };
    if (jobDescription) {
      resumeDoc.jobDescription = jobDescription;
    }
    await resumeDoc.save();
  }

  res.status(200).json({
    success: true,
    data: analysis,
  });
});

/**
 * @desc    Match a resume against a specific job description for ATS scoring.
 * @route   POST /api/resumes/match-jd
 */
export const matchJobDescription = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription } = req.body;

  if (!jobDescription || jobDescription.trim().length < 50) {
    res.status(400);
    throw new Error("A valid job description (at least 50 characters) is required.");
  }

  let resumeData;
  if (resumeId) {
    const resumeDoc = await Resume.findById(resumeId);
    if (!resumeDoc) {
      res.status(404);
      throw new Error("Resume not found");
    }
    resumeData = resumeDoc.toObject();
  } else if (req.body.resumeData) {
    resumeData = req.body.resumeData;
  } else {
    res.status(400);
    throw new Error("Either resumeId or resumeData is required.");
  }

  let atsScore;
  try {
    atsScore = await analyzeATSCompatibility(resumeData, jobDescription);
  } catch (err) {
    console.error("[ATS Match Error]", err);
    res.status(502);
    throw new Error("ATS matching service is temporarily unavailable.");
  }

  res.status(200).json({
    success: true,
    data: {
      atsScore,
      jobDescription,
      matchedAt: new Date(),
    },
  });
});

/**
 * @desc    Generate AI-powered interview questions based on resume data
 * @route   POST /api/resumes/interview-questions
 */
export const getInterviewQuestions = asyncHandler(async (req, res) => {
  let resumeData = req.body;

  if (!resumeData?.personalInfo?.fullName) {
    res.status(400);
    throw new Error("A valid resume payload with personalInfo is required");
  }

  let questions;
  try {
    questions = await generateInterviewQuestions(resumeData);
  } catch (err) {
    console.error("[Interview Questions AI Error]", err);
    res.status(502);
    throw new Error(
      "The AI interview question service is temporarily unavailable. Please try again shortly."
    );
  }

  res.status(200).json({
    success: true,
    data: questions,
  });
});
