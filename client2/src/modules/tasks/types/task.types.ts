import { Task, TaskStatus, TaskPriority, Project, User } from '../../../types';

export type { Task, TaskStatus, TaskPriority };

export interface TaskFilterOptions {
  search?: string;
  projectId?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  projectId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  tags?: string[];
  estimatedHours?: number;
}
