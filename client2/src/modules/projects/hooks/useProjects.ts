import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project } from '../../../types';
import { ProjectFormData } from '../types/project.types';

export function useProjects(workspaceId?: string) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await projectService.getProjects(workspaceId);
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (data: ProjectFormData): Promise<Project | null> => {
    try {
      const created = await projectService.createProject(data);
      setProjects((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    try {
      const updated = await projectService.updateProject(id, updates);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update project');
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      await projectService.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete project');
      return false;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);

  return {
    projects,
    loading,
    error,
    refresh: fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}
