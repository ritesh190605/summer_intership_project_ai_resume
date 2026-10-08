import React from "react";
import { Check } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

const STEPS = ["Personal Info", "Experience", "Education", "Skills", "Certs", "Languages"];

const WizardStepper = () => {
  const { activeStep, setActiveStep, isStepCompleted } = useResumeContext();

  return (
    <div className="mb-6 flex items-center justify-between">
      {STEPS.map((label, index) => {
        const isComplete = isStepCompleted(index);
        const isActive = index === activeStep;

        return (
          <React.Fragment key={label}>
            <button
              type="button"
              onClick={() => setActiveStep(index)}
              className="flex flex-col items-center gap-2 text-center group"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-xs font-semibold transition-all duration-500 backdrop-blur-sm
                  ${
                    isActive
                      ? "border-accent-500 bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-lg shadow-accent-500/30 scale-110 animate-breathe"
                      : isComplete
                      ? "border-accent-400 bg-accent-50/80 text-accent-600 shadow-md dark:bg-slate-800/80 dark:shadow-accent-500/20 glow-blue"
                      : "border-slate-300/60 bg-white/60 text-slate-400 shadow-sm dark:border-slate-600/60 dark:bg-slate-800/40 group-hover:border-accent-300 group-hover:shadow-md group-hover:scale-105"
                  }`}
              >
                {isComplete ? <Check size={14} /> : index + 1}
              </span>
              <span
                className={`text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "text-accent-600 dark:text-accent-400 font-semibold scale-105"
                    : isComplete
                    ? "text-accent-500 dark:text-accent-400"
                    : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </button>
            {index < STEPS.length - 1 && (
              <div
                className={`relative mx-2 h-1 flex-1 rounded-full overflow-hidden transition-all duration-500 ${
                  isComplete
                    ? "bg-gradient-to-r from-accent-400 to-accent-500"
                    : "bg-slate-200/60 dark:bg-slate-700/60"
                }`}
              >
                {isComplete && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                )}
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default WizardStepper;

