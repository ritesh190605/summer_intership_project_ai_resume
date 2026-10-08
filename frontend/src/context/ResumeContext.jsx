import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

/**
 * Advanced analysis state shape for all 5 new analysis dimensions.
 */
const initialAdvancedAnalysis = {
  atsScore: null,
  skillGaps: [],
  keywordDensity: [],
  contextQuality: [],
  techStackRecommendations: [],
  analyzedAt: null,
};

const initialResume = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
    summary: "",
    pronouns: "",
    nationality: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  targetRole: "",
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
};

const TOTAL_STEPS = 6;

const ResumeContext = createContext(null);

/**
 * Validation rules for each wizard step.
 */
const validateStep = (stepIndex, resume) => {
  switch (stepIndex) {
    case 0:
      return (
        resume.personalInfo.fullName.trim().length > 0 &&
        resume.personalInfo.email.trim().length > 0 &&
        /^\S+@\S+\.\S+$/.test(resume.personalInfo.email) &&
        resume.personalInfo.phone.trim().length > 0 &&
        resume.personalInfo.linkedin.trim().length > 0 &&
        resume.personalInfo.github.trim().length > 0
      );
    case 1:
      return true;
    case 2:
      return (
        resume.education.length > 0 &&
        resume.education.some((e) => e.institution.trim() && e.degree.trim())
      );
    case 3:
      return true;
    case 4:
      return (
        resume.certifications.length === 0 ||
        resume.certifications.every((c) => c.title.trim().length > 0)
      );
    case 5:
      return (
        resume.languages.length === 0 ||
        resume.languages.every((l) => l.language.trim().length > 0)
      );
    default:
      return true;
  }
};

export const ResumeProvider = ({ children }) => {
  const [resume, setResume] = useState(initialResume);
  const [uploadedResume, setUploadedResume] = useState(null);
  const [pg, setPg] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState(null);

  const [advancedAnalysis, setAdvancedAnalysis] = useState(initialAdvancedAnalysis);
  const [isAdvancedAnalyzing, setIsAdvancedAnalyzing] = useState(false);
  const [advancedAnalysisError, setAdvancedAnalysisError] = useState(null);

  const [analysisHistory, setAnalysisHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("resumeAnalysisHistory");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToHistory = useCallback((type, data) => {
    const activeResume = uploadedResume || resume;
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      type,
      data,
      timestamp: new Date().toISOString(),
      targetRole: activeResume.targetRole || "Not specified",
      fullName: activeResume.personalInfo?.fullName || "Unknown",
    };
    setAnalysisHistory((prev) => {
      const updated = [entry, ...prev].slice(0, 50);
      localStorage.setItem("resumeAnalysisHistory", JSON.stringify(updated));
      return updated;
    });
  }, [uploadedResume, resume.targetRole, resume.personalInfo?.fullName]);

  const clearHistory = useCallback(() => {
    setAnalysisHistory([]);
    localStorage.removeItem("resumeAnalysisHistory");
  }, []);

  const [jobDescription, setJobDescription] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updatePersonalInfo = useCallback((field, value) => {
    setUploadedResume(null);
    setResume((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const updateField = useCallback((field, value) => {
    setUploadedResume(null);
    setResume((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addItem = useCallback((section, item) => {
    setUploadedResume(null);
    setResume((prev) => ({ ...prev, [section]: [...prev[section], item] }));
  }, []);

  const updateItem = useCallback((section, index, item) => {
    setUploadedResume(null);
    setResume((prev) => {
      const next = [...prev[section]];
      next[index] = item;
      return { ...prev, [section]: next };
    });
  }, []);

  const removeItem = useCallback((section, index) => {
    setUploadedResume(null);
    setResume((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }, []);

  const getSectionFeedback = useCallback(
    (section) => (analysis?.improvements || []).filter((i) => i.section === section),
    [analysis]
  );

  const goToNextStep = useCallback(() => {
    const isValid = validateStep(activeStep, resume);
    if (!isValid) return false;

    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(activeStep);
      return next;
    });

    setActiveStep((prev) => Math.min(prev + 1, TOTAL_STEPS - 1));
    return true;
  }, [activeStep, resume]);

  const goToPreviousStep = useCallback(() => {
    setActiveStep((prev) => Math.max(0, prev - 1));
  }, []);

  const isStepCompleted = useCallback(
    (stepIndex) => completedSteps.has(stepIndex),
    [completedSteps]
  );

  const value = useMemo(
    () => ({
      resume,
      setResume,
      uploadedResume,
      setUploadedResume,
      pg,
      setPg,
      activeStep,
      setActiveStep,
      completedSteps,
      goToNextStep,
      goToPreviousStep,
      isStepCompleted,
      validateStep: (index) => validateStep(index, resume),
      totalSteps: TOTAL_STEPS,
      updatePersonalInfo,
      updateField,
      addItem,
      updateItem,
      removeItem,
      analysis,
      setAnalysis,
      isAnalyzing,
      setIsAnalyzing,
      analysisError,
      setAnalysisError,
      getSectionFeedback,
      advancedAnalysis,
      setAdvancedAnalysis,
      isAdvancedAnalyzing,
      setIsAdvancedAnalyzing,
      advancedAnalysisError,
      setAdvancedAnalysisError,
      analysisHistory,
      saveToHistory,
      clearHistory,
      jobDescription,
      setJobDescription,
      isConfirmed,
      setIsConfirmed,
      isSubmitted,
      setIsSubmitted,
    }),
    [
      resume, uploadedResume, pg, activeStep, completedSteps,
      analysis, isAnalyzing, analysisError,
      advancedAnalysis, isAdvancedAnalyzing, advancedAnalysisError,
      analysisHistory,
      jobDescription,
      isConfirmed, isSubmitted,
      updatePersonalInfo, updateField, addItem, updateItem, removeItem, getSectionFeedback,
      goToNextStep, goToPreviousStep, isStepCompleted,
      saveToHistory, clearHistory,
    ]
  );

  return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>;
};

export const useResumeContext = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResumeContext must be used within a ResumeProvider");
  return ctx;
};
