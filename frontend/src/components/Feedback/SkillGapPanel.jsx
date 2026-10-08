import React from "react";
import { BarChart3, AlertTriangle, BookOpen, TrendingUp, Lightbulb, Zap } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

const importanceColors = {
  Critical: { bg: "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900/30 dark:text-red-400", dot: "bg-red-500" },
  Important: { bg: "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/30 dark:text-amber-400", dot: "bg-amber-500" },
  "Nice-to-have": { bg: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/30 dark:text-emerald-400", dot: "bg-emerald-500" },
};

const statusIcons = {
  Missing: <AlertTriangle size={14} />,
  "Partially present": <BarChart3 size={14} />,
  "Present but needs improvement": <TrendingUp size={14} />,
};

const SkillGapPanel = () => {
  const { advancedAnalysis } = useResumeContext();
  const skillGaps = advancedAnalysis?.skillGaps || [];

  if (!skillGaps.length) {
    return (
      <div className="glass-card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <BarChart3 size={12} className="text-white" />
          </div>
          Skill Gap Analysis
        </h2>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-50 dark:from-amber-900/30 dark:to-orange-800/20">
            <BarChart3 size={24} className="text-amber-500/60" />
          </div>
          <p className="text-sm text-slate-400">Run an advanced analysis to see skill gaps identified for your target role.</p>
        </div>
      </div>
    );
  }

  const criticalCount = skillGaps.filter((g) => g.importance === "Critical").length;
  const importantCount = skillGaps.filter((g) => g.importance === "Important").length;

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
          <BarChart3 size={12} className="text-white" />
        </div>
        Skill Gap Analysis
      </h2>

      {/* Summary stats */}
      <div className="mb-4 flex gap-3">
        <div className="flex-1 rounded-xl bg-red-50/50 p-3 text-center dark:bg-red-950/20">
          <p className="text-lg font-bold text-red-600 dark:text-red-400">{criticalCount}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-red-500/70">Critical</p>
        </div>
        <div className="flex-1 rounded-xl bg-amber-50/50 p-3 text-center dark:bg-amber-950/20">
          <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{importantCount}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-amber-500/70">Important</p>
        </div>
        <div className="flex-1 rounded-xl bg-emerald-50/50 p-3 text-center dark:bg-emerald-950/20">
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{skillGaps.length - criticalCount - importantCount}</p>
          <p className="text-[10px] font-medium uppercase tracking-wider text-emerald-500/70">Nice-to-have</p>
        </div>
      </div>

      {/* Skill gap items */}
      <div className="space-y-3">
        {skillGaps.map((gap, i) => {
          const colors = importanceColors[gap.importance] || importanceColors.Important;
          return (
            <div key={i} className={`rounded-xl border p-3.5 ${colors.bg} animate-slide-up`} style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${colors.dot} text-white`}>
                    {statusIcons[gap.currentStatus] || <Zap size={10} />}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{gap.skill}</span>
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${colors.bg}`}>
                        {gap.importance}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">{gap.category} · {gap.currentStatus}</span>
                    {gap.suggestion && (
                      <p className="mt-1.5 flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <Lightbulb size={12} className="mt-0.5 shrink-0 text-amber-500" />
                        {gap.suggestion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent-50 to-indigo-50 p-3 dark:from-accent-950/20 dark:to-indigo-950/20">
        <BookOpen size={14} className="shrink-0 text-accent-500" />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Focus on closing Critical gaps first. Consider online courses, certifications, or hands-on projects to build these skills.
        </p>
      </div>
    </div>
  );
};

export default SkillGapPanel;

