import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DashboardPreviewProps {
  onOpenDashboard: () => void;
}

export const DashboardPreview: React.FC<DashboardPreviewProps> = ({ onOpenDashboard }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'analytics'>('overview');

  return (
    <section id="showcase" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Interactive Product Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Designed for Instant Clarity and Speed
          </h2>
          <p className="text-base text-slate-600 mt-3">
            Switch between views to experience how TaskFlow AI brings order to complex team workflows.
          </p>
        </div>

        {/* Carousel / Tab Navigation (Light Mode Pill Controls) */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 bg-slate-100/80 border border-slate-200/80 rounded-2xl gap-1 shadow-2xs">
            <button
              id="showcase-tab-overview"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Screen 1: Dashboard Overview</span>
            </button>

            <button
              id="showcase-tab-projects"
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span>Screen 2: Projects Board</span>
            </button>

            <button
              id="showcase-tab-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Screen 3: Analytics Dashboard</span>
            </button>
          </div>
        </div>

        {/* Active View Container */}
        <div className="bg-slate-50/70 border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-sm">
          {/* Top Bar with API Source Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 mb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div>
                <span className="text-sm font-bold text-slate-800">
                  {activeTab === 'overview' && 'Dashboard Overview Viewport'}
                  {activeTab === 'projects' && 'Projects Portfolio & Milestone Board'}
                  {activeTab === 'analytics' && 'Sprint & Velocity Performance Analytics'}
                </span>
                <span className="ml-2 font-mono text-[11px] bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded">
                  {activeTab === 'overview' && 'Source: /api/dashboard'}
                  {activeTab === 'projects' && 'Source: /api/projects'}
                  {activeTab === 'analytics' && 'Source: /api/analytics/tasks'}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenDashboard}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <span>Launch Live View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SCREEN 1: Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Requested Metrics: Total Projects, Completed Tasks, Pending Tasks, Overdue Tasks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2 text-xs font-semibold">
                    <span>Total Projects</span>
                    <FolderKanban className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">24</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +3 added this month
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2 text-xs font-semibold">
                    <span>Completed Tasks</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">92</div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 62% overall completion
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2 text-xs font-semibold">
                    <span>Pending Tasks</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">56</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    Active in current sprint
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-2 text-xs font-semibold">
                    <span>Overdue Tasks</span>
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">3</div>
                  <div className="text-[11px] text-rose-600 font-medium mt-1">
                    Auto-flagged by AI triage
                  </div>
                </div>
              </div>

              {/* Sample Task Stream */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="text-sm font-bold text-slate-800 mb-4">Current Sprint Focus Items</div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span className="font-semibold text-slate-800">Finalize OAuth 2.0 Client Flow</span>
                      <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-mono text-[10px]">High</span>
                    </div>
                    <span className="text-slate-500">Assigned: Sarah Jenkins</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800">Stripe Billing Webhook Reconciliation</span>
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-mono text-[10px]">Medium</span>
                    </div>
                    <span className="text-slate-500">Assigned: Alex Rivera</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 2: Projects Board */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Requested items: Frontend Project, Backend API, Mobile App, Landing Page */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Web App</span>
                    <span className="text-xs font-bold text-emerald-600">85% Complete</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Frontend Project</h4>
                  <p className="text-xs text-slate-500 mb-4">React 18 + Vite SPA with modern responsive UI and state management.</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[85%] rounded-full" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">Infrastructure</span>
                    <span className="text-xs font-bold text-emerald-600">92% Complete</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Backend API</h4>
                  <p className="text-xs text-slate-500 mb-4">Express REST endpoints for workspaces, tasks, and auth tokens.</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full w-[92%] rounded-full" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Cross-Platform</span>
                    <span className="text-xs font-bold text-amber-600">60% Complete</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Mobile App</h4>
                  <p className="text-xs text-slate-500 mb-4">React Native companion for on-the-go notifications and quick status checks.</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full w-[60%] rounded-full" />
                  </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Growth</span>
                    <span className="text-xs font-bold text-emerald-600">100% Shipped</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">Landing Page</h4>
                  <p className="text-xs text-slate-500 mb-4">High-conversion Doozy-inspired light mode showcase for TaskFlow AI.</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[100%] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Requested: Task Completion Rate, Workspace Performance, Team Productivity */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Task Completion Rate
                  </div>
                  <div className="text-4xl font-extrabold text-indigo-600 mb-1">94.2%</div>
                  <div className="text-xs text-emerald-600 font-semibold">+4.8% vs last sprint</div>
                  <p className="text-xs text-slate-400 mt-3">Calculated over 148 registered tasks across all active sprints.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Workspace Performance
                  </div>
                  <div className="text-4xl font-extrabold text-purple-600 mb-1">9.6 / 10</div>
                  <div className="text-xs text-purple-600 font-semibold">Optimal health score</div>
                  <p className="text-xs text-slate-400 mt-3">Low cycle time and sub-24h turnaround for priority tickets.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Team Productivity
                  </div>
                  <div className="text-4xl font-extrabold text-emerald-600 mb-1">+95%</div>
                  <div className="text-xs text-emerald-600 font-semibold">Efficiency multiplier</div>
                  <p className="text-xs text-slate-400 mt-3">Powered by automated AI task breakdowns and real-time alerts.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
