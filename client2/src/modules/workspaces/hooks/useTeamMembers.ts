
import { useState, useEffect } from "react";
import { workspaceService } from "../services/workspaceService";
import { User } from "../../../types";
import { AddMemberInput } from "../types/workspace.types";

interface UpdateMemberInput {
  name?: string;
  email?: string;
  role?: "admin" | "member";
}

export function useTeamMembers(workspaceId?: string) {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =====================================================
  // GET MEMBERS
  // =====================================================

  const fetchMembers = async () => {
    if (!workspaceId) {
      console.warn("⚠️ WORKSPACE ID IS MISSING");

      setMembers([]);
      setLoading(false);

      return;
    }

    console.log("🔄 FETCHING MEMBERS:", workspaceId);

    setLoading(true);

    try {
      const data = await workspaceService.getMembers(workspaceId);

      console.log("📥 MEMBERS RECEIVED:", data);

      setMembers(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error("❌ FETCH MEMBERS ERROR:", err);

      setError(
        err?.message || "Failed to load team members"
      );

      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // CREATE / ADD MEMBER
  // =====================================================

  const addMember = async (
    input: AddMemberInput
  ): Promise<User | null> => {
    console.log("🚀 ADD MEMBER CALLED");

    if (!workspaceId) {
      setError("Workspace ID is missing");
      return null;
    }

    try {
      const created = await workspaceService.addMember(
        workspaceId,
        input
      );

      console.log("📥 CREATED MEMBER:", created);

      if (!created) {
        throw new Error("Member was not created");
      }

      setMembers((previous) => [
        ...previous,
        created,
      ]);

      setError(null);

      return created;
    } catch (err: any) {
      console.error("❌ ADD MEMBER ERROR:", err);

      setError(
        err?.message || "Failed to add member"
      );

      return null;
    }
  };

  // =====================================================
  // UPDATE MEMBER
  // =====================================================

  const updateMember = async (
    userId: string,
    data: UpdateMemberInput
  ): Promise<User | null> => {
    console.log("🚀 UPDATE MEMBER CALLED");
    console.log("🏢 WORKSPACE:", workspaceId);
    console.log("👤 USER:", userId);
    console.log("📦 DATA:", data);

    if (!workspaceId) {
      setError("Workspace ID is missing");
      return null;
    }

    if (!userId) {
      setError("Member ID is missing");
      return null;
    }

    try {
      const updated =
        await workspaceService.updateMember(
          workspaceId,
          userId,
          data
        );

      console.log("📥 UPDATED MEMBER:", updated);

      if (!updated) {
        throw new Error("Member update failed");
      }

      // Update frontend state immediately
      setMembers((previous) =>
        previous.map((member) => {
          const currentId =
            member.id ||
            (member as any)._id;

          if (currentId === userId) {
            return {
              ...member,
              ...updated,
            };
          }

          return member;
        })
      );

      setError(null);

      console.log(
        "✅ MEMBER UPDATED IN STATE"
      );

      return updated;
    } catch (err: any) {
      console.error(
        "❌ UPDATE MEMBER ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to update member"
      );

      return null;
    }
  };

  // =====================================================
  // DELETE / REMOVE MEMBER
  // =====================================================

  const deleteMember = async (
    userId: string
  ): Promise<boolean> => {
    console.log("🚀 DELETE MEMBER CALLED");
    console.log("🏢 WORKSPACE:", workspaceId);
    console.log("👤 USER:", userId);

    if (!workspaceId) {
      setError("Workspace ID is missing");
      return false;
    }

    if (!userId) {
      setError("Member ID is missing");
      return false;
    }

    try {
      const result =
        await workspaceService.deleteMember(
          workspaceId,
          userId
        );

      console.log(
        "📥 DELETE RESPONSE:",
        result
      );

      if (!result?.success) {
        throw new Error(
          "Member deletion failed"
        );
      }

      // Remove member from frontend state
      setMembers((previous) =>
        previous.filter((member) => {
          const currentId =
            member.id ||
            (member as any)._id;

          return currentId !== userId;
        })
      );

      setError(null);

      console.log(
        "✅ MEMBER REMOVED FROM STATE"
      );

      return true;
    } catch (err: any) {
      console.error(
        "❌ DELETE MEMBER ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete member"
      );

      return false;
    }
  };

  // =====================================================
  // LOAD MEMBERS
  // =====================================================

  useEffect(() => {
    fetchMembers();
  }, [workspaceId]);

  // =====================================================
  // RETURN
  // =====================================================

  return {
    members,
    loading,
    error,

    refresh: fetchMembers,

    addMember,
    updateMember,
    deleteMember,
  };
}

