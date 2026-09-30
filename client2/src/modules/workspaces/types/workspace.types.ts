import { Workspace, User } from '../../../types';

export interface WorkspaceFormInput {
  name: string;
  slug?: string;
  logo?: string;
  plan?: 'free' | 'pro' | 'enterprise';
}

export interface AddMemberInput {
  name: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  department?: string;
}

export interface WorkspaceDetailsData {
  workspace: Workspace;
  members: User[];
  projectsCount: number;
  tasksCount: number;
}
