import React from 'react';
import { Task, Project } from '../../../types';
import { Calendar, CheckSquare, Pencil, Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onSelect: (task: Task) => void;
  onQuickMove?: (taskId: string, status: any) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  project,
  onSelect,
}) => {
  const subtasksList = task.subtasks || [];
  const completedSubs = subtasksList.filter((s) => s && s.completed).length;
  const tagsList = task.tags || [];

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

  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        onSelect(task);
      }}
      className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group select-none active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tagsList.slice(0, 2).map((t, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
            >
              {t}
            </span>
          ))}
        </div>
        <span
          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${getPriorityStyle(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
        {task.title}
      </h4>

      {project && (
        <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-slate-400">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          <span className="truncate">{project.name}</span>
        </div>
      )}

      {subtasksList.length > 0 && (
        <div className="mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3 h-3 text-slate-400" />
              <span>Subtasks</span>
            </span>
            <span className="font-semibold">
              {completedSubs}/{subtasksList.length}
            </span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(completedSubs / subtasksList.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] text-slate-400">
          <Calendar className="w-3 h-3" />
          <span>{task.dueDate}</span>
        </span>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-indigo-600 text-xs font-semibold">
          <Pencil className="w-3 h-3" />
          <span>Edit</span>
        </div>
      </div>
    </div>
  );
};
