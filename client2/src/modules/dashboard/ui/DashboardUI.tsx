import React from 'react';
import { DashboardData } from '../types/dashboard.types';
import { StatsCards } from '../components/StatsCards';
import { RecentTasks } from '../components/RecentTasks';
import { ActivityList } from '../components/ActivityList';
import { Task, Project } from '../../../types';
import { Loader2 } from 'lucide-react';

interface DashboardUIProps {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  onSelectTask: (task: Task) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardUI: React.FC<DashboardUIProps> = ({
  data,
  loading,
  error,
  onSelectTask,
  onNavigateTab,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center text-rose-600 bg-rose-50 rounded-2xl border border-rose-200">
        {error || 'Unable to load dashboard metrics.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Stats */}
      <StatsCards stats={data.stats} />

      {/* Main Grid: Recent Tasks & Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentTasks
            tasks={data.recentTasks}
            projects={data.projects}
            onSelectTask={onSelectTask}
            onViewAllTasks={() => onNavigateTab('tasks')}
          />
        </div>
        <div>
          <ActivityList activities={data.activities} />
        </div>
      </div>
    </div>
  );
};
