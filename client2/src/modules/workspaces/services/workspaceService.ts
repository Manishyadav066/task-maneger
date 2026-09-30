import { api } from "../../../services/api";

import {
  Workspace,
  User,
} from "../../../types";

import {
  WorkspaceFormInput,
  AddMemberInput,
} from "../types/workspace.types";

export const workspaceService = {
  // =====================================================
  // WORKSPACES
  // =====================================================

  async getWorkspaces(): Promise<Workspace[]> {
    return api.getWorkspaces();
  },

  async getWorkspace(
    id: string
  ): Promise<Workspace> {
    return api.getWorkspace(id);
  },

  async createWorkspace(
    data: WorkspaceFormInput
  ): Promise<Workspace> {
    return api.createWorkspace(data);
  },

  async updateWorkspace(
    id: string,
    data: Partial<Workspace>
  ): Promise<Workspace> {
    return api.updateWorkspace(id, data);
  },

  async deleteWorkspace(
    id: string
  ): Promise<{ success: boolean }> {
    return api.deleteWorkspace(id);
  },

  // =====================================================
  // GET MEMBERS
  // =====================================================

  async getMembers(
    workspaceId: string
  ): Promise<User[]> {
    try {
      return await api.getMembers(workspaceId);
    } catch (error: any) {
      console.error(
        "WORKSPACE SERVICE - GET MEMBERS ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to load workspace members.";

      throw new Error(message);
    }
  },

  // =====================================================
  // ADD MEMBER
  // =====================================================

  async addMember(
    workspaceId: string,
    member: AddMemberInput
  ): Promise<User> {
    const normalizedEmail =
      member.email.trim().toLowerCase();

    const userRole: "admin" | "member" =
      member.role === "admin"
        ? "admin"
        : "member";

    try {
      const result = await api.addMember(
        workspaceId,
        {
          ...member,
          email: normalizedEmail,
          role: userRole,
        }
      );

      return result;
    } catch (error: any) {
      console.error(
        "WORKSPACE SERVICE - ADD MEMBER ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add workspace member.";

      throw new Error(message);
    }
  },

  // =====================================================
  // UPDATE MEMBER
  // =====================================================

  async updateMember(
    workspaceId: string,
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "member";
    }
  ): Promise<User> {
    console.log(
      "✏️ SERVICE - UPDATE MEMBER"
    );

    console.log(
      "🏢 WORKSPACE:",
      workspaceId
    );

    console.log(
      "👤 USER:",
      userId
    );

    console.log(
      "📦 DATA:",
      data
    );

    if (!workspaceId) {
      throw new Error("Workspace ID is required.");
    }

    if (!userId) {
      throw new Error("Member ID is required.");
    }

    try {
      const payload = {
        ...data,
        ...(data.name !== undefined && {
          name: data.name.trim(),
        }),
        ...(data.email !== undefined && {
          email: data.email.trim().toLowerCase(),
        }),
        ...(data.role !== undefined && {
          role:
            data.role === "admin"
              ? "admin"
              : "member",
        }),
      };

      const result =
        await api.updateWorkspaceMember(
          workspaceId,
          userId,
          payload
        );

      console.log(
        "📥 SERVICE - UPDATED MEMBER:",
        result
      );

      return result;
    } catch (error: any) {
      console.error(
        "WORKSPACE SERVICE - UPDATE MEMBER ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update workspace member.";

      throw new Error(message);
    }
  },

  // =====================================================
  // DELETE MEMBER
  // =====================================================

  async deleteMember(
    workspaceId: string,
    userId: string
  ): Promise<{ success: boolean }> {
    console.log(
      "🗑️ SERVICE - DELETE MEMBER"
    );

    console.log(
      "🏢 WORKSPACE:",
      workspaceId
    );

    console.log(
      "👤 USER:",
      userId
    );

    if (!workspaceId) {
      throw new Error("Workspace ID is required.");
    }

    if (!userId) {
      throw new Error("Member ID is required.");
    }

    try {
      const result =
        await api.deleteWorkspaceMember(
          workspaceId,
          userId
        );

      console.log(
        "📥 SERVICE - DELETE RESPONSE:",
        result
      );

      return result;
    } catch (error: any) {
      console.error(
        "WORKSPACE SERVICE - DELETE MEMBER ERROR:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to remove workspace member.";

      throw new Error(message);
    }
  },
};