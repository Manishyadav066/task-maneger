import { useCallback, useEffect, useState } from "react";
import { teamService } from "../services/teamService";

import type {
  InviteMemberInput,
  UpdateMemberInput,
} from "../types/team.Types";

export function useTeam(workspaceId?: string) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) {
      setMembers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await teamService.getMembers(workspaceId);

      setMembers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("FETCH TEAM MEMBERS ERROR:", err);

      setError(
        err?.message || "Failed to load team members"
      );

      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  const addMember = async (
    data: InviteMemberInput
  ) => {
    if (!workspaceId) {
      throw new Error("Workspace ID is required");
    }

    try {
      setError(null);

      const response =
        await teamService.addMember(
          workspaceId,
          data
        );

      await fetchMembers();

      return response;
    } catch (err: any) {
      console.error("ADD TEAM MEMBER ERROR:", err);

      setError(
        err?.message || "Failed to add team member"
      );

      throw err;
    }
  };

  const updateMember = async (
    userId: string,
    data: UpdateMemberInput
  ) => {
    if (!workspaceId) {
      throw new Error("Workspace ID is required");
    }

    try {
      setError(null);

      const response =
        await teamService.updateMember(
          workspaceId,
          userId,
          data
        );

      await fetchMembers();

      return response;
    } catch (err: any) {
      console.error(
        "UPDATE TEAM MEMBER ERROR:",
        err
      );

      setError(
        err?.message || "Failed to update team member"
      );

      throw err;
    }
  };

  const removeMember = async (
    userId: string
  ) => {
    if (!workspaceId) {
      throw new Error("Workspace ID is required");
    }

    try {
      setError(null);

      const response =
        await teamService.removeMember(
          workspaceId,
          userId
        );

      setMembers((prev) =>
        prev.filter((member: any) => {
          const user =
            member?.user || member;

          const id =
            user?.id ||
            user?._id ||
            member?.user?._id;

          return id !== userId;
        })
      );

      return response;
    } catch (err: any) {
      console.error(
        "REMOVE TEAM MEMBER ERROR:",
        err
      );

      setError(
        err?.message || "Failed to remove team member"
      );

      throw err;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,

    refresh: fetchMembers,

    addMember,
    updateMember,
    removeMember,
  };
}