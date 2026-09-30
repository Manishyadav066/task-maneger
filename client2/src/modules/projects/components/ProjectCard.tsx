import React from 'react';
import { Project } from '../../../types';
import { Calendar, CheckSquare, Pencil, Trash2, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onEdit,
  onDelete,
}) => {
  const total = project.totalTasks ?? project.tasksCount ?? 0;
  const completed = project.completedTasks ?? project.completedTasksCount ?? 0;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all p-5 flex flex-col justify-between cursor-pointer group"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
            style={{ backgroundColor: `${project.color}15`, color: project.color }}
          >
            {project.category}
          </span>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {onEdit && (
              <button
                onClick={() => onEdit(project)}
                className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer"
                title="Edit Project"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(project)}
                className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1">
          {project.name}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {project.description || 'No description provided.'}
        </p>
      </div>

      <div>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span className="font-medium">Progress</span>
            <span className="font-bold text-slate-700">{percent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${percent}%`, backgroundColor: project.color }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>
                {completed}/{total}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{project.dueDate}</span>
            </span>
          </div>

          <div className="flex items-center gap-1 font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
