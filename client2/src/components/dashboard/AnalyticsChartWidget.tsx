import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

interface AnalyticsChartWidgetProps {
  statusBreakdown: { status: string; name: string; count: number; color: string }[];
  weeklyVelocity: { day: string; created: number; completed: number }[];
}

export const AnalyticsChartWidget: React.FC<AnalyticsChartWidgetProps> = ({
  statusBreakdown,
  weeklyVelocity,
}) => {
  const totalTasks = statusBreakdown.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Velocity Area Chart (8 cols) */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sprint Velocity</h3>
            <span className="text-[11px] text-slate-400">Created vs Completed tasks</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Completed</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
              <span>Created</span>
            </span>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyVelocity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="createdGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px',
                  padding: '8px 12px',
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="created"
                stroke="#94a3b8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#createdGrad)"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#completedGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Breakdown Donut (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Task Status</h3>
            <span className="text-[11px] text-slate-400">Total active distribution</span>
          </div>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {totalTasks} Total
          </span>
        </div>

        <div className="relative h-44 w-full flex items-center justify-center my-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={72}
                paddingAngle={4}
                dataKey="count"
              >
                {statusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Centered stat */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-slate-900">{totalTasks}</span>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Tasks</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
          {statusBreakdown.map((item) => (
            <div key={item.status} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
