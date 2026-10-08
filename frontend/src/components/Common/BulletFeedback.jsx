import React, { useState, useMemo } from "react";
import {
  AlertTriangle, CheckCircle2, Lightbulb, TrendingUp,
  ChevronDown, ChevronUp
} from "lucide-react";
import { analyzeBulletPoint } from "../../utils/bulletAnalysis";

/**
 * BulletFeedback — Inline bullet point analysis component.
 *
 * Features:
 *  1. Basic bullet feedback points (score + summary badges)
 *  2. Flags weak/passive phrases with severity indicators
 *  3. Checks for quantified achievements (%/numbers)
 *  4. Provides a list of suggestions for improvement
 */
const BulletFeedback = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const analysis = useMemo(() => analyzeBulletPoint(text), [text]);

  if (!text || text.trim().length < 3) return null;

  const { weakPhrases, hasQuantified, suggestions, score } = analysis;

  if (weakPhrases.length === 0 && hasQuantified && suggestions.length === 0) return null;

  const severityColor = score >= 75 ? "emerald" : score >= 45 ? "amber" : "red";
  const bgColor =
    severityColor === "emerald"
      ? "bg-emerald-50/80 border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-900/30"
      : severityColor === "amber"
        ? "bg-amber-50/80 border-amber-200/50 dark:bg-amber-950/20 dark:border-amber-900/30"
        : "bg-red-50/80 border-red-200/50 dark:bg-red-950/20 dark:border-red-900/30";
  const dotColor = severityColor === "emerald"
    ? "bg-emerald-500"
    : severityColor === "amber"
      ? "bg-amber-500"
      : "bg-red-500";

  const hasIssues = weakPhrases.length > 0 || !hasQuantified;

  const severityIcon = (severity) => {
    switch (severity) {
      case "high": return <AlertTriangle size={12} className="text-red-500 shrink-0" />;
      case "medium": return <AlertTriangle size={12} className="text-amber-500 shrink-0" />;
      case "low": return <Lightbulb size={12} className="text-amber-400 shrink-0" />;
      default: return <Lightbulb size={12} className="text-amber-400 shrink-0" />;
    }
  };

  const outerClass = "mt-2 rounded-xl border " + bgColor + " p-3 transition-all duration-200";
  const dotClass = "flex h-2 w-2 rounded-full " + dotColor + (hasIssues ? " animate-pulse" : "");
  const scoreClass = "text-[11px] font-bold " + (
    severityColor === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : severityColor === "amber"
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400"
  );

  return (
    <div className={outerClass}>
      {/* Header row — collapsed summary */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Score indicator */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className={dotClass} />
            <span className={scoreClass}>
              {score}/100
            </span>
          </div>

          {/* Weak phrase flags */}
          {weakPhrases.length > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100/80 dark:bg-red-900/30 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:text-red-400 shrink-0">
              <AlertTriangle size={10} />
              {weakPhrases.length} weak phrase{weakPhrases.length > 1 ? "s" : ""}
            </span>
          )}

          {/* Quantified flag */}
          {!hasQuantified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0">
              <TrendingUp size={10} />
              No metrics
            </span>
          )}

          {/* Clean bill if everything looks good */}
          {weakPhrases.length === 0 && hasQuantified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 size={10} />
              Looks good
            </span>
          )}
        </div>

        {/* Expand / collapse toggle */}
        {suggestions.length > 0 && (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setIsExpanded(!isExpanded); }}
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-white/60 hover:text-slate-600 dark:hover:bg-slate-800/40 dark:hover:text-slate-300 transition-colors"
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && suggestions.length > 0 && (
        <div className="mt-3 space-y-2 border-t border-slate-200/40 dark:border-slate-700/40 pt-3">
          {/* Weak phrases detail */}
          {weakPhrases.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-red-500/70 dark:text-red-400/70">
                Weak / Passive Phrases
              </p>
              {weakPhrases.map((wp, i) => {
                const wpSeverityClass = "font-medium " + (
                  wp.severity === "high"
                    ? "text-red-600 dark:text-red-400"
                    : wp.severity === "medium"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-amber-500 dark:text-amber-300"
                );
                const wpLabel = wp.severity === "high"
                  ? "High severity: "
                  : wp.severity === "medium"
                    ? "Moderate: "
                    : "Suggestion: ";
                return (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-white/50 dark:bg-slate-800/30 px-2.5 py-2 text-xs">
                    {severityIcon(wp.severity)}
                    <div>
                      <span className={wpSeverityClass}>{wpLabel}</span>
                      <span className="text-slate-600 dark:text-slate-400">{wp.suggestion}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Suggestions list */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-500/70 dark:text-amber-400/70 flex items-center gap-1.5">
              <Lightbulb size={11} /> Suggestions ({suggestions.length})
            </p>
            {suggestions.map((s, i) => {
              const sSeverityClass = "font-medium " + (
                s.severity === "high"
                  ? "text-red-600 dark:text-red-400"
                  : s.severity === "medium"
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-amber-500 dark:text-amber-300"
              );
              const sLabel = s.type === "weak_phrase"
                ? "Rewrite: "
                : s.type === "quantification"
                  ? "Quantify: "
                  : s.type === "action_verb"
                    ? "Action verb: "
                    : s.type === "too_short"
                      ? "Expand: "
                      : s.type === "tech_context"
                        ? "Tech: "
                        : "Tip: ";
              return (
                <div key={i} className="flex items-start gap-2 rounded-lg bg-white/50 dark:bg-slate-800/30 px-2.5 py-2 text-xs">
                  {severityIcon(s.severity)}
                  <div>
                    <span className={sSeverityClass}>{sLabel}</span>
                    <span className="text-slate-600 dark:text-slate-400">{s.message}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletFeedback;
