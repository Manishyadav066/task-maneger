import React from 'react';
import { Activity } from '../../../types';
import { Activity as ActivityIcon } from 'lucide-react';

interface ActivityListProps {
  activities: Activity[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold">
          <ActivityIcon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent Workspace Activity</h3>
          <p className="text-[11px] text-slate-400">Real-time team collaboration stream</p>
        </div>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 5).map((act) => (
          <div key={act.id} className="flex items-start gap-3 text-xs">
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-slate-200">
              <img
                src={act.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={act.userName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-800 leading-snug">
                <span className="font-semibold text-slate-900">{act.userName}</span>{' '}
                <span className="text-slate-500">{act.action.replace('_', ' ')}</span>{' '}
                <span className="font-medium text-indigo-600 truncate">{act.targetTitle}</span>
              </p>
              {act.detail && <p className="text-[11px] text-slate-400 mt-0.5">{act.detail}</p>}
            </div>
            <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
