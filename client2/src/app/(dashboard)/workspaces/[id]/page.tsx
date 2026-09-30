import React from 'react';
import { useWorkspaceDetails } from '../../../../modules/workspaces/hooks/useWorkspaceDetails';
import { WorkspaceDetailsUI } from '../../../../modules/workspaces/ui/WorkspaceDetailsUI';
import { Loader2 } from 'lucide-react';

interface WorkspaceDetailPageProps {
  workspaceId: string;
  onBack: () => void;
}

export const WorkspaceDetailPage: React.FC<WorkspaceDetailPageProps> = ({
  workspaceId,
  onBack,
}) => {
  const { workspace, members, loading, error, addMember } = useWorkspaceDetails(workspaceId);

  if (loading) {
    return (
      <div className="p-12 flex justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center">
        {error || 'Workspace not found'}
      </div>
    );
  }

  return (
    <WorkspaceDetailsUI
      workspace={workspace}
      members={members}
      onBack={onBack}
      onAddMember={addMember}
    />
  );
};

export default WorkspaceDetailPage;
