import React from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { AnalyticsUI } from '../ui/AnalyticsUI';

interface AnalyticsContainerProps {
  workspaceId?: string;
}

export const AnalyticsContainer: React.FC<AnalyticsContainerProps> = ({ workspaceId }) => {
  const { metrics, loading } = useAnalytics(workspaceId);

  return <AnalyticsUI metrics={metrics} loading={loading} />;
};
