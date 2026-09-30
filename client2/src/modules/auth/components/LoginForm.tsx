
import React, { useState } from "react";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onSwitchToRegister,
  onForgotPassword,
  loading = false,
  error = null,
}) => {
  const [email, setEmail] = useState("alex@taskflow.ai");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      return;
    }

    try {
      await onSubmit(trimmedEmail, trimmedPassword);
    } catch (err) {
      console.error("❌ LOGIN FORM ERROR:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Email */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Email Address
        </label>

        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            Password
          </label>

          {onForgotPassword && (
            <button
              type="button"
              onClick={onForgotPassword}
              disabled={loading}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer disabled:opacity-50"
            >
              Forgot?
            </button>
          )}
        </div>

        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Login Button */}
      <button
        type="submit"
        disabled={loading || !email.trim() || !password.trim()}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Register */}
      <div className="pt-2 text-center">
        <p className="text-xs text-slate-500">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            disabled={loading}
            className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer disabled:opacity-50"
          >
            Create account
          </button>
        </p>
      </div>
    </form>
  );
};
