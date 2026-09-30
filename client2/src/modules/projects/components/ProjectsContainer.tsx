import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useProjectDetails } from '../hooks/useProjectDetails';
import { ProjectsUI } from '../ui/ProjectsUI';
import { ProjectDetailsUI } from '../ui/ProjectDetailsUI';
import { Project, Task, User } from '../../../types';

interface ProjectsContainerProps {
  workspaceId?: string;
  users?: User[];
  onSelectTask: (task: Task) => void;
  onQuickAddTask?: (status: any, title: string) => void;
  onMoveTaskStatus?: (taskId: string, newStatus: any) => void;
  onOpenCreateTask?: () => void;
}

export const ProjectsContainer: React.FC<ProjectsContainerProps> = ({
  workspaceId,
  users = [],
  onSelectTask,
  onQuickAddTask,
  onMoveTaskStatus,
  onOpenCreateTask,
}) => {
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects(workspaceId);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const { project, tasks } = useProjectDetails(selectedProjectId || undefined);

  if (selectedProjectId && project) {
    return (
      <ProjectDetailsUI
        project={project}
        tasks={tasks}
        projects={projects}
        users={users}
        onBack={() => setSelectedProjectId(null)}
        onUpdateProject={updateProject}
        onDeleteProject={deleteProject}
        onSelectTask={onSelectTask}
        onQuickAddTask={onQuickAddTask}
        onMoveTaskStatus={onMoveTaskStatus}
        onOpenCreateTask={onOpenCreateTask}
      />
    );
  }

  return (
    <ProjectsUI
      projects={projects}
      loading={loading}
      onSelectProject={(p) => setSelectedProjectId(p.id)}
      onCreateProject={createProject}
      onUpdateProject={updateProject}
      onDeleteProject={deleteProject}
    />
  );
};
