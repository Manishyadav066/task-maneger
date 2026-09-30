import { Project, Task, Activity, User } from '../../../types';

export interface DashboardStats {
  totalProjects: number;
  completedTasks: number;
  inProgressTasks: number;
  teamVelocity: number;
}

export interface DashboardData {
  stats: DashboardStats;
  projects: Project[];
  recentTasks: Task[];
  activities: Activity[];
  teamMembers: User[];
}
