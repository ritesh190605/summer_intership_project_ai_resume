import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Upload, FileText, CheckCircle, Trash2, Loader2,
  FileCode, AlertTriangle, Sparkles, ScanLine, Brain, Save,
} from "lucide-react";
import { useResumeContext } from "../../context/ResumeContext";
import { parseUploadedResume, analyzeResume, saveResume } from "../../api/resumeApi";

// ─── Step indicator sub-component ───────────────────────────────────────────
const Step = ({ icon: Icon, label, status }) => {
  const base = "flex items-center gap-2 text-xs font-medium transition-all duration-300";
  const styles = {
    pending:  "text-slate-400",
    active:   "text-accent-600 dark:text-accent-400",
    done:     "text-emerald-600 dark:text-emerald-400",
    error:    "text-red-600 dark:text-red-400",
  };
  return (
    <div className={`${base} ${styles[status] || styles.pending}`}>
      {status === "active" ? (
        <Loader2 size={13} className="animate-spin shrink-0" />
      ) : status === "done" ? (
        <CheckCircle size={13} className="shrink-0" />
      ) : status === "error" ? (
        <AlertTriangle size={13} className="shrink-0" />
      ) : (
        <Icon size={13} className="shrink-0 opacity-40" />
      )}
      {label}
    </div>
  );
};

