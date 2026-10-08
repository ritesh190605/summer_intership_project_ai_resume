import { useCallback } from "react";
import { useResumeContext } from "../context/ResumeContext";
import { analyzeResume, advancedAnalyzeResume, matchJobDescription } from "../api/resumeApi";

/**
 * Wraps the AI analysis call, wiring it into the shared ResumeContext
 * loading/error/result state so any component can trigger + read it.
 */
export const useResumeAnalysis = () => {
  const { resume, uploadedResume, setAnalysis, isAnalyzing, setIsAnalyzing, setAnalysisError, saveToHistory } =
    useResumeContext();

  const runAnalysis = useCallback(async () => {
    const activeResume = uploadedResume || resume;
    if (!activeResume.personalInfo?.fullName || !activeResume.personalInfo?.email) {
      setAnalysisError("Please add your name and email before running an analysis.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await analyzeResume(activeResume);
      setAnalysis(result);
      saveToHistory("basic", { overallScore: result.overallScore, missingKeywords: result.missingKeywords, improvements: result.improvements });
      return result;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong while analyzing your resume. Please try again.";
      setAnalysisError(message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resume, uploadedResume, setAnalysis, setIsAnalyzing, setAnalysisError, saveToHistory]);

  return { runAnalysis, isAnalyzing };
};

/**
 * Hook for running the full advanced analysis suite (ATS, skill gaps,
 * keyword density, context quality, tech stack recommendations).
 */
export const useAdvancedAnalysis = () => {
  const {
    resume,
    uploadedResume,
    setAdvancedAnalysis,
    isAdvancedAnalyzing,
    setIsAdvancedAnalyzing,
    setAdvancedAnalysisError,
    jobDescription,
    saveToHistory,
  } = useResumeContext();

  const runAdvancedAnalysis = useCallback(async () => {
    const activeResume = uploadedResume || resume;
    if (!activeResume.personalInfo?.fullName) {
      setAdvancedAnalysisError("Please add your name before running an advanced analysis.");
      return;
    }

    setIsAdvancedAnalyzing(true);
    setAdvancedAnalysisError(null);

    try {
      const result = await advancedAnalyzeResume(activeResume, jobDescription);
      setAdvancedAnalysis(result);
      saveToHistory("advanced", {
        atsScore: result.atsScore,
        skillGaps: result.skillGaps,
        keywordDensity: result.keywordDensity,
        contextQuality: result.contextQuality,
        techStackRecommendations: result.techStackRecommendations,
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong during advanced analysis. Please try again.";
      setAdvancedAnalysisError(message);
    } finally {
      setIsAdvancedAnalyzing(false);
    }
  }, [resume, uploadedResume, jobDescription, setAdvancedAnalysis, setIsAdvancedAnalyzing, setAdvancedAnalysisError, saveToHistory]);

  return { runAdvancedAnalysis, isAdvancedAnalyzing };
};

/**
 * Hook for matching a resume against a specific job description (ATS scoring).
 */
export const useJobMatch = () => {
  const {
    resume,
    uploadedResume,
    setAdvancedAnalysis,
    isAdvancedAnalyzing,
    setIsAdvancedAnalyzing,
    setAdvancedAnalysisError,
    jobDescription,
    saveToHistory,
  } = useResumeContext();

  const runJobMatch = useCallback(async () => {
    if (!jobDescription || jobDescription.trim().length < 50) {
      setAdvancedAnalysisError("Please enter a job description (at least 50 characters).");
      return;
    }

    setIsAdvancedAnalyzing(true);
    setAdvancedAnalysisError(null);

    try {
      const activeResume = uploadedResume || resume;
      const result = await matchJobDescription({
        resumeData: activeResume,
        jobDescription,
      });
      setAdvancedAnalysis((prev) => ({
        ...prev,
        atsScore: result.atsScore,
      }));
      saveToHistory("ats-match", { atsScore: result.atsScore });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong during ATS matching. Please try again.";
      setAdvancedAnalysisError(message);
    } finally {
      setIsAdvancedAnalyzing(false);
    }
  }, [resume, uploadedResume, jobDescription, setAdvancedAnalysis, setIsAdvancedAnalyzing, setAdvancedAnalysisError, saveToHistory]);

  return { runJobMatch, isAdvancedAnalyzing };
};
