import React from "react";
import { Sparkles } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

/**
 * Renders any AI improvement suggestions scoped to a given resume section
 * (e.g. "experience", "personalInfo") directly beneath that section's form.
 */
const SectionFeedback = ({ section }) => {
  const { getSectionFeedback } = useResumeContext();
  const items = getSectionFeedback(section);

  if (!items.length) return null;

  return (
    <div className="mt-4 space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`sub-card-3d border border-amber-200/40 p-4 dark:border-amber-900/30 stagger-${Math.min(idx + 1, 8)}`}
        >
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-amber-500/30">
              <Sparkles size={10} className="text-white" />
            </div>
            AI Suggestion
          </div>
          {item.originalText && (
            <div className="mb-1.5 rounded-lg bg-white/40 dark:bg-slate-800/40 px-2.5 py-1.5">
              <p className="text-xs text-slate-400 line-through dark:text-slate-500">
                {item.originalText}
              </p>
            </div>
          )}
          {item.suggestedText && (
            <div className="mb-1.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 px-2.5 py-1.5 border border-emerald-200/30 dark:border-emerald-900/30 emerald-glow-hover">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                {item.suggestedText}
              </p>
            </div>
          )}
          {item.reason && (
            <p className="text-xs text-slate-500 dark:text-slate-400 italic">{item.reason}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SectionFeedback;

