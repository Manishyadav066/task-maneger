import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  CheckCircle2,
  CalendarCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const AIFeatures: React.FC = () => {
  const [selectedPrompt, setSelectedPrompt] = useState('Build Ecommerce Website');
  const [isGenerating, setIsGenerating] = useState(false);

  // Exact breakdown requested:
  // UI Design, Backend Development, Authentication, Payment Integration, Testing, Deployment
  const promptBreakdowns: Record<string, string[]> = {
    'Build Ecommerce Website': [
      'UI Design (Figma wireframes, catalog layout & mobile checkout UX)',
      'Backend Development (REST API for products, cart sessions & orders)',
      'Authentication (JWT tokens, password reset & OAuth 2.0 social login)',
      'Payment Integration (Stripe webhook, tax calculator & invoice receipts)',
      'Testing (End-to-end Cypress checkout flows & unit test suites)',
      'Deployment (Cloud Run container deploy, CDN edge caching & DNS setup)',
    ],
    'Launch Mobile App (iOS & Android)': [
      'App Store Optimization (Icon design, screenshots & localized copy)',
      'Push Notification Architecture (FCM credentials & user permission prompts)',
      'Offline State Cache (SQLite local store & sync manager)',
      'In-App Subscriptions (RevenueCat integration & receipt validation)',
    ],
    'Setup SaaS Customer Portal': [
      'Customer Dashboard UI (Billing invoices & seat license manager)',
      'Multi-Tenant Data Isolation (Role-based schema migration)',
      'Support Ticket Widget (Zendesk webhook & real-time notifications)',
    ],
  };

  const currentTasks = promptBreakdowns[selectedPrompt] || promptBreakdowns['Build Ecommerce Website'];

  const handleSelectPreset = (prompt: string) => {
    setIsGenerating(true);
    setSelectedPrompt(prompt);
    setTimeout(() => {
      setIsGenerating(false);
    }, 300);
  };

  return (
    <section id="ai-features" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>The TaskFlow AI Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            AI-Powered Intelligence That Separates Us From Clones
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Intelligent AI deeply embedded into your daily sprint cycle. Stop writing tickets by hand and let AI decompose complex product initiatives in seconds.
          </p>
        </div>

        {/* USP 1: Interactive AI Task Generator */}
        <div className="mb-14 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border border-indigo-100 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input & Presets */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </span>
                <h3 className="text-xl font-bold text-slate-900">AI Task Generator</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Type any goal or feature request. TaskFlow AI decomposes it into concrete milestones, estimated subtasks, and assigns proper sprint priorities automatically.
              </p>

              {/* Prompt Input Box */}
              <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Enter Initiative or Feature:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={selectedPrompt}
                    onChange={(e) => setSelectedPrompt(e.target.value)}
                    className="w-full text-sm font-semibold text-slate-900 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="e.g. Build Ecommerce Website"
                  />
                </div>
              </div>

              {/* Presets */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-2">Try quick presets:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(promptBreakdowns).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all cursor-pointer ${
                        selectedPrompt === preset
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generated Subtasks Output (Right Box) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span className="text-xs font-bold text-slate-800">
                    AI Auto-Decomposition Output ({currentTasks.length} Subtasks)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Ready to import
                </span>
              </div>

              <div className="space-y-2.5">
                {currentTasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-indigo-200 transition-all text-xs"
                  >
                    <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="font-medium text-slate-800">{task}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>TaskFlow Copilot • Real-time Stream</span>
                <span className="text-indigo-600 font-bold flex items-center gap-1">
                  <span>Synced to /api/tasks</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Other Key AI Features: Daily Summary & Project Health */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* AI Daily Summary */}
          <div className="bg-slate-50/60 border border-slate-200/80 rounded-3xl p-7">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">AI Daily Summary</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              Every morning at 9:00 AM, TaskFlow AI synthesizes the status of your workspace so leadership doesn't have to interrupt engineers.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Today's Progress</span>
                <span className="text-emerald-600 font-bold">12 Tasks Closed</span>
              </div>
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Pending Work</span>
                <span className="text-indigo-600 font-bold">18 In Review</span>
              </div>
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Overdue Tasks</span>
                <span className="text-rose-600 font-bold">1 Re-assigned</span>
              </div>
            </div>
          </div>

          {/* AI Project Health */}
          <div className="bg-slate-50/60 border border-slate-200/80 rounded-3xl p-7">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">AI Project Health</h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              Proactive sprint risk detection catches bottlenecks before they derail launch dates or inflate budgets.
            </p>

            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Risk Detection</span>
                <span className="text-emerald-600 font-bold">Zero High-Severity Risks</span>
              </div>
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Progress Analysis</span>
                <span className="text-purple-600 font-bold">Velocity +14% Ahead</span>
              </div>
              <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-xs flex items-center justify-between">
                <span className="font-semibold text-slate-800">Completion Forecast</span>
                <span className="text-indigo-600 font-bold">Estimated on Schedule</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
