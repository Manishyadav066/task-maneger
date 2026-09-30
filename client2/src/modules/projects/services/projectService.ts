import { api } from '../../../services/api';
import { Project, Task } from '../../../types';
import { ProjectFormData } from '../types/project.types';

export const projectService = {
  async getProjects(workspaceId?: string): Promise<Project[]> {
    return api.getProjects(workspaceId);
  },

  async getProject(id: string): Promise<Project> {
    return api.getProject(id);
  },

  async createProject(data: ProjectFormData): Promise<Project> {
    return api.createProject(data);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    return api.updateProject(id, updates);
  },

  async deleteProject(id: string): Promise<{ success: boolean }> {
    return api.deleteProject(id);
  },

  async getProjectTasks(projectId: string): Promise<Task[]> {
    return api.getTasks({ projectId });
  },
};
