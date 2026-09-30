import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Users,
  Bell,
  Sparkles,
  FileText,
  Settings,
  Layers,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  LogIn,
  Building2,
} from 'lucide-react';
import { Project, User } from '../../types';

export type NavigationTab =
  | 'dashboard'
  | 'workspaces'
  | 'projects'
  | 'tasks'
  | 'analytics'
  | 'team'
  | 'notifications'
  | 'ai'
  | 'files'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (projectId: string) => void;
  currentUser?: User;
  onOpenAuth?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  unreadCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  projects,
  selectedProjectId,
  onSelectProject,
  currentUser,
  onOpenAuth,
  isCollapsed = false,
  onToggleCollapse,
  unreadCount = 3,
}) => {
  const [isActiveProjectsOpen, setIsActiveProjectsOpen] = useState(true);

  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'workspaces' as NavigationTab, label: 'Workspaces', icon: Building2 },
    { id: 'projects' as NavigationTab, label: 'Projects', icon: FolderKanban, badge: projects.length },
    { id: 'tasks' as NavigationTab, label: 'Tasks', icon: CheckSquare },
    { id: 'notifications' as NavigationTab, label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'files' as NavigationTab, label: 'Files', icon: FileText },
    { id: 'analytics' as NavigationTab, label: 'Analytics', icon: BarChart3 },
    { id: 'team' as NavigationTab, label: 'Team', icon: Users },
    { id: 'ai' as NavigationTab, label: 'AI Assistant', icon: Sparkles, highlight: true },
  ];

  // ==========================================
  // COLLAPSED SIDEBAR (Icon Only Mode)
  // ==========================================
  if (isCollapsed) {
    return (
      <aside className="w-16 bg-white text-slate-700 flex flex-col items-center shrink-0 border-r border-slate-200 select-none h-screen sticky top-0 z-40 shadow-2xs py-3 transition-all duration-200">
        {/* Brand Icon */}
        <div className="flex flex-col items-center gap-2 pb-3 border-b border-slate-100 w-full">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Nav Items (Icons Only with Tooltips) */}
        <div className="flex-1 w-full overflow-y-auto py-4 space-y-1.5 px-2 flex flex-col items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-collapsed-${item.id}-btn`}
                onClick={() => onTabChange(item.id)}
                title={item.label}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative group cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                    : item.highlight
                    ? 'text-indigo-600 hover:bg-indigo-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.badge !== undefined && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white" />
                )}
              </button>
            );
          })}

          {/* Active Projects Quick Icon */}
          <button
            id="collapsed-active-projects-btn"
            onClick={() => onTabChange('projects')}
            title="Active Projects"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-slate-100 transition-all cursor-pointer relative"
          >
            <FolderKanban className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>
        </div>

        {/* Bottom Settings */}
        <div className="w-full flex flex-col items-center gap-2 pt-3 border-t border-slate-100">
          <button
            id="collapsed-settings-btn"
            onClick={() => onTabChange('settings')}
            title="Settings"
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>
    );
  }

  // ==========================================
  // EXPANDED SIDEBAR (Full Mode)
  // ==========================================
  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col shrink-0 border-r border-slate-200 select-none h-screen sticky top-0 z-40 shadow-2xs transition-all duration-200">
      {/* Brand Header with Close/Collapse Toggle */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-base tracking-tight">TaskFlow</span>
              <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                AI
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block font-normal -mt-0.5">SaaS Project OS</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Workspace Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}-btn`}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200 font-semibold'
                      : item.highlight
                      ? 'text-indigo-600 hover:bg-indigo-50/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-white'
                          : item.highlight
                          ? 'text-indigo-600'
                          : 'text-slate-400 group-hover:text-slate-700'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold uppercase">
                      New
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Projects Button & Accordion */}
        <div>
          <button
            id="sidebar-active-projects-btn"
            type="button"
            onClick={() => setIsActiveProjectsOpen(!isActiveProjectsOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/80 transition-all cursor-pointer border border-slate-200/60 shadow-2xs group"
          >
            <div className="flex items-center gap-2">
              <FolderKanban className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-110 transition-transform" />
              <span>Active Projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white text-slate-600 font-bold border border-slate-200">
                {projects.length}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isActiveProjectsOpen ? 'rotate-180 text-indigo-600' : ''
                }`}
              />
            </div>
          </button>

          {/* Collapsible Projects List */}
          {isActiveProjectsOpen && (
            <div className="mt-1.5 space-y-1 pl-1">
              {projects.slice(0, 4).map((project) => (
                <button
                  key={project.id}
                  id={`sidebar-project-${project.id}`}
                  onClick={() => {
                    onSelectProject(project.id);
                    onTabChange('tasks');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors text-left cursor-pointer ${
                    selectedProjectId === project.id && activeTab === 'tasks'
                      ? 'bg-indigo-50 text-indigo-900 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: project.color || '#6366f1' }}
                    />
                    <span className="truncate">{project.name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium shrink-0 ml-1">
                    {project.progress}%
                  </span>
                </button>
              ))}
              <button
                onClick={() => onTabChange('projects')}
                className="w-full text-left px-3 py-1 text-[11px] text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer"
              >
                + View all projects
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Footer Settings & User Profile (Light Mode) */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <button
          id="sidebar-settings-btn"
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-indigo-50 text-indigo-900 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white'
          }`}
          title="Workspace Settings"
        >
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-slate-500" />
            <span className="font-medium">Settings</span>
          </div>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
        </button>

        {/* Current User Card (No Avatar) */}
        {currentUser && (
          <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between px-1">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser.department}</div>
              </div>
            </div>

            {onOpenAuth && (
              <button
                id="sidebar-switch-auth-btn"
                onClick={onOpenAuth}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                title="Switch User / Sign In UI"
              >
                <LogIn className="w-3.5 h-3.5 text-indigo-600" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
