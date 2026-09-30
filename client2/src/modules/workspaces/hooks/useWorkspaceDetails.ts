
import { useState, useEffect } from "react";
import { workspaceService } from "../services/workspaceService";
import { Workspace, User } from "../../../types";

export function useWorkspaceDetails(workspaceId?: string) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = async () => {
    if (!workspaceId) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const [ws, mems] = await Promise.all([
        workspaceService.getWorkspace(workspaceId),
        workspaceService.getMembers(workspaceId),
      ]);

      setWorkspace(ws);
      setMembers(mems);
      setError(null);
    } catch (err: any) {
      console.error("FETCH WORKSPACE DETAILS ERROR:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load workspace details",
      );
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (input: any): Promise<User> => {
    if (!workspaceId) {
      throw new Error("Workspace ID is missing");
    }

    try {
      setError(null);

      const created = await workspaceService.addMember(
        workspaceId,
        input,
      );

      if (!created) {
        throw new Error("Member was not created");
      }

      // Duplicate protection on frontend as well
      const normalizedEmail = input.email
        ?.trim()
        .toLowerCase();

      const alreadyExists = members.some(
        (member) =>
          member.email?.trim().toLowerCase() === normalizedEmail,
      );

      if (alreadyExists) {
        throw new Error(
          "This email is already a member of this workspace.",
        );
      }

      setMembers((prev) => [...prev, created]);

      return created;
    } catch (err: any) {
      console.error("ADD MEMBER ERROR:", err);

      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to add member";

      setError(message);

      // IMPORTANT:
      // Error ko modal tak wapas bhejna hai.
      // null return nahi karna.
      throw new Error(message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [workspaceId]);

  return {
    workspace,
    members,
    loading,
    error,
    refresh: fetchDetails,
    addMember,
  };
}

