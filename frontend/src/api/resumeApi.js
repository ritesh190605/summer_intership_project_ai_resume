import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://summer-internship-project-ai-resume.onrender.com/api",
  timeout: 60000, // AI calls can take a while
});

/**
 * Sends the current resume draft to the backend for AI analysis.
 * @param {object} resumeData - full resume JSON from ResumeContext
 * @returns {Promise<{overallScore:number, improvements:Array, missingKeywords:string[]}>}
 */
export const analyzeResume = async (resumeData) => {
  const { data } = await api.post("/resumes/analyze", resumeData);
  return data.data;
};

export const saveResume = async (resumeData, resumeId) => {
  const { data } = resumeId
    ? await api.put(`/resumes/${resumeId}`, resumeData)
    : await api.post("/resumes", resumeData);
  return data.data;
};

/**
 * Uploads a resume file (PDF/Word) and returns structured resume data
 * parsed by the AI from the file contents.
 * @param {File} file - the resume file object
 * @returns {Promise<object>} - structured resume JSON matching ResumeContext shape
 */
export const parseUploadedResume = async (file) => {
  const formData = new FormData();
  formData.append("resume", file);
  const { data } = await api.post("/resumes/parse-upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data;
};

/**
 * Runs the full advanced analysis suite: ATS score, skill gaps, keyword density,
 * context quality, and tech stack recommendations.
 * @param {object} resumeData - full resume JSON
 * @param {string} [jobDescription] - optional job description text
 * @returns {Promise<object>} combined advanced analysis result
 */
export const advancedAnalyzeResume = async (resumeData, jobDescription) => {
  const payload = jobDescription
    ? { ...resumeData, jobDescription }
    : resumeData;
  const { data } = await api.post("/resumes/advanced-analyze", payload);
  return data.data;
};

/**
 * Matches a resume against a specific job description for ATS scoring.
 * @param {object} options - { resumeId?, resumeData?, jobDescription }
 * @returns {Promise<object>} ATS score and match results
 */
export const matchJobDescription = async ({ resumeId, resumeData, jobDescription }) => {
  const { data } = await api.post("/resumes/match-jd", {
    resumeId,
    resumeData,
    jobDescription,
  });
  return data.data;
};

export default api;



export const getInterviewQuestions = async (resumeData) => {
  const { data } = await api.post("/resumes/interview-questions", resumeData);
  return data.data;
};
