
import React, { useState } from "react";

import {
  UserPlus,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

import { User } from "../../../types";

interface TeamMembersProps {
  members: User[];

  // =====================================================
  // CREATE
  // =====================================================

  onInvite: () => void;

  // =====================================================
  // UPDATE
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
  // DELETE
  // =====================================================

  onDeleteMember: (
    memberId: string
  ) => Promise<boolean>;
}

export const TeamMembers: React.FC<
  TeamMembersProps
> = ({
  members,
  onInvite,
  onUpdateMember,
  onDeleteMember,
}) => {
  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  const [editingMember, setEditingMember] =
    useState<User | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editEmail, setEditEmail] =
    useState("");

  const [editRole, setEditRole] =
    useState<"admin" | "member">("member");

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const handleEdit = (member: User) => {
    const memberId =
      member.id ||
      (member as any)._id;

    if (!memberId) {
      console.error(
        "❌ MEMBER ID NOT FOUND"
      );
      return;
    }

    console.log(
      "✏️ EDIT MEMBER:",
      member
    );

    console.log(
      "👤 MEMBER ID:",
      memberId
    );

    setEditingMember(member);

    setEditName(
      member.name || ""
    );

    setEditEmail(
      member.email || ""
    );

    setEditRole(
      (member as any).role === "admin"
        ? "admin"
        : "member"
    );

    setOpenMenuId(null);
  };

  // =====================================================
  // SAVE EDIT
  // =====================================================

  const handleSaveEdit = async () => {
    if (!editingMember) {
      return;
    }

    const memberId =
      editingMember.id ||
      (editingMember as any)._id;

    if (!memberId) {
      console.error(
        "❌ MEMBER ID NOT FOUND"
      );
      return;
    }

    const cleanName =
      editName.trim();

    const cleanEmail =
      editEmail.trim().toLowerCase();

    if (!cleanName) {
      alert(
        "Member name is required"
      );
      return;
    }

    if (!cleanEmail) {
      alert(
        "Member email is required"
      );
      return;
    }

    console.log(
      "🚀 UPDATE MEMBER STARTED"
    );

    console.log(
      "🏢 MEMBER ID:",
      memberId
    );

    console.log(
      "📦 UPDATE DATA:",
      {
        name: cleanName,
        email: cleanEmail,
        role: editRole,
      }
    );

    setSaving(true);

    try {
      const updated =
        await onUpdateMember(
          memberId,
          {
            name: cleanName,
            email: cleanEmail,
            role: editRole,
          }
        );

      console.log(
        "📥 UPDATE RESULT:",
        updated
      );

      if (!updated) {
        throw new Error(
          "Member update failed"
        );
      }

      console.log(
        "✅ MEMBER UPDATED SUCCESSFULLY"
      );

      setEditingMember(null);
    } catch (error) {
      console.error(
        "❌ UPDATE MEMBER ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update member"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE MEMBER
  // =====================================================

  const handleDelete = async (
    member: User
  ) => {
    const memberId =
      member.id ||
      (member as any)._id;

    if (!memberId) {
      console.error(
        "❌ MEMBER ID NOT FOUND"
      );
      return;
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to remove ${
          member.name || "this member"
        } from the workspace?`
      );

    if (!confirmed) {
      return;
    }

    console.log(
      "🚀 DELETE MEMBER STARTED"
    );

    console.log(
      "🏢 MEMBER ID:",
      memberId
    );

    setDeletingId(memberId);
    setOpenMenuId(null);

    try {
      const deleted =
        await onDeleteMember(
          memberId
        );

      console.log(
        "📥 DELETE RESULT:",
        deleted
      );

      if (!deleted) {
        throw new Error(
          "Member deletion failed"
        );
      }

      console.log(
        "✅ MEMBER DELETED SUCCESSFULLY"
      );
    } catch (error) {
      console.error(
        "❌ DELETE MEMBER ERROR:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete member"
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      {/* =================================================
          TEAM MEMBERS
      ================================================= */}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between p-5 border-b border-slate-100">

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Team Members
            </h3>

            <p className="text-xs text-slate-500 mt-1">
              Manage people who have access to this workspace
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              console.log(
                "➕ INVITE MEMBER BUTTON CLICKED"
              );

              onInvite();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />

            <span>
              Invite Member
            </span>
          </button>
        </div>

        {/* =================================================
            MEMBERS
        ================================================= */}

        <div className="divide-y divide-slate-100">

          {members.length === 0 ? (
            <div className="p-8 text-center">

              <p className="text-sm text-slate-500">
                No members found
              </p>

              <button
                type="button"
                onClick={onInvite}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Add first member
              </button>

            </div>
          ) : (
            members.map((member) => {

              const memberId =
                member.id ||
                (member as any)._id ||
                member.email;

              const role =
                (member as any).role ||
                "member";

              return (
                <div
                  key={memberId}
                  className="flex items-center justify-between p-5"
                >

                  {/* =================================================
                      USER
                  ================================================= */}

                  <div className="flex items-center gap-3">

                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={
                          member.name ||
                          "Member"
                        }
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        {(
                          member.name ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div>

                      <p className="text-sm font-semibold text-slate-900">
                        {member.name ||
                          "Unknown User"}
                      </p>

                      <div className="flex items-center gap-1 text-xs text-slate-500">

                        <Mail className="w-3 h-3" />

                        <span>
                          {member.email ||
                            "No email"}
                        </span>

                      </div>

                    </div>
                  </div>

                  {/* =================================================
                      RIGHT SIDE
                  ================================================= */}

                  <div className="flex items-center gap-3">

                    <span className="text-[10px] font-semibold uppercase px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                      {role}
                    </span>

                    {/* =================================================
                        ACTION MENU
                    ================================================= */}

                    <div className="relative">

                      <button
                        type="button"
                        disabled={
                          deletingId ===
                          memberId
                        }
                        onClick={() => {
                          setOpenMenuId(
                            openMenuId ===
                              memberId
                              ? null
                              : memberId
                          );
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {openMenuId ===
                        memberId && (
                        <div className="absolute right-0 top-10 z-30 w-40 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">

                          {/* EDIT */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                member
                              )
                            }
                            className="w-full px-3 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Pencil className="w-3.5 h-3.5" />

                            Edit Member
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                member
                              )
                            }
                            className="w-full px-3 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />

                            Remove Member
                          </button>

                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>

      {/* =================================================
          EDIT MEMBER MODAL
      ================================================= */}

      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex items-center justify-between p-5 border-b border-slate-100">

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Edit Member
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Update workspace member information
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setEditingMember(null)
                }
                disabled={saving}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <div className="p-5 space-y-4">

              {/* NAME */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Name
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  placeholder="Member name"
                />
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email
                </label>

                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) =>
                    setEditEmail(
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                  placeholder="member@example.com"
                />
              </div>

              {/* ROLE */}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Workspace Role
                </label>

                <select
                  value={editRole}
                  onChange={(e) =>
                    setEditRole(
                      e.target.value as
                        | "admin"
                        | "member"
                    )
                  }
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 bg-white"
                >
                  <option value="member">
                    Member
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex items-center justify-end gap-2 p-5 border-t border-slate-100">

              <button
                type="button"
                onClick={() =>
                  setEditingMember(null)
                }
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
