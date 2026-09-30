import React from 'react';
import { FolderKanban, CheckCircle2, Clock, Zap } from 'lucide-react';
import { DashboardStats } from '../types/dashboard.types';

interface StatsCardsProps {
  stats: DashboardStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Active Projects',
      value: stats.totalProjects,
      change: '+2 this month',
      icon: FolderKanban,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Completed Tasks',
      value: stats.completedTasks,
      change: '+14% vs last week',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'In Progress Tasks',
      value: stats.inProgressTasks,
      change: 'Active focus items',
      icon: Clock,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
    {
      title: 'Team Velocity',
      value: `${stats.teamVelocity}%`,
      change: 'Sprint health score',
      icon: Zap,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => {
        const Icon = c.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500">{c.title}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mb-1">{c.value}</div>
            <div className="text-[11px] text-slate-400 font-medium">{c.change}</div>
          </div>
        );
      })}
    </div>
  );
};
