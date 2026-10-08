import React, { useState, useEffect, useRef } from "react";
import { X, Mail, Phone, Lock, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Shield, Globe } from "lucide-react";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState("email"); // "email" | "phone"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Email form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Phone form state
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [timer, setTimer] = useState(60);
  const timerRef = useRef(null);

  // Auto-focus helper
  const firstInputRef = useRef(null);
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => firstInputRef.current.focus(), 150);
    }
    // Clean up timer on close
    if (!isOpen) {
      resetState();
    }
  }, [isOpen]);

  // Countdown timer for Phone OTP
  useEffect(() => {
    if (otpSent && timer > 0) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [otpSent, timer]);

  const resetState = () => {
    setActiveTab("email");
    setLoading(false);
    setError(null);
    setSuccess(false);
    setEmail("");
    setPassword("");
    setIsRegister(false);
    setPhone("");
    setOtpSent(false);
    setOtpCode("");
    setTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  if (!isOpen) return null;

  // Handles Google login
  const handleGoogleLogin = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          name: "Alex Mercer",
          identifier: "alex.mercer@gmail.com",
          provider: "google",
        });
        onClose();
      }, 1200);
    }, 1500);
  };

  // Handles Apple login
  const handleAppleLogin = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          name: "Sarah Connor",
          identifier: "s.connor@icloud.com",
          provider: "apple",
        });
        onClose();
      }, 1200);
    }, 1500);
  };

  // Handles Email login/register
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        onLoginSuccess({
          name: email.split("@")[0],
          identifier: email,
          provider: "email",
        });
        onClose();
      }, 1200);
    }, 1500);
  };

  // Handles Phone number send OTP
  const handleSendOTP = (e) => {
    e.preventDefault();
    const phoneClean = phone.replace(/\D/g, "");
    if (phoneClean.length < 8) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
      setTimer(60);
    }, 1200);
  };

  // Handles Phone verification
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Simulating correct OTP code is anything, or 123456
      if (otpCode === "123456" || otpCode.length === 6) {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess({
            name: `User ${countryCode} ${phone}`,
            identifier: `${countryCode} ${phone}`,
            provider: "phone",
          });
          onClose();
        }, 1200);
      } else {
        setLoading(false);
        setError("Invalid OTP code. Try '123456' or any 6-digit code.");
      }
    }, 1500);
  };

  // Resend OTP
  const handleResendOTP = () => {
    if (timer > 0) return;
    setLoading(true);
    setError(null);
    setTimeout(() => {
      setLoading(false);
      setTimer(60);
      setError("A new verification code has been sent.");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative ambient background gradients inside modal */}
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-accent-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />

        {/* Success screen */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-10 text-center animate-scale-in">
            <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 size={48} className="animate-pulse" />
              <div className="absolute -inset-2 rounded-full bg-emerald-500/10 blur-sm animate-ping" style={{ animationDuration: "2s" }} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Welcome Back!</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Login successful. Opening the resume builder...</p>
            <div className="mt-6 flex h-1.5 w-32 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div className="h-full bg-gradient-to-r from-accent-500 to-emerald-500 animate-shimmer" style={{ width: "100%", transition: "width 1.2s ease-in-out" }} />
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent-500 via-purple-500 to-pink-500 shadow-md">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Portal Authentication</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide uppercase">AI Resume Builder Secure Login</p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200/50 bg-red-50/80 p-3 text-xs text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400 animate-slide-up">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Social logins */}
            {!otpSent && (
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {/* Google SVG logo */}
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  onClick={handleAppleLogin}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-850 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {/* Apple ID SVG logo */}
                  <svg className="h-4 w-4 fill-current shrink-0 text-slate-800 dark:text-slate-200" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.49-.62.71-1.16 1.85-1.01 2.96 1.09.09 2.21-.57 2.94-1.39" />
                  </svg>
                  <span>Apple ID</span>
                </button>
              </div>
            )}

            {!otpSent && (
              <div className="relative mb-6 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
                <span className="relative bg-white px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-slate-900 dark:text-slate-500">or use credentials</span>
              </div>
            )}

            {/* Form Tabs */}
            {!otpSent && (
              <div className="flex rounded-xl bg-slate-100 p-1 mb-5 dark:bg-slate-800/80">
                <button
                  type="button"
                  onClick={() => { setActiveTab("email"); setError(null); }}
                  className={`flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-205 ${
                    activeTab === "email"
                      ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  Email Address
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("phone"); setError(null); }}
                  className={`flex-1 rounded-lg py-1.5 text-center text-xs font-semibold transition-all duration-205 ${
                    activeTab === "phone"
                      ? "bg-white text-slate-800 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  Phone Number
                </button>
              </div>
            )}

            {/* Email form */}
            {activeTab === "email" && !otpSent && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail size={16} /></span>
                    <input
                      ref={firstInputRef}
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200/80 bg-white/60 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-accent-400 focus:bg-white/90 focus:shadow-glow focus:ring-2 focus:ring-accent-500/20 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-accent-500"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Password</label>
                    <span className="text-[10px] font-semibold text-accent-500 hover:underline cursor-pointer">Forgot?</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock size={16} /></span>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="w-full rounded-xl border border-slate-200/80 bg-white/60 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-accent-400 focus:bg-white/90 focus:shadow-glow focus:ring-2 focus:ring-accent-500/20 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-accent-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/20 hover:shadow-accent-500/30 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all duration-200 mt-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>{isRegister ? "Create Account" : "Sign In with Credentials"}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                  {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => { setIsRegister(!isRegister); setError(null); }}
                    className="font-bold text-accent-500 hover:underline bg-transparent border-none p-0 focus:outline-none"
                  >
                    {isRegister ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </form>
            )}

            {/* Phone form */}
            {activeTab === "phone" && !otpSent && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">Phone Number</label>
                  <div className="flex gap-2">
                    <div className="relative shrink-0">
                      <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="h-full rounded-xl border border-slate-200/80 bg-white/60 pl-8 pr-6 py-2.5 text-xs text-slate-800 shadow-sm outline-none transition-all focus:border-accent-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 appearance-none"
                      >
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+81">🇯🇵 +81</option>
                        <option value="+49">🇩🇪 +49</option>
                      </select>
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500" />
                    </div>
                    <div className="relative flex-1">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Phone size={16} /></span>
                      <input
                        ref={firstInputRef}
                        type="tel"
                        required
                        placeholder="(555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                        className="w-full rounded-xl border border-slate-200/80 bg-white/60 pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm outline-none transition-all duration-200 focus:border-accent-400 focus:bg-white/90 focus:shadow-glow focus:ring-2 focus:ring-accent-500/20 dark:border-slate-800/80 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-accent-500"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 to-purple-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-accent-500/20 hover:shadow-accent-500/30 hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all duration-200 mt-2"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OTP input form */}
            {otpSent && (
              <form onSubmit={handleVerifyOTP} className="space-y-5 animate-slide-left">
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    We sent a 6-digit verification code to
                  </p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                    {countryCode} {phone}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 italic">
                    Hint: You can enter any 6-digit code or '123456' to log in.
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 text-center">Verification Code</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="0 0 0 0 0 0"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 text-center text-lg font-bold tracking-[0.75em] text-slate-800 shadow-sm outline-none transition-all focus:border-accent-400 focus:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-lg hover:scale-[1.01] active:scale-95 disabled:opacity-50 transition-all duration-200"
                >
                  {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Verify &amp; Continue</span>
                      <CheckCircle2 size={16} />
                    </>
                  )}
                </button>
                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setError(null); }}
                    className="font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    Change Number
                  </button>
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={timer > 0 || loading}
                    className={`font-bold ${timer > 0 ? "text-slate-400 cursor-not-allowed" : "text-accent-500 hover:underline"}`}
                  >
                    {timer > 0 ? `Resend Code (${timer}s)` : "Resend Code"}
                  </button>
                </div>
              </form>
            )}

            {/* Security Notice */}
            <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-100 pt-4 dark:border-slate-800">
              <Sparkles size={12} className="text-amber-400" />
              <span>Fully simulated client-side authentication</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
