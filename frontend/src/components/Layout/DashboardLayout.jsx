import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Download, AlertTriangle, Sparkles, Upload, Edit3, BookOpen, ArrowRight, ArrowLeft, User, Shield } from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import { saveResume } from "../../api/resumeApi";
import WizardStepper from "../Wizard/WizardStepper";
import PersonalInfoForm from "../Wizard/PersonalInfoForm";
import ExperienceForm from "../Wizard/ExperienceForm";
import EducationForm from "../Wizard/EducationForm";
import SkillsForm from "../Wizard/SkillsForm";
import CertificationsForm from "../Wizard/CertificationsForm";
import LanguagesForm from "../Wizard/LanguagesForm";
import AIFeedbackPanel from "../Feedback/AIFeedbackPanel";
import ResumeUploadSection from "../Feedback/ResumeUploadSection";
import ResumePreview from "../Preview/ResumePreview";
import LoginModal from "../Common/LoginModal";

const SC = [PersonalInfoForm, ExperienceForm, EducationForm, SkillsForm, CertificationsForm, LanguagesForm];
const SL = ["Personal Info", "Experience", "Education", "Skills", "Certifications", "Languages"];

const DashboardLayout = () => {
  const { activeStep, isConfirmed, setIsConfirmed, isSubmitted, setIsSubmitted, resume, uploadedResume, pg, setPg, goToNextStep, goToPreviousStep, validateStep } = useResumeContext();
  const C = SC[activeStep];
  const [isSub, setSub] = useState(false);
  const [sErr, setSErr] = useState(null);
  const [sDir, setSDir] = useState("right");
  const [isT, setT] = useState(false);
  const [vErr, setVErr] = useState(null);
  const [isPT, setPT] = useState(false);
  const [ptDir, setPTDir] = useState("forward");
  const ref = useRef(null);

  // Auth States
  const [user, setUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("resume_builder_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("resume_builder_user");
    } catch (e) {
      console.error("Failed to clear user session", e);
    }
  };

  useEffect(() => { setT(true); const t = setTimeout(() => setT(false), 400); return () => clearTimeout(t); }, [activeStep]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pg]);

  const fwd = useCallback(() => { if (isPT) return; setPT(true); setPTDir("forward"); setTimeout(() => { setPg(2); setPT(false); }, 500); }, [isPT]);
  const bck = useCallback(() => { if (isPT) return; setPT(true); setPTDir("back"); setTimeout(() => { setPg(1); setPT(false); }, 500); }, [isPT]);

  const nxt = () => {
    setVErr(null);
    if (!validateStep(activeStep)) {
      setVErr("Please fill in the required fields for " + SL[activeStep] + " before proceeding.");
      if (ref.current) { ref.current.classList.remove("animate-slide-right"); void ref.current.offsetWidth; ref.current.classList.add("animate-slide-left"); }
      return;
    }
    setSDir("right");
    goToNextStep();
  };

  const prv = () => { setVErr(null); setSDir("left"); goToPreviousStep(); };

  const sub = async () => {
    setSub(true); setSErr(null);
    const activeResume = uploadedResume || resume;
    try { await saveResume(activeResume); setIsSubmitted(true); alert("Resume submitted successfully!"); }
    catch (err) { console.error(err); setSErr(err.response?.data?.message || "Failed to submit. Please check if the backend server is running."); }
    finally { setSub(false); }
  };

  const dl = () => { window.print(); };
  const sa = isT ? (sDir === "right" ? "animate-slide-right" : "animate-slide-left") : "";
  const c1 = isPT ? (ptDir === "forward" ? "page-turn-forward" : "page-turn-back") : "";
  const c2 = isPT ? (ptDir === "back" ? "page-turn-forward" : "") : "";

  const [showHero, setShowHero] = useState(true);

  if (showHero) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col relative overflow-x-hidden overflow-y-auto">
        {/* Top Header Bar for Landing Page */}
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex justify-between items-center relative z-25">
          <div className="flex items-center gap-2">
            <BookOpen className="text-accent-600" size={24} />
            <span className="text-lg font-extrabold bg-gradient-to-r from-accent-600 to-pink-500 bg-clip-text text-transparent">AI Resume Builder</span>
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-3.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm animate-scale-in">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-accent-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold uppercase">
                    {user.name ? user.name[0] : "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[150px] truncate">{user.identifier}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all duration-200 hover:bg-white hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 dark:border-slate-700/60 dark:bg-slate-800/65 dark:text-slate-200 hover:scale-[1.03]"
              >
                <User size={14} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl pointer-events-none animate-breathe" style={{ animationDelay: "1s" }} />

        {/* Hero Section Container */}
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 mx-auto max-w-3xl px-6 text-center pt-8 pb-16 animate-fade-in">
          {/* Logo */}
          <div className="relative mb-8 inline-block">
            <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-accent-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-breathe" />
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-accent-500 via-purple-500 to-pink-500 shadow-2xl shadow-accent-500/30 animate-float-3d" style={{ transformStyle: "preserve-3d" }}>
              <BookOpen className="text-white" size={52} />
              <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-400 shadow-lg shadow-amber-500/30 animate-pulse-slow">
                <Sparkles size={20} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="mb-4 text-5xl font-extrabold tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-accent-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI Resume Builder</span>
            <br />
            <span className="text-3xl font-semibold text-slate-400 sm:text-4xl">&amp; Analyzer</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-500 sm:text-lg">
            Create stunning, ATS-optimized resumes in minutes. Our AI-powered platform helps you craft the perfect resume with intelligent suggestions, real-time preview, and detailed analysis to land your dream job.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 backdrop-blur-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-100 text-accent-600">
                <Edit3 size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">Smart Builder</h3>
              <p className="mt-1 text-xs text-slate-400">Step-by-step wizard with guided forms</p>
            </div>
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 backdrop-blur-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Sparkles size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">AI Analysis</h3>
              <p className="mt-1 text-xs text-slate-400">ATS match, keyword density &amp; skill gap insights</p>
            </div>
            <div className="rounded-xl border border-slate-200/50 bg-white/50 p-4 backdrop-blur-sm">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <BookOpen size={20} />
              </div>
              <h3 className="text-sm font-semibold text-slate-700">Live Preview</h3>
              <p className="mt-1 text-xs text-slate-400">Real-time preview with interactive 3D effects</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowHero(false)}
            className="group relative inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent-600 via-purple-500 to-pink-500 px-12 py-4.5 text-lg font-bold text-white shadow-2xl shadow-accent-500/30 transition-all duration-300 hover:scale-105 hover:shadow-accent-500/40 active:scale-95"
          >
            <User size={22} className="transition-transform duration-300" />
            <span>Get Started</span>
            <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-accent-500/20 via-purple-500/20 to-pink-500/20 blur-lg transition-all duration-300 group-hover:blur-xl" />
          </button>

          <div className="mt-16 text-slate-400 dark:text-slate-500 text-xs font-semibold flex flex-col items-center gap-1.5 animate-pulse">
            <span>Scroll down to learn more</span>
            <ChevronRight size={16} className="rotate-90 text-slate-350 dark:text-slate-500" />
          </div>
        </div>

        <section className="w-full max-w-5xl mx-auto px-6 py-20 relative z-10 border-t border-slate-200/30 dark:border-slate-800/30">
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold tracking-widest text-accent-500 uppercase bg-accent-100/60 dark:bg-accent-950/30 px-3 py-1 rounded-full">About the Website</span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
              Elevating Your Career with AI-Powered Intelligence
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-base text-slate-500 dark:text-slate-400">
              Our platform combines cutting-edge LLMs and real-time visualization to turn resume building from a mundane task into an interactive, career-launching strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="rounded-2xl border border-slate-200/50 bg-white/40 p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800/40 dark:bg-slate-900/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent-100 text-accent-600 dark:bg-accent-950 dark:text-accent-400">
                <Edit3 size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Step-by-Step Wizard</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Fill out your professional profile section-by-section. Instantly import pre-existing details by uploading your current resume.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/50 bg-white/40 p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800/40 dark:bg-slate-900/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                <Sparkles size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Comprehensive ATS Analyzer</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Input your target job description and get real-time scores matching keyword density, alignment feedback, and semantic recommendations.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/50 bg-white/40 p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800/40 dark:bg-slate-900/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-400">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Interactive 3D Diary Interface</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Experience your resume come to life as a realistic paper book. Turn pages, adjust fields, and watch rendering updates occur instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200/50 bg-white/40 p-6 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-800/40 dark:bg-slate-900/40">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <Shield size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Secure Client Authentication</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Secure your credentials using multiple entry gates: Google, Apple ID, custom Email and password, or rapid SMS-style OTP.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200/50 bg-white/20 p-8 backdrop-blur-sm dark:border-slate-800/20 dark:bg-slate-900/20">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-8 text-center font-semibold">How the Platform Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              <div className="hidden md:block absolute top-6 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-accent-200 via-purple-200 to-pink-200 dark:from-accent-950 dark:via-purple-950 dark:to-pink-950 z-0" />
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-600 text-white font-bold text-sm shadow-md shadow-accent-600/20">1</div>
                <h4 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">Authenticate</h4>
                <p className="mt-1.5 text-xs text-slate-400">Login securely to save and track resume history</p>
              </div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-bold text-sm shadow-md shadow-purple-600/20">2</div>
                <h4 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">Construct &amp; Import</h4>
                <p className="mt-1.5 text-xs text-slate-400">Input your credentials or upload an existing template</p>
              </div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-600 text-white font-bold text-sm shadow-md shadow-pink-600/20">3</div>
                <h4 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">AI Optimize</h4>
                <p className="mt-1.5 text-xs text-slate-400">Receive precise ATS and skill assessments against target positions</p>
              </div>
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/20">4</div>
                <h4 className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-200">Deploy &amp; Save</h4>
                <p className="mt-1.5 text-xs text-slate-400">Export clean, professionally styled and parsed layouts</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="w-full text-center py-8 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200/20 dark:border-slate-800/20 mt-auto">
          <p>© {new Date().getFullYear()} AI Resume Builder &amp; Analyzer. All rights reserved.</p>
        </footer>

        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh perspective-1000 preserve-3d py-6">
      <header className="mx-auto mb-12 max-w-5xl px-4 text-center animate-fade-in relative z-20">
        <div className="relative inline-block">
          <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-accent-500/20 via-purple-500/20 to-pink-500/20 blur-2xl animate-breathe" />
          <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 via-purple-500 to-pink-500 shadow-2xl shadow-accent-500/30 animate-float-3d" style={{ transformStyle: "preserve-3d" }}>
            <BookOpen className="text-white" size={36} />
            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 shadow-lg shadow-amber-500/30 animate-pulse-slow">
              <Sparkles size={16} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-r from-accent-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">AI Resume Builder</span>
            <span className="ml-2 text-2xl font-semibold text-slate-400">&amp; Analyzer</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-500">Create, analyze, and optimize your resume with AI-powered insights.</p>
          <div className="header-underline" />
          <div className="mt-5 flex items-center justify-center gap-2">
            <span className={"page-dot" + (pg === 1 ? " active" : "")} />
            <span className={"page-dot" + (pg === 2 ? " active" : "")} />
          </div>
        </div>
      </header>

      <div className="relative mx-auto" style={{ minHeight: "100vh" }}>

        {/* Front Page - Resume Builder (on top when pg=1) */}
        <div className={c2} style={{ position: "absolute", left: "3%", right: "3%", top: "3%", bottom: "18%", marginTop: "0", transition: "opacity 0.4s ease, filter 0.4s ease", zIndex: pg === 1 ? 20 : 5, opacity: pg === 1 ? 1 : 0, filter: pg === 2 ? "blur(6px)" : "blur(0px)", pointerEvents: pg === 1 ? "auto" : "none" }}>
          <div className="diary-paper p-8 lg:p-10 h-full">
            <div className="diary-spiral">{[...Array(14)].map((_, i) => <div key={i} className="diary-spiral-ring" />)}</div>
            <div className="diary-curl" />
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
              {/* Upload Resume Section */}
              <div className="lg:col-span-1 lg:border-r lg:border-dashed lg:border-amber-200/40 lg:pr-10">
                <div className="diary-tab-upload">
                  <div className="diary-section-tab"><Upload size={16} /> Upload &amp; Import</div>
                  <div className="diary-content"><ResumeUploadSection /></div>
                </div>
              </div>
              {/* Details Field Section */}
              <div className="lg:col-span-1 lg:px-16">
                <div className="diary-tab-details">
                  <div className="diary-section-tab"><Edit3 size={16} /> Resume Details</div>
                  <div className="diary-content">
                    <WizardStepper />
                    <div ref={ref} className={sa} key={activeStep}><C /></div>
                    {vErr ? <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-red-200/50 bg-red-50/80 p-3.5 text-xs font-medium text-red-600 animate-slide-left"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{vErr}</div> : null}
                    {activeStep === SC.length - 1 && (
                      <div className="mt-6 mb-4 flex items-start gap-2.5 rounded-xl border border-slate-200/60 bg-white/60 p-4 animate-scale-in">
                        <input id="c" type="checkbox" checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded-lg border-slate-300 text-accent-600 shadow-sm focus:ring-accent-500/30" />
                        <label htmlFor="c" className="cursor-pointer text-xs font-medium leading-tight text-slate-500 select-none">I confirm details are correct.</label>
                      </div>
                    )}
                    {sErr ? <p className="mt-2 text-xs font-medium text-red-600">{sErr}</p> : null}
                    <div className="mt-4 flex justify-between">
                      <button type="button" className="btn-secondary group" disabled={activeStep === 0} onClick={prv}><ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back</button>
                      {activeStep === SC.length - 1 ? (
                        <button type="button" className="btn-primary bg-emerald-600/90 btn-glow" disabled={!isConfirmed || isSub} onClick={sub}>{isSub ? "Submitting..." : "Submit Resume"}</button>
                      ) : (
                        <button type="button" className="btn-primary group" onClick={nxt}>Next <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" /></button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Live Preview Section */}
              <div className="lg:col-span-1 lg:border-l lg:border-dashed lg:border-amber-200/40 lg:pl-10">
                <div className="diary-content">
                  <div className="relative -ml-2 mb-4 inline-flex items-center gap-1.5 rounded-br-xl rounded-tr-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2 text-xs font-bold tracking-wide text-white shadow-lg shadow-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />Live Preview
                  </div>
                  <div className="diary-preview-card rounded-xl border border-slate-200/60 bg-white/90 p-4 shadow-lg"
                    onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--rx", (((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -3) + "deg"); e.currentTarget.style.setProperty("--ry", (((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 3) + "deg"); }}
                    onMouseLeave={(e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); }}
                    style={{ transformStyle: "preserve-3d", transform: "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))" }}>
                    <ResumePreview />
                    {isConfirmed && isSubmitted && (
                      <div className="mt-5 flex justify-end animate-scale-in">
                        <button type="button" onClick={dl} className="btn-primary bg-indigo-600/90 flex items-center gap-1.5 group"><Download size={16} /> Download</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <button type="button" onClick={fwd} disabled={isPT} className="page-turn-btn"><ArrowRight size={22} /></button>
          </div>
        </div>

        {/* Back Page - AI Intelligence (underneath when pg=1, on top when pg=2) */}
        <div className={c1} style={{ position: "absolute", left: "3%", right: "3%", top: "3%", bottom: "18%", transition: "opacity 0.4s ease", zIndex: pg === 2 ? 10 : 1, opacity: pg === 2 ? 1 : 0.4, filter: pg === 1 ? "blur(6px)" : "blur(0px)", pointerEvents: pg === 2 ? "auto" : "none" }}>
          <div className="diary-paper p-8 lg:p-10 h-full">
            <div className="diary-spiral">{[...Array(10)].map((_, i) => <div key={i} className="diary-spiral-ring" />)}</div>
            <div className="diary-curl" />
            <div className="diary-tab-ai">
              <div className="diary-section-tab"><Sparkles size={16} /> AI Intelligence &amp; Analysis</div>
              <div className="diary-content"><AIFeedbackPanel /></div>
            </div>
            <button type="button" onClick={bck} disabled={isPT} className={"page-turn-btn-back" + (pg === 2 ? " visible" : "")}><ArrowLeft size={22} /></button>
          </div>
        </div>

      </div>

      <footer className="mt-12 text-center text-[10px] text-slate-400"><p>AI Resume Builder &amp; Analyzer</p></footer>
    </div>
  );
};

export default DashboardLayout;
