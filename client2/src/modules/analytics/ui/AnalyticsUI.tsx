import React from 'react';
import { AnalyticsMetrics } from '../types/analytics.types';
import { AnalyticsCards } from '../components/AnalyticsCards';
import { Charts } from '../components/Charts';
import { Loader2 } from 'lucide-react';

interface AnalyticsUIProps {
  metrics: AnalyticsMetrics | null;
  loading: boolean;
}

export const AnalyticsUI: React.FC<AnalyticsUIProps> = ({ metrics, loading }) => {
  if (loading || !metrics) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Analytics & Insights</h2>
        <p className="text-xs text-slate-500">
          Real-time metrics on team throughput, cycle times, and roadmap velocity
        </p>
      </div>

      <AnalyticsCards metrics={metrics} />
      <Charts />
    </div>
  );
};
