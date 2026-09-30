import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { User, Task } from '../../types';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface AnalyticsViewProps {
  tasks: Task[];
  users: User[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ tasks, users }) => {
  const statusData = [
    { name: 'To Do', count: tasks.filter((t) => t.status === 'todo').length, color: '#94a3b8' },
    { name: 'In Progress', count: tasks.filter((t) => t.status === 'in_progress').length, color: '#f59e0b' },
    { name: 'Review', count: tasks.filter((t) => t.status === 'review').length, color: '#8b5cf6' },
    { name: 'Done', count: tasks.filter((t) => t.status === 'done').length, color: '#10b981' },
  ];

  const priorityData = [
    { name: 'Urgent', count: tasks.filter((t) => t.priority === 'urgent').length, color: '#ef4444' },
    { name: 'High', count: tasks.filter((t) => t.priority === 'high').length, color: '#f97316' },
    { name: 'Medium', count: tasks.filter((t) => t.priority === 'medium').length, color: '#eab308' },
    { name: 'Low', count: tasks.filter((t) => t.priority === 'low').length, color: '#3b82f6' },
  ];

  const velocityData = [
    { sprint: 'Sprint 1', planned: 14, completed: 12 },
    { sprint: 'Sprint 2', planned: 16, completed: 15 },
    { sprint: 'Sprint 3', planned: 18, completed: 19 },
    { sprint: 'Sprint 4', planned: 20, completed: 18 },
    { sprint: 'Sprint 5 (Current)', planned: 22, completed: 17 },
  ];

  // Productivity per user
  const memberStats = users.map((u) => {
    const assigned = tasks.filter((t) => t.assigneeId === u.id);
    const done = assigned.filter((t) => t.status === 'done');
    const inFlight = assigned.filter((t) => t.status !== 'done');
    const score = assigned.length > 0 ? Math.round((done.length / assigned.length) * 100) : 100;

    return {
      user: u,
      assignedCount: assigned.length,
      doneCount: done.length,
      inFlightCount: inFlight.length,
      score,
    };
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Engineering & Task Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Real-time metrics, throughput distribution, and team capacity.
        </p>
      </div>

      {/* Top Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Status Distribution Bar Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Status Volume Breakdown</h3>
          <span className="text-[11px] text-slate-400 block mb-4">Total tasks in active workflow</span>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sprint Velocity Area Chart */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-slate-900">Sprint Throughput (Velocity)</h3>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>Completed</span>
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>Planned</span>
              </span>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 block mb-4">5-Sprint planned vs delivered ratio</span>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="compGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="sprint" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="planned" stroke="#cbd5e1" strokeWidth={2} fill="transparent" />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fill="url(#compGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Member Productivity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Member Workload & Delivery Score</h3>
            <span className="text-[11px] text-slate-400">Current sprint allocation</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
            {users.length} Active Contributors
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-5">Team Member</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Assigned</th>
                <th className="py-3 px-4">Completed</th>
                <th className="py-3 px-4">In Flight</th>
                <th className="py-3 px-5">Delivery Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {memberStats.map((stat) => (
                <tr key={stat.user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-5 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-900">{stat.user.name}</div>
                      <div className="text-[11px] text-slate-400">{stat.user.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{stat.user.department || 'Product'}</td>
                  <td className="py-3 px-4 font-bold text-slate-800">{stat.assignedCount}</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">{stat.doneCount}</td>
                  <td className="py-3 px-4 font-bold text-amber-600">{stat.inFlightCount}</td>
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full"
                          style={{ width: `${stat.score}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-900 text-xs">{stat.score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
