import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { Task } from '../../../types';
import { TaskCreateInput } from '../types/task.types';

export function useTasks(workspaceId?: string, projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks({ workspaceId, projectId });
      setTasks(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (data: TaskCreateInput): Promise<Task | null> => {
    try {
      const created = await taskService.createTask(data);
      setTasks((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message || 'Failed to create task');
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<Task | null> => {
    try {
      const updated = await taskService.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    } catch (err: any) {
      setError(err.message || 'Failed to update task');
      return null;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      await taskService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete task');
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [workspaceId, projectId]);

  return {
    tasks,
    loading,
    error,
    refresh: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    setTasks,
  };
}
