
import React from "react";

import { useTeam } from "../hooks/useTeam";
import { TeamView } from "../ui/teamView";

interface TeamContainerProps {
  workspaceId?: string;

  onViewMemberTasks: (
    memberId: string
  ) => void;
}

export const TeamContainer: React.FC<
  TeamContainerProps
> = ({
  workspaceId,
  onViewMemberTasks,
}) => {
  const {
    members,
    loading,
    error,
    addMember,
    refresh,
  } = useTeam(workspaceId);

  const handleInviteMember = async (
    data: Partial<any>
  ) => {
    if (!workspaceId) {
      alert(
        "Please select a workspace first."
      );
      return;
    }

    try {
      const payload = {
        name: data.name || "",
        email: data.email || "",
        role:
          data.role === "admin"
            ? "admin"
            : "member",
        department:
          data.department ||
          "Engineering",
      };

      const response =
        await addMember(payload);

      console.log(
        "MEMBER ADDED:",
        response
      );

      if (response?.isNewUser) {
        alert(
          `Member added successfully.\n\nTemporary Password: ${response.temporaryPassword}`
        );
      } else {
        alert(
          "Member added successfully."
        );
      }
    } catch (err: any) {
      console.error(
        "INVITE MEMBER ERROR:",
        err
      );

      alert(
        err?.message ||
          "Failed to add team member"
      );
    }
  };

  if (!workspaceId) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">
          No workspace selected
        </p>

        <p className="text-xs text-slate-400 mt-1">
          Please select a workspace to view
          team members.
        </p>
      </div>
    );
  }

  if (
    loading &&
    members.length === 0
  ) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
        <p className="text-sm font-semibold text-slate-700">
          Loading team members...
        </p>
      </div>
    );
  }

  if (
    error &&
    members.length === 0
  ) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
        <p className="text-sm font-semibold text-red-700">
          Failed to load team members
        </p>

        <p className="text-xs text-red-500 mt-1">
          {error}
        </p>

        <button
          type="button"
          onClick={refresh}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <TeamView
      members={members as any}
      onInviteMember={
        handleInviteMember
      }
      onViewMemberTasks={
        onViewMemberTasks
      }
    />
  );
};

