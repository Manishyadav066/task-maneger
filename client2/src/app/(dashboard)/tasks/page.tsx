import React from 'react';
import { TasksContainer } from '../../../modules/tasks/components/TasksContainer';
import { Task, Project, User } from '../../../types';

interface TasksPageProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onQuickAddTask: (status: any, title: string) => void;
  onMoveTaskStatus: (taskId: string, newStatus: any) => void;
  onOpenCreateTask: () => void;
  onOpenAIGenerator?: () => void;
}

export const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  projects,
  users,
  onSelectTask,
  onQuickAddTask,
  onMoveTaskStatus,
  onOpenCreateTask,
  onOpenAIGenerator,
}) => {
  return (
    <TasksContainer
      tasks={tasks}
      projects={projects}
      users={users}
      onSelectTask={onSelectTask}
      onQuickAddTask={onQuickAddTask}
      onMoveTaskStatus={onMoveTaskStatus}
      onOpenCreateTask={onOpenCreateTask}
      onOpenAIGenerator={onOpenAIGenerator}
    />
  );
};

export default TasksPage;
