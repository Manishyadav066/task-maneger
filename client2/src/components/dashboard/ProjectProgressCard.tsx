import React from 'react';
import { Calendar, CheckCircle2, Sparkles, ArrowRight, Pencil, Trash2 } from 'lucide-react';
import { Project } from '../../types';

interface ProjectProgressCardProps {
  project: Project;
  onOpenTasks: (projectId: string) => void;
  onOpenAISummary: (projectId: string) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectProgressCard: React.FC<ProjectProgressCardProps> = ({
  project,
  onOpenTasks,
  onOpenAISummary,
  onEditProject,
  onDeleteProject,
}) => {
  const isComplete = project.progress === 100;

  return (
    <div
      id={`project-card-${project.id}`}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Category badge & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
            {project.category}
          </span>
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-slate-100 mr-1"
              style={{ backgroundColor: project.color || '#6366f1' }}
            />
            <button
              onClick={() => onOpenAISummary(project.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Generate AI Project Summary"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
            {onEditProject && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditProject(project);
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                title="Edit Project"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            {onDeleteProject && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`Are you sure you want to delete project "${project.name}"? All associated tasks will also be removed.`)) {
                    onDeleteProject(project.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Project Title & Description */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {project.name}
        </h3>
        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
          {project.description}
        </p>

        {/* Progress Bar & Calculated Stats */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-bold">{project.progress}%</span>
          </div>

          {/* Styled progress bar */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-indigo-500 to-violet-500'
              }`}
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {project.completedTasks} of {project.totalTasks} Tasks Done
              </span>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{project.dueDate}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Footer: Team Contributors & View Tasks Action */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        {/* Contributors Count */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>{project.members && project.members.length > 0 ? `${project.members.length} contributors` : '0 contributors'}</span>
        </div>

        {/* Go to Board */}
        <button
          onClick={() => onOpenTasks(project.id)}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:gap-1.5 transition-all cursor-pointer"
        >
          <span>Tasks Board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
