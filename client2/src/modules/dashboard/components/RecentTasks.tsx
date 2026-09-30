import React from 'react';
import { Task, Project } from '../../../types';
import { CheckSquare, Calendar, ChevronRight } from 'lucide-react';

interface RecentTasksProps {
  tasks: Task[];
  projects?: Project[];
  onSelectTask: (task: Task) => void;
  onViewAllTasks?: () => void;
}

export const RecentTasks: React.FC<RecentTasksProps> = ({
  tasks,
  projects = [],
  onSelectTask,
  onViewAllTasks,
}) => {
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'in_progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'review':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Tasks</h3>
            <p className="text-[11px] text-slate-400">Click any task to view or edit details</p>
          </div>
        </div>
        {onViewAllTasks && (
          <button
            onClick={onViewAllTasks}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">No recent tasks found.</div>
        ) : (
          tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            return (
              <div
                key={task.id}
                id={`recent-task-${task.id}`}
                onClick={() => onSelectTask(task)}
                className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-slate-50/70 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${getPriorityStyle(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {project && (
                      <span className="text-[11px] font-medium text-slate-500 truncate">
                        {project.name}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {task.title}
                  </h4>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadge(
                      task.status
                    )}`}
                  >
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 hidden sm:flex">
                    <Calendar className="w-3 h-3" />
                    {task.dueDate}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