// ─── Main component ──────────────────────────────────────────────────────────
const ResumeUploadSection = () => {
  const {
    setUploadedResume,
    setPg,
    setAnalysis,
    setIsAnalyzing,
    setAnalysisError,
    setIsConfirmed,
    setIsSubmitted,
    saveToHistory,
  } = useResumeContext();

  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [allDone, setAllDone] = useState(false);

  // Per-step status: "pending" | "active" | "done" | "error"
  const [stepStatus, setStepStatus] = useState({
    parse:   "pending",
    save:    "pending",
    analyze: "pending",
  });

  const fileInputRef = useRef(null);
  const autoStartedRef = useRef(false); // prevent double-triggering

  // ── Helpers ──────────────────────────────────────────────────────────────
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const setStep = (step, status) =>
    setStepStatus((prev) => ({ ...prev, [step]: status }));

  // ── File validation & selection ──────────────────────────────────────────
  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    const allowedExtensions = [".pdf", ".doc", ".docx", ".txt"];
    const isValid = allowedExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );
    if (!isValid) {
      alert("Invalid format! Please upload a PDF, Word, or TXT file (.pdf, .doc, .docx, .txt).");
      return;
    }
    // Reset all state for a fresh run
    autoStartedRef.current = false;
    setFile(selectedFile);
    setIsUploading(true);
    setUploadSuccess(false);
    setParseError(null);
    setAllDone(false);
    setStepStatus({ parse: "pending", save: "pending", analyze: "pending" });

    // Simulate brief "reading file" step, then kick off auto-scan
    setTimeout(() => {
      setIsUploading(false);
      setUploadSuccess(true);
    }, 500);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
    else if (e.type === "dragleave") setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleRemove = () => {
    setFile(null);
    setUploadSuccess(false);
    setParseError(null);
    setAllDone(false);
    autoStartedRef.current = false;
    setStepStatus({ parse: "pending", save: "pending", analyze: "pending" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Scan + analyze pipeline (stored in ref to stay stable across renders) ──
  const runScanAndAnalyze = useCallback(async (resumeFile) => {
    setParseError(null);

    // ── Step 1: Parse ────────────────────────────────────────────────────
    setStep("parse", "active");
    let parsed;
    try {
      parsed = await parseUploadedResume(resumeFile);
      setUploadedResume(parsed);      // store in context without touching wizard fields
      setStep("parse", "done");
    } catch (err) {
      console.error("[Parse error]", err);
      setStep("parse", "error");
      const msg =
        err.response?.data?.message ||
        "Failed to read the resume. The file may be image-based, corrupted, or unsupported.";
      setParseError(msg);
      return;
    }

    // ── Step 2: Save ─────────────────────────────────────────────────────
    setStep("save", "active");
    try {
      await saveResume(parsed);
      setIsSubmitted(true);
      setIsConfirmed(true);
      setStep("save", "done");
    } catch (saveErr) {
      console.warn("[Save warn]", saveErr);
      // Non-fatal: mark as done anyway so UX continues
      setStep("save", "done");
    }

    // ── Step 3: AI Analysis ──────────────────────────────────────────────
    setStep("analyze", "active");
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const result = await analyzeResume(parsed);
      setAnalysis(result);
      saveToHistory("basic", {
        overallScore: result.overallScore,
        missingKeywords: result.missingKeywords,
        improvements: result.improvements,
      });
      setStep("analyze", "done");
    } catch (analysisErr) {
      console.error("[Analysis error]", analysisErr);
      setStep("analyze", "error");
      const msg =
        analysisErr.response?.data?.message ||
        "Resume saved, but AI analysis failed. You can retry from the AI Feedback panel.";
      setAnalysisError(msg);
    } finally {
      setIsAnalyzing(false);
    }

    // ── Done — navigate to AI Feedback page ──────────────────────────────
    setAllDone(true);
    setTimeout(() => setPg(2), 800);
  }, [setUploadedResume, setPg, setAnalysis, setIsAnalyzing, setAnalysisError, setIsConfirmed, setIsSubmitted, saveToHistory]);

  // ── Auto-scan: trigger as soon as uploadSuccess flips to true ────────────
  useEffect(() => {
    if (!uploadSuccess || !file || autoStartedRef.current) return;
    autoStartedRef.current = true;
    runScanAndAnalyze(file);
  }, [uploadSuccess, file, runScanAndAnalyze]);

  // ── Derived states ───────────────────────────────────────────────────────
  const isBusy =
    stepStatus.parse === "active" ||
    stepStatus.save  === "active" ||
    stepStatus.analyze === "active";

  const hasError = parseError !== null || stepStatus.analyze === "error";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="glass-card">
      {/* Header */}
      <h2 className="mb-1 flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-slate-100">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/20">
          <Upload size={12} className="text-white" />
        </div>
        Upload &amp; Auto-Analyze
      </h2>
      <p className="mb-3 text-xs text-slate-400">
        Drop or select your resume — it will be scanned and analyzed by AI automatically.
      </p>

      {/* ── Drop zone (shown when no file selected) ── */}
      {!file && !isUploading && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
          className={`glass-strong flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive
              ? "border-accent-400 bg-accent-50/40 shadow-glow dark:bg-accent-950/20"
              : "border-white/30 hover:border-accent-300/50 hover:shadow-lg dark:border-white/10 dark:hover:border-accent-500/30"
            }`}
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-100 to-accent-50 dark:from-accent-900/40 dark:to-accent-800/20">
            <Upload size={24} className="text-accent-500" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Drag &amp; drop your resume here, or{" "}
            <span className="text-accent-600 hover:underline">browse</span>
          </p>
          <p className="text-xs text-slate-400 mt-1.5">
            PDF, Word, TXT · Auto-scanned instantly
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleChange}
          />
        </div>
      )}

      {/* ── Initial read spinner ── */}
      {isUploading && (
        <div className="glass-strong flex flex-col items-center justify-center rounded-2xl py-8 text-center">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent-400 to-purple-500 animate-pulse p-0.5 mb-3">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-white/90 dark:bg-slate-900/90">
              <Loader2 size={20} className="animate-spin text-accent-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Reading resume file…</p>
        </div>
      )}

      {/* ── File card + progress steps ── */}
      {file && uploadSuccess && (
        <div className="space-y-3">
          {/* File info row */}
          <div className="glass-strong flex items-center justify-between rounded-xl p-4">
            <div className="flex items-center gap-3">
              {file.name.toLowerCase().endsWith(".pdf") ? (
                <FileText size={24} className="text-red-500 shrink-0" />
              ) : file.name.toLowerCase().endsWith(".txt") ? (
                <FileText size={24} className="text-gray-500 shrink-0" />
              ) : (
                <FileCode size={24} className="text-blue-500 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[190px] sm:max-w-xs">
                  {file.name}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-slate-400">{formatFileSize(file.size)}</span>
                  {allDone && !hasError && (
                    <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                      <CheckCircle size={9} /> Done
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isBusy}
              className="btn-danger p-2 disabled:opacity-40 disabled:cursor-not-allowed"
              title="Remove file"
            >
              <Trash2 size={16} />
            </button>
          </div>

          {/* Progress steps panel */}
          <div className="glass-strong rounded-xl border border-accent-100/40 dark:border-accent-900/30 p-4 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Auto-Scan Progress
            </p>

            <Step
              icon={ScanLine}
              label="Extracting resume data with AI…"
              status={stepStatus.parse}
            />

            {/* Connector line */}
            <div className="ml-[6px] w-px h-3 bg-slate-200/70 dark:bg-slate-700/50" />

            <Step
              icon={Save}
              label="Saving resume to the cloud…"
              status={stepStatus.save}
            />

            <div className="ml-[6px] w-px h-3 bg-slate-200/70 dark:bg-slate-700/50" />

            <Step
              icon={Brain}
              label="Running AI analysis &amp; scoring…"
              status={stepStatus.analyze}
            />
          </div>

          {/* Error message */}
          {parseError && (
            <div className="glass-strong flex items-start gap-2 rounded-xl border border-red-200/50 p-3 text-xs font-medium text-red-600 dark:border-red-900/30 dark:text-red-400">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              {parseError}
            </div>
          )}

          {/* Success banner */}
          {allDone && !hasError && (
            <div className="glass-strong flex items-center gap-2 rounded-xl border border-emerald-200/50 p-3 text-xs font-semibold text-emerald-600 dark:border-emerald-900/30 dark:text-emerald-400 animate-fade-in">
              <Sparkles size={14} className="shrink-0" />
              Analysis complete! Opening AI Feedback panel…
            </div>
          )}

          {/* Retry button (shown only on error after all steps attempted) */}
          {hasError && !isBusy && (
            <button
              type="button"
              onClick={() => {
                autoStartedRef.current = false;
                setStepStatus({ parse: "pending", save: "pending", analyze: "pending" });
                setParseError(null);
                setAllDone(false);
                autoStartedRef.current = true;
                runScanAndAnalyze(file);
              }}
              className="btn-primary w-full justify-center bg-gradient-to-r from-accent-600 to-purple-600 hover:from-accent-700 hover:to-purple-700 shadow-lg shadow-accent-600/20"
            >
              <ScanLine size={15} /> Retry Scan &amp; Analyze
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUploadSection;
