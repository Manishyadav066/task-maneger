import React, { useState } from "react";
import { AddMemberInput } from "../types/workspace.types";
import { User } from "../../../types";
import { UserPlus, X } from "lucide-react";

interface AddMemberModalProps {
  onAdd: (input: AddMemberInput) => Promise<User | null>;
  onClose: () => void;
  loading?: boolean;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  onAdd,
  onClose,
  loading = false,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "member">("member");
  const [department, setDepartment] = useState("Engineering");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("🔥 ADD MEMBER FORM SUBMITTED");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    console.log("👤 NAME:", cleanName);
    console.log("📧 EMAIL:", cleanEmail);
    console.log("👑 ROLE:", role);
    console.log("🏢 DEPARTMENT:", department);

    if (!cleanName) {
      console.error("❌ MEMBER NAME IS EMPTY");
      return;
    }

    if (!cleanEmail) {
      console.error("❌ MEMBER EMAIL IS EMPTY");
      return;
    }

    const memberInput: AddMemberInput = {
      name: cleanName,
      email: cleanEmail,
      role,
      department,
    };

    console.log("📤 SENDING MEMBER TO onAdd:", memberInput);

    try {
      const result = await onAdd(memberInput);

      console.log("📥 onAdd RESULT:", result);

      if (result) {
        console.log("✅ MEMBER SUCCESSFULLY ADDED");

        // Clear form
        setName("");
        setEmail("");
        setRole("member");
        setDepartment("Engineering");

        // Close modal after successful add
        onClose();
      } else {
        console.error("❌ MEMBER WAS NOT ADDED - onAdd returned null");
      }
    } catch (error) {
      console.error("❌ ADD MEMBER MODAL ERROR:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-600" />

            <h3 className="text-base font-bold text-slate-900">
              Invite Workspace Member
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Miller"
              disabled={loading}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 disabled:bg-slate-50"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@company.com"
              disabled={loading}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 disabled:bg-slate-50"
            />
          </div>

          {/* ROLE + DEPARTMENT */}
          <div className="grid grid-cols-2 gap-3">
            {/* ROLE */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Role
              </label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "member")}
                disabled={loading}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 disabled:bg-slate-50"
              >
                <option value="member">Member</option>

                <option value="admin">Admin</option>
              </select>
            </div>

            {/* DEPARTMENT */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Department
              </label>

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={loading}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 disabled:bg-slate-50"
              >
                <option value="Engineering">Engineering</option>

                <option value="Product Design">Product Design</option>

                <option value="Marketing">Marketing</option>

                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="pt-3 flex gap-2 justify-end">
            {/* CANCEL */}
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            {/* ADD MEMBER */}
            <button
              type="submit"
              disabled={loading || !name.trim() || !email.trim()}
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
