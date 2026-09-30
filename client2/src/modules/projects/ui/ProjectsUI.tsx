import React, { useState } from 'react';
import { Project } from '../../../types';
import { ProjectCard } from '../components/ProjectCard';
import { ProjectForm } from '../components/ProjectForm';
import { ProjectFormData } from '../types/project.types';
import { FolderKanban, Plus, Loader2 } from 'lucide-react';

interface ProjectsUIProps {
  projects: Project[];
  loading: boolean;
  onSelectProject: (project: Project) => void;
  onCreateProject: (data: ProjectFormData) => Promise<Project | null>;
  onUpdateProject: (id: string, data: Partial<Project>) => Promise<Project | null>;
  onDeleteProject: (id: string) => Promise<boolean>;
}

export const ProjectsUI: React.FC<ProjectsUIProps> = ({
  projects,
  loading,
  onSelectProject,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (data: ProjectFormData) => {
    setSubmitting(true);
    if (editingProject) {
      await onUpdateProject(editingProject.id, data);
    } else {
      await onCreateProject(data);
    }
    setSubmitting(false);
    setIsFormOpen(false);
    setEditingProject(null);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm(`Are you sure you want to delete project "${project.name}"?`)) {
      await onDeleteProject(project.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Projects</h2>
          <p className="text-xs text-slate-500">
            Roadmaps, sprint trackers, and cross-functional deliverables
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null);
            setIsFormOpen(true);
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <FolderKanban className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No projects yet</h3>
          <p className="text-xs text-slate-400 mt-1">Create your first project to organize tasks</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onSelect={onSelectProject}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <ProjectForm
          initialProject={editingProject}
          onSubmit={handleSubmit}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProject(null);
          }}
          loading={submitting}
        />
      )}
    </div>
  );
};
