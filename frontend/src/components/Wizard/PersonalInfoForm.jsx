import React from "react";
import { User } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import SectionFeedback from "../Common/SectionFeedback";

const FIELDS = [
  { key: "fullName", label: "Full Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "phone", label: "Phone", type: "text", required: true },
  { key: "location", label: "Location", type: "text" },
  { key: "headline", label: "Headline (e.g. Senior Full-Stack Engineer)", type: "text" },
  { key: "pronouns", label: "Pronouns (e.g. he/him, she/her)", type: "text" },
  { key: "nationality", label: "Nationality / Work Authorization", type: "text" },
  { key: "linkedin", label: "LinkedIn URL", type: "text", required: true },
  { key: "github", label: "GitHub URL", type: "text", required: true },
  { key: "portfolio", label: "Portfolio URL", type: "text" },
];

const PersonalInfoForm = () => {
  const { resume, updatePersonalInfo, updateField } = useResumeContext();
  const { personalInfo } = resume;

  return (
    <div className="glass-card">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-accent-500 to-blue-600 shadow-lg shadow-accent-500/20">
          <User size={12} className="text-white" />
        </div>
        Personal Information
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.key} className={field.key === "headline" ? "sm:col-span-2" : field.key === "summary" ? "sm:col-span-2" : ""}>
            <label className="label-text" htmlFor={field.key}>
              {field.label} {field.required && "*"}
            </label>
            <input
              id={field.key}
              type={field.type}
              className="input-field"
              value={personalInfo[field.key] || ""}
              onChange={(e) => {
                let val = e.target.value;
                if (field.key === "phone") {
                  val = val.replace(/\D/g, "").slice(0, 10);
                }
                updatePersonalInfo(field.key, val);
              }}
              placeholder={field.label}
              maxLength={field.key === "phone" ? 10 : undefined}
              required={field.required}
            />
          </div>
        ))}

        <div>
          <label className="label-text" htmlFor="targetRole">
            Target Role
          </label>
          <input
            id="targetRole"
            type="text"
            className="input-field"
            value={resume.targetRole || ""}
            onChange={(e) => updateField("targetRole", e.target.value)}
            placeholder="e.g. Frontend Developer"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="label-text" htmlFor="summary">
          Professional Summary
        </label>
        <textarea
          id="summary"
          rows={4}
          className="input-field resize-none"
          value={personalInfo.summary || ""}
          onChange={(e) => updatePersonalInfo("summary", e.target.value)}
          placeholder="2-3 sentence pitch highlighting your experience and impact..."
        />
      </div>

      <SectionFeedback section="personalInfo" />
    </div>
  );
};

export default PersonalInfoForm;

