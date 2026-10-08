import React, { useState } from "react";
import { Plus, X, Globe } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import SectionFeedback from "../Common/SectionFeedback";

const PROFICIENCY_LEVELS = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"];

const LanguagesForm = () => {
  const { resume, addItem, removeItem, updateItem } = useResumeContext();
  const [language, setLanguage] = useState("");
  const [proficiency, setProficiency] = useState("Intermediate");

  const handleAdd = (e) => {
    e.preventDefault();
    const lang = language.trim();
    if (!lang) return;

    // Check for duplicates
    if (resume.languages.some((l) => l.language.toLowerCase() === lang.toLowerCase())) {
      return;
    }

    addItem("languages", { language: lang, proficiency });
    setLanguage("");
    setProficiency("Intermediate");
  };

  const handleRemove = (index) => {
    removeItem("languages", index);
  };

  const handleProficiencyChange = (index, newProficiency) => {
    updateItem("languages", index, {
      ...resume.languages[index],
      proficiency: newProficiency,
    });
  };

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-cyan-600 shadow-lg shadow-sky-500/20">
          <Globe size={12} className="text-white" />
        </div>
        Languages
      </h2>

      <form onSubmit={handleAdd} className="mb-4 flex flex-wrap gap-2">
        <input
          className="input-field flex-1 min-w-[140px]"
          placeholder="e.g. English, Spanish, Mandarin"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <select
          className="input-field w-auto min-w-[130px]"
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value)}
        >
          {PROFICIENCY_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">
          <Plus size={16} /> Add
        </button>
      </form>

      <div className="space-y-2">
        {(resume.languages || []).length === 0 && (
          <p className="text-sm text-slate-400">Add languages you speak and your proficiency level.</p>
        )}
        {(resume.languages || []).map((lang, index) => (
          <div
            key={index}
            className="glass-strong flex items-center justify-between rounded-xl px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-sky-500 shrink-0" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {lang.language}
              </span>
              <select
                value={lang.proficiency || "Intermediate"}
                onChange={(e) => handleProficiencyChange(index, e.target.value)}
                className="rounded-lg border border-slate-200/60 bg-white/50 px-2 py-1 text-xs font-medium text-slate-600 dark:border-slate-700/60 dark:bg-slate-800/50 dark:text-slate-300"
              >
                {PROFICIENCY_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      <SectionFeedback section="languages" />
    </div>
  );
};

export default LanguagesForm;

