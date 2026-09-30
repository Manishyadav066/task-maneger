import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Play } from 'lucide-react';

interface CTASectionProps {
  onStartFree: () => void;
  onBookDemo: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onStartFree, onBookDemo }) => {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-indigo-50/50 via-white to-slate-50/80 border-b border-slate-100 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Transform Your Workspace in 2 Minutes</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
          Ready to Organize Your Team?
        </h2>
        <p className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
          Start Managing Projects Smarter with TaskFlow AI
        </p>

        <p className="text-base text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed font-normal">
          Join over 500+ engineering and product teams delivering on schedule. Get full access to AI task generation, sprint boards, and real-time collaboration.
        </p>

        {/* Buttons: Start Free & Book Demo */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="final-cta-start-free-btn"
            onClick={onStartFree}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-200 hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>Start Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="final-cta-book-demo-btn"
            onClick={onBookDemo}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
            <span>Book Demo / Launch Dashboard</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Free 14-day Pro trial included</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-500" />
            <span>SOC2 Type II & GDPR Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Instant workspace setup</span>
          </div>
        </div>
      </div>
    </section>
  );
};
