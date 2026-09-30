
import React, { useState } from "react";

import { useWorkspaces } from "../hooks/useWorkspaces";
import { useTeamMembers } from "../hooks/useTeamMembers";

import { WorkspacesUI } from "../ui/WorkspacesUI";
import { WorkspaceDetailsUI } from "../ui/WorkspaceDetailsUI";

import { Workspace } from "../types/workspace.types";
import { Project } from "../../../types";

export interface WorkspacesContainerProps {
  allProjects: Project[];
  onSelectProject?: (project: Project) => void;
}

export const WorkspacesContainer: React.FC<
  WorkspacesContainerProps
> = ({
  allProjects,
  onSelectProject,
}) => {
  // =====================================================
  // WORKSPACES
  // =====================================================

  const {
    workspaces,
    currentWorkspace,
    loading,
    selectWorkspace,
    createWorkspace,
  } = useWorkspaces();

  // =====================================================
  // SELECTED WORKSPACE FOR DETAILS
  // =====================================================

  const [
    selectedWorkspaceForDetails,
    setSelectedWorkspaceForDetails,
  ] = useState<Workspace | null>(null);

  // =====================================================
  // ACTIVE WORKSPACE ID
  // =====================================================

  const activeWorkspaceId =
    selectedWorkspaceForDetails?.id ||
    currentWorkspace?.id;

  // =====================================================
  // TEAM MEMBERS
  // =====================================================

  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    loading: membersLoading,
    error: membersError,
    refresh: refreshMembers,
  } = useTeamMembers(activeWorkspaceId);

  // =====================================================
  // OPEN WORKSPACE DETAILS
  // =====================================================

  const handleViewDetails = (
    workspace: Workspace
  ) => {
    console.log(
      "📂 OPENING WORKSPACE:",
      workspace
    );

    console.log(
      "🏢 WORKSPACE ID:",
      workspace.id
    );

    setSelectedWorkspaceForDetails(workspace);
  };

  // =====================================================
  // BACK TO WORKSPACE LIST
  // =====================================================

  const handleBack = () => {
    console.log(
      "⬅️ BACK TO WORKSPACE LIST"
    );

    setSelectedWorkspaceForDetails(null);
  };

  // =====================================================
  // SELECT WORKSPACE
  // =====================================================

  const handleSelectWorkspace = (
    workspace: Workspace
  ) => {
    console.log(
      "🎯 WORKSPACE SELECTED:",
      workspace
    );

    selectWorkspace(workspace);
  };

  // =====================================================
  // ADD MEMBER
  // =====================================================

  const handleAddMember = async (
    input: Parameters<typeof addMember>[0]
  ) => {
    console.log(
      "👤 CONTAINER - ADD MEMBER:"
    );

    console.log(
      "🏢 WORKSPACE ID:",
      activeWorkspaceId
    );

    console.log(
      "📤 MEMBER DATA:",
      input
    );

    const result = await addMember(input);

    console.log(
      "📥 CONTAINER - ADD MEMBER RESULT:",
      result
    );

    if (result) {
      console.log(
        "✅ MEMBER ADDED SUCCESSFULLY"
      );

      // Backend se latest members dobara load
      await refreshMembers();
    } else {
      console.error(
        "❌ MEMBER WAS NOT ADDED"
      );
    }

    return result;
  };

  // =====================================================
  // UPDATE MEMBER
  // =====================================================

  const handleUpdateMember = async (
    memberId: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "member";
    }
  ) => {
    console.log(
      "✏️ CONTAINER - UPDATE MEMBER"
    );

    console.log(
      "🏢 WORKSPACE ID:",
      activeWorkspaceId
    );

    console.log(
      "👤 MEMBER ID:",
      memberId
    );

    console.log(
      "📦 UPDATE DATA:",
      data
    );

    const result = await updateMember(
      memberId,
      data
    );

    console.log(
      "📥 CONTAINER - UPDATE RESULT:",
      result
    );

    if (result) {
      console.log(
        "✅ MEMBER UPDATED SUCCESSFULLY"
      );

      // Backend se latest members dobara load
      await refreshMembers();
    } else {
      console.error(
        "❌ MEMBER WAS NOT UPDATED"
      );
    }

    return result;
  };

  // =====================================================
  // DELETE MEMBER
  // =====================================================

  const handleDeleteMember = async (
    memberId: string
  ) => {
    console.log(
      "🗑️ CONTAINER - DELETE MEMBER"
    );

    console.log(
      "🏢 WORKSPACE ID:",
      activeWorkspaceId
    );

    console.log(
      "👤 MEMBER ID:",
      memberId
    );

    const result = await deleteMember(
      memberId
    );

    console.log(
      "📥 CONTAINER - DELETE RESULT:",
      result
    );

    if (result) {
      console.log(
        "✅ MEMBER DELETED SUCCESSFULLY"
      );

      // Backend se latest members dobara load
      await refreshMembers();
    } else {
      console.error(
        "❌ MEMBER WAS NOT DELETED"
      );
    }

    return result;
  };

  // =====================================================
  // WORKSPACE DETAILS SCREEN
  // =====================================================

  if (selectedWorkspaceForDetails) {
    return (
      <WorkspaceDetailsUI
        workspace={
          selectedWorkspaceForDetails
        }
        members={members}
        projects={allProjects}
        onBack={handleBack}
        onAddMember={handleAddMember}
        onUpdateMember={
          handleUpdateMember
        }
        onDeleteMember={
          handleDeleteMember
        }
        onSelectProject={
          onSelectProject
        }
      />
    );
  }

  // =====================================================
  // WORKSPACE LIST SCREEN
  // =====================================================

  return (
    <WorkspacesUI
      workspaces={workspaces}
      activeWorkspaceId={
        currentWorkspace?.id
      }
      loading={loading}
      onSelectWorkspace={
        handleSelectWorkspace
      }
      onCreateWorkspace={
        createWorkspace
      }
      onViewDetails={
        handleViewDetails
      }
    />
  );
};
