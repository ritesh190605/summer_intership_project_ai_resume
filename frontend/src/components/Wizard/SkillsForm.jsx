import React, { useState } from "react";
import { X, Settings2, TrendingUp } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import SectionFeedback from "../Common/SectionFeedback";

const CATEGORIES = ["Technical", "Soft", "Tool", "Language", "Other"];
const PROFICIENCIES = ["Beginner", "Intermediate", "Advanced", "Expert"];

const SkillsForm = () => {
  const { resume, advancedAnalysis, addItem, removeItem, updateItem } = useResumeContext();
  const [draft, setDraft] = useState("");
  const [category, setCategory] = useState("Technical");
  const [proficiency, setProficiency] = useState("Intermediate");

  // Compute matched vs missing skills based on advancedAnalysis.skillGaps
  const skillGaps = advancedAnalysis?.skillGaps || [];
  const userSkillNames = new Set(resume.skills.map((s) => s.name.toLowerCase().trim()));
  const matchedSkills = skillGaps.filter(
    (g) => userSkillNames.has(g.skill.toLowerCase().trim()) && g.currentStatus !== "Missing"
  );
  const missingSkills = skillGaps.filter(
    (g) => g.currentStatus === "Missing" && !userSkillNames.has(g.skill.toLowerCase().trim())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    const name = draft.trim();
    if (!name) return;
    addItem("skills", { name, category, proficiency });
    setDraft("");
    setCategory("Technical");
    setProficiency("Intermediate");
  };

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-blue-600 shadow-lg shadow-accent-500/20">
          <TrendingUp size={12} className="text-white" />
        </div>
        Skills
      </h2>

      {matchedSkills.length + missingSkills.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Matched Skills ({matchedSkills.length})
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500"></span>
            Missing Skills ({missingSkills.length})
          </span>
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-4 flex flex-wrap gap-2">
        <div className="flex flex-1 min-w-[200px] gap-2 flex-wrap sm:flex-nowrap">
          <input
            className="input-field flex-1"
            placeholder="e.g. React, Node.js, System Design"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <select
            className="input-field w-auto min-w-[110px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            className="input-field w-auto min-w-[120px]"
            value={proficiency}
            onChange={(e) => setProficiency(e.target.value)}
          >
            {PROFICIENCIES.map((prof) => (
              <option key={prof} value={prof}>{prof}</option>
            ))}
          </select>
          <button type="submit" className="btn-primary shrink-0">
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {resume.skills.length === 0 && (
          <p className="text-sm text-slate-400">Add skills relevant to your target role.</p>
        )}
        {resume.skills.map((skill, index) => (
          <div
            key={index}
            className="glass-strong flex items-center justify-between rounded-xl px-4 py-2.5"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {skill.name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-accent-50/60 px-2 py-0.5 text-[10px] font-semibold text-accent-600 dark:bg-accent-900/30 dark:text-accent-400">
                <Settings2 size={10} />
                {skill.category || "Technical"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <TrendingUp size={10} />
                {skill.proficiency || "Intermediate"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => removeItem("skills", index)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <SectionFeedback section="skills" />
    </div>
  );
};

export default SkillsForm;

