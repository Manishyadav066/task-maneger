import { useState, useEffect } from 'react';
import { fileService } from '../services/fileService';
import { FileItem } from '../../../types';

export function useFiles(projectId?: string) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const data = await fileService.getFiles(projectId);
      setFiles(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (data: Partial<FileItem>): Promise<FileItem | null> => {
    try {
      const uploaded = await fileService.uploadFile(data);
      setFiles((prev) => [uploaded, ...prev]);
      return uploaded;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      return null;
    }
  };

  const deleteFile = async (id: string): Promise<boolean> => {
    try {
      await fileService.deleteFile(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete file');
      return false;
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [projectId]);

  return { files, loading, error, refresh: fetchFiles, uploadFile, deleteFile };
}
