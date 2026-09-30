import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export const Charts: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', completed: 4, created: 3 },
    { day: 'Tue', completed: 7, created: 5 },
    { day: 'Wed', completed: 6, created: 4 },
    { day: 'Thu', completed: 9, created: 6 },
    { day: 'Fri', completed: 11, created: 3 },
    { day: 'Sat', completed: 3, created: 1 },
    { day: 'Sun', completed: 2, created: 0 },
  ];

  const maxVal = 12;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Weekly Throughput */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Task Throughput</h3>
              <p className="text-[11px] text-slate-400">Created vs. Resolved tasks</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-indigo-600">
              <span className="w-2 h-2 rounded-full bg-indigo-600" /> Completed
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-300" /> Created
            </span>
          </div>
        </div>

        <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
          {weeklyData.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1.5 h-32">
                <div
                  className="w-3 sm:w-4 bg-indigo-600 rounded-t-md transition-all"
                  style={{ height: `${(d.completed / maxVal) * 100}%` }}
                  title={`${d.completed} completed`}
                />
                <div
                  className="w-3 sm:w-4 bg-slate-200 rounded-t-md transition-all"
                  style={{ height: `${(d.created / maxVal) * 100}%` }}
                  title={`${d.created} created`}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Burn-Up / Cumulative Flow */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Sprint Health & Quality</h3>
              <p className="text-[11px] text-slate-400">Code review turnaround & bug escape rate</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">PR Review Velocity</span>
              <span className="font-bold text-slate-900">&lt; 3.2 hours</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[88%] h-full bg-indigo-600 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Sprint Goal Completion</span>
              <span className="font-bold text-slate-900">92%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[92%] h-full bg-emerald-500 rounded-full" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Test Suite Coverage</span>
              <span className="font-bold text-slate-900">96.4%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="w-[96.4%] h-full bg-violet-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
