import React from "react";
import { Cpu, Lightbulb, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

const categoryIcons = {
  Frontend: "🖥️",
  Backend: "⚙️",
  DevOps: "🚀",
  Mobile: "📱",
  "Data Science": "📊",
  "AI/ML": "🤖",
  Design: "🎨",
  Testing: "🧪",
  Database: "🗄️",
  Cloud: "☁️",
  Security: "🔒",
};

const TechStackPanel = () => {
  const { advancedAnalysis } = useResumeContext();
  const recommendations = advancedAnalysis?.techStackRecommendations || [];
  const overallGuidance = advancedAnalysis?.techStackRecommendations?.overallGuidance;

  if (!recommendations.length) {
    return (
      <div className="glass-card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
            <Cpu size={12} className="text-white" />
          </div>
          Tech Stack Recommendations
        </h2>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-900/30 dark:to-blue-800/20">
            <Cpu size={24} className="text-indigo-500/60" />
          </div>
          <p className="text-sm text-slate-400">Run an advanced analysis to get personalized tech stack recommendations for your target role.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-500/20">
          <Cpu size={12} className="text-white" />
        </div>
        Tech Stack Recommendations
      </h2>

      {/* Overall Guidance */}
      {overallGuidance && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-gradient-to-r from-indigo-50 to-blue-50 p-3 dark:from-indigo-950/20 dark:to-blue-950/20">
          <Lightbulb size={14} className="mt-0.5 shrink-0 text-indigo-500" />
          <p className="text-xs text-slate-600 dark:text-slate-300">{overallGuidance}</p>
        </div>
      )}

      {/* Category Recommendations */}
      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="mb-3 flex items-center gap-2">
              <span className="text-lg">{categoryIcons[rec.category] || "💡"}</span>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{rec.category}</h3>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {rec.recommended?.map((tech, ti) => (
                <span key={ti} className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 px-2.5 py-1 text-xs font-medium text-indigo-700 shadow-sm ring-1 ring-indigo-200/50 dark:from-indigo-950/30 dark:to-blue-950/20 dark:text-indigo-300 dark:ring-indigo-800/30">
                  <Sparkles size={10} />
                  {tech}
                </span>
              ))}
            </div>

            {rec.rationale && (
              <div className="flex items-start gap-1.5 rounded-lg bg-slate-50 p-2 dark:bg-slate-900/50">
                <ArrowRight size={12} className="mt-0.5 shrink-0 text-indigo-400" />
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{rec.rationale}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-50 to-indigo-50 p-3 dark:from-accent-950/20 dark:to-indigo-950/20">
        <BookOpen size={14} className="shrink-0 text-accent-500" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Prioritize learning technologies that complement your existing stack and align with your target role's market demand.
        </p>
      </div>
    </div>
  );
};

export default TechStackPanel;

