"use client";

import React, { useState } from "react";

import {
  Search,
  Bell,
  ChevronDown,
  Check,
  Trash2,
  PanelLeft,
  UserCircle,
  Settings,
  SlidersHorizontal,
  ShieldCheck,
  Lock,
  Pencil,
  Mail,
  User,
  X,
  KeyRound,
  Activity,
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Building2,
  Users,
  Globe,
  CheckCircle2,
  Smartphone,
  Monitor,
  LogOut,
} from "lucide-react";

import { User as UserType, Workspace, Notification } from "../../types";

interface HeaderProps {
  currentUser?: UserType;

  workspaces?: Workspace[];

  activeWorkspace?: Workspace;

  onSelectWorkspace?: (ws: Workspace) => void;

  notifications?: Notification[];

  onMarkNotificationRead?: (id: string) => void;

  onMarkAllNotificationsRead?: () => void;

  onDeleteNotification?: (id: string) => void;

  onOpenAIGenerator?: () => void;

  onOpenAIAssistant?: () => void;

  onOpenNotifications?: () => void;

  onOpenCreateTask?: () => void;

  searchQuery?: string;

  onSearchChange?: (q: string) => void;

  onSignOut?: () => void;

  onOpenAuth?: () => void;

  onOpenLanding?: () => void;

  isSidebarCollapsed?: boolean;

  onToggleSidebar?: () => void;
}

type ProfileSection =
  | "overview"
  | "edit-profile"
  | "account"
  | "password"
  | "security"
  | "notifications"
  | "workspace";

