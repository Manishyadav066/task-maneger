import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, X } from 'lucide-react';
import { api } from '../../services/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
  onSuccessToast: (msg: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
  onSuccessToast,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const res = await api.forgotPassword(email);
      setSubmitted(true);
      onSuccessToast(res.message);
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4">
              <Mail className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Reset your password</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
              Enter your registered work email and we will send a secure one-click link to reset your credentials.
            </p>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.j@taskflow.ai"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Reset Instructions</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={onClose}
              className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1.5 py-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-3">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Check your inbox</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              We've dispatched password recovery instructions to{' '}
              <span className="font-semibold text-slate-800">{email}</span>. Please click the link inside to set a new password.
            </p>

            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
              >
                Return to Sign In
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-slate-500 hover:text-indigo-600 py-1.5"
              >
                Didn't receive email? Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
