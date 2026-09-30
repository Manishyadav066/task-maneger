import { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { DashboardData } from '../types/dashboard.types';

export function useDashboard(workspaceId?: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await dashboardService.getDashboardData(workspaceId);
      setData(result);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [workspaceId]);

  return { data, loading, error, refresh };
}
