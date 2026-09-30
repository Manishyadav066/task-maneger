import React from 'react';
import { Task, Project, User } from '../../../types';
import { TasksUI } from '../ui/TasksUI';

interface TasksContainerProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onQuickAddTask: (status: any, title: string) => void;
  onMoveTaskStatus: (taskId: string, newStatus: any) => void;
  onOpenCreateTask: () => void;
  onOpenAIGenerator?: () => void;
}

export const TasksContainer: React.FC<TasksContainerProps> = (props) => {
  return <TasksUI {...props} />;
};