export const Header: React.FC<HeaderProps> = ({
  currentUser,

  workspaces = [
    {
      id: "ws-1",
      name: "Acme Corp",
      slug: "acme-corp",
      icon: "⚡",
      membersCount: 12,
      role: "owner",
    },
  ],

  activeWorkspace = {
    id: "ws-1",
    name: "Acme Corp",
    slug: "acme-corp",
    icon: "⚡",
    membersCount: 12,
    role: "owner",
  },

  onSelectWorkspace = () => {},

  notifications = [],

  onMarkNotificationRead = () => {},

  onMarkAllNotificationsRead = () => {},

  onDeleteNotification = () => {},

  searchQuery = "",

  onSearchChange = () => {},

  isSidebarCollapsed = false,

  onToggleSidebar,

  onSignOut,
}) => {
  // ==========================================================
  // DROPDOWN STATES
  // ==========================================================

  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);

  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // ==========================================================
  // PROFILE VIEW
  // ==========================================================

  const [showProfileView, setShowProfileView] = useState(false);

  const [profileSection, setProfileSection] =
    useState<ProfileSection>("overview");

  // ==========================================================
  // PROFILE FORM STATES
  // ==========================================================

  const [profileName, setProfileName] = useState(currentUser?.name || "");

  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");

  const [profileSaved, setProfileSaved] = useState(false);

  // ==========================================================
  // PASSWORD STATES
  // ==========================================================

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordMessage, setPasswordMessage] = useState("");

  // ==========================================================
  // NOTIFICATION SETTINGS
  // ==========================================================

  const [emailNotifications, setEmailNotifications] = useState(true);

  const [taskNotifications, setTaskNotifications] = useState(true);

  const [mentionNotifications, setMentionNotifications] = useState(true);

  const [workspaceNotifications, setWorkspaceNotifications] = useState(true);

  // ==========================================================
  // WORKSPACE SETTINGS
  // ==========================================================

  const [workspaceSaved, setWorkspaceSaved] = useState(false);

  const [workspaceName, setWorkspaceName] = useState(
    activeWorkspace?.name || "",
  );

  // ==========================================================
  // USER DATA
  // ==========================================================

  const userName = currentUser?.name?.trim() || "User";

  const avatarUrl =
    typeof currentUser?.avatar === "string" ? currentUser.avatar.trim() : "";

  const hasAvatar = avatarUrl.length > 0;

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  // ==========================================================
  // USER INITIAL
  // ==========================================================

  const getUserInitial = () => {
    if (!userName) {
      return "U";
    }

    return userName.charAt(0).toUpperCase();
  };

  // ==========================================================
  // DROPDOWN CONTROLS
  // ==========================================================

  const toggleWorkspaceDropdown = () => {
    setShowWorkspaceDropdown((prev) => !prev);

    setShowNotificationDrawer(false);
    setShowProfileMenu(false);
  };

  const toggleNotificationDrawer = () => {
    setShowNotificationDrawer((prev) => !prev);

    setShowWorkspaceDropdown(false);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);

    setShowWorkspaceDropdown(false);
    setShowNotificationDrawer(false);
  };

  // ==========================================================
  // SIGN OUT
  // ==========================================================

  const handleSignOut = () => {
    setShowProfileMenu(false);
    setShowWorkspaceDropdown(false);
    setShowNotificationDrawer(false);
    setShowProfileView(false);

    if (onSignOut) {
      onSignOut();
    }
  };

  // ==========================================================
  // PROFILE OPEN / CLOSE
  // ==========================================================

  const openProfileView = () => {
    setShowProfileMenu(false);
    setShowWorkspaceDropdown(false);
    setShowNotificationDrawer(false);

    setProfileSection("overview");

    setProfileName(currentUser?.name || "");
    setProfileEmail(currentUser?.email || "");

    setShowProfileView(true);
  };

  const closeProfileView = () => {
    setShowProfileView(false);
    setProfileSection("overview");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("");
    setProfileSaved(false);
    setWorkspaceSaved(false);
  };

  const openProfileSection = (section: ProfileSection) => {
    setProfileSection(section);

    setProfileSaved(false);
    setWorkspaceSaved(false);
    setPasswordMessage("");
  };

  // ==========================================================
  // AVATAR
  // ==========================================================

  const renderAvatar = (size: "small" | "large" = "small") => {
    const sizeClass = size === "large" ? "text-base" : "text-sm";

    if (hasAvatar) {
      return (
        <>
          <img
            src={avatarUrl}
            alt={`${userName} profile`}
            className="
              w-full
              h-full
              object-cover
            "
            onError={(event) => {
              event.currentTarget.style.display = "none";

              const fallback = event.currentTarget.nextElementSibling;

              if (fallback instanceof HTMLElement) {
                fallback.style.display = "flex";
              }
            }}
          />

          <span
            className={`
              w-full
              h-full

              items-center
              justify-center

              bg-gradient-to-br
              from-indigo-500
              to-violet-600

              text-white

              ${sizeClass}

              font-bold
              select-none
            `}
            style={{
              display: "none",
            }}
          >
            {getUserInitial()}
          </span>
        </>
      );
    }

    return (
      <span
        className={`
          w-full
          h-full

          flex
          items-center
          justify-center

          bg-gradient-to-br
          from-indigo-500
          to-violet-600

          text-white

          ${sizeClass}

          font-bold
          select-none
        `}
      >
        {getUserInitial()}
      </span>
    );
  };

  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const handleSaveProfile = () => {
    setProfileSaved(true);

    setTimeout(() => {
      setProfileSaved(false);
    }, 2500);
  };

  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  const handleChangePassword = () => {
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("Please fill all password fields.");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordMessage("New password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }

    setPasswordMessage("Password updated successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  // ==========================================================
  // SAVE WORKSPACE
  // ==========================================================

  const handleSaveWorkspace = () => {
    setWorkspaceSaved(true);

    setTimeout(() => {
      setWorkspaceSaved(false);
    }, 2500);
  };

  // ==========================================================
  // PROFILE SECTION HEADER
  // ==========================================================

  const getSectionTitle = () => {
    switch (profileSection) {
      case "edit-profile":
        return "Edit Profile";

      case "account":
        return "Account Information";

      case "password":
        return "Change Password";

      case "security":
        return "Security & Privacy";

      case "notifications":
        return "Notification Preferences";

      case "workspace":
        return "Workspace Settings";

      default:
        return "Profile";
    }
  };

  // ==========================================================
  // TOGGLE COMPONENT
  // ==========================================================

  const Toggle = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: () => void;
  }) => {
    return (
      <button
        type="button"
        onClick={onChange}
        className={`
          relative

          w-10
          h-5

          rounded-full

          transition-colors
          duration-200

          cursor-pointer

          ${enabled ? "bg-indigo-600" : "bg-slate-300"}
        `}
        aria-pressed={enabled}
      >
        <span
          className={`
            absolute
            top-0.5

            w-4
            h-4

            rounded-full

            bg-white

            shadow-sm

            transition-transform
            duration-200

            ${enabled ? "translate-x-5" : "translate-x-0.5"}
          `}
        />
      </button>
    );
  };

  // ==========================================================
  // RENDER PROFILE CONTENT
  // ==========================================================

  const renderProfileContent = () => {
    // ========================================================
    // OVERVIEW
    // ========================================================

    if (profileSection === "overview") {
      return (
        <div className="space-y-6">
          {/* PERSONAL INFORMATION */}

          <section>
            <div
              className="
                flex
                items-center
                justify-between

                gap-3

                mb-3
              "
            >
              <div>
                <h3
                  className="
                    text-sm
                    font-bold
                    text-slate-900
                  "
                >
                  Personal Information
                </h3>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                    mt-0.5
                  "
                >
                  Manage your basic profile details
                </p>
              </div>

              <button
                type="button"
                onClick={() => openProfileSection("edit-profile")}
                className="
                  px-3
                  py-1.5

                  rounded-lg

                  border
                  border-slate-200

                  text-[10px]

                  font-semibold

                  text-indigo-600

                  hover:bg-indigo-50
                  hover:border-indigo-200

                  transition-colors

                  cursor-pointer

                  flex
                  items-center
                  gap-1.5
                "
              >
                <Pencil className="w-3 h-3" />
                Edit Profile
              </button>
            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-3
              "
            >
              <InfoCard
                icon={<User className="w-3.5 h-3.5" />}
                label="Full Name"
                value={currentUser?.name || "Not available"}
              />

              <InfoCard
                icon={<Mail className="w-3.5 h-3.5" />}
                label="Email Address"
                value={currentUser?.email || "Not available"}
              />

              <InfoCard
                icon={<UserCircle className="w-3.5 h-3.5" />}
                label="Role"
                value={currentUser?.role || "Member"}
                capitalize
              />

              <InfoCard
                icon={<Building2 className="w-3.5 h-3.5" />}
                label="Workspace"
                value={activeWorkspace.name}
              />
            </div>
          </section>

          {/* ACCOUNT OPTIONS */}

          <section>
            <div className="mb-3">
              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                Account & Security
              </h3>

              <p
                className="
                  text-[10px]
                  text-slate-400
                  mt-0.5
                "
              >
                Manage your account preferences
              </p>
            </div>

            <div
              className="
                border
                border-slate-200

                rounded-2xl

                overflow-hidden

                divide-y
                divide-slate-100
              "
            >
              <ProfileOption
                icon={<UserCircle className="w-4 h-4" />}
                title="Account Information"
                description="View your account details"
                onClick={() => openProfileSection("account")}
              />

              <ProfileOption
                icon={<Pencil className="w-4 h-4" />}
                title="Edit Profile"
                description="Update your profile information"
                onClick={() => openProfileSection("edit-profile")}
              />

              <ProfileOption
                icon={<KeyRound className="w-4 h-4" />}
                title="Change Password"
                description="Update your account password"
                onClick={() => openProfileSection("password")}
              />

              <ProfileOption
                icon={<ShieldCheck className="w-4 h-4" />}
                title="Security & Privacy"
                description="Manage security and privacy"
                onClick={() => openProfileSection("security")}
              />
            </div>
          </section>

          {/* PREFERENCES */}

          <section>
            <div className="mb-3">
              <h3
                className="
                  text-sm
                  font-bold
                  text-slate-900
                "
              >
                Preferences
              </h3>

              <p
                className="
                  text-[10px]
                  text-slate-400
                  mt-0.5
                "
              >
                Configure your workspace experience
              </p>
            </div>

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2

                gap-3
              "
            >
              <PreferenceCard
                icon={<Bell className="w-4 h-4" />}
                title="Notification Preferences"
                description="Control your notifications"
                onClick={() => openProfileSection("notifications")}
              />

              <PreferenceCard
                icon={<Settings className="w-4 h-4" />}
                title="Workspace Settings"
                description="Manage workspace configuration"
                onClick={() => openProfileSection("workspace")}
              />
            </div>
          </section>

          {/* SECURITY STATUS */}

          <SecurityStatus />
        </div>
      );
    }

    // ========================================================
    // EDIT PROFILE
    // ========================================================

    if (profileSection === "edit-profile") {
      return (
        <div className="space-y-5">
          <div
            className="
              rounded-2xl

              border
              border-indigo-100

              bg-indigo-50/50

              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-12
                  h-12

                  rounded-xl

                  overflow-hidden
                "
              >
                {renderAvatar("large")}
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    text-slate-800
                  "
                >
                  Profile Information
                </p>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                    mt-1
                  "
                >
                  Update your personal information
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <FormInput
              label="Full Name"
              value={profileName}
              onChange={setProfileName}
              placeholder="Enter your name"
              icon={<User className="w-4 h-4" />}
            />

            <FormInput
              label="Email Address"
              value={profileEmail}
              onChange={setProfileEmail}
              placeholder="Enter your email"
              type="email"
              icon={<Mail className="w-4 h-4" />}
            />

            <div>
              <label
                className="
                  block
                  text-[10px]

                  font-bold

                  text-slate-500

                  uppercase
                  tracking-wide

                  mb-1.5
                "
              >
                Role
              </label>

              <div
                className="
                  h-10

                  px-3

                  rounded-xl

                  bg-slate-100

                  border
                  border-slate-200

                  flex
                  items-center

                  text-xs
                  font-semibold
                  text-slate-500
                "
              >
                {currentUser?.role || "Member"}
              </div>
            </div>
          </div>

          {profileSaved && (
            <SuccessMessage>Profile changes saved successfully.</SuccessMessage>
          )}

          <div
            className="
              flex
              justify-end
              gap-2

              pt-2
            "
          >
            <button
              type="button"
              onClick={() => openProfileSection("overview")}
              className="
                h-10

                px-4

                rounded-xl

                border
                border-slate-200

                text-xs
                font-semibold

                text-slate-600

                hover:bg-slate-50

                cursor-pointer
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveProfile}
              className="
                h-10

                px-4

                rounded-xl

                bg-indigo-600

                text-white

                text-xs
                font-bold

                hover:bg-indigo-700

                cursor-pointer

                flex
                items-center
                gap-2
              "
            >
              <Save className="w-3.5 h-3.5" />
              Save Changes
            </button>
          </div>
        </div>
      );
    }

    // ========================================================
    // ACCOUNT
    // ========================================================

    if (profileSection === "account") {
      return (
        <div className="space-y-5">
          <AccountDetail
            icon={<User className="w-4 h-4" />}
            title="Full Name"
            value={currentUser?.name || "Not available"}
          />

          <AccountDetail
            icon={<Mail className="w-4 h-4" />}
            title="Email Address"
            value={currentUser?.email || "Not available"}
          />

          <AccountDetail
            icon={<Building2 className="w-4 h-4" />}
            title="Current Workspace"
            value={activeWorkspace.name}
          />

          <AccountDetail
            icon={<Users className="w-4 h-4" />}
            title="Workspace Members"
            value={`${activeWorkspace.membersCount} members`}
          />

          <AccountDetail
            icon={<ShieldCheck className="w-4 h-4" />}
            title="Account Status"
            value="Active"
            status
          />
        </div>
      );
    }

    // ========================================================
    // PASSWORD
    // ========================================================

    if (profileSection === "password") {
      return (
        <div className="space-y-5">
          <div
            className="
              p-4

              rounded-2xl

              bg-amber-50

              border
              border-amber-100

              flex
              gap-3
            "
          >
            <Lock
              className="
                w-5
                h-5

                text-amber-600

                shrink-0
              "
            />

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-amber-800
                "
              >
                Password Security
              </p>

              <p
                className="
                  text-[10px]
                  text-amber-600

                  mt-1
                  leading-relaxed
                "
              >
                Use a strong password with at least 8 characters.
              </p>
            </div>
          </div>

          <PasswordInput
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            show={showCurrentPassword}
            onToggle={() => setShowCurrentPassword((prev) => !prev)}
          />

          <PasswordInput
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            show={showNewPassword}
            onToggle={() => setShowNewPassword((prev) => !prev)}
          />

          <PasswordInput
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((prev) => !prev)}
          />

          {passwordMessage && (
            <div
              className={`
                p-3

                rounded-xl

                text-[10px]

                font-semibold

                ${
                  passwordMessage.includes("successfully")
                    ? `
                      bg-emerald-50
                      border
                      border-emerald-100
                      text-emerald-700
                    `
                    : `
                      bg-rose-50
                      border
                      border-rose-100
                      text-rose-700
                    `
                }
              `}
            >
              {passwordMessage}
            </div>
          )}

          <button
            type="button"
            onClick={handleChangePassword}
            className="
              w-full

              h-10

              rounded-xl

              bg-indigo-600

              text-white

              text-xs

              font-bold

              hover:bg-indigo-700

              cursor-pointer

              flex
              items-center
              justify-center
              gap-2
            "
          >
            <KeyRound className="w-3.5 h-3.5" />
            Update Password
          </button>
        </div>
      );
    }

    // ========================================================
    // SECURITY
    // ========================================================

    if (profileSection === "security") {
      return (
        <div className="space-y-4">
          <SecurityItem
            icon={<ShieldCheck className="w-4 h-4" />}
            title="Account Security"
            description="Your account is currently active and secured."
            status="Protected"
          />

          <SecurityItem
            icon={<Smartphone className="w-4 h-4" />}
            title="Two-Factor Authentication"
            description="Add an extra layer of security to your account."
            status="Not configured"
            action="Configure"
          />

          <SecurityItem
            icon={<Monitor className="w-4 h-4" />}
            title="Active Sessions"
            description="Review devices currently signed in to your account."
            status="1 active session"
            action="Review"
          />

          <SecurityItem
            icon={<Lock className="w-4 h-4" />}
            title="Privacy"
            description="Your workspace information is protected."
            status="Protected"
          />
        </div>
      );
    }

    // ========================================================
    // NOTIFICATIONS
    // ========================================================

    if (profileSection === "notifications") {
      return (
        <div className="space-y-4">
          <NotificationSetting
            title="Email Notifications"
            description="Receive important updates by email."
            enabled={emailNotifications}
            onChange={() => setEmailNotifications((prev) => !prev)}
          />

          <NotificationSetting
            title="Task Notifications"
            description="Get notified about task updates and assignments."
            enabled={taskNotifications}
            onChange={() => setTaskNotifications((prev) => !prev)}
          />

          <NotificationSetting
            title="Mention Notifications"
            description="Receive alerts when someone mentions you."
            enabled={mentionNotifications}
            onChange={() => setMentionNotifications((prev) => !prev)}
          />

          <NotificationSetting
            title="Workspace Notifications"
            description="Receive important workspace activity updates."
            enabled={workspaceNotifications}
            onChange={() => setWorkspaceNotifications((prev) => !prev)}
          />

          <div
            className="
              mt-5

              p-4

              rounded-2xl

              bg-indigo-50

              border
              border-indigo-100
            "
          >
            <p
              className="
                text-xs
                font-bold
                text-indigo-800
              "
            >
              Notification Center
            </p>

            <p
              className="
                text-[10px]

                text-indigo-600

                mt-1
              "
            >
              You currently have <strong>{unreadCount}</strong> unread
              notification
              {unreadCount !== 1 ? "s" : ""}.
            </p>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  onMarkAllNotificationsRead();
                }}
                className="
                  mt-3

                  text-[10px]

                  font-bold

                  text-indigo-600

                  hover:text-indigo-800

                  cursor-pointer
                "
              >
                Mark all notifications as read
              </button>
            )}
          </div>
        </div>
      );
    }

    // ========================================================
    // WORKSPACE
    // ========================================================

    if (profileSection === "workspace") {
      return (
        <div className="space-y-5">
          <div
            className="
              p-4

              rounded-2xl

              bg-indigo-50

              border
              border-indigo-100
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  w-12
                  h-12

                  rounded-xl

                  bg-white

                  border
                  border-indigo-100

                  flex
                  items-center
                  justify-center

                  text-xl
                "
              >
                {activeWorkspace.icon}
              </div>

              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    text-indigo-900
                  "
                >
                  {activeWorkspace.name}
                </p>

                <p
                  className="
                    text-[10px]
                    text-indigo-500
                    mt-0.5
                  "
                >
                  {activeWorkspace.membersCount} members
                </p>
              </div>
            </div>
          </div>

          <FormInput
            label="Workspace Name"
            value={workspaceName}
            onChange={setWorkspaceName}
            placeholder="Workspace name"
            icon={<Building2 className="w-4 h-4" />}
          />

          <div
            className="
              rounded-xl

              border
              border-slate-200

              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Users
                className="
                  w-4
                  h-4

                  text-slate-400
                "
              />

              <div className="flex-1">
                <p
                  className="
                    text-xs
                    font-bold
                    text-slate-800
                  "
                >
                  Members
                </p>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                    mt-0.5
                  "
                >
                  {activeWorkspace.membersCount} people are currently in this
                  workspace.
                </p>
              </div>
            </div>
          </div>

          <div
            className="
              rounded-xl

              border
              border-slate-200

              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <Globe
                className="
                  w-4
                  h-4

                  text-slate-400
                "
              />

              <div className="flex-1">
                <p
                  className="
                    text-xs
                    font-bold
                    text-slate-800
                  "
                >
                  Workspace Slug
                </p>

                <p
                  className="
                    text-[10px]
                    text-slate-400
                    mt-0.5
                  "
                >
                  {activeWorkspace.slug}
                </p>
              </div>
            </div>
          </div>

          {workspaceSaved && (
            <SuccessMessage>
              Workspace settings saved successfully.
            </SuccessMessage>
          )}

          <button
            type="button"
            onClick={handleSaveWorkspace}
            className="
              w-full

              h-10

              rounded-xl

              bg-indigo-600

              text-white

              text-xs

              font-bold

              hover:bg-indigo-700

              cursor-pointer

              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Save className="w-3.5 h-3.5" />
            Save Workspace Settings
          </button>
        </div>
      );
    }

    return null;
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      <header
        className="
          h-16

          bg-white

          border-b
          border-slate-200/80

          sticky
          top-0
          z-30

          px-3
          sm:px-5
          lg:px-6

          flex
          items-center
          justify-between

          shadow-[0_1px_3px_rgba(15,23,42,0.04)]

          relative
          w-full
          min-w-0
          overflow-visible
        "
      >
        {/* ====================================================
            LEFT SIDE
        ==================================================== */}

        <div
          className="
            flex
            items-center

            gap-2
            sm:gap-3

            flex-1
            min-w-0
          "
        >
          {/* SIDEBAR */}

          {onToggleSidebar && (
            <button
              id="sidebar-toggle-header-btn"
              type="button"
              onClick={onToggleSidebar}
              title={isSidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
              aria-label={isSidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
              className="
                w-9
                h-9

                rounded-xl

                flex
                items-center
                justify-center

                text-slate-500

                border
                border-slate-200

                bg-white

                hover:bg-slate-50
                hover:text-slate-800
                hover:border-slate-300

                active:scale-95

                transition-all
                duration-150

                cursor-pointer

                shrink-0
              "
            >
              <PanelLeft className="w-4 h-4" />
            </button>
          )}

          {/* ==================================================
              WORKSPACE SWITCHER
          ================================================== */}

          <div className="relative shrink-0">
            <button
              id="workspace-switcher-btn"
              type="button"
              onClick={toggleWorkspaceDropdown}
              aria-expanded={showWorkspaceDropdown}
              className="
                h-9

                flex
                items-center
                gap-2

                px-2.5
                sm:px-3

                rounded-xl

                border
                border-slate-200

                bg-white

                hover:bg-slate-50
                hover:border-slate-300

                transition-all

                cursor-pointer

                text-slate-800
              "
            >
              <span
                className="
                  w-6
                  h-6

                  rounded-lg

                  bg-indigo-50

                  flex
                  items-center
                  justify-center

                  text-sm
                "
              >
                {activeWorkspace.icon}
              </span>

              <span
                className="
                  hidden
                  sm:block

                  max-w-[130px]
                  lg:max-w-[160px]

                  truncate

                  text-sm
                  font-semibold
                  text-slate-900
                "
              >
                {activeWorkspace.name}
              </span>

              <span
                className="
                  hidden
                  lg:inline-flex

                  px-1.5
                  py-0.5

                  rounded-md

                  bg-indigo-50
                  text-indigo-600

                  text-[9px]

                  font-bold

                  uppercase
                "
              >
                {activeWorkspace.role}
              </span>

              <ChevronDown
                className={`
                  w-3.5
                  h-3.5

                  text-slate-400

                  transition-transform

                  ${showWorkspaceDropdown ? "rotate-180 text-indigo-600" : ""}
                `}
              />
            </button>

            {/* WORKSPACE DROPDOWN */}

            {showWorkspaceDropdown && (
              <div
                className="
                  absolute
                  left-0

                  mt-2

                  w-[calc(100vw-16px)]
                  max-w-72
                  sm:w-72

                  bg-white

                  rounded-2xl

                  border
                  border-slate-200

                  shadow-[0_15px_45px_rgba(15,23,42,0.12)]

                  overflow-hidden

                  z-50
                "
              >
                <div
                  className="
                    px-4
                    py-3

                    border-b
                    border-slate-100

                    bg-slate-50/70
                  "
                >
                  <p
                    className="
                      text-[10px]

                      font-bold

                      uppercase
                      tracking-widest

                      text-slate-400
                    "
                  >
                    Workspace
                  </p>

                  <p
                    className="
                      mt-0.5

                      text-sm
                      font-bold
                      text-slate-900
                    "
                  >
                    Switch workspace
                  </p>
                </div>

                <div className="p-2">
                  {workspaces.length === 0 ? (
                    <div
                      className="
                        px-3
                        py-6

                        text-center

                        text-xs
                        text-slate-400
                      "
                    >
                      No workspaces available
                    </div>
                  ) : (
                    workspaces.map((ws) => {
                      const isActive = ws.id === activeWorkspace.id;

                      return (
                        <button
                          key={ws.id}
                          type="button"
                          onClick={() => {
                            onSelectWorkspace(ws);

                            setShowWorkspaceDropdown(false);
                          }}
                          className={`
                            w-full

                            px-3
                            py-2.5

                            rounded-xl

                            flex
                            items-center
                            justify-between

                            gap-3

                            text-left

                            transition-colors

                            cursor-pointer

                            ${
                              isActive
                                ? `
                                  bg-indigo-50
                                  text-indigo-700
                                `
                                : `
                                  text-slate-700
                                  hover:bg-slate-50
                                `
                            }
                          `}
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3

                              min-w-0
                            "
                          >
                            <span
                              className="
                                w-8
                                h-8

                                rounded-lg

                                bg-white

                                border
                                border-slate-200

                                flex
                                items-center
                                justify-center

                                text-sm
                              "
                            >
                              {ws.icon}
                            </span>

                            <div className="min-w-0">
                              <p
                                className="
                                  text-xs
                                  font-semibold

                                  truncate
                                "
                              >
                                {ws.name}
                              </p>

                              <p
                                className="
                                  text-[10px]

                                  text-slate-400

                                  mt-0.5
                                "
                              >
                                {ws.membersCount} members
                              </p>
                            </div>
                          </div>

                          {isActive && (
                            <Check
                              className="
                                w-4
                                h-4

                                text-indigo-600
                              "
                            />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SEARCH */}

          <div
            className="
              relative

              hidden
              sm:block

              flex-1

              min-w-0

              max-w-md
            "
          >
            <Search
              className="
                w-4
                h-4

                text-slate-400

                absolute
                left-3.5
                top-1/2
                -translate-y-1/2

                pointer-events-none
              "
            />

            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks, projects, tags..."
              className="
                w-full

                h-9

                pl-9
                pr-4

                text-xs
                sm:text-sm

                bg-slate-100/70

                hover:bg-slate-100

                focus:bg-white

                text-slate-900

                placeholder:text-slate-400

                rounded-xl

                border
                border-transparent

                focus:border-indigo-400

                focus:ring-4
                focus:ring-indigo-50

                focus:outline-none
              "
            />
          </div>
        </div>

        {/* ====================================================
            RIGHT SIDE
        ==================================================== */}

        <div
          className="
            flex
            items-center

            gap-1.5
            sm:gap-2.5

            ml-2
            sm:ml-4
          "
        >
          {/* ==================================================
              NOTIFICATIONS
          ================================================== */}

          <div className="relative">
            <button
              id="notifications-bell-btn"
              type="button"
              onClick={toggleNotificationDrawer}
              aria-label="Notifications"
              aria-expanded={showNotificationDrawer}
              className="
                relative

                w-9
                h-9

                rounded-xl

                flex
                items-center
                justify-center

                text-slate-500

                hover:text-slate-900
                hover:bg-slate-100

                border
                border-transparent

                hover:border-slate-200

                transition-all

                cursor-pointer
              "
            >
              <Bell className="w-[17px] h-[17px]" />

              {unreadCount > 0 && (
                <span
                  className="
                    absolute
                    top-2
                    right-2

                    w-2
                    h-2

                    rounded-full

                    bg-rose-500

                    ring-2
                    ring-white
                  "
                />
              )}
            </button>

            {/* NOTIFICATION DRAWER */}

            {showNotificationDrawer && (
              <div
                className="
                  fixed
                  right-2
                  sm:absolute
                  sm:right-0

                  top-16
                  sm:top-auto

                  mt-0
                  sm:mt-2

                  w-[calc(100vw-16px)]
                  sm:w-96

                  max-w-[24rem]

                  bg-white

                  rounded-2xl

                  shadow-[0_15px_45px_rgba(15,23,42,0.14)]

                  border
                  border-slate-200

                  overflow-hidden

                  z-50
                "
              >
                <div
                  className="
                    px-4
                    py-3.5

                    border-b
                    border-slate-100

                    bg-slate-50/70

                    flex
                    items-center
                    justify-between
                  "
                >
                  <div>
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <h3
                        className="
                          text-sm
                          font-bold
                          text-slate-900
                        "
                      >
                        Notifications
                      </h3>

                      {unreadCount > 0 && (
                        <span
                          className="
                            px-2
                            py-0.5

                            rounded-full

                            bg-indigo-100
                            text-indigo-700

                            text-[10px]
                            font-bold
                          "
                        >
                          {unreadCount} new
                        </span>
                      )}
                    </div>

                    <p
                      className="
                        text-[10px]
                        text-slate-400

                        mt-0.5
                      "
                    >
                      Stay updated with your workspace
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={() => onMarkAllNotificationsRead()}
                      className="
                        text-[11px]

                        text-indigo-600
                        hover:text-indigo-800

                        font-semibold

                        cursor-pointer
                      "
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div
                  className="
                    max-h-80

                    overflow-y-auto

                    divide-y
                    divide-slate-100
                  "
                >
                  {notifications.length === 0 ? (
                    <div
                      className="
                        py-12
                        px-5

                        text-center
                      "
                    >
                      <div
                        className="
                          w-10
                          h-10

                          mx-auto
                          mb-3

                          rounded-full

                          bg-slate-100

                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Bell
                          className="
                            w-4
                            h-4

                            text-slate-400
                          "
                        />
                      </div>

                      <p
                        className="
                          text-xs
                          font-semibold
                          text-slate-700
                        "
                      >
                        No notifications
                      </p>

                      <p
                        className="
                          text-[10px]
                          text-slate-400

                          mt-1
                        "
                      >
                        You're all caught up.
                      </p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`
                            p-3.5

                            flex
                            items-start
                            justify-between

                            gap-3

                            ${
                              notif.read
                                ? "bg-white opacity-80"
                                : "bg-indigo-50/40"
                            }
                          `}
                      >
                        <div
                          className="
                              flex-1
                              min-w-0
                            "
                        >
                          <div
                            className="
                                flex
                                items-center
                                gap-1.5
                              "
                          >
                            {!notif.read && (
                              <span
                                className="
                                    w-1.5
                                    h-1.5

                                    rounded-full

                                    bg-indigo-600
                                  "
                              />
                            )}

                            <h4
                              className="
                                  text-xs
                                  font-semibold

                                  text-slate-900

                                  truncate
                                "
                            >
                              {notif.title}
                            </h4>
                          </div>

                          <p
                            className="
                                text-xs
                                text-slate-600

                                mt-1

                                line-clamp-2

                                leading-relaxed
                              "
                          >
                            {notif.message}
                          </p>

                          <span
                            className="
                                text-[10px]

                                text-slate-400

                                mt-1.5

                                block
                              "
                          >
                            {notif.timestamp}
                          </span>
                        </div>

                        <div
                          className="
                              flex
                              items-center
                              gap-1

                              shrink-0
                            "
                        >
                          {!notif.read && (
                            <button
                              type="button"
                              onClick={() => onMarkNotificationRead(notif.id)}
                              className="
                                  p-1.5

                                  rounded-lg

                                  text-slate-400

                                  hover:text-indigo-600
                                  hover:bg-white

                                  cursor-pointer
                                "
                              title="Mark as read"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => onDeleteNotification(notif.id)}
                            className="
                                p-1.5

                                rounded-lg

                                text-slate-400

                                hover:text-rose-600
                                hover:bg-rose-50

                                cursor-pointer
                              "
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              PROFILE MENU
          ================================================== */}

          <div className="relative">
            <button
              id="user-profile-menu-btn"
              type="button"
              onClick={toggleProfileMenu}
              aria-expanded={showProfileMenu}
              className={`
                h-10

                flex
                items-center
                gap-2

                pl-1
                pr-2.5

                rounded-2xl

                border

                transition-all

                cursor-pointer

                ${
                  showProfileMenu
                    ? `
                      bg-indigo-50
                      border-indigo-200
                    `
                    : `
                      bg-white
                      border-slate-200

                      hover:bg-slate-50
                      hover:border-slate-300
                    `
                }
              `}
            >
              <div
                className="
                  relative

                  w-8
                  h-8

                  rounded-xl

                  overflow-hidden

                  shrink-0
                "
              >
                {renderAvatar("small")}

                <span
                  className="
                    absolute

                    bottom-0
                    right-0

                    w-2.5
                    h-2.5

                    rounded-full

                    bg-emerald-500

                    border-2
                    border-white
                  "
                />
              </div>

              <div
                className="
                  hidden
                  sm:block

                  text-left

                  max-w-[105px]
                  lg:max-w-[130px]

                  min-w-0
                "
              >
                <p
                  className="
                    text-[11px]

                    font-bold

                    text-slate-900

                    truncate
                  "
                >
                  {currentUser?.name || "User"}
                </p>

                <p
                  className="
                    text-[9px]

                    text-slate-400

                    font-medium

                    truncate

                    mt-0.5
                  "
                >
                  {currentUser?.role === "owner"
                    ? "Workspace Owner"
                    : currentUser?.role || "Member"}
                </p>
              </div>

              <ChevronDown
                className={`
                  hidden
                  sm:block

                  w-3.5
                  h-3.5

                  text-slate-400

                  transition-transform

                  ${showProfileMenu ? "rotate-180 text-indigo-600" : ""}
                `}
              />
            </button>

            {/* PROFILE DROPDOWN */}

            {showProfileMenu && (
              <div
                className="
                  fixed
                  right-2
                  sm:absolute
                  sm:right-0

                  top-16
                  sm:top-auto

                  mt-0
                  sm:mt-2

                  w-[calc(100vw-16px)]
                  max-w-72
                  sm:w-72

                  bg-white

                  rounded-2xl

                  border
                  border-slate-200

                  shadow-[0_15px_45px_rgba(15,23,42,0.14)]

                  overflow-hidden

                  z-50
                "
              >
                {/* PROFILE HEADER */}

                <div
                  className="
                    p-4

                    bg-gradient-to-br
                    from-slate-50
                    to-white

                    border-b
                    border-slate-100
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                    "
                  >
                    <div
                      className="
                        w-12
                        h-12

                        rounded-2xl

                        overflow-hidden

                        shrink-0
                      "
                    >
                      {renderAvatar("large")}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                          text-sm
                          font-bold
                          text-slate-900

                          truncate
                        "
                      >
                        {currentUser?.name || "User"}
                      </h3>

                      <p
                        className="
                          text-[11px]
                          text-slate-500

                          truncate

                          mt-0.5
                        "
                      >
                        {currentUser?.email || "No email available"}
                      </p>

                      <span
                        className="
                          inline-flex

                          mt-1.5

                          px-2
                          py-0.5

                          rounded-full

                          bg-indigo-50
                          text-indigo-600

                          text-[9px]

                          font-bold

                          uppercase
                        "
                      >
                        {currentUser?.role === "owner"
                          ? "Owner"
                          : currentUser?.role || "Member"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <MenuButton
                    icon={<UserCircle className="w-4 h-4" />}
                    title="Profile"
                    subtitle="View profile"
                    onClick={openProfileView}
                  />

                  <MenuButton
                    icon={<Settings className="w-4 h-4" />}
                    title="Workspace Settings"
                    subtitle="Manage"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setProfileSection("workspace");
                      setShowProfileView(true);
                    }}
                  />

                  <MenuButton
                    icon={<SlidersHorizontal className="w-4 h-4" />}
                    title="Notification Preferences"
                    subtitle="Configure"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setProfileSection("notifications");
                      setShowProfileView(true);
                    }}
                  />
                </div>

                <div
                  className="
                    mx-3
                    mb-3

                    px-3
                    py-2.5

                    rounded-xl

                    bg-emerald-50

                    border
                    border-emerald-100

                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      w-2
                      h-2

                      rounded-full

                      bg-emerald-500
                    "
                  />

                  <span
                    className="
                      text-[10px]

                      font-semibold

                      text-emerald-700
                    "
                  >
                    Workspace secured
                  </span>

                  <span
                    className="
                      ml-auto

                      text-[9px]

                      text-emerald-500
                    "
                  >
                    Active
                  </span>
                </div>
                <div className="border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="
                    w-full

                    px-4
                    py-3

                    flex
                    items-center
                    gap-3

                    text-left

                    text-rose-600

                    hover:bg-rose-50

                    transition-colors

                    cursor-pointer
                  "
                >
                  <LogOut className="w-4 h-4 shrink-0" />

                  <div className="min-w-0">
                    <p className="text-xs font-semibold">Logout</p>

                    <p className="text-[10px] text-rose-400 mt-0.5">
                      Sign out of your account
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ==========================================================
          MOBILE SIDEBAR CLOSE BUTTON
          This stays above the sidebar so it remains visible when
          the sidebar is open on small screens.
      ========================================================== */}

      {onToggleSidebar && !isSidebarCollapsed && (
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Close Sidebar"
          title="Close Sidebar"
          className="
            fixed
            left-3
            top-3

            sm:hidden

            z-[200]

            w-10
            h-10

            rounded-xl

            flex
            items-center
            justify-center

            bg-white
            border
            border-slate-200

            text-slate-600

            shadow-[0_8px_30px_rgba(15,23,42,0.18)]

            hover:bg-slate-50
            hover:text-slate-900

            active:scale-95

            transition-all
            duration-150

            cursor-pointer
          "
        >
          <PanelLeft className="w-4 h-4" />
        </button>
      )}

      {/* ==========================================================
          PROFILE MODAL
      ========================================================== */}

      {showProfileView && (
        <div
          className="
            fixed
            inset-0

            z-[100]

            flex
            items-center
            justify-center

            p-3
            sm:p-5
          "
        >
          {/* BACKDROP */}

          <div
            className="
              absolute
              inset-0

              bg-slate-950/45

              backdrop-blur-[2px]
            "
            onClick={closeProfileView}
          />

          {/* PANEL */}

          <div
            className="
              relative

              w-[calc(100vw-16px)]
              sm:w-full
              max-w-2xl

              max-h-[calc(100dvh-1rem)]
              sm:max-h-[90vh]

              bg-white

              rounded-2xl
              sm:rounded-3xl

              shadow-[0_25px_80px_rgba(15,23,42,0.25)]

              border
              border-slate-200

              overflow-hidden
            "
          >
            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div
              className="
                px-5
                sm:px-6

                py-4

                border-b
                border-slate-100

                bg-white
              "
            >
              <div
                className="
                  flex
                  items-center
                  justify-between

                  gap-3
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-3

                    min-w-0
                  "
                >
                  {profileSection !== "overview" && (
                    <button
                      type="button"
                      onClick={() => openProfileSection("overview")}
                      className="
                        w-9
                        h-9

                        rounded-xl

                        border
                        border-slate-200

                        flex
                        items-center
                        justify-center

                        text-slate-500

                        hover:bg-slate-50
                        hover:text-slate-900

                        cursor-pointer
                      "
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}

                  <div className="min-w-0">
                    <h2
                      className="
                        text-lg

                        font-bold

                        text-slate-900
                      "
                    >
                      {getSectionTitle()}
                    </h2>

                    <p
                      className="
                        text-[10px]

                        text-slate-400

                        mt-0.5
                      "
                    >
                      {profileSection === "overview"
                        ? "Manage your account and workspace"
                        : "Configure your profile settings"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeProfileView}
                  className="
                    w-9
                    h-9

                    rounded-xl

                    border
                    border-slate-200

                    flex
                    items-center
                    justify-center

                    text-slate-400

                    hover:text-slate-900
                    hover:bg-slate-50

                    cursor-pointer
                  "
                  aria-label="Close profile"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ==================================================
                PROFILE BODY
            ================================================== */}

            <div
              className="
                overflow-y-auto
                min-w-0
                [overflow-wrap:anywhere]

                max-h-[calc(100dvh-6.5rem)]
                sm:max-h-[calc(90vh-82px)]

                p-4
                sm:p-6
              "
            >
              {renderProfileContent()}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

const MenuButton = ({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full

        px-3
        py-2.5

        rounded-xl

        flex
        items-center
        gap-3

        text-left

        hover:bg-indigo-50
        hover:text-indigo-600

        transition-colors

        cursor-pointer
      "
    >
      <span
        className="
          w-8
          h-8

          rounded-lg

          bg-slate-100

          flex
          items-center
          justify-center

          shrink-0
        "
      >
        {icon}
      </span>

      <span className="flex-1">
        <span
          className="
            block

            text-xs
            font-semibold

            text-slate-700
          "
        >
          {title}
        </span>

        <span
          className="
            block

            text-[9px]

            text-slate-400

            mt-0.5
          "
        >
          {subtitle}
        </span>
      </span>

      <ChevronDown
        className="
          w-3.5
          h-3.5

          text-slate-300

          -rotate-90
        "
      />
    </button>
  );
};

const InfoCard = ({
  icon,
  label,
  value,
  capitalize = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  capitalize?: boolean;
}) => {
  return (
    <div
      className="
        rounded-xl

        border
        border-slate-200

        bg-slate-50/50

        p-3.5
      "
    >
      <div
        className="
          flex
          items-center
          gap-2

          mb-2
        "
      >
        <span className="text-slate-400">{icon}</span>

        <span
          className="
            text-[10px]

            font-semibold

            text-slate-400

            uppercase
            tracking-wide
          "
        >
          {label}
        </span>
      </div>

      <p
        className={`
          text-xs

          font-semibold

          text-slate-800

          ${capitalize ? "capitalize" : ""}
        `}
      >
        {value}
      </p>
    </div>
  );
};

const ProfileOption = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full

        p-4

        flex
        items-center
        gap-3

        text-left

        hover:bg-slate-50

        transition-colors

        cursor-pointer
      "
    >
      <span
        className="
          w-9
          h-9

          rounded-xl

          bg-indigo-50

          flex
          items-center
          justify-center

          text-indigo-600

          shrink-0
        "
      >
        {icon}
      </span>

      <span className="flex-1">
        <span
          className="
            block

            text-xs

            font-bold

            text-slate-800
          "
        >
          {title}
        </span>

        <span
          className="
            block

            mt-0.5

            text-[10px]

            text-slate-400
          "
        >
          {description}
        </span>
      </span>

      <ChevronDown
        className="
          w-4
          h-4

          text-slate-300

          -rotate-90
        "
      />
    </button>
  );
};

const PreferenceCard = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        p-4

        rounded-2xl

        border
        border-slate-200

        bg-white

        text-left

        hover:bg-slate-50
        hover:border-indigo-200

        transition-all

        cursor-pointer
      "
    >
      <span
        className="
          w-9
          h-9

          rounded-xl

          bg-indigo-50

          flex
          items-center
          justify-center

          text-indigo-600

          mb-3
        "
      >
        {icon}
      </span>

      <p
        className="
          text-xs

          font-bold

          text-slate-800
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1

          text-[10px]

          leading-relaxed

          text-slate-400
        "
      >
        {description}
      </p>
    </button>
  );
};

const SecurityStatus = () => {
  return (
    <div
      className="
        p-4

        rounded-2xl

        bg-emerald-50

        border
        border-emerald-100

        flex
        items-start
        gap-3
      "
    >
      <div
        className="
          w-9
          h-9

          rounded-xl

          bg-white

          flex
          items-center
          justify-center

          shrink-0
        "
      >
        <ShieldCheck
          className="
            w-4
            h-4

            text-emerald-600
          "
        />
      </div>

      <div className="flex-1">
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <p
            className="
              text-xs

              font-bold

              text-emerald-800
            "
          >
            Account & Workspace Secured
          </p>

          <span
            className="
              px-1.5
              py-0.5

              rounded-full

              bg-emerald-100
              text-emerald-700

              text-[8px]

              font-bold
            "
          >
            ACTIVE
          </span>
        </div>

        <p
          className="
            mt-1

            text-[10px]

            leading-relaxed

            text-emerald-600
          "
        >
          Your account and workspace are currently active.
        </p>
      </div>
    </div>
  );
};

const AccountDetail = ({
  icon,
  title,
  value,
  status = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  status?: boolean;
}) => {
  return (
    <div
      className="
        p-4

        rounded-2xl

        border
        border-slate-200

        flex
        items-center
        gap-3
      "
    >
      <div
        className="
          w-10
          h-10

          rounded-xl

          bg-slate-50

          border
          border-slate-100

          flex
          items-center
          justify-center

          text-slate-500

          shrink-0
        "
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="
            text-[10px]

            uppercase
            tracking-wide

            font-bold

            text-slate-400
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1

            text-xs

            font-semibold

            text-slate-800

            break-all
          "
        >
          {value}
        </p>
      </div>

      {status && (
        <span
          className="
            px-2
            py-1

            rounded-full

            bg-emerald-50
            text-emerald-600

            text-[9px]

            font-bold
          "
        >
          Active
        </span>
      )}
    </div>
  );
};

const PasswordInput = ({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
}) => {
  return (
    <div>
      <label
        className="
          block

          text-[10px]

          font-bold

          text-slate-500

          uppercase
          tracking-wide

          mb-1.5
        "
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          className="
            absolute
            left-3
            top-1/2

            -translate-y-1/2

            w-4
            h-4

            text-slate-400
          "
        />

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className="
            w-full

            h-10

            pl-10
            pr-10

            rounded-xl

            border
            border-slate-200

            bg-white

            text-xs

            text-slate-900

            outline-none

            focus:border-indigo-400

            focus:ring-4
            focus:ring-indigo-50
          "
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute

            right-2.5
            top-1/2

            -translate-y-1/2

            text-slate-400

            hover:text-slate-700

            cursor-pointer
          "
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
}) => {
  return (
    <div>
      <label
        className="
          block

          text-[10px]

          font-bold

          text-slate-500

          uppercase
          tracking-wide

          mb-1.5
        "
      >
        {label}
      </label>

      <div className="relative">
        <span
          className="
            absolute
            left-3
            top-1/2

            -translate-y-1/2

            text-slate-400
          "
        >
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full

            h-10

            pl-10
            pr-3

            rounded-xl

            border
            border-slate-200

            bg-white

            text-xs

            text-slate-900

            outline-none

            focus:border-indigo-400

            focus:ring-4
            focus:ring-indigo-50
          "
        />
      </div>
    </div>
  );
};

const NotificationSetting = ({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) => {
  return (
    <div
      className="
        p-4

        rounded-2xl

        border
        border-slate-200

        flex
        items-center
        gap-4
      "
    >
      <div className="flex-1">
        <p
          className="
            text-xs

            font-bold

            text-slate-800
          "
        >
          {title}
        </p>

        <p
          className="
            text-[10px]

            text-slate-400

            mt-1

            leading-relaxed
          "
        >
          {description}
        </p>
      </div>

      <ToggleControl enabled={enabled} onChange={onChange} />
    </div>
  );
};

const ToggleControl = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        relative

        w-10
        h-5

        rounded-full

        transition-colors

        cursor-pointer

        shrink-0

        ${enabled ? "bg-indigo-600" : "bg-slate-300"}
      `}
      aria-pressed={enabled}
    >
      <span
        className={`
          absolute

          top-0.5

          w-4
          h-4

          rounded-full

          bg-white

          shadow-sm

          transition-transform

          ${enabled ? "translate-x-5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
};

const SecurityItem = ({
  icon,
  title,
  description,
  status,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: string;
  action?: string;
}) => {
  return (
    <div
      className="
        p-4

        rounded-2xl

        border
        border-slate-200

        flex
        items-center
        gap-3
      "
    >
      <div
        className="
          w-10
          h-10

          rounded-xl

          bg-slate-50

          flex
          items-center
          justify-center

          text-slate-500

          shrink-0
        "
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="
            text-xs

            font-bold

            text-slate-800
          "
        >
          {title}
        </p>

        <p
          className="
            text-[10px]

            text-slate-400

            mt-1
          "
        >
          {description}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p
          className="
            text-[9px]

            font-bold

            text-emerald-600
          "
        >
          {status}
        </p>

        {action && (
          <button
            type="button"
            className="
              mt-1

              text-[9px]

              font-bold

              text-indigo-600

              hover:text-indigo-800

              cursor-pointer
            "
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
};

const SuccessMessage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className="
        p-3

        rounded-xl

        bg-emerald-50

        border
        border-emerald-100

        text-[10px]

        font-semibold

        text-emerald-700

        flex
        items-center
        gap-2
      "
    >
      <CheckCircle2 className="w-4 h-4" />
      {children}
    </div>
  );
};

export default Header;
