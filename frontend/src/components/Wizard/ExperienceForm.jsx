import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import SectionFeedback from "../Common/SectionFeedback";
import BulletFeedback from "../Common/BulletFeedback";

const emptyExperience = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  employmentType: "Full-time",
  responsibilities: [""],
};

const emptyProject = {
  title: "",
  description: "",
  technologies: [],
  link: "",
  startDate: "",
  endDate: "",
};

const ExperienceForm = () => {
  const { resume, addItem, updateItem, removeItem } = useResumeContext();

  const handleChange = (index, field, value) => {
    updateItem("experience", index, { ...resume.experience[index], [field]: value });
  };

  const handleResponsibilityChange = (expIndex, respIndex, value) => {
    const exp = resume.experience[expIndex];
    const responsibilities = [...exp.responsibilities];
    responsibilities[respIndex] = value;
    updateItem("experience", expIndex, { ...exp, responsibilities });
  };

  const addResponsibility = (expIndex) => {
    const exp = resume.experience[expIndex];
    updateItem("experience", expIndex, {
      ...exp,
      responsibilities: [...exp.responsibilities, ""],
    });
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProject = { ...resume.projects[index] };
    if (field === "technologies") {
      updatedProject[field] = value.split(",").map((t) => t.trim()).filter(Boolean);
    } else {
      updatedProject[field] = value;
    }
    updateItem("projects", index, updatedProject);
  };

  return (
    <div className="space-y-6">
      {/* Experience Card */}
      <div className="glass-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Work Experience
          </h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => addItem("experience", emptyExperience)}
          >
            <Plus size={16} /> Add Role
          </button>
        </div>

        {resume.experience.length === 0 && (
          <p className="text-sm text-slate-400">No experience added yet. Click "Add Role" to start.</p>
        )}

        <div className="space-y-6">
          {resume.experience.map((exp, index) => (
            <div key={index} className="rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Role #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem("experience", index)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="input-field"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Role / Title"
                  value={exp.role}
                  onChange={(e) => handleChange(index, "role", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Location"
                  value={exp.location}
                  onChange={(e) => handleChange(index, "location", e.target.value)}
                />
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col w-1/2">
                    <label className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase">Start Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={exp.startDate}
                      onChange={(e) => handleChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase">End Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={exp.endDate}
                      onChange={(e) => handleChange(index, "endDate", e.target.value)}
                      disabled={exp.isCurrent}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input
                    id={`isCurrent-${index}`}
                    type="checkbox"
                    checked={exp.isCurrent || false}
                    onChange={(e) => handleChange(index, "isCurrent", e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-accent-600 focus:ring-accent-500/30"
                  />
                  <label htmlFor={`isCurrent-${index}`} className="text-xs font-medium text-slate-500 dark:text-slate-400 select-none cursor-pointer">
                    I currently work here
                  </label>
                </div>
                <div>
                  <select
                    className="input-field"
                    value={exp.employmentType || "Full-time"}
                    onChange={(e) => handleChange(index, "employmentType", e.target.value)}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="label-text">Responsibilities / Achievements</label>
                {exp.responsibilities.map((resp, ri) => (
                  <div key={ri} className="mb-2">
                    <input
                      className="input-field"
                      placeholder="e.g. Reduced API latency by 35% by redesigning caching layer"
                      value={resp}
                      onChange={(e) => handleResponsibilityChange(index, ri, e.target.value)}
                    />
                    <BulletFeedback text={resp} />
                  </div>
                ))}
                <button
                  type="button"
                  className="text-xs font-medium text-accent-600 hover:text-accent-500 transition-colors hover:underline"
                  onClick={() => addResponsibility(index)}
                >
                  + Add bullet point
                </button>
              </div>
            </div>
          ))}
        </div>

        <SectionFeedback section="experience" />
      </div>

      {/* Projects Card */}
      <div className="glass-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Projects
          </h2>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => addItem("projects", emptyProject)}
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        {(!resume.projects || resume.projects.length === 0) && (
          <p className="text-sm text-slate-400">No projects added yet. Click "Add Project" to start.</p>
        )}

        <div className="space-y-6">
          {(resume.projects || []).map((proj, index) => (
            <div key={index} className="rounded-xl border border-slate-200/60 bg-white/40 p-4 dark:border-slate-700/60 dark:bg-slate-800/30 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Project #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeItem("projects", index)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  className="input-field"
                  placeholder="Project Title *"
                  value={proj.title || ""}
                  onChange={(e) => handleProjectChange(index, "title", e.target.value)}
                  required
                />
                <input
                  className="input-field"
                  placeholder="Technologies (comma-separated, e.g. React, Node, AWS)"
                  value={proj.technologies ? proj.technologies.join(", ") : ""}
                  onChange={(e) => handleProjectChange(index, "technologies", e.target.value)}
                />
                <input
                  className="input-field"
                  placeholder="Project Link (e.g. GitHub, Live URL)"
                  value={proj.link || ""}
                  onChange={(e) => handleProjectChange(index, "link", e.target.value)}
                />
                <div className="flex gap-2 w-full">
                  <div className="flex flex-col w-1/2">
                    <label className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase">Start Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={proj.startDate || ""}
                      onChange={(e) => handleProjectChange(index, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    <label className="text-[10px] font-semibold text-slate-400 mb-0.5 uppercase">End Date</label>
                    <input
                      type="date"
                      className="input-field"
                      value={proj.endDate || ""}
                      onChange={(e) => handleProjectChange(index, "endDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <textarea
                  className="input-field h-20 resize-none"
                  placeholder="Brief description of the project, features built, and impact..."
                  value={proj.description || ""}
                  onChange={(e) => handleProjectChange(index, "description", e.target.value)}
                  maxLength={1000}
                />
              </div>
            </div>
          ))}
        </div>

        <SectionFeedback section="projects" />
      </div>
    </div>
  );
};

export default ExperienceForm;

