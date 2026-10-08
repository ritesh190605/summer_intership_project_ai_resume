import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import SectionFeedback from "../Common/SectionFeedback";

const emptyEducation = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  grade: "",
};

const EducationForm = () => {
  const { resume, addItem, updateItem, removeItem } = useResumeContext();

  const handleChange = (index, field, value) => {
    updateItem("education", index, { ...resume.education[index], [field]: value });
  };

  return (
    <div className="card-3d-glow"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rx = ((y - centerY) / centerY) * -2;
        const ry = ((x - centerX) / centerX) * 2;
        e.currentTarget.style.setProperty('--rx', `${rx}deg`);
        e.currentTarget.style.setProperty('--ry', `${ry}deg`);
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.setProperty('--rx', '0deg');
        e.currentTarget.style.setProperty('--ry', '0deg');
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Education</h2>
        <button
          type="button"
          className="btn-secondary glow-hover"
          onClick={() => addItem("education", emptyEducation)}
        >
          <Plus size={16} /> Add Education
        </button>
      </div>

      {resume.education.length === 0 && (
        <p className="text-sm text-slate-400">No education added yet.</p>
      )}

      <div className="space-y-6">
        {resume.education.map((edu, index) => (
          <div key={index} className={`sub-card-3d stagger-${Math.min(index + 1, 8)}`}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">Education #{index + 1}</span>
              <button
                type="button"
                onClick={() => removeItem("education", index)}
                className="text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="input-field"
                  placeholder="Institution *"
                  value={edu.institution}
                  onChange={(e) => handleChange(index, "institution", e.target.value)}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Degree *"
                  value={edu.degree}
                  onChange={(e) => handleChange(index, "degree", e.target.value)}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Field of Study"
                  value={edu.fieldOfStudy}
                  onChange={(e) => handleChange(index, "fieldOfStudy", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Grade / GPA"
                  value={edu.grade}
                  onChange={(e) => {
                    let val = e.target.value.replace(/[^0-9.]/g, "");
                    const parts = val.split(".");
                    if (parts.length > 2) {
                      val = `${parts[0]}.${parts.slice(1).join("")}`;
                    }
                    handleChange(index, "grade", val);
                  }}
                />
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase">Start Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={edu.startDate}
                    onChange={(e) => handleChange(index, "startDate", e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase">End Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={edu.endDate}
                    onChange={(e) => handleChange(index, "endDate", e.target.value)}
                    disabled={edu.isCurrent}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id={`edu-current-${index}`}
                  type="checkbox"
                  checked={edu.isCurrent || false}
                  onChange={(e) => handleChange(index, "isCurrent", e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500/30"
                />
                <label htmlFor={`edu-current-${index}`} className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                  I currently study here
                </label>
              </div>
              <div>
                <label className="label-text">Description (optional)</label>
                <textarea
                  className="input-field resize-none h-20"
                  placeholder="Honors, relevant coursework, extracurricular activities..."
                  value={edu.description || ""}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  maxLength={1000}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionFeedback section="education" />
    </div>
  );
};

export default EducationForm;

