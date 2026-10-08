import React from "react";
import { FileText, CheckCircle, XCircle, AlertTriangle, TrendingUp, Lightbulb, Sparkles } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

const QualityIndicator = ({ label, value }) => (
  <div className="flex items-center gap-1.5">
    {value ? (
      <CheckCircle size={12} className="text-emerald-500" />
    ) : (
      <XCircle size={12} className="text-red-400" />
    )}
    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</span>
  </div>
);

const ContextQualityPanel = () => {
  const { advancedAnalysis } = useResumeContext();
  const contextQuality = advancedAnalysis?.contextQuality || [];
  const overallContextScore = advancedAnalysis?.contextQuality?.overallContextScore;

  if (!contextQuality.length) {
    return (
      <div className="glass-card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
            <FileText size={12} className="text-white" />
          </div>
          Context Quality &amp; Impact
        </h2>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-100 to-rose-50 dark:from-pink-900/30 dark:to-rose-800/20">
            <FileText size={24} className="text-pink-500/60" />
          </div>
          <p className="text-sm text-slate-400">Run an advanced analysis to evaluate the quality and impact of each bullet point.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/20">
          <FileText size={12} className="text-white" />
        </div>
        Context Quality &amp; Impact
      </h2>

      {/* Overall Score */}
      {overallContextScore !== undefined && (
        <div className="glass-strong mb-4 flex items-center gap-3 rounded-xl p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ background: overallContextScore >= 70 ? "linear-gradient(135deg, #16a34a, #15803d)" : overallContextScore >= 45 ? "linear-gradient(135deg, #d97706, #b45309)" : "linear-gradient(135deg, #dc2626, #b91c1c)" }}>
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Overall Impact Quality Score</p>
            <p className="text-lg font-bold">{overallContextScore}/100</p>
          </div>
        </div>
      )}

      {/* Summary feedback */}
      {advancedAnalysis?.contextQuality?.summaryFeedback && (
        <div className="mb-4 flex items-start gap-2 rounded-xl bg-gradient-to-r from-accent-50 to-indigo-50 p-3 dark:from-accent-950/20 dark:to-indigo-950/20">
          <Lightbulb size={14} className="mt-0.5 shrink-0 text-accent-500" />
          <p className="text-xs text-slate-600 dark:text-slate-300">{advancedAnalysis.contextQuality.summaryFeedback}</p>
        </div>
      )}

      {/* Bullet point evaluations */}
      <div className="space-y-3">
        {contextQuality.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200/60 bg-white/40 p-3 dark:border-slate-700/60 dark:bg-slate-800/30 animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {item.section === "experience" ? "Experience" : "Project"} #{i + 1}
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: item.score >= 70 ? "#16a34a" : item.score >= 45 ? "#d97706" : "#dc2626" }}
              >
                {item.score}/100
              </span>
            </div>

            {item.item && (
              <p className="mb-2 text-xs text-slate-600 dark:text-slate-300 italic line-clamp-2">"{item.item}"</p>
            )}

            {/* Quality indicators */}
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
              <QualityIndicator label="Quantified Impact" value={item.hasQuantifiedImpact} />
              <QualityIndicator label="Action Verbs" value={item.hasActionVerbs} />
              <QualityIndicator label="Has Context" value={item.hasContext} />
            </div>

            {/* Feedback */}
            {item.feedback && (
              <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-amber-50/50 p-2 dark:bg-amber-950/20">
                <Sparkles size={12} className="mt-0.5 shrink-0 text-amber-500" />
                <p className="text-[11px] text-amber-700 dark:text-amber-300">{item.feedback}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContextQualityPanel;

