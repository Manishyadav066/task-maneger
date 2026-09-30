import React from 'react';
import { Project } from '../../../types';
import { ArrowLeft, Calendar, CheckSquare, Pencil, Trash2 } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onBack,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {project.category}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{project.name}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1.5 border border-rose-200 hover:bg-rose-50 rounded-xl text-xs font-semibold text-rose-600 flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-600 mt-3 leading-relaxed max-w-2xl">
        {project.description || 'No description provided.'}
      </p>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Due {project.dueDate}</span>
        </span>
        <span className="flex items-center gap-1.5">
          <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
          <span>
            {(project.completedTasks ?? project.completedTasksCount ?? 0)} of {(project.totalTasks ?? project.tasksCount ?? 0)} tasks completed
          </span>
        </span>
      </div>
    </div>
  );
};
