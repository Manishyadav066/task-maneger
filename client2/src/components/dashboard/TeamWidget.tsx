import React, { useState } from 'react';
import { User } from '../../types';
import { UserPlus, Check, MoreHorizontal } from 'lucide-react';

interface TeamWidgetProps {
  members: User[];
  onInviteMember: (newMember: Partial<User>) => void;
}

export const TeamWidget: React.FC<TeamWidgetProps> = ({ members, onInviteMember }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [inviteDept, setInviteDept] = useState('Engineering');

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    onInviteMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      department: inviteDept,
      online: true,
    });

    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Team Members</h3>
          <span className="text-[11px] text-slate-400">
            {members.filter((m) => m.online).length} online now
          </span>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Invite</span>
        </button>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  member.online ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-900 truncate">{member.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{member.department || member.email}</div>
              </div>
            </div>

            <span
              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${getRoleBadge(
                member.role
              )}`}
            >
              {member.role}
            </span>
          </div>
        ))}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900">Invite Team Member</h4>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Jordan Miller"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="jordan@taskflow.ai"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                  <select
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Product">Product</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
