import { useState, useEffect } from 'react';
import { analyticsService } from '../services/analyticsService';
import { AnalyticsMetrics } from '../types/analytics.types';

export function useAnalytics(workspaceId?: string) {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getMetrics(workspaceId);
      setMetrics(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [workspaceId]);

  return { metrics, loading, error, refresh: fetchMetrics };
}
