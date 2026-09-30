import React from 'react';
import { Activity } from '../../types';
import {
  CheckCircle2,
  Clock,
  PlusCircle,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface RecentActivityWidgetProps {
  activities: Activity[];
  onViewAll?: () => void;
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({
  activities,
  onViewAll,
}) => {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'completed_task':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'created_task':
      case 'created_project':
        return <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />;
      case 'added_comment':
        return <MessageSquare className="w-3.5 h-3.5 text-sky-600" />;
      case 'added_member':
        return <UserPlus className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span>Recent Activity</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all
          </button>
        )}
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">No activity recorded yet</div>
        ) : (
          activities.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 border border-slate-200">
                {act.userName ? act.userName.charAt(0) : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-slate-900">{act.userName}</span>
                  <span className="text-[11px] text-slate-500">{act.action.replace('_', ' ')}</span>
                </div>
                <p className="text-xs font-medium text-indigo-600 truncate mt-0.5">
                  {act.targetTitle}
                </p>
                {act.detail && (
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{act.detail}</p>
                )}
                <span className="text-[10px] text-slate-400 mt-1 block">{act.timestamp}</span>
              </div>
              <div className="p-1 rounded-full bg-slate-50 shrink-0 border border-slate-100">
                {getActionIcon(act.action)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
