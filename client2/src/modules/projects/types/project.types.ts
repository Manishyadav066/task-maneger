import { Project, Task, User } from '../../../types';

export type { Project };

export interface ProjectFormData {
  name: string;
  description: string;
  category: string;
  color: string;
  dueDate: string;
  workspaceId?: string;
}

export interface ProjectDetailsData {
  project: Project;
  tasks: Task[];
  members: User[];
}
