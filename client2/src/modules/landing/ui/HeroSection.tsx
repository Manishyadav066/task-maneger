import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  FolderKanban,
  CheckSquare,
  Users,
  TrendingUp,
  Shield,
  Layers,
} from 'lucide-react';

interface HeroSectionProps {
  onStartFree: () => void;
  onOpenDashboard: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onStartFree, onOpenDashboard }) => {
  const highlights = [
    'Plan Projects',
    'Assign Tasks',
    'Track Progress',
    'Collaborate with Teams',
    'Get AI Insights',
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/30 border-b border-slate-100">
      {/* Ambient background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-100/50 via-purple-50/40 to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Vision & Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Next-Gen AI Project Management SaaS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Manage Projects, Teams & Tasks with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600">
                AI-Powered Productivity
              </span>
            </h1>

            {/* Feature Bullets in Pill Format */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
              Transform high-level product roadmaps into automated sprint backlogs. Eliminate manual standups and keep your entire team aligned with real-time intelligence.
            </p>

            {/* Feature Badges list */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 rounded-lg text-xs font-medium text-slate-700 shadow-2xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-4">
              <button
                id="hero-start-free-btn"
                onClick={onStartFree}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-200 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <span>Start Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-watch-demo-btn"
                onClick={onOpenDashboard}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-semibold text-sm shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                <span>Watch Live Demo</span>
              </button>
            </div>

            {/* Micro-Trust Info */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Free 14-day trial</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Dashboard Preview Card (Doozy Style, Light Mode) */}
          <div className="lg:col-span-6 relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-blue-100/30 rounded-3xl blur-2xl -z-10" />

            <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-7 shadow-xl shadow-slate-200/50 relative">
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-400/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 ml-2">app.taskflow.ai/overview</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Production</span>
                </div>
              </div>

              {/* Exact Requested Hero Stats: Projects: 24, Tasks: 148, Completed: 92, Team Members: 18 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <FolderKanban className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">24</div>
                  <div className="text-[11px] font-medium text-slate-500">Projects</div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <CheckSquare className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">148</div>
                  <div className="text-[11px] font-medium text-slate-500">Tasks</div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">92</div>
                  <div className="text-[11px] font-medium text-slate-500">Completed</div>
                </div>

                <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 text-center">
                  <div className="w-7 h-7 mx-auto mb-1.5 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-xl font-bold text-slate-900">18</div>
                  <div className="text-[11px] font-medium text-slate-500">Team Members</div>
                </div>
              </div>

              {/* Mini Interactive Preview Snippet */}
              <div className="space-y-2.5">
                <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">Sprint Intelligence Active</div>
                      <div className="text-[11px] text-slate-500">Sprint risk detection & auto-standup ready</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-white px-2 py-1 rounded-lg border border-indigo-200/60 shadow-2xs">
                    94% Velocity
                  </span>
                </div>

                {/* Active Sprint Progress Item */}
                <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-800">Q3 Platform Revamp</span>
                    <span className="text-emerald-600 font-bold">14/18 Tasks Done</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full w-[78%] rounded-full" />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Trigger */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Click to jump into real workspace:</span>
                <button
                  onClick={onOpenDashboard}
                  className="font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Full Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
