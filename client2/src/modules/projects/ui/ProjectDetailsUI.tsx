import React, { useState } from 'react';
import { Project, Task, User } from '../../../types';
import { ProjectHeader } from '../components/ProjectHeader';
import { ProjectForm } from '../components/ProjectForm';
import { KanbanBoard } from '../../../components/tasks/KanbanBoard';
import { ProjectFormData } from '../types/project.types';

interface ProjectDetailsUIProps {
  project: Project | null;
  tasks: Task[];
  projects: Project[];
  users: User[];
  onBack: () => void;
  onUpdateProject: (id: string, data: Partial<Project>) => Promise<Project | null>;
  onDeleteProject: (id: string) => Promise<boolean>;
  onSelectTask: (task: Task) => void;
  onQuickAddTask?: (status: any, title: string) => void;
  onMoveTaskStatus?: (taskId: string, newStatus: any) => void;
  onOpenCreateTask?: () => void;
}

export const ProjectDetailsUI: React.FC<ProjectDetailsUIProps> = ({
  project,
  tasks,
  projects,
  users,
  onBack,
  onUpdateProject,
  onDeleteProject,
  onSelectTask,
  onQuickAddTask = () => {},
  onMoveTaskStatus = () => {},
  onOpenCreateTask = () => {},
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!project) return null;

  const handleEditSubmit = async (data: ProjectFormData) => {
    setSaving(true);
    await onUpdateProject(project.id, data);
    setSaving(false);
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete project "${project.name}" and its associated tasks?`)) {
      await onDeleteProject(project.id);
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <ProjectHeader
        project={project}
        onBack={onBack}
        onEdit={() => setIsEditOpen(true)}
        onDelete={handleDelete}
      />

      {/* Kanban Board of this project's tasks */}
      <div className="pt-2">
        <KanbanBoard
          tasks={tasks}
          projects={projects}
          users={users}
          selectedProjectId={project.id}
          onSelectTask={onSelectTask}
          onQuickAddTask={onQuickAddTask}
          onMoveTaskStatus={onMoveTaskStatus}
          onOpenCreateModal={onOpenCreateTask}
        />
      </div>

      {isEditOpen && (
        <ProjectForm
          initialProject={project}
          onSubmit={handleEditSubmit}
          onClose={() => setIsEditOpen(false)}
          loading={saving}
        />
      )}
    </div>
  );
};
