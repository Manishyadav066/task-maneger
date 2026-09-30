import React from 'react';
import { Rocket, Building2, Laptop, Code2, Globe2, TrendingUp, CheckCircle, Award } from 'lucide-react';

interface TrustedByProps {
  stats: Array<{ value: string; label: string; sub: string }>;
}

export const TrustedBy: React.FC<TrustedByProps> = ({ stats }) => {
  const teamCategories = [
    { name: 'Startups', icon: Rocket, desc: 'Y-Combinator & Seed funded' },
    { name: 'Agencies', icon: Building2, desc: 'Design & Engineering shops' },
    { name: 'Freelancers', icon: Laptop, desc: 'Independent consultants' },
    { name: 'Software Teams', icon: Code2, desc: 'Full-stack & DevOps squads' },
    { name: 'Remote Teams', icon: Globe2, desc: 'Distributed across 40+ countries' },
  ];

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
            Trusted By High-Output Teams Worldwide
          </h2>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Built for modern squads who ship fast and refuse busywork
          </p>
        </div>

        {/* Team Categories Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-12">
          {teamCategories.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="p-4 bg-slate-50/60 hover:bg-indigo-50/40 border border-slate-200/70 hover:border-indigo-200 rounded-2xl transition-all text-center group cursor-default"
              >
                <div className="w-10 h-10 mx-auto mb-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs group-hover:border-indigo-300 text-indigo-600 flex items-center justify-center transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-slate-800 group-hover:text-indigo-700">
                  {item.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Stats Cards Section (500+ Projects Managed, 10,000+ Tasks Completed, 95% Productivity Improvement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 bg-gradient-to-b from-white to-slate-50/50 border border-slate-200/80 rounded-3xl shadow-xs relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div className="text-sm font-bold text-slate-800">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
