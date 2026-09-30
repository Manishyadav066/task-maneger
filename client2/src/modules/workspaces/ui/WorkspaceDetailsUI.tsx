
import React, { useState } from "react";

import {
  Workspace,
  User,
  Project,
} from "../../../types";

import { TeamMembers } from "../components/TeamMembers";
import { AddMemberModal } from "../components/AddMemberModal";

import { AddMemberInput } from "../types/workspace.types";

import {
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

interface WorkspaceDetailsUIProps {
  workspace: Workspace | null;

  members: User[];

  onBack: () => void;

  // =====================================================
  // CREATE MEMBER
  // =====================================================

  onAddMember: (
    input: AddMemberInput
  ) => Promise<User | null>;

  // =====================================================
  // UPDATE MEMBER
  // =====================================================

  onUpdateMember: (
    memberId: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "member";
    }
  ) => Promise<User | null>;

  // =====================================================
  // DELETE MEMBER
  // =====================================================

  onDeleteMember: (
    memberId: string
  ) => Promise<boolean>;

  // =====================================================
  // PROJECTS
  // =====================================================

  projects?: Project[];

  onSelectProject?: (
    project: Project
  ) => void;
}

export const WorkspaceDetailsUI: React.FC<
  WorkspaceDetailsUIProps
> = ({
  workspace,
  members,
  onBack,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  projects,
  onSelectProject,
}) => {
  const [isAddMemberOpen, setIsAddMemberOpen] =
    useState(false);

  const [inviting, setInviting] =
    useState(false);

  // =====================================================
  // NO WORKSPACE
  // =====================================================

  if (!workspace) {
    return null;
  }

  // =====================================================
  // OPEN ADD MEMBER
  // =====================================================

  const handleOpenAddMember = () => {
    console.log(
      "➕ OPENING ADD MEMBER MODAL"
    );

    setIsAddMemberOpen(true);
  };

  // =====================================================
  // CLOSE ADD MEMBER
  // =====================================================

  const handleCloseAddMember = () => {
    if (inviting) {
      return;
    }

    setIsAddMemberOpen(false);
  };

  // =====================================================
  // CREATE MEMBER
  // =====================================================

  const handleAdd = async (
    input: AddMemberInput
  ): Promise<User | null> => {
    console.log(
      "📤 WORKSPACE DETAILS - ADD MEMBER"
    );

    console.log(
      "🏢 WORKSPACE:",
      workspace.id
    );

    console.log(
      "👤 MEMBER INPUT:",
      input
    );

    setInviting(true);

    try {
      const added =
        await onAddMember(input);

      console.log(
        "📥 ADD MEMBER RESULT:",
        added
      );

      if (added) {
        setIsAddMemberOpen(false);

        return added;
      }

      return null;
    } catch (error) {
      console.error(
        "❌ ADD MEMBER ERROR:",
        error
      );

      return null;
    } finally {
      setInviting(false);
    }
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
  ): Promise<User | null> => {
    console.log(
      "✏️ WORKSPACE DETAILS - UPDATE MEMBER"
    );

    console.log(
      "👤 MEMBER ID:",
      memberId
    );

    console.log(
      "📦 DATA:",
      data
    );

    try {
      const updated =
        await onUpdateMember(
          memberId,
          data
        );

      console.log(
        "📥 UPDATED MEMBER:",
        updated
      );

      return updated;
    } catch (error) {
      console.error(
        "❌ WORKSPACE DETAILS UPDATE ERROR:",
        error
      );

      throw error;
    }
  };

  // =====================================================
  // DELETE MEMBER
  // =====================================================

  const handleDeleteMember = async (
    memberId: string
  ): Promise<boolean> => {
    console.log(
      "🗑️ WORKSPACE DETAILS - DELETE MEMBER"
    );

    console.log(
      "👤 MEMBER ID:",
      memberId
    );

    try {
      const result =
        await onDeleteMember(memberId);

      console.log(
        "📥 DELETE RESULT:",
        result
      );

      return result;
    } catch (error) {
      console.error(
        "❌ WORKSPACE DETAILS DELETE ERROR:",
        error
      );

      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {workspace.name}
            </h2>

            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
              {workspace.plan} plan
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Workspace identifier:{" "}
            {workspace.id}
          </p>
        </div>
      </div>

      {/* =================================================
          OVERVIEW
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Total Members
          </span>

          <span className="text-2xl font-bold text-slate-900">
            {members.length}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Domain Slug
          </span>

          <span className="text-sm font-bold text-indigo-600">
            taskflow.ai/
            {workspace.slug}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">
            Security Tier
          </span>

          <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />

            Enterprise SSO & TLS
          </span>
        </div>
      </div>

      {/* =================================================
          TEAM MEMBERS
      ================================================= */}

      <TeamMembers
        members={members}
        onInvite={handleOpenAddMember}
        onUpdateMember={
          handleUpdateMember
        }
        onDeleteMember={
          handleDeleteMember
        }
      />

      {/* =================================================
          ADD MEMBER
      ================================================= */}

      {isAddMemberOpen && (
        <AddMemberModal
          onAdd={handleAdd}
          onClose={handleCloseAddMember}
          loading={inviting}
        />
      )}
    </div>
  );
};

