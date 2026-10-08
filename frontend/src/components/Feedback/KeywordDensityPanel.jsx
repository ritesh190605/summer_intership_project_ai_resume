import React from "react";
import { Hash, TrendingUp, AlertTriangle, Lightbulb, Sparkles } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

const relevanceColors = {
  High: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30",
  Medium: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30",
  Low: "text-slate-500 bg-slate-50 dark:text-slate-400 dark:bg-slate-800/30",
};

const KeywordDensityPanel = () => {
  const { advancedAnalysis } = useResumeContext();
  const keywordDensity = advancedAnalysis?.keywordDensity || [];
  const overallKeywordScore = advancedAnalysis?.keywordDensity?.overallKeywordScore;

  if (!keywordDensity.length) {
    return (
      <div className="glass-card">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/20">
            <Hash size={12} className="text-white" />
          </div>
          Keyword Density &amp; Context
        </h2>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-50 dark:from-cyan-900/30 dark:to-teal-800/20">
            <Hash size={24} className="text-cyan-500/60" />
          </div>
          <p className="text-sm text-slate-400">Run an advanced analysis to see keyword frequency, density, and context quality.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/20">
          <Hash size={12} className="text-white" />
        </div>
        Keyword Density &amp; Context
      </h2>

      {/* Overall Keyword Score */}
      {overallKeywordScore !== undefined && (
        <div className="glass-strong mb-4 flex items-center gap-3 rounded-xl p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600">
            <TrendingUp size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Overall Keyword Optimization Score</p>
            <p className="text-lg font-bold" style={{ color: overallKeywordScore >= 70 ? "#16a34a" : overallKeywordScore >= 45 ? "#d97706" : "#dc2626" }}>
              {overallKeywordScore}/100
            </p>
          </div>
        </div>
      )}

      {/* Keyword list */}
      <div className="space-y-2">
        {keywordDensity.map((kw, i) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/40 p-3 dark:border-slate-700/60 dark:bg-slate-800/30 animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-teal-50 text-xs font-bold text-cyan-700 dark:from-cyan-900/30 dark:to-teal-800/20 dark:text-cyan-400">
                {kw.count || 0}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{kw.keyword}</p>
                {kw.context && (
                  <p className="mt-0.5 text-xs text-slate-400 italic truncate">"...{kw.context}..."</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-xs text-slate-400">{kw.density?.toFixed(1)}%</span>
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${relevanceColors[kw.relevance] || relevanceColors.Medium}`}>
                {kw.relevance || "Medium"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {advancedAnalysis?.keywordDensity?.suggestions?.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Lightbulb size={12} /> Optimization Suggestions
          </p>
          <ul className="space-y-1.5">
            {advancedAnalysis.keywordDensity.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <Sparkles size={12} className="mt-0.5 shrink-0 text-cyan-500" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KeywordDensityPanel;

