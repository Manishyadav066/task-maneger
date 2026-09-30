import { useState, useEffect } from 'react';
import { projectService } from '../services/projectService';
import { Project, Task } from '../../../types';

export function useProjectDetails(projectId?: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const [proj, taskList] = await Promise.all([
        projectService.getProject(projectId),
        projectService.getProjectTasks(projectId),
      ]);
      setProject(proj);
      setTasks(taskList);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [projectId]);

  return { project, tasks, loading, error, refresh: fetchDetails };
}
