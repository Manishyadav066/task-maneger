import { api } from '../../../services/api';
import { Task } from '../../../types';
import { TaskCreateInput } from '../types/task.types';

export const taskService = {
  async getTasks(params?: { workspaceId?: string; projectId?: string; status?: string }): Promise<Task[]> {
    return api.getTasks(params);
  },

  async getTask(id: string): Promise<Task> {
    return api.getTask(id);
  },

  async createTask(data: TaskCreateInput): Promise<Task> {
    return api.createTask(data);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    return api.updateTask(id, updates);
  },

  async deleteTask(id: string): Promise<{ success: boolean }> {
    return api.deleteTask(id);
  },

  async addSubtask(taskId: string, title: string) {
    return api.addSubtask(taskId, title);
  },

  async toggleSubtask(taskId: string, subtaskId: string, completed: boolean) {
    return api.toggleSubtask(taskId, subtaskId, completed);
  },
};
