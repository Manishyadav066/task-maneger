import React from 'react';
import {
  Users,
  UserPlus,
  ShieldCheck,
  MessageSquare,
  Activity,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const CollaborationSection: React.FC = () => {
  const members = [
    {
      name: 'Sarah Jenkins',
      role: 'Owner & Lead Product',
      email: 'sarah.j@taskflow.ai',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      badge: 'Owner',
    },
    {
      name: 'Alex Rivera',
      role: 'Staff Full-Stack Engineer',
      email: 'alex.r@taskflow.ai',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      badge: 'Admin',
    },
    {
      name: 'Elena Rostova',
      role: 'UI/UX Design Specialist',
      email: 'elena.r@taskflow.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
      badge: 'Member',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50/50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Vision & Features */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Real-Time Team Collaboration</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Bring Your Entire Squad Into One Unified Flow
            </h2>

            <p className="text-base text-slate-600 leading-relaxed font-normal">
              No more scattered Slack threads or lost Jira tickets. TaskFlow AI makes every member's contribution transparent, with instant role assignment and live activity tracking.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Invite Team Members & Guests</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Generate instant one-click invite tokens for full collaborators or read-only client stakeholders.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Assign Granular Roles</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Precise role-based access control protecting billing, project deletion, and public publishing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Live Activity Feed & Comments</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Powered by <span className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">/api/activities</span> and <span className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">/api/comments</span> for zero delay.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Team Card & Activity Preview */}
          <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-800">Workspace Members</span>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                /api/workspaces/members
              </span>
            </div>

            {/* Member List */}
            <div className="space-y-3 mb-6">
              {members.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/60 border border-slate-100 hover:border-slate-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-500">{m.role}</div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    m.badge === 'Owner'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200/60'
                      : m.badge === 'Admin'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}>
                    {m.badge}
                  </span>
                </div>
              ))}
            </div>

            {/* Real-time Comment Preview */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Thread on "Frontend Project - Sprint 4"</span>
              </div>
              <p className="text-xs text-slate-700">
                <span className="font-semibold text-slate-900">Alex Rivera:</span> "I just pushed the OAuth Google login flow and updated the schema. Pulling into testing now."
              </p>
              <div className="mt-2 text-[10px] text-slate-400 font-medium">Just now • Synced across all connected clients</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
