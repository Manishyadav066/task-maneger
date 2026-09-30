import React from 'react';
import { useProjectDetails } from '../../../../modules/projects/hooks/useProjectDetails';
import { ProjectDetailsUI } from '../../../../modules/projects/ui/ProjectDetailsUI';
import { Project, Task, User } from '../../../../types';
import { Loader2 } from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
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

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  projects,
  users,
  onBack,
  onUpdateProject,
  onDeleteProject,
  onSelectTask,
  onQuickAddTask,
  onMoveTaskStatus,
  onOpenCreateTask,
}) => {
  const { project, tasks, loading, error } = useProjectDetails(projectId);

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center">
        {error || 'Project not found'}
      </div>
    );
  }

  return (
    <ProjectDetailsUI
      project={project}
      tasks={tasks}
      projects={projects}
      users={users}
      onBack={onBack}
      onUpdateProject={onUpdateProject}
      onDeleteProject={onDeleteProject}
      onSelectTask={onSelectTask}
      onQuickAddTask={onQuickAddTask}
      onMoveTaskStatus={onMoveTaskStatus}
      onOpenCreateTask={onOpenCreateTask}
    />
  );
};

export default ProjectDetailPage;
