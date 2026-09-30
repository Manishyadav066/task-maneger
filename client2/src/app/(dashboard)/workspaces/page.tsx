import React from 'react';
import { WorkspacesContainer } from '../../../modules/workspaces/components/WorkspacesContainer';
import { Workspace } from '../../../types';

interface WorkspacesPageProps {
  currentWorkspaceId?: string;
  onSelectWorkspace?: (workspace: Workspace) => void;
}

export const WorkspacesPage: React.FC<WorkspacesPageProps> = ({
  currentWorkspaceId,
  onSelectWorkspace,
}) => {
  return (
    <WorkspacesContainer
      currentWorkspaceId={currentWorkspaceId}
      onSelectWorkspace={onSelectWorkspace}
    />
  );
};

export default WorkspacesPage;
