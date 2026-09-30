import React from 'react';
import { DashboardContainer } from '../../../modules/dashboard/components/DashboardContainer';
import { Task } from '../../../types';

interface DashboardPageProps {
  workspaceId?: string;
  onSelectTask: (task: Task) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  workspaceId,
  onSelectTask,
  onNavigateTab,
}) => {
  return (
    <DashboardContainer
      workspaceId={workspaceId}
      onSelectTask={onSelectTask}
      onNavigateTab={onNavigateTab}
    />
  );
};

export default DashboardPage;
