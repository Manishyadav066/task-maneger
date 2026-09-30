import React from 'react';
import { Project, TaskPriority, TaskStatus } from '../../../types';
import { Search, Filter, FolderKanban } from 'lucide-react';

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedProjectId: string;
  onProjectChange: (pid: string) => void;
  projects: Project[];
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedProjectId,
  onProjectChange,
  projects,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter tasks by title, tag, or assignee..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <select
            value={selectedProjectId}
            onChange={(e) => onProjectChange(e.target.value)}
            className="pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold focus:outline-hidden focus:border-indigo-500"
          >
            <option value="all">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
