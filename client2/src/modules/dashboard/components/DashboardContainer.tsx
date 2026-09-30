import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { DashboardUI } from '../ui/DashboardUI';
import { Task } from '../../../types';

interface DashboardContainerProps {
  workspaceId?: string;
  onSelectTask: (task: Task) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  workspaceId,
  onSelectTask,
  onNavigateTab,
}) => {
  const { data, loading, error } = useDashboard(workspaceId);

  return (
    <DashboardUI
      data={data}
      loading={loading}
      error={error}
      onSelectTask={onSelectTask}
      onNavigateTab={onNavigateTab}
    />
  );
};
