import React from "react";
import { Plus, Trash2, Award } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import SectionFeedback from "../Common/SectionFeedback";

const emptyCert = {
  title: "",
  issuer: "",
  date: "",
  link: "",
  description: "",
};

const CertificationsForm = () => {
  const { resume, addItem, updateItem, removeItem } = useResumeContext();

  const handleChange = (index, field, value) => {
    updateItem("certifications", index, { ...resume.certifications[index], [field]: value });
  };

  return (
    <div className="glass-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Award size={12} className="text-white" />
          </div>
          Certifications
        </h2>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => addItem("certifications", emptyCert)}
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>

      {(!resume.certifications || resume.certifications.length === 0) && (
        <p className="text-sm text-slate-400">No certifications added yet. Click "Add Certification" to start.</p>
      )}

      <div className="space-y-6">
        {(resume.certifications || []).map((cert, index) => (
          <div key={index} className="rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                <Award size={14} className="text-emerald-500" />
                Certification #{index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeItem("certifications", index)}
                className="btn-danger p-1.5"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                className="input-field"
                placeholder="Certification Title *"
                value={cert.title || ""}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                required
              />
              <input
                className="input-field"
                placeholder="Issuing Organization"
                value={cert.issuer || ""}
                onChange={(e) => handleChange(index, "issuer", e.target.value)}
              />
              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase">Date Obtained</label>
                <input
                  type="date"
                  className="input-field"
                  value={cert.date || ""}
                  onChange={(e) => handleChange(index, "date", e.target.value)}
                />
              </div>
              <input
                className="input-field"
                placeholder="Credential URL (optional)"
                value={cert.link || ""}
                onChange={(e) => handleChange(index, "link", e.target.value)}
              />
            </div>
            <div className="mt-3">
              <textarea
                className="input-field h-20 resize-none"
                placeholder="Brief description (optional)"
                value={cert.description || ""}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                maxLength={500}
              />
            </div>
          </div>
        ))}
      </div>

      <SectionFeedback section="certifications" />
    </div>
  );
};

export default CertificationsForm;

