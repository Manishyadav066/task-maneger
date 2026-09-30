import React, { useState } from "react";
import {
  Sparkles,
  Lock,
  Mail,
  User as UserIcon,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  Layers,
  ChevronRight,
  Check,
} from "lucide-react";

import { User } from "../../types";
import { api } from "../../services/api";
import { ForgotPasswordModal } from "./ForgotPasswordModal";

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
  onCancel?: () => void;
  initialMode?: "signin" | "register";
  showBackToDashboard?: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  onLoginSuccess,
  onCancel,
  initialMode = "signin",
  showBackToDashboard = false,
}) => {
  const [mode, setMode] = useState<"signin" | "register">(initialMode);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  // =========================
  // FORM FIELDS
  // =========================

  const [email, setEmail] = useState("sarah.j@taskflow.ai");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Engineering");

  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // =========================
  // TOAST
  // =========================

  const showToast = (message: string) => {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // =========================
  // DEMO USERS
  // =========================

  const demoUsers: Array<{
    name: string;
    email: string;
    role: string;
    department: string;
    avatar: string;
  }> = [
    {
      name: "Sarah Jenkins",
      email: "sarah.j@taskflow.ai",
      role: "Workspace Owner",
      department: "Product & Design",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Alex Rivera",
      email: "alex.r@taskflow.ai",
      role: "Admin Lead",
      department: "Engineering",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "David Chen",
      email: "david.c@taskflow.ai",
      role: "Frontend Lead",
      department: "Web Platform",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
    {
      name: "Elena Rostova",
      email: "elena.r@taskflow.ai",
      role: "DevOps & Cloud",
      department: "Infrastructure",
      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
  ];

  // =========================
  // PASSWORD STRENGTH
  // =========================

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) {
      return {
        score: 0,
        label: "Empty",
        color: "bg-slate-200",
      };
    }

    let score = 0;

    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return {
          score: 1,
          label: "Weak",
          color: "bg-rose-500",
        };

      case 2:
        return {
          score: 2,
          label: "Fair",
          color: "bg-amber-500",
        };

      case 3:
        return {
          score: 3,
          label: "Good",
          color: "bg-blue-500",
        };

      case 4:
        return {
          score: 4,
          label: "Strong",
          color: "bg-emerald-500",
        };

      default:
        return {
          score: 0,
          label: "Weak",
          color: "bg-rose-500",
        };
    }
  };

  const strength = getPasswordStrength(password);

  // =========================
  // MAIN LOGIN / REGISTER
  // =========================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Validation
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Please provide a valid work email address.");
      return;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "register" && !fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (mode === "register" && !agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      // ==========================================
      // LOGIN
      // ==========================================

      if (mode === "signin") {
        console.log("🔐 LOGIN START");
        console.log("📧 EMAIL:", cleanEmail);
        console.log("🔑 PASSWORD PROVIDED:", !!cleanPassword);

        const res = await api.login(cleanEmail, cleanPassword);

        console.log("✅ LOGIN API SUCCESS");
        console.log("👤 USER:", res.user);
        console.log(
          "🔑 TOKEN:",
          res.token ? "TOKEN RECEIVED" : "TOKEN MISSING",
        );

        // api.login() already stores JWT in localStorage.
        console.log(
          "💾 LOCAL STORAGE TOKEN:",
          localStorage.getItem("token") ? "TOKEN FOUND" : "TOKEN MISSING",
        );

        showToast(`Welcome back, ${res.user.name}!`);

        onLoginSuccess(res.user);

        return;
      }

      // ==========================================
      // REGISTER
      // ==========================================

      console.log("📝 REGISTER START");
      console.log("📧 EMAIL:", cleanEmail);
      console.log("👤 NAME:", fullName.trim());

      const res = await api.register({
        name: fullName.trim(),
        email: cleanEmail,
        department,
        password: cleanPassword,
      });

      console.log("✅ REGISTER API SUCCESS");
      console.log("👤 USER:", res.user);
      console.log("🔑 TOKEN:", res.token ? "TOKEN RECEIVED" : "TOKEN MISSING");

      console.log(
        "💾 LOCAL STORAGE TOKEN:",
        localStorage.getItem("token") ? "TOKEN FOUND" : "TOKEN MISSING",
      );

      showToast(`Account created! Welcome to TaskFlow AI, ${res.user.name}!`);

      onLoginSuccess(res.user);
    } catch (err: any) {
      console.error("❌ AUTHENTICATION FAILED:", err);

      const message =
        err?.message ||
        "Authentication failed. Please verify your credentials.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DEMO LOGIN
  // =========================

  const handleDemoSignIn = async (demoUser: (typeof demoUsers)[0]) => {
    setError(null);

    setEmail(demoUser.email);
    setPassword("password123");

    setLoading(true);

    try {
      console.log("⚡ DEMO LOGIN START");
      console.log("📧 DEMO EMAIL:", demoUser.email);

      const res = await api.login(demoUser.email, "password123");

      console.log("✅ DEMO LOGIN SUCCESS");
      console.log("👤 USER:", res.user);

      showToast(`Signed in as ${demoUser.name} (${demoUser.role})`);

      onLoginSuccess(res.user);
    } catch (err: any) {
      console.error("❌ DEMO LOGIN FAILED:", err);

      setError(err?.message || "Could not sign in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SOCIAL LOGIN
  // =========================

  const handleSocialSignIn = (provider: string) => {
    setError(null);

    /*
      IMPORTANT:

      Google/GitHub are currently UI mock buttons.
      They are NOT connected to backend OAuth.

      We don't call fake backend authentication here.
    */

    showToast(`${provider} SSO is not connected yet. Use email login.`);
  };

  // =========================
  // JSX
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Toast */}

      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />

          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}

      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-12">
        {/* ========================================================= */}
        {/* LEFT COLUMN */}
        {/* ========================================================= */}

        <div className="lg:col-span-6 xl:col-span-5 bg-white px-6 sm:px-10 lg:px-14 py-8 sm:py-12 flex flex-col justify-between relative z-10 border-r border-slate-100 shadow-xl lg:shadow-none">
          {/* Brand */}

          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
                <Sparkles className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    TaskFlow
                  </span>

                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 uppercase tracking-wide">
                    AI
                  </span>
                </div>

                <p className="text-[10px] text-slate-400 -mt-0.5">
                  Unified Sprint & Copilot Suite
                </p>
              </div>
            </div>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>
                  {showBackToDashboard ? "Back to App" : "Back to Home"}
                </span>

                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Form Content */}

          <div className="w-full max-w-md mx-auto my-auto py-2">
            {/* Mode Switcher */}

            <div className="bg-slate-100/80 p-1 rounded-2xl flex items-center mb-6 max-w-xs mx-auto border border-slate-200/50">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  mode === "signin"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  mode === "register"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Header */}

            <div className="text-center sm:text-left mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {mode === "signin" ? "Welcome back" : "Start your workspace"}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                {mode === "signin"
                  ? "Sign in to access your projects, sprint kanban, and AI copilot."
                  : "Join 12,000+ teams managing deliverables and automated sprints."}
              </p>
            </div>

            {/* Social Login */}

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialSignIn("Google")}
                className="py-2.5 px-3 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />

                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />

                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />

                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>

                <span>Google</span>
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialSignIn("GitHub")}
                className="py-2.5 px-3 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-2xs hover:shadow-xs active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-slate-900" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>

                <span>GitHub</span>
              </button>
            </div>

            {/* Divider */}

            <div className="relative flex items-center justify-center mb-5">
              <div className="border-t border-slate-200 w-full" />

              <span className="bg-white px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                Or with work email
              </span>
            </div>

            {/* Error */}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in duration-150">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />

                <span>{error}</span>
              </div>
            )}

            {/* Form */}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}

              {mode === "register" && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>

                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Email Address
                </label>

                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              {/* Department */}

              {mode === "register" && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-150">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Department / Role
                  </label>

                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all appearance-none"
                    >
                      <option value="Product & Design">Product & Design</option>

                      <option value="Engineering">
                        Engineering & Architecture
                      </option>

                      <option value="Frontend Lead">Frontend Platform</option>

                      <option value="Backend & DevOps">
                        Backend & Infrastructure
                      </option>

                      <option value="Growth & Executive">
                        Growth & Executive
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password */}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>

                  {mode === "signin" && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password Strength */}

                {mode === "register" && password.length > 0 && (
                  <div className="mt-2 space-y-1 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Security strength:</span>

                      <span className="font-semibold text-slate-700">
                        {strength.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 h-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`rounded-full ${
                            strength.score >= level
                              ? strength.color
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Checkbox */}

              <div className="flex items-center justify-between pt-1">
                {mode === "signin" ? (
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                    />

                    <span className="text-xs text-slate-600">
                      Remember me for 30 days
                    </span>
                  </label>
                ) : (
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 mt-0.5"
                    />

                    <span className="text-xs text-slate-600 leading-tight">
                      I agree to the{" "}
                      <span className="text-indigo-600 hover:underline">
                        Terms of Service
                      </span>{" "}
                      and{" "}
                      <span className="text-indigo-600 hover:underline">
                        Privacy Policy
                      </span>
                      .
                    </span>
                  </label>
                )}
              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading || (mode === "register" && !agreeTerms)}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-indigo-200 hover:shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>
                      {mode === "signin"
                        ? "Sign in to Workspace"
                        : "Create Free Workspace"}
                    </span>

                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Logins */}

            <div className="mt-7 pt-5 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ⚡ Quick Demo Logins
                </span>

                <span className="text-[11px] text-indigo-600 font-medium">
                  1-Click Test
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {demoUsers.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    disabled={loading}
                    onClick={() => handleDemoSignIn(user)}
                    className="p-2 rounded-xl border border-slate-200/70 hover:border-indigo-300 bg-slate-50/50 hover:bg-indigo-50/40 text-left transition-all group flex items-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {user.name.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-700">
                        {user.name}
                      </div>

                      <div className="text-[10px] text-slate-400 truncate">
                        {user.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Switch Mode */}

            <div className="text-center mt-6 text-xs text-slate-500">
              {mode === "signin" ? (
                <>
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have a workspace account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError(null);
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Footer */}

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />

              <span>SOC2 Type II & 256-bit Encrypted</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hover:text-slate-600 cursor-pointer">
                Privacy
              </span>

              <span>•</span>

              <span className="hover:text-slate-600 cursor-pointer">Terms</span>

              <span>•</span>

              <span className="hover:text-slate-600 cursor-pointer">
                Status
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN */}
        {/* ========================================================= */}

        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 border-l border-slate-200 p-8 sm:p-12 xl:p-16 flex-col justify-between relative overflow-hidden text-slate-900">
          {/* Background */}

          <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-100/60 rounded-full blur-3xl pointer-events-none" />

          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#4f46e5 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top Tag */}

          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />

              <span className="text-xs font-semibold text-slate-800">
                Enterprise Sprint OS
              </span>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Sprint Release 2026.4
            </div>
          </div>

          {/* Center */}

          <div className="relative z-10 my-auto py-8 max-w-xl mx-auto w-full space-y-5">
            <div className="space-y-3 mb-8">
              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Plan sprints faster. Automate execution with AI.
              </h2>

              <p className="text-sm xl:text-base text-slate-600 leading-relaxed max-w-lg">
                TaskFlow gives software teams real-time sprint visibility,
                automated task breakdown, and team velocity intelligence in one
                unified platform.
              </p>
            </div>

            {/* Card 1 */}

            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-lg shadow-slate-200/40 relative transition-transform hover:-translate-y-1 duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Layers className="w-4 h-4" />
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Q3 Sprint 14 Delivery
                    </h4>

                    <p className="text-[11px] text-slate-500">
                      Frontend Web Platform & Go Microservices
                    </p>
                  </div>
                </div>

                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  88% Complete
                </span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="bg-gradient-to-r from-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: "88%" }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-3">
                  <span>
                    <strong className="text-slate-900">18</strong> Done
                  </span>

                  <span>
                    <strong className="text-slate-900">4</strong> In Review
                  </span>

                  <span>
                    <strong className="text-slate-900">2</strong> To Do
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />

                  <span>7 Active Contributors</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}

            <div className="bg-white border border-indigo-100 rounded-3xl p-5 shadow-lg shadow-indigo-100/40 relative transition-transform hover:-translate-y-1 duration-300 ml-4 sm:ml-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      TaskFlow AI Copilot
                    </h4>

                    <span className="text-[10px] text-indigo-600 font-bold">
                      Just now
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Auto-generated 6 structured subtasks for{" "}
                    <span className="text-indigo-700 font-semibold">
                      "Stripe Billing Webhooks"
                    </span>{" "}
                    in 0.8 seconds.
                  </p>

                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Dependencies verified
                    </span>

                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                      Auto-assigned: Alex Rivera
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}

            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-center justify-between mr-4 sm:mr-8">
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />

                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Sarah Jenkins (Owner)
                  </div>

                  <div className="text-[11px] text-slate-500">
                    Approved Design Tokens v2.4
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Active Now
              </span>
            </div>
          </div>

          {/* Trust Footer */}

          <div className="relative z-10 pt-6 border-t border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                {"★".repeat(5)}

                <span className="text-slate-600 text-[11px] ml-1.5 font-semibold">
                  5.0 rating on G2 & Capterra
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Trusted by 12,000+ teams from startups to tech enterprises.
              </p>
            </div>

            <div className="flex items-center gap-4 opacity-70 hover:opacity-100 transition-all text-xs font-bold text-slate-500">
              <span>VERCEL</span>
              <span>•</span>
              <span>LINEAR</span>
              <span>•</span>
              <span>STRIPE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password */}

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultEmail={email}
        onSuccessToast={showToast}
      />
    </div>
  );
};
