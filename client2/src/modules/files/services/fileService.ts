import { api } from '../../../services/api';
import { FileItem } from '../../../types';

export const fileService = {
  async getFiles(projectId?: string): Promise<FileItem[]> {
    return api.getFiles(projectId);
  },

  async uploadFile(data: Partial<FileItem>): Promise<FileItem> {
    return api.uploadFile(data);
  },

  async deleteFile(id: string): Promise<{ success: boolean }> {
    return api.deleteFile(id);
  },
};
