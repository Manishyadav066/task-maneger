import type { User } from "../../../types";

export interface TeamMember extends User {
  id: string;
  name: string;
  email: string;
  role: "owner" | "admin" | "member";
  department?: string;
  online?: boolean;
  status?: string;
  avatar?: string;
}

export interface InviteMemberInput {
  name: string;
  email: string;
  role: "admin" | "member";
  department?: string;
}

export interface UpdateMemberInput {
  name?: string;
  email?: string;
  role?: "admin" | "member";
}

export interface AddMemberResponse {
  message: string;
  member: TeamMember;
  isNewUser: boolean;
  temporaryPassword?: string;
}