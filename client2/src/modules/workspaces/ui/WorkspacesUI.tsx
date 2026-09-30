
import React, { useState } from "react";
import { Workspace } from "../../../types";
import { WorkspaceCard } from "../components/WorkspaceCard";
import { WorkspaceForm } from "../components/WorkspaceForm";
import { WorkspaceFormInput } from "../types/workspace.types";
import { Building2, Plus, Loader2 } from "lucide-react";

interface WorkspacesUIProps {
  workspaces: Workspace[];
  activeWorkspaceId?: string;
  loading: boolean;

  onSelectWorkspace: (workspace: Workspace) => void;

  onCreateWorkspace: (
    input: WorkspaceFormInput
  ) => Promise<Workspace | null>;

  // Added: used to open workspace details
  onViewDetails?: (workspace: Workspace) => void;
}

export const WorkspacesUI: React.FC<WorkspacesUIProps> = ({
  workspaces,
  activeWorkspaceId,
  loading,
  onSelectWorkspace,
  onCreateWorkspace,
  onViewDetails,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreate = async (input: WorkspaceFormInput) => {
    setCreating(true);

    const created = await onCreateWorkspace(input);

    setCreating(false);

    if (created) {
      setIsCreateOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Workspaces
          </h2>

          <p className="text-xs text-slate-500">
            Manage your organization workspaces and team boundaries
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Workspace</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workspaces.map((ws) => (
            <WorkspaceCard
              key={ws.id}
              workspace={ws}
              isActive={ws.id === activeWorkspaceId}
              onSelect={onSelectWorkspace}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}

      {isCreateOpen && (
        <WorkspaceForm
          onSubmit={handleCreate}
          onClose={() => setIsCreateOpen(false)}
          loading={creating}
        />
      )}
    </div>
  );
};
