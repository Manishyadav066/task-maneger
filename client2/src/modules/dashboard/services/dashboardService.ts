import { api } from '../../../services/api';
import { DashboardData } from '../types/dashboard.types';
import { Task } from '../../../types';

export const dashboardService = {
  async getDashboardData(workspaceId?: string): Promise<DashboardData> {
    const [stats, projects, tasks, activities, members] = await Promise.all([
      api.getAnalyticsDashboard(workspaceId),
      api.getProjects(workspaceId),
      api.getTasks({ workspaceId }),
      api.getActivities(workspaceId),
      api.getMembers(workspaceId || 'ws-1'),
    ]);

    return {
      stats: {
        totalProjects: stats.totalProjects || projects.length,
        completedTasks: stats.completedTasks || tasks.filter((t: Task) => t.status === 'done').length,
        inProgressTasks: stats.inProgressTasks || tasks.filter((t: Task) => t.status === 'in_progress').length,
        teamVelocity: stats.teamVelocity || 88,
      },
      projects,
      recentTasks: tasks.slice(0, 6),
      activities,
      teamMembers: members,
    };
  },
};
