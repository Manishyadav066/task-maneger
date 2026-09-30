import React from 'react';
import {
  Building,
  Briefcase,
  CheckSquare,
  ShieldCheck,
  BarChart3,
  ListTodo,
  Calendar,
  Layers,
  ArrowRight,
  Code2,
} from 'lucide-react';

interface FeaturesSectionProps {
  onExploreFeature: () => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ onExploreFeature }) => {
  return (
    <section id="features" className="py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <span>Enterprise-Grade Foundation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why TaskFlow AI Outperforms Legacy Tools
          </h2>
          <p className="text-base text-slate-600 mt-3 max-w-2xl mx-auto">
            Deeply connected full-stack architecture built on robust REST APIs. Seamlessly transition from strategy to everyday execution without friction.
          </p>
        </div>

        {/* 3 Main Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1. Workspace Management */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-indigo-100">
                <Building className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  /api/workspaces
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Workspace Management</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Organize distinct organizations, clients, or branches within isolated workspaces. Assign granular permissions and switch contexts instantly.
              </p>

              {/* Sub-features */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span>Create Unlimited Workspaces</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span>Manage Teams & Invitation Links</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                  <span>Role Based Access (Owner, Admin, Member)</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold">
              <span>Explore Workspaces</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Project Management */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-purple-100">
                <Briefcase className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  /api/projects
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Project Management</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Keep every product release, marketing push, and client engagement on target with automatic milestone tracking and progress health analytics.
              </p>

              {/* Sub-features */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                  <span>Track Every Project & Release Tag</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                  <span>Real-time Progress Monitoring (0-100%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                  <span>Project Analytics & Velocity Forecasts</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-bold">
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Task Management */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform border border-emerald-100">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  /api/tasks
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Task Management</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Powerful kanban and sprint boards supporting subtasks, attachments, rich comments, priority tags, and automated stage progression.
              </p>

              {/* Sub-features */}
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>Direct Task Assignment & Avatar Stacks</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>Priority Levels (Low, Med, High, Urgent)</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                  <span>Status Tracking, Subtasks & Deadlines</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-600 font-bold">
              <span>Explore Tasks</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
