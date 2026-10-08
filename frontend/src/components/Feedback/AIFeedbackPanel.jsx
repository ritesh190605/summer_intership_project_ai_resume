import React, { useState } from "react";
import {
  Loader2,
  Sparkles,
  AlertTriangle,
  KeyRound,
  ChevronDown,
  ChevronRight,
  Target,
  BarChart3,
  Hash,
  FileText,
  Cpu,
  MessageSquare,
  History,
} from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import ATSMatchPanel from "./ATSMatchPanel";
import SkillGapPanel from "./SkillGapPanel";
import KeywordDensityPanel from "./KeywordDensityPanel";
import ContextQualityPanel from "./ContextQualityPanel";
import TechStackPanel from "./TechStackPanel";
import InterviewQuestionsPanel from "./InterviewQuestionsPanel";
import HistoryAnalyticsPanel from "./HistoryAnalyticsPanel";

const ScoreRing = ({ score = 0 }) => {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="card-3d-glow p-2">
      <svg width="90" height="90" viewBox="0 0 90 90" className="shrink-0">
        <circle cx="45" cy="45" r={radius} stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle cx="45" cy="45" r={radius} stroke={color} strokeWidth="8" fill="none" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 45 45)" className="drop-shadow-[0_0_6px_currentColor]" style={{ color, filter: `drop-shadow(0 0 8px ${color}40)` }} />
        <text x="45" y="50" textAnchor="middle" className="fill-slate-700 dark:fill-slate-200" fontSize="20" fontWeight="700">{score}</text>
      </svg>
    </div>
  );
};

const CollapsibleSection = ({ icon, title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200/60 dark:border-slate-700/60 last:border-b-0">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center justify-between px-1 py-3 text-left transition-colors hover:text-accent-600">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {icon}
          {title}
        </span>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </button>
      {isOpen && <div className="pb-3">{children}</div>}
    </div>
  );
};

const AIFeedbackPanel = () => {
  const { analysis, analysisError } = useResumeContext();
  const { runAnalysis, isAnalyzing } = useResumeAnalysis();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20 animate-float-slow">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-slate-800 dark:text-slate-100">AI Feedback</span>
        </h2>
        <button className="btn-primary shimmer-border" onClick={runAnalysis} disabled={isAnalyzing}>
          {isAnalyzing && <Loader2 size={16} className="animate-spin" />}
          {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
        </button>
      </div>

      {analysisError && (
        <div className="glass-strong mb-4 flex items-start gap-2.5 rounded-xl border border-red-200/50 p-3.5 text-sm text-red-700 dark:border-red-900/30 dark:text-red-400 animate-slide-left">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>{analysisError}</span>
        </div>
      )}

      {!analysis && !isAnalyzing && !analysisError && (
        <div className="flex flex-col items-center gap-3 py-6 text-center animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-50 dark:from-accent-900/30 dark:to-accent-800/20 animate-breathe">
            <Sparkles size={28} className="text-accent-500/60" />
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Fill in your resume details and click <span className="font-semibold text-accent-500">&ldquo;Analyze Resume&rdquo;</span> to get an AI-powered score, section-by-section rewrites, and missing keywords.
          </p>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center gap-4 py-8 animate-scale-in">
          <div className="relative">

              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-white/90 dark:bg-slate-900/90">
                <Loader2 size={28} className="animate-spin-slow text-accent-600" />
              </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Reviewing your resume against role expectations...
          </p>
        </div>
      )}

      {analysis && !isAnalyzing && (
        <div className="space-y-5 animate-slide-up">
          <div className="flex items-center gap-4 glass-strong rounded-xl p-4 glow-hover">
            <ScoreRing score={analysis.overallScore} />
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Overall Resume Score</p>
              <p className="text-xs text-slate-400">Based on clarity, quantified impact, and keyword alignment.</p>
            </div>
          </div>
          {analysis.missingKeywords?.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <KeyRound size={12} /> Missing Keywords
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw, i) => (
                  <span key={i} className={`glass-badge border border-dashed border-slate-300/60 dark:border-slate-600/60 text-slate-500 dark:text-slate-400 stagger-${Math.min(i + 1, 8)} glow-hover`}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-slate-400 italic animate-wiggle">
            Detailed suggestions are highlighted inline next to each resume section below.
          </p>
        </div>
      )}

      <div className="mt-6 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
        <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
          <Sparkles size={12} /> Advanced Analysis Suite
        </h3>
        <div className="space-y-1">
          <CollapsibleSection icon={<Target size={14} className="text-violet-500" />} title="ATS &amp; Job Description Match" defaultOpen={false}>
            <ATSMatchPanel />
          </CollapsibleSection>
          <CollapsibleSection icon={<BarChart3 size={14} className="text-amber-500" />} title="Skill Gap Analysis" defaultOpen={false}>
            <SkillGapPanel />
          </CollapsibleSection>
          <CollapsibleSection icon={<Hash size={14} className="text-cyan-500" />} title="Keyword Density &amp; Context" defaultOpen={false}>
            <KeywordDensityPanel />
          </CollapsibleSection>
          <CollapsibleSection icon={<FileText size={14} className="text-pink-500" />} title="Context Quality &amp; Impact" defaultOpen={false}>
            <ContextQualityPanel />
          </CollapsibleSection>
          <CollapsibleSection icon={<Cpu size={14} className="text-indigo-500" />} title="Tech Stack Recommendations" defaultOpen={false}>
            <TechStackPanel />
          </CollapsibleSection>
          <CollapsibleSection icon={<MessageSquare size={14} className="text-emerald-500" />} title="Interview Questions" defaultOpen={false}>
            <InterviewQuestionsPanel />
          </CollapsibleSection>
          <CollapsibleSection icon={<History size={14} className="text-slate-500" />} title="History &amp; Analytics Dashboard" defaultOpen={false}>
            <HistoryAnalyticsPanel />
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
};

export default AIFeedbackPanel;
