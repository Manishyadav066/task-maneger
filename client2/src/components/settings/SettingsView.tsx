import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  HardDrive,
  Bell,
  Shield,
  CreditCard,
  Download,
  Trash2,
  Save,
  Check,
  UploadCloud,
  FileText,
  AlertTriangle,
  RefreshCw,
  Lock,
  Globe,
  Mail,
  Zap,
} from 'lucide-react';
import { Workspace, User } from '../../types';

interface SettingsViewProps {
  workspace: Workspace;
  currentUser: User;
  onUpdateWorkspace?: (updated: Partial<Workspace>) => void;
  onShowToast?: (msg: string) => void;
}

type SettingsTab =
  | 'general'
  | 'files'
  | 'members'
  | 'notifications'
  | 'security'
  | 'billing'
  | 'export';

export const SettingsView: React.FC<SettingsViewProps> = ({
  workspace,
  currentUser,
  onUpdateWorkspace,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [slug, setSlug] = useState('techcorp-sprints');
  const [timezone, setTimezone] = useState('America/New_York (UTC-5)');
  const [defaultCurrency, setDefaultCurrency] = useState('USD ($)');
  const [isSaving, setIsSaving] = useState(false);

  // Files & Storage Settings State
  const [fileRetention, setFileRetention] = useState('365');
  const [maxUploadSize, setMaxUploadSize] = useState('50');
  const [allowPublicShares, setAllowPublicShares] = useState(true);
  const [autoVirusScan, setAutoVirusScan] = useState(true);
  const [allowedExtensions, setAllowedExtensions] = useState<string[]>([
    'PDF',
    'PNG',
    'JPG',
    'SVG',
    'FIG',
    'DOCX',
    'ZIP',
  ]);

  // Notifications State
  const [emailDigest, setEmailDigest] = useState(true);
  const [sprintReminders, setSprintReminders] = useState(true);
  const [taskAssignments, setTaskAssignments] = useState(true);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXX');

  // Security State
  const [twoFactorEnforced, setTwoFactorEnforced] = useState(true);
  const [sessionDuration, setSessionDuration] = useState('14');

  const handleSaveGeneral = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (onUpdateWorkspace) {
        onUpdateWorkspace({ name: workspaceName });
      }
      if (onShowToast) {
        onShowToast('Workspace settings saved successfully!');
      }
    }, 600);
  };

  const handleCleanOrphanFiles = () => {
    if (onShowToast) {
      onShowToast('Storage audit complete: 1.2 GB of cached files cleaned!');
    }
  };

  const handleExportData = (type: string) => {
    if (onShowToast) {
      onShowToast(`Exporting workspace ${type} bundle... Download will begin shortly.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <SettingsIcon className="w-6 h-6 text-indigo-600" />
          <span>Workspace Settings</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Manage your workspace preferences, storage & file rules, team policies, and security settings.
        </p>
      </div>

      {/* Main Settings Layout: Left Tabs + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs (Light Mode) */}
        <aside className="lg:col-span-3 space-y-1">
          <button
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'general'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>General Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'files'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <HardDrive className="w-4 h-4 shrink-0" />
            <span>Files & Storage</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Members & Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bell className="w-4 h-4 shrink-0" />
            <span>Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4 shrink-0" />
            <span>Security & Privacy</span>
          </button>

          <button
            onClick={() => setActiveTab('billing')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'billing'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4 shrink-0" />
            <span>Billing & Plan</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Data Export & Danger</span>
          </button>
        </aside>

        {/* Tab Content Canvas (Light Mode) */}
        <div className="lg:col-span-9 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          {/* TAB 1: GENERAL PROFILE */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Workspace Details</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your primary organization brand and display configurations.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">
                      Workspace URL Slug
                    </label>
                    <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500">
                      <span className="text-[11px]">taskflow.ai/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full py-2.5 px-1 bg-transparent text-slate-800 font-medium focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">
                      Workspace Unique ID
                    </label>
                    <input
                      type="text"
                      disabled
                      value={workspace.id}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-xs cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">
                      Timezone
                    </label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option>America/New_York (UTC-5)</option>
                      <option>America/Los_Angeles (UTC-8)</option>
                      <option>Europe/London (UTC+0)</option>
                      <option>Asia/Kolkata (UTC+5:30)</option>
                      <option>Asia/Tokyo (UTC+9)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">
                      Currency
                    </label>
                    <select
                      value={defaultCurrency}
                      onChange={(e) => setDefaultCurrency(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-medium bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSaveGeneral}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSaving ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FILES & STORAGE SETTINGS */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-indigo-600" />
                  <span>Files & Storage Policy</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure upload rules, allowed document extensions, and manage cloud file storage limits.
                </p>
              </div>

              {/* Storage Consumption Meter */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Workspace Storage Quota</span>
                  <span className="text-slate-500 font-medium">14.8 GB of 50.0 GB (29.6%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-600 to-violet-500 rounded-full"
                    style={{ width: '29.6%' }}
                  />
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                  <span>Sprint Specs & Designs: 9.4 GB</span>
                  <span>Logs & Code Bundles: 5.4 GB</span>
                </div>
              </div>

              {/* Upload Controls */}
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">
                      Max Single File Size (MB)
                    </label>
                    <select
                      value={maxUploadSize}
                      onChange={(e) => setMaxUploadSize(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-medium bg-white focus:outline-hidden"
                    >
                      <option value="25">25 MB per file</option>
                      <option value="50">50 MB per file (Default)</option>
                      <option value="100">100 MB per file (Pro)</option>
                      <option value="250">250 MB per file (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1.5">
                      File Version Retention
                    </label>
                    <select
                      value={fileRetention}
                      onChange={(e) => setFileRetention(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 font-medium bg-white focus:outline-hidden"
                    >
                      <option value="90">Keep versions for 90 days</option>
                      <option value="180">Keep versions for 180 days</option>
                      <option value="365">Keep versions for 1 Year</option>
                      <option value="forever">Indefinite (Never delete)</option>
                    </select>
                  </div>
                </div>

                {/* Allowed File Formats */}
                <div>
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Permitted File Formats
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['PDF', 'PNG', 'JPG', 'SVG', 'FIG', 'DOCX', 'ZIP', 'CSV', 'JSON'].map((ext) => {
                      const isIncluded = allowedExtensions.includes(ext);
                      return (
                        <button
                          key={ext}
                          type="button"
                          onClick={() => {
                            setAllowedExtensions((prev) =>
                              isIncluded ? prev.filter((item) => item !== ext) : [...prev, ext]
                            );
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            isIncluded
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                              : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          .{ext.toLowerCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-3 pt-2">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-800">Auto-Scan Attachments</div>
                      <div className="text-[11px] text-slate-500">
                        Check uploaded documents for malware and virus signatures automatically.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={autoVirusScan}
                      onChange={(e) => setAutoVirusScan(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-md border-slate-300"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
                    <div>
                      <div className="font-semibold text-slate-800">Allow Public Download Links</div>
                      <div className="text-[11px] text-slate-500">
                        Allow team members to generate secure public share links for external stakeholders.
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowPublicShares}
                      onChange={(e) => setAllowPublicShares(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded-md border-slate-300"
                    />
                  </label>
                </div>
              </div>

              {/* Maintenance action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleCleanOrphanFiles}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Audit & Clean Orphan Attachments</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveGeneral}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save File Rules</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: MEMBERS & ROLES */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Team Members & Role Governance</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage access roles, inviting permissions, and departmental assignments.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Default Role for New Members</div>
                    <div className="text-slate-500 text-[11px]">
                      Applied when an invited collaborator signs in to this workspace.
                    </div>
                  </div>
                  <select className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-700 font-medium bg-white text-xs">
                    <option>Member (Can edit tasks & upload files)</option>
                    <option>Admin (Full sprint & project administration)</option>
                    <option>Viewer (Read-only observation)</option>
                  </select>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Require Admin Approval to Invite</div>
                    <div className="text-slate-500 text-[11px]">
                      Non-admin members cannot generate workspace invite links without approval.
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded-md" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-indigo-600" />
                  <span>Notification Preferences & Webhooks</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tune how and when your teams receive task deadlines, sprint alerts, and standup digests.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Sprint Deadline Alerts</div>
                    <div className="text-[11px] text-slate-500">
                      Notify assignees 24 hours before a sprint task reaches its due date.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={sprintReminders}
                    onChange={(e) => setSprintReminders(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Task Assignment Alerts</div>
                    <div className="text-[11px] text-slate-500">
                      Send instant in-app notification when assigned or mentioned on a task.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={taskAssignments}
                    onChange={(e) => setTaskAssignments(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-800">Daily Standup AI Digest</div>
                    <div className="text-[11px] text-slate-500">
                      Deliver an automated 8:00 AM velocity summary to workspace managers.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md"
                  />
                </label>

                <div className="pt-2">
                  <label className="font-semibold text-slate-700 block mb-1.5">
                    Slack / Discord Broadcast Webhook URL
                  </label>
                  <input
                    type="text"
                    value={slackWebhook}
                    onChange={(e) => setSlackWebhook(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveGeneral}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notification Rules</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: SECURITY & PRIVACY */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Security & Compliance</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protect workspace assets with multi-factor authentication, session governance, and audit trails.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Enforce Two-Factor Authentication (2FA)</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      All workspace users will be prompted for an authenticator code upon login.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={twoFactorEnforced}
                    onChange={(e) => setTwoFactorEnforced(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md"
                  />
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Idle Session Expiration</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      Automatically sign out inactive sessions to protect confidential sprint files.
                    </div>
                  </div>
                  <select
                    value={sessionDuration}
                    onChange={(e) => setSessionDuration(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-800 font-medium bg-white text-xs"
                  >
                    <option value="7">7 days</option>
                    <option value="14">14 days (Recommended)</option>
                    <option value="30">30 days</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BILLING & SUBSCRIPTION */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Subscription & Invoices</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review your active SaaS tier, manage member seats, and download past invoices.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-indigo-600 text-white">
                    Active Plan
                  </span>
                  <h4 className="text-lg font-extrabold text-indigo-950 mt-1.5">
                    Pro Sprint Tier — $29 / month
                  </h4>
                  <p className="text-xs text-indigo-800 mt-0.5">
                    18 of 25 collaborator seats occupied. Next renewal on October 1st, 2026.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onShowToast && onShowToast('Plan management portal opened.')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-all self-start sm:self-auto"
                >
                  Manage Subscription
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: DATA EXPORT & DANGER ZONE */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Data Export & Backup</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Download complete workspace telemetry, sprint boards, task history, and metadata.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="font-bold text-slate-900 text-xs">Full Workspace JSON Export</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Contains all tasks, projects, activities, comments, and file references in structured JSON.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleExportData('JSON')}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Download .JSON Archive</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="font-bold text-slate-900 text-xs">Task Analytics CSV</div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Formatted for Excel or Google Sheets to analyze sprint velocity and completion rates.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleExportData('CSV')}
                    className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Tasks .CSV</span>
                  </button>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-rose-100">
                <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3">
                  <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Danger Zone</span>
                  </div>
                  <p className="text-[11px] text-rose-950/70 leading-relaxed">
                    Archiving or deleting this workspace will immediately revoke member access and schedule all sprint records for permanent deletion after 30 days.
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => onShowToast && onShowToast('Workspace archive requested.')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs"
                    >
                      Archive Workspace
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
