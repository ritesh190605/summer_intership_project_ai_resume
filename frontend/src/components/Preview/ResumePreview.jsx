import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Award, Medal, Languages } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";

const ResumePreview = () => {
  const { resume, uploadedResume } = useResumeContext();
  const activeResume = uploadedResume || resume;
  const { personalInfo, education, experience, skills, projects, certifications, languages } = activeResume;

  return (
    <div className="print-area mx-auto max-w-2xl rounded-xl bg-white p-8 text-slate-800 shadow-xl ring-1 ring-black/5 dark:bg-white dark:text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {personalInfo.fullName || "Your Name"}
        </h1>
        {personalInfo.headline && (
          <p className="mt-0.5 text-sm font-medium text-accent-600">{personalInfo.headline}</p>
        )}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {personalInfo.email && (
            <span className="flex items-center gap-1"><Mail size={12} /> {personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1"><Phone size={12} /> {personalInfo.phone}</span>
          )}
          {personalInfo.location && (
            <span className="flex items-center gap-1"><MapPin size={12} /> {personalInfo.location}</span>
          )}
          {personalInfo.pronouns && (
            <span className="flex items-center gap-1 text-slate-400 italic">{personalInfo.pronouns}</span>
          )}
          {personalInfo.nationality && (
            <span className="flex items-center gap-1"><Medal size={12} /> {personalInfo.nationality}</span>
          )}
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1"><Linkedin size={12} /> {personalInfo.linkedin}</span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1"><Github size={12} /> {personalInfo.github}</span>
          )}
          {personalInfo.portfolio && (
            <span className="flex items-center gap-1"><Globe size={12} /> {personalInfo.portfolio}</span>
          )}
        </div>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <section className="mt-4">
          <p className="text-sm leading-relaxed text-slate-600">{personalInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">
                    {exp.role || "Role"} · {exp.company || "Company"}
                    {exp.employmentType && exp.employmentType !== "Full-time" && (
                      <span className="ml-1.5 text-[10px] font-normal text-slate-400">({exp.employmentType})</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">
                    {exp.startDate} — {exp.isCurrent ? "Present" : exp.endDate}
                  </p>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-slate-600">
                  {exp.responsibilities?.filter(Boolean).map((resp, ri) => (
                    <li key={ri}>{resp}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Education</h2>
          <div className="space-y-2">
            {education.map((edu, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-semibold">
                    {edu.degree || "Degree"}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""} — {edu.institution}
                  </p>
                  <p className="text-xs text-slate-400">
                    {edu.startDate} — {edu.isCurrent ? "Present" : edu.endDate}
                  </p>
                </div>
                {edu.grade && <p className="text-xs text-slate-500 mt-0.5">GPA: {edu.grade}</p>}
                {edu.description && <p className="text-xs text-slate-500 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((s, i) => (
              <span key={i} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                {s.name}
                {s.proficiency && s.proficiency !== "Intermediate" && (
                  <span className="text-[10px] text-slate-400">({s.proficiency})</span>
                )}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Award size={12} /> Certifications
          </h2>
          <div className="space-y-2">
            {certifications.map((cert, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium">
                    {cert.title}
                    {cert.issuer ? <span className="font-normal text-slate-500"> — {cert.issuer}</span> : ""}
                  </p>
                  {cert.date && <p className="text-xs text-slate-400">{cert.date}</p>}
                </div>
                {cert.description && <p className="text-xs text-slate-500 mt-0.5">{cert.description}</p>}
              </div>
            ))};
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
            <Languages size={12} /> Languages
          </h2>
          <p className="text-sm text-slate-600">
            {languages.map((l, i) => (
              <span key={i}>
                {l.language}{l.proficiency ? ` (${l.proficiency})` : ""}
                {i < languages.length - 1 ? " · " : ""}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="mt-5">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500">Projects</h2>
          <div className="space-y-3">
            {projects.map((proj, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold">{proj.title || "Project Title"}</p>
                    {proj.link && (
                      <a href={proj.link.startsWith("http") ? proj.link : `https://${proj.link}`} target="_blank" rel="noreferrer" className="text-xs text-accent-600 hover:underline">Link</a>
                    )}
                  </div>
                  {(proj.startDate || proj.endDate) && (
                    <p className="text-xs text-slate-400">{proj.startDate} {proj.endDate ? `— ${proj.endDate}` : ""}</p>
                  )}
                </div>
                {proj.description && <p className="text-sm text-slate-600 mt-0.5">{proj.description}</p>}
                {proj.technologies && proj.technologies.length > 0 && (
                  <p className="text-xs text-slate-400 mt-1 font-medium">Technologies: {proj.technologies.join(", ")}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {!personalInfo.fullName && (
        <p className="mt-6 text-center text-xs text-slate-300">Start filling out the form to see your resume come to life here.</p>
      )}
    </div>
  );
};

export default ResumePreview;

