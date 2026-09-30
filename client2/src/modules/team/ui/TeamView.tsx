import React, { useMemo, useState } from "react";
import { UserPlus, Mail, Search } from "lucide-react";

import type { User } from "../../../types";

interface TeamViewProps {
  members: User[];
  onInviteMember: (newMember: Partial<User>) => void;
  onViewMemberTasks: (memberId: string) => void;
}

export const TeamView: React.FC<TeamViewProps> = ({
  members,
  onInviteMember,
  onViewMemberTasks,
}) => {
  const [search, setSearch] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [role, setRole] = useState<"admin" | "member">("member");

  const [department, setDepartment] = useState("Engineering");

  /*
   * Backend response can be:
   *
   * {
   *   user: {
   *     id,
   *     name,
   *     email
   *   },
   *   role: "member"
   * }
   *
   * OR:
   *
   * {
   *   id,
   *   name,
   *   email,
   *   role
   * }
   *
   * Normalize both formats for the UI.
   */
  const normalizedMembers = useMemo(() => {
    if (!Array.isArray(members)) {
      return [];
    }

    return members
      .map((item: any) => {
        const user = item?.user || item;

        if (!user) {
          return null;
        }

        return {
          ...user,

          id: user.id || user._id || item?.user?._id || item?.user?.id || "",
          _id: user._id || user.id || item?.user?._id || item?.user?.id || "",

          name: user.name || user.fullName || "Unknown Member",

          email: user.email || "",

          department: user.department || "Engineering",

          online: typeof user.online === "boolean" ? user.online : false,

          role: item?.role || user.role || "member",
        };
      })
      .filter(Boolean);
  }, [members]);

  /*
   * Search
   */
  const searchText = search.trim().toLowerCase();

  const filtered = normalizedMembers.filter((member: any) => {
    const memberName = String(member.name || "").toLowerCase();

    const memberEmail = String(member.email || "").toLowerCase();

    const memberDepartment = String(member.department || "").toLowerCase();

    return (
      memberName.includes(searchText) ||
      memberEmail.includes(searchText) ||
      memberDepartment.includes(searchText)
    );
  });

  /*
   * Invite member
   */
  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      return;
    }

    onInviteMember({
      name: name.trim(),
      email: email.trim(),
      role,
      department,
      online: true,
    });

    setName("");
    setEmail("");
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Team & Collaborators
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage workspace roles, departments, and member access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />

          <span>Invite Member</span>
        </button>
      </div>

      {/* Search and stats */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <span>{normalizedMembers.length} Total Members</span>

          <span className="text-emerald-600 font-semibold">
            {normalizedMembers.filter((member: any) => member.online).length}{" "}
            Active Online
          </span>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search member or department..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Members Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((member: any) => (
          <div
            key={member.id || member.email || member.name}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      member.online ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                  />

                  <span className="text-xs font-semibold text-slate-500">
                    {member.department || "Engineering"}
                  </span>
                </div>

                <span
                  className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg border ${
                    member.role === "owner"
                      ? "bg-purple-50 text-purple-700 border-purple-200"
                      : member.role === "admin"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                  }`}
                >
                  {member.role || "member"}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-3">
                {member.name || "Unknown Member"}
              </h3>

              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-slate-400" />

                <span>{member.email || "No email available"}</span>
              </p>

              <div className="mt-2 text-xs font-medium text-slate-600">
                Department:{" "}
                <span className="font-semibold text-slate-900">
                  {member.department || "Product"}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                {member.online ? "Active in workspace" : "Offline"}
              </span>

              <button
                type="button"
                onClick={() => {
                  console.log("========== VIEW TASKS ==========");

                  console.log("MEMBER OBJECT:", member);

                  const memberId = String(member.id || member._id || "");

                  console.log("SELECTED MEMBER ID:", memberId);

                  if (!memberId) {
                    alert("Member ID not found");
                    return;
                  }

                  onViewMemberTasks(memberId);
                }}
                className="relative z-10 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                View Tasks
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
          <p className="text-sm font-semibold text-slate-700">
            No team members found
          </p>

          <p className="text-xs text-slate-400 mt-1">
            Try a different name, email, or department.
          </p>
        </div>
      )}

      {/* Invite Modal */}

      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 border border-slate-200 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Invite Team Member
            </h3>

            <form onSubmit={handleInviteSubmit} className="space-y-3 text-xs">
              {/* Name */}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Full Name
                </label>

                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Email */}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Role + Department */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Role
                  </label>

                  <select
                    value={role}
                    onChange={(e) =>
                      setRole(e.target.value as "admin" | "member")
                    }
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="member">Member</option>

                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Department
                  </label>

                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>

                    <option value="Design">Design</option>

                    <option value="Marketing">Marketing</option>

                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
