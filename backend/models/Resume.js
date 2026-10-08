import mongoose from "mongoose";

const { Schema } = mongoose;

/* ---------------------------- Sub-Schemas ---------------------------- */

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    isCurrent: { type: Boolean, default: false },
    grade: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: true, timestamps: false }
);

const ExperienceSchema = new Schema(
  {
    company: { type: String, trim: true },
    role: { type: String, trim: true },
    location: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
    isCurrent: { type: Boolean, default: false },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Other"],
      default: "Full-time",
    },
    responsibilities: [{ type: String, trim: true, maxlength: 500 }],
  },
  { _id: true, timestamps: false }
);

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["Technical", "Soft", "Tool", "Language", "Other"],
      default: "Technical",
    },
    proficiency: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
  },
  { _id: true, timestamps: false }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    technologies: [{ type: String, trim: true }],
    link: { type: String, trim: true },
    startDate: { type: String, trim: true },
    endDate: { type: String, trim: true },
  },
  { _id: true, timestamps: false }
);

/* ---------------------- New: Certification Schema ---------------------- */

const CertificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true },
    date: { type: String, trim: true },
    link: { type: String, trim: true },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { _id: true, timestamps: false }
);

/* ---------------------- New: Language Schema ---------------------- */

const LanguageSchema = new Schema(
  {
    language: { type: String, required: true, trim: true },
    proficiency: {
      type: String,
      enum: ["Native", "Fluent", "Advanced", "Intermediate", "Basic"],
      default: "Intermediate",
    },
  },
  { _id: true, timestamps: false }
);

/* ------------------------ AI Feedback Sub-Schema ---------------------- */

const ImprovementSchema = new Schema(
  {
    section: {
      type: String,
      enum: ["personalInfo", "experience", "education", "skills", "projects", "certifications", "languages", "general"],
      required: true,
    },
    originalText: { type: String, trim: true },
    suggestedText: { type: String, trim: true },
    reason: { type: String, trim: true },
  },
  { _id: false }
);

const AnalysisResultSchema = new Schema(
  {
    overallScore: { type: Number, min: 0, max: 100 },
    improvements: [ImprovementSchema],
    missingKeywords: [{ type: String, trim: true }],
    analyzedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* ---------------------- Advanced Analysis Sub-Schemas ---------------------- */

const SkillGapSchema = new Schema(
  {
    skill: { type: String, required: true, trim: true },
    category: { type: String, enum: ["Technical", "Soft", "Tool", "Other"], default: "Technical" },
    importance: { type: String, enum: ["Critical", "Important", "Nice-to-have"], default: "Important" },
    currentStatus: { type: String, enum: ["Missing", "Present but needs improvement", "Partially present"], default: "Missing" },
    suggestion: { type: String, trim: true },
  },
  { _id: false }
);

const KeywordDensitySchema = new Schema(
  {
    keyword: { type: String, required: true, trim: true },
    count: { type: Number, default: 0 },
    density: { type: Number, default: 0 }, // percentage
    context: { type: String, trim: true },
    relevance: { type: String, enum: ["High", "Medium", "Low"], default: "Medium" },
  },
  { _id: false }
);

const ContextQualitySchema = new Schema(
  {
    section: { type: String, required: true },
    item: { type: String, trim: true },
    score: { type: Number, min: 0, max: 100 },
    feedback: { type: String, trim: true },
    hasQuantifiedImpact: { type: Boolean, default: false },
    hasActionVerbs: { type: Boolean, default: false },
    hasContext: { type: Boolean, default: false },
  },
  { _id: false }
);

const ATSScoreSchema = new Schema(
  {
    overall: { type: Number, min: 0, max: 100 },
    keywordMatch: { type: Number, min: 0, max: 100 },
    formatCompatibility: { type: Number, min: 0, max: 100 },
    sectionCompleteness: { type: Number, min: 0, max: 100 },
    missingSections: [{ type: String }],
    recommendations: [{ type: String, trim: true }],
  },
  { _id: false }
);

const TechStackRecommendationSchema = new Schema(
  {
    category: { type: String, required: true, trim: true }, // e.g. "Frontend", "Backend", "DevOps"
    recommended: [{ type: String, trim: true }],
    rationale: { type: String, trim: true },
  },
  { _id: false }
);

const AdvancedAnalysisResultSchema = new Schema(
  {
    atsScore: ATSScoreSchema,
    skillGaps: [SkillGapSchema],
    keywordDensity: [KeywordDensitySchema],
    contextQuality: [ContextQualitySchema],
    techStackRecommendations: [TechStackRecommendationSchema],
    analyzedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

/* ------------------------------ Main Schema ---------------------------- */

const ResumeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },

    personalInfo: {
      fullName: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
      },
      phone: { type: String, required: true, trim: true },
      location: { type: String, trim: true },
      headline: { type: String, trim: true, maxlength: 150 },
      summary: { type: String, trim: true, maxlength: 2000 },
      pronouns: { type: String, trim: true },
      nationality: { type: String, trim: true },
      linkedin: { type: String, required: true, trim: true },
      github: { type: String, required: true, trim: true },
      portfolio: { type: String, trim: true },
    },

    education: [EducationSchema],
    experience: [ExperienceSchema],
    skills: [SkillSchema],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    languages: [LanguageSchema],

    targetRole: { type: String, trim: true },

    lastAnalysis: AnalysisResultSchema,
    advancedAnalysis: AdvancedAnalysisResultSchema,
    jobDescription: { type: String, trim: true, maxlength: 10000 },
  },
  { timestamps: true }
);

ResumeSchema.index({ "personalInfo.email": 1 });

const Resume = mongoose.model("Resume", ResumeSchema);

export default Resume;

