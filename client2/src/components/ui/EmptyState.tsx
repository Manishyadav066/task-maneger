import React from 'react';
import { FolderOpen } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50">
      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h4 className="text-sm font-bold text-slate-800 mb-1">{title}</h4>
      {description && <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed">{description}</p>}
      {action}
    </div>
  );
};
