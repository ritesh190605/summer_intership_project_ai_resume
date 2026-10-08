import React, { useState } from "react";
import {
  Loader2,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  BarChart3,
} from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import { getInterviewQuestions } from "../../api/resumeApi";

const difficultyColors = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const categoryIcons = {
  Technical: <BarChart3 size={14} />,
  Behavioral: <MessageSquare size={14} />,
  "System Design": <Lightbulb size={14} />,
  "Project Deep-Dive": <MessageSquare size={14} />,
  "Role-specific": <MessageSquare size={14} />,
};

const InterviewQuestionsPanel = () => {
  const { resume } = useResumeContext();
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setQuestions(null);
    try {
      const result = await getInterviewQuestions(resume);
      setQuestions(result);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to generate interview questions.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Generate tailored interview questions based on your resume.
        </p>
        <button
          type="button"
          className="btn-primary shimmer-border text-xs"
          onClick={handleGenerate}
          disabled={isLoading}
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {isLoading ? "Generating..." : "Generate Questions"}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200/50 bg-red-50/80 p-3 text-xs font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20">
            <Loader2 size={22} className="animate-spin text-emerald-600" />
          </div>
          <p className="text-xs text-slate-400">Crafting personalized interview questions...</p>
        </div>
      )}

      {questions?.overallGuidance && !isLoading && (
        <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/60 p-3 text-xs text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-950/20 dark:text-emerald-300">
          <p className="font-semibold mb-1">Interview Prep Guidance</p>
          <p>{questions.overallGuidance}</p>
        </div>
      )}

      {questions?.questions?.length > 0 && !isLoading && (
        <div className="space-y-2">
          {questions.questions.map((q, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-200/60 bg-white/60 p-3 transition-all duration-200 hover:shadow-sm dark:border-slate-700/60 dark:bg-slate-800/30"
            >
              <button
                type="button"
                onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
                className="flex w-full items-start justify-between gap-2 text-left"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {i + 1}. {q.question}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-700/50 dark:text-slate-400">
                      {categoryIcons[q.category] || null}
                      {q.category}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${difficultyColors[q.difficulty] || "bg-slate-100 text-slate-600"}`}>
                      {q.difficulty}
                    </span>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  {expandedIndex === i ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                </div>
              </button>

              {expandedIndex === i && (
                <div className="mt-3 space-y-2 border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
                  {q.context && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Why this question?</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{q.context}</p>
                    </div>
                  )}
                  {q.suggestedApproach && (
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">Suggested Approach</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{q.suggestedApproach}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!questions && !isLoading && !error && (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20">
            <MessageSquare size={20} className="text-emerald-500/60" />
          </div>
          <p className="text-xs text-slate-400">
            Click "Generate Questions" to get AI-powered interview questions tailored to your resume.
          </p>
        </div>
      )}
    </div>
  );
};

export default InterviewQuestionsPanel;
