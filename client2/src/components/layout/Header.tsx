import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  ChevronDown,
  Check,
  Trash2,
  ExternalLink,
  Plus,
  SlidersHorizontal,
  PanelLeft,
} from 'lucide-react';
import { User, Workspace, Notification } from '../../types';

interface HeaderProps {
  currentUser?: User;
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

export const Header: React.FC<HeaderProps> = ({
  currentUser = {
    id: 'u-1',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    role: 'owner',
  },
  workspaces = [
    {
      id: 'ws-1',
      name: 'Acme Corp',
      slug: 'acme-corp',
      icon: '⚡',
      membersCount: 12,
      role: 'owner',
    },
  ],
  activeWorkspace = {
    id: 'ws-1',
    name: 'Acme Corp',
    slug: 'acme-corp',
    icon: '⚡',
    membersCount: 12,
    role: 'owner',
  },
  onSelectWorkspace = () => {},
  notifications = [],
  onMarkNotificationRead = () => {},
  onMarkAllNotificationsRead = () => {},
  onDeleteNotification = () => {},
  onOpenAIGenerator = () => {},
  onOpenCreateTask = () => {},
  searchQuery = '',
  onSearchChange = () => {},
  onSignOut,
  onOpenAuth,
  onOpenLanding,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Sidebar toggle, Workspace switcher & Global Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        {/* Sidebar Collapse/Expand Button */}
        {onToggleSidebar && (
          <button
            id="sidebar-toggle-header-btn"
            onClick={onToggleSidebar}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/60 shrink-0"
            title={isSidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        )}

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            id="workspace-switcher-btn"
            onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/60 text-slate-800 font-medium text-sm"
          >
            <span className="text-base">{activeWorkspace.icon}</span>
            <span className="font-semibold text-slate-900 hidden sm:inline truncate max-w-[140px]">
              {activeWorkspace.name}
            </span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 font-medium hidden md:inline uppercase">
              {activeWorkspace.role}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showWorkspaceDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws);
                    setShowWorkspaceDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between text-sm transition-colors hover:bg-slate-50 ${
                    ws.id === activeWorkspace.id ? 'bg-indigo-50/70 font-semibold text-indigo-700' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-base">{ws.icon}</span>
                    <span className="truncate">{ws.name}</span>
                  </div>
                  {ws.id === activeWorkspace.id && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks, projects, tags... (Ctrl + K)"
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Right Actions: AI Generator, Create Task, Notifications, User */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Landing Page Link Button */}
        {onOpenLanding && (
          <button
            id="landing-page-header-btn"
            onClick={onOpenLanding}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="View TaskFlow AI Landing Page"
          >
            <span>Landing Page</span>
          </button>
        )}

        {/* Auth / Sign In Page Button */}
        {onOpenAuth && (
          <button
            id="auth-page-header-btn"
            onClick={onOpenAuth}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            title="Open Sign In / Register Page"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>Sign In / Register</span>
          </button>
        )}

        {/* AI Task Generator Trigger */}
        <button
          id="ai-generator-header-btn"
          onClick={onOpenAIGenerator}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-lg text-xs sm:text-sm font-semibold shadow-xs shadow-indigo-200 transition-all hover:shadow-md cursor-pointer"
          title="Use AI Copilot to break down project goals into actionable tasks"
        >
          <Sparkles className="w-4 h-4 animate-pulse text-amber-200" />
          <span className="hidden sm:inline">AI Generator</span>
        </button>

        {/* Create Task Button */}
        <button
          id="create-task-header-btn"
          onClick={onOpenCreateTask}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden md:inline">New Task</span>
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            id="notifications-bell-btn"
            onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotificationDrawer && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllNotificationsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">No notifications yet</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 transition-colors flex items-start justify-between gap-3 ${
                        notif.read ? 'bg-white opacity-80' : 'bg-indigo-50/30'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                          <h4 className="text-xs font-semibold text-slate-900 truncate">{notif.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1.5 block">{notif.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => onMarkNotificationRead(notif.id)}
                            className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded"
                            title="Mark as read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onDeleteNotification(notif.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded"
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

        {/* User Profile Button (No Avatar) */}
        <div className="relative">
          <button
            id="user-profile-menu-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer text-xs font-semibold text-slate-700 shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="max-w-[110px] truncate">{currentUser.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-slate-100">
                <div className="text-sm font-semibold text-slate-900">{currentUser.name}</div>
                <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                <div className="text-[11px] text-indigo-600 mt-1 font-medium">{currentUser.department}</div>
              </div>
              <div className="pt-1">
                {onOpenAuth && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-indigo-600 font-semibold hover:bg-indigo-50 flex items-center justify-between"
                  >
                    <span>Switch Account / Sign In</span>
                    <span className="text-[10px] bg-indigo-100 px-1.5 py-0.5 rounded text-indigo-700">Auth UI</span>
                  </button>
                )}
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Workspace Settings
                </button>
                <button
                  onClick={() => setShowProfileMenu(false)}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Notification Preferences
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onSignOut) {
                      onSignOut();
                    } else if (onOpenAuth) {
                      onOpenAuth();
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
