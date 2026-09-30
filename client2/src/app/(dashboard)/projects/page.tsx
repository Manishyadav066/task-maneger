import React from 'react';
import { ProjectsContainer } from '../../../modules/projects/components/ProjectsContainer';
import { Task, User } from '../../../types';

interface ProjectsPageProps {
  workspaceId?: string;
  users?: User[];
  onSelectTask: (task: Task) => void;
  onQuickAddTask?: (status: any, title: string) => void;
  onMoveTaskStatus?: (taskId: string, newStatus: any) => void;
  onOpenCreateTask?: () => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  workspaceId,
  users,
  onSelectTask,
  onQuickAddTask,
  onMoveTaskStatus,
  onOpenCreateTask,
}) => {
  return (
    <ProjectsContainer
      workspaceId={workspaceId}
      users={users}
      onSelectTask={onSelectTask}
      onQuickAddTask={onQuickAddTask}
      onMoveTaskStatus={onMoveTaskStatus}
      onOpenCreateTask={onOpenCreateTask}
    />
  );
};

export default ProjectsPage;
