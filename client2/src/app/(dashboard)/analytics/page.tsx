import React from 'react';
import { AnalyticsContainer } from '../../../modules/analytics/components/AnalyticsContainer';

interface AnalyticsPageProps {
  workspaceId?: string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ workspaceId }) => {
  return <AnalyticsContainer workspaceId={workspaceId} />;
};

export default AnalyticsPage;
