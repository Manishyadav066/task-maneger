import { api } from "../../../services/api";

import type {
  AddMemberResponse,
  InviteMemberInput,
  UpdateMemberInput,
} from "../types/team.Types";

export const teamService = {
  async getMembers(workspaceId: string): Promise<any[]> {
    return api.getWorkspaceMembers(workspaceId);
  },

  async addMember(
    workspaceId: string,
    data: InviteMemberInput,
  ): Promise<AddMemberResponse> {
    return api.addWorkspaceMember(workspaceId, data);
  },

  async updateMember(
    workspaceId: string,
    userId: string,
    data: UpdateMemberInput,
  ) {
    return api.updateWorkspaceMember(
      workspaceId,
      userId,
      data,
    );
  },

  async removeMember(
    workspaceId: string,
    userId: string,
  ) {
    return api.removeWorkspaceMember(
      workspaceId,
      userId,
    );
  },
};