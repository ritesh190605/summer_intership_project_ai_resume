import React from "react";
import { Target, Loader2, AlertTriangle, CheckCircle, TrendingUp, FileSearch, Lightbulb, Download } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import { useAdvancedAnalysis, useJobMatch } from "../../hooks/useResumeAnalysis";

const ScoreBar = ({ label, score, color }) => {
  const barColor = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="mb-2">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-semibold" style={{ color: barColor }}>{score}/100</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
};

const downloadATSSummary = (atsScore) => {
  const txt = [
    "========================================",
    "    ATS COMPATIBILITY SUMMARY REPORT",
    "========================================",
    "",
    `Overall ATS Score: ${atsScore.overall}/100`,
    `  - Keyword Match: ${atsScore.keywordMatch}/100`,
    `  - Format Compatibility: ${atsScore.formatCompatibility}/100`,
    `  - Section Completeness: ${atsScore.sectionCompleteness}/100`,
    "",
    `Missing Sections: ${atsScore.missingSections?.length > 0 ? atsScore.missingSections.join(", ") : "None"}`,
    "",
    "Recommendations:",
    ...(atsScore.recommendations || []).map((r, i) => `  ${i + 1}. ${r}`),
    "",
    `Generated: ${new Date().toLocaleString()}`,
    "========================================",
  ].join("\n");
  const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ats-summary-${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const ATSMatchPanel = () => {
  const { advancedAnalysis, isAdvancedAnalyzing, advancedAnalysisError, jobDescription, setJobDescription } =
    useResumeContext();
  const { runAdvancedAnalysis } = useAdvancedAnalysis();
  const { runJobMatch } = useJobMatch();

  const atsScore = advancedAnalysis?.atsScore;
  const hasResults = atsScore && atsScore.overall !== undefined;

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
          <Target size={12} className="text-white" />
        </div>
        ATS &amp; Job Description Match
      </h2>

      {/* Job Description Input */}
      <div className="mb-4">
        <label className="label-text" htmlFor="jobDescription">
          Paste Job Description (optional but recommended)
        </label>
        <textarea
          id="jobDescription"
          rows={4}
          className="input-field resize-none mb-3"
          placeholder="Paste the full job description here to get accurate ATS matching, skill gap analysis, and keyword recommendations..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary flex-1"
            onClick={runAdvancedAnalysis}
            disabled={isAdvancedAnalyzing}
          >
            {isAdvancedAnalyzing ? (
              <><Loader2 size={16} className="animate-spin" /> Analyzing...</>
            ) : (
              <><FileSearch size={16} /> Full Advanced Analysis</>
            )}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={runJobMatch}
            disabled={isAdvancedAnalyzing || !jobDescription}
            title={!jobDescription ? "Paste a job description first" : "Match against JD"}
          >
            <TrendingUp size={16} /> ATS Score
          </button>
        </div>
      </div>

      {/* Error state */}
      {advancedAnalysisError && (
        <div className="glass-strong mb-4 flex items-start gap-2.5 rounded-xl border border-red-200/50 p-3.5 text-xs font-medium text-red-600 dark:border-red-900/30 dark:text-red-400 animate-slide-left">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>{advancedAnalysisError}</span>
        </div>
      )}

      {/* Loading */}
      {isAdvancedAnalyzing && (
        <div className="flex flex-col items-center gap-3 py-6 text-center animate-fade-in">
          <Loader2 size={24} className="animate-spin text-accent-500" />
          <p className="text-sm text-slate-400">Running comprehensive analysis...</p>
        </div>
      )}

      {/* Results */}
      {hasResults && !isAdvancedAnalyzing && (
        <div className="space-y-4 animate-slide-up">
          {/* Overall ATS Score */}
          <div className="glass-strong flex items-center gap-4 rounded-xl p-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-800/20">
              <span className="text-2xl font-bold" style={{ color: atsScore.overall >= 75 ? "#16a34a" : atsScore.overall >= 50 ? "#d97706" : "#dc2626" }}>
                {atsScore.overall}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">ATS Compatibility Score</p>
              <p className="text-xs text-slate-400">
                {atsScore.overall >= 75 ? "Strong ATS compatibility" : atsScore.overall >= 50 ? "Moderate - improvements needed" : "Low - significant changes recommended"}
              </p>
            </div>
          </div>

          {/* Sub-scores */}
          <div className="rounded-xl bg-white/40 p-4 dark:bg-slate-800/30">
            <ScoreBar label="Keyword Match" score={atsScore.keywordMatch} />
            <ScoreBar label="Format Compatibility" score={atsScore.formatCompatibility} />
            <ScoreBar label="Section Completeness" score={atsScore.sectionCompleteness} />
          </div>

          {/* Missing Sections */}
          {atsScore.missingSections?.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <AlertTriangle size={12} /> Missing or Sparse Sections
              </p>
              <div className="flex flex-wrap gap-2">
                {atsScore.missingSections.map((section, i) => (
                  <span key={i} className="glass-badge border border-amber-200/50 text-amber-700 dark:border-amber-900/30 dark:text-amber-400">
                    {section}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {atsScore.recommendations?.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <Lightbulb size={12} /> Recommendations
              </p>
              <ul className="space-y-1.5">
                {atsScore.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle size={12} className="mt-0.5 shrink-0 text-accent-500" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Download ATS Summary */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => downloadATSSummary(atsScore)}
              className="btn-secondary text-[11px] px-3 py-1.5"
            >
              <Download size={14} /> Download ATS Summary
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!hasResults && !isAdvancedAnalyzing && !advancedAnalysisError && (
        <div className="flex flex-col items-center gap-3 py-6 text-center animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-purple-50 dark:from-violet-900/30 dark:to-purple-800/20">
            <Target size={24} className="text-violet-500/60" />
          </div>
          <p className="text-sm text-slate-400 max-w-xs">
            Paste a job description and run an advanced analysis to see your ATS compatibility score, skill gaps, keyword density, and more.
          </p>
        </div>
      )}
    </div>
  );
};

export default ATSMatchPanel;
