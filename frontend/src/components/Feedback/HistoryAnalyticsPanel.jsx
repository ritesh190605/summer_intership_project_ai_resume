import React, { useState } from "react";
import {
  History,
  BarChart3,
  Trash2,
  Sparkles,
  Target,
  ChevronDown,
  ChevronRight,
  Download,
} from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

const HistoryAnalyticsPanel = () => {
  const { analysisHistory, clearHistory } = useResumeContext();
  const [expandedId, setExpandedId] = useState(null);

  const getScoreColor = (score) => {
    if (!score) return "text-slate-400";
    return score >= 75 ? "text-emerald-500" : score >= 50 ? "text-amber-500" : "text-red-500";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "basic":
        return <Sparkles size={14} className="text-amber-500" />;
      case "advanced":
        return <BarChart3 size={14} className="text-violet-500" />;
      case "ats-match":
        return <Target size={14} className="text-cyan-500" />;
      default:
        return <History size={14} className="text-slate-400" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "basic":
        return "Basic Analysis";
      case "advanced":
        return "Advanced Analysis";
      case "ats-match":
        return "ATS Match";
      default:
        return "Unknown";
    }
  };

  const downloadHistoryCSV = () => {
    if (analysisHistory.length === 0) return;

    const headers = [
      "Date",
      "Type",
      "Target Role",
      "Overall Score",
      "Keyword Match",
      "Format Compatibility",
      "Section Completeness",
      "Missing Sections",
      "Recommendations",
    ];
    const rows = analysisHistory.map((entry) => {
      const d = entry.data;
      const score = d?.overallScore ?? d?.atsScore?.overall ?? "N/A";
      const kwMatch = d?.atsScore?.keywordMatch ?? "N/A";
      const fmtCompat = d?.atsScore?.formatCompatibility ?? "N/A";
      const secComplete = d?.atsScore?.sectionCompleteness ?? "N/A";
      const missingSecs =
        d?.atsScore?.missingSections?.join("; ") ||
        d?.missingKeywords?.join("; ") ||
        "N/A";
      const recs =
        d?.atsScore?.recommendations?.join("; ") ||
        d?.improvements?.map((i) => i.reason).join("; ") ||
        "N/A";

      return [
        new Date(entry.timestamp).toLocaleString(),
        getTypeLabel(entry.type),
        entry.targetRole,
        score,
        kwMatch,
        fmtCompat,
        secComplete,
        missingSecs,
        recs,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resume-analysis-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalAnalyses = analysisHistory.length;
  const basicAnalyses = analysisHistory.filter((e) => e.type === "basic");
  const atsAnalyses = analysisHistory.filter(
    (e) => e.type === "ats-match" || e.type === "advanced"
  );
  const avgOverallScore =
    basicAnalyses.length > 0
      ? Math.round(
          basicAnalyses.reduce(
            (sum, e) => sum + (e.data?.overallScore || 0),
            0
          ) / basicAnalyses.length
        )
      : null;
  const avgATSScore =
    atsAnalyses.length > 0
      ? Math.round(
          atsAnalyses.reduce(
            (sum, e) => sum + (e.data?.atsScore?.overall || 0),
            0
          ) / atsAnalyses.length
        )
      : null;

  const hasHistory = analysisHistory.length > 0;

  return (
    <div className="space-y-4">
      {/* Analytics Summary Cards */}
      {hasHistory && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200/60 bg-white/60 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Total Analyses
            </p>
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">
              {totalAnalyses}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200/60 bg-white/60 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Avg. Score
            </p>
            <p
              className={`text-2xl font-bold ${getScoreColor(
                avgOverallScore || avgATSScore
              )}`}
            >
              {avgOverallScore || avgATSScore || "N/A"}
            </p>
          </div>
          {avgOverallScore !== null && (
            <div className="rounded-xl border border-slate-200/60 bg-white/60 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Avg. Resume Score
              </p>
              <p
                className={`text-lg font-bold ${getScoreColor(
                  avgOverallScore
                )}`}
              >
                {avgOverallScore}
              </p>
            </div>
          )}
          {avgATSScore !== null && (
            <div className="rounded-xl border border-slate-200/60 bg-white/60 p-3 dark:border-slate-700/60 dark:bg-slate-800/30">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Avg. ATS Score
              </p>
              <p
                className={`text-lg font-bold ${getScoreColor(avgATSScore)}`}
              >
                {avgATSScore}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions Bar */}
      {hasHistory && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">
            {analysisHistory.length} saved analysis
            {analysisHistory.length !== 1 ? "es" : ""}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={downloadHistoryCSV}
              className="btn-secondary text-[10px] px-3 py-1.5"
            >
              <Download size={12} /> Export CSV
            </button>
            <button
              type="button"
              onClick={clearHistory}
              className="btn-danger text-[10px] px-3 py-1.5"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      {hasHistory ? (
        <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
          {analysisHistory.map((entry) => (
            <div
              key={entry.id}
              className="rounded-xl border border-slate-200/60 bg-white/50 p-3 transition-all hover:shadow-sm dark:border-slate-700/60 dark:bg-slate-800/20"
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(
                    expandedId === entry.id ? null : entry.id
                  )
                }
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getTypeIcon(entry.type)}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                      {getTypeLabel(entry.type)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(entry.timestamp).toLocaleDateString()} ·{" "}
                      {new Date(entry.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {entry.data?.overallScore !== undefined && (
                    <span
                      className={`text-xs font-bold ${getScoreColor(
                        entry.data.overallScore
                      )}`}
                    >
                      {entry.data.overallScore}
                    </span>
                  )}
                  {entry.data?.atsScore?.overall !== undefined && (
                    <span
                      className={`text-xs font-bold ${getScoreColor(
                        entry.data.atsScore.overall
                      )}`}
                    >
                      {entry.data.atsScore.overall}
                    </span>
                  )}
                  {expandedId === entry.id ? (
                    <ChevronDown size={14} className="text-slate-400" />
                  ) : (
                    <ChevronRight size={14} className="text-slate-400" />
                  )}
                </div>
              </button>

              {expandedId === entry.id && (
                <div className="mt-3 space-y-2 border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
                  <p className="text-[10px] text-slate-400">
                    <span className="font-semibold">Target Role:</span>{" "}
                    {entry.targetRole}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    <span className="font-semibold">Name:</span>{" "}
                    {entry.fullName}
                  </p>

                  {entry.data?.atsScore && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        ATS Sub-scores
                      </p>
                      {entry.data.atsScore.keywordMatch !== undefined && (
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Keyword Match</span>
                          <span className="font-semibold">
                            {entry.data.atsScore.keywordMatch}/100
                          </span>
                        </div>
                      )}
                      {entry.data.atsScore.formatCompatibility !==
                        undefined && (
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Format Compatibility</span>
                          <span className="font-semibold">
                            {entry.data.atsScore.formatCompatibility}/100
                          </span>
                        </div>
                      )}
                      {entry.data.atsScore.sectionCompleteness !==
                        undefined && (
                        <div className="flex justify-between text-[10px] text-slate-500">
                          <span>Section Completeness</span>
                          <span className="font-semibold">
                            {entry.data.atsScore.sectionCompleteness}/100
                          </span>
                        </div>
                      )}
                      {entry.data.atsScore.missingSections?.length > 0 && (
                        <div>
                          <p className="text-[10px] text-amber-600 mt-1">
                            Missing:{" "}
                            {entry.data.atsScore.missingSections.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {entry.data?.missingKeywords?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 mb-1">
                        Missing Keywords
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {entry.data.missingKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[9px] text-slate-500 dark:bg-slate-700/50"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.data?.improvements?.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-500 mb-1">
                        Improvements Suggested
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {entry.data.improvements.length} suggestions across{" "}
                        {new Set(
                          entry.data.improvements.map((i) => i.section)
                        ).size}{" "}
                        sections
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800/50 dark:to-slate-700/30">
            <History size={22} className="text-slate-400" />
          </div>
          <p className="text-xs text-slate-400 max-w-xs">
            No analysis history yet. Run a basic analysis, advanced analysis,
            or ATS match and results will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
};

export default HistoryAnalyticsPanel;
