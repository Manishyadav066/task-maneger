
'use client';

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
  ChevronDown,
  ShieldCheck,
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

  /**
   * false = sidebar visible
   * true  = sidebar completely hidden
   */
  isCollapsed?: boolean;

  /**
   * Parent component se sidebar open/close control hoga.
   */
  onToggleCollapse?: () => void;

  unreadCount?: number;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
  highlight?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  projects,
  selectedProjectId,
  onSelectProject,
  currentUser,
  isCollapsed = false,
  unreadCount = 3,
}) => {
  const [isActiveProjectsOpen, setIsActiveProjectsOpen] =
    useState(true);

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const mainMenu: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },

    {
      id: 'workspaces',
      label: 'Workspaces',
      icon: Building2,
    },

    {
      id: 'projects',
      label: 'Projects',
      icon: FolderKanban,
      badge: projects.length,
    },

    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
    },
  ];

  const toolsMenu: NavItem[] = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      badge: unreadCount,
    },

    {
      id: 'files',
      label: 'Files',
      icon: FileText,
    },

    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
    },

    {
      id: 'team',
      label: 'Team',
      icon: Users,
    },

    {
      id: 'ai',
      label: 'AI Assistant',
      icon: Sparkles,
      highlight: true,
    },
  ];

  // ==========================================================
  // COLLAPSED STATE
  // ==========================================================

  /**
   * Sidebar completely invisible rahega.
   *
   * NO:
   * - hamburger
   * - 3-line button
   * - logo
   * - icons
   * - mini sidebar
   * - navigation buttons
   *
   * Lekin <aside> ki jagah 0 width element rahega,
   * jisse parent layout break nahi hoga.
   */

  if (isCollapsed) {
    return (
      <aside
        aria-hidden="true"
        className="
          w-0
          min-w-0
          h-screen
          shrink-0
          overflow-hidden
          border-0
          p-0
          m-0
          bg-transparent
          transition-all
          duration-200
        "
      />
    );
  }

  // ==========================================================
  // NAV ITEM
  // ==========================================================

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;

    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        id={`nav-${item.id}-btn`}
        type="button"
        onClick={() => onTabChange(item.id)}
        className={`
          group
          w-full
          min-h-[42px]
          px-3
          py-2
          rounded-xl

          flex
          items-center
          justify-between
          gap-3

          text-left
          cursor-pointer

          transition-all
          duration-200

          ${
            isActive
              ? `
                bg-indigo-600
                text-white
                font-semibold
                shadow-sm
                shadow-indigo-200
              `
              : item.highlight
              ? `
                  text-indigo-600
                  font-semibold
                  hover:bg-indigo-50
                `
              : `
                  text-slate-600
                  font-medium
                  hover:bg-slate-100
                  hover:text-slate-950
                `
          }
        `}
      >
        {/* Left */}
        <div
          className="
            flex
            items-center
            gap-3
            min-w-0
          "
        >
          <Icon
            className={`
              w-[18px]
              h-[18px]
              shrink-0

              transition-transform
              duration-200

              group-hover:scale-105

              ${
                isActive
                  ? 'text-white'
                  : item.highlight
                  ? 'text-indigo-600'
                  : 'text-slate-400 group-hover:text-slate-700'
              }
            `}
          />

          <span
            className="
              truncate
              text-[14px]
            "
          >
            {item.label}
          </span>
        </div>

        {/* Badge */}
        {item.badge !== undefined && (
          <span
            className={`
              min-w-[28px]
              h-6
              px-2

              flex
              items-center
              justify-center

              rounded-full

              text-[11px]
              font-bold

              shrink-0

              ${
                item.id === 'notifications'
                  ? 'bg-red-500 text-white'
                  : isActive
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-100 text-slate-600'
              }
            `}
          >
            {item.badge}
          </span>
        )}

        {/* New */}
        {item.highlight && !isActive && (
          <span
            className="
              px-2
              py-1

              rounded-full

              bg-indigo-100
              text-indigo-700

              text-[10px]
              font-bold

              shrink-0
            "
          >
            New
          </span>
        )}
      </button>
    );
  };

  // ==========================================================
  // ACTIVE PROJECTS
  // ==========================================================

  const renderActiveProjects = () => {
    return (
      <div
        className="
          rounded-2xl
          border
          border-slate-200

          bg-slate-50/70

          overflow-hidden
        "
      >
        {/* Header */}

        <button
          id="sidebar-active-projects-btn"
          type="button"
          onClick={() =>
            setIsActiveProjectsOpen(!isActiveProjectsOpen)
          }
          className="
            w-full

            px-3.5
            py-3

            flex
            items-center
            justify-between

            text-left

            cursor-pointer

            hover:bg-slate-100

            transition-colors
          "
        >
          <div
            className="
              flex
              items-center
              gap-2.5
            "
          >
            <FolderKanban
              className="
                w-4
                h-4
                text-indigo-600
              "
            />

            <span
              className="
                text-xs
                font-bold
                text-slate-800
              "
            >
              Active Projects
            </span>

            <span
              className="
                min-w-[24px]
                h-5
                px-1.5

                flex
                items-center
                justify-center

                rounded-full

                bg-white
                border
                border-slate-200

                text-[10px]
                font-bold
                text-slate-600
              "
            >
              {projects.length}
            </span>
          </div>

          <ChevronDown
            className={`
              w-4
              h-4

              text-slate-400

              transition-transform
              duration-200

              ${
                isActiveProjectsOpen
                  ? 'rotate-180 text-indigo-600'
                  : ''
              }
            `}
          />
        </button>

        {/* Projects */}

        {isActiveProjectsOpen && (
          <div className="px-2 pb-2">
            {projects.length === 0 ? (
              <div
                className="
                  px-3
                  py-3
                  text-xs
                  text-slate-400
                "
              >
                No active projects
              </div>
            ) : (
              <>
                {projects.slice(0, 4).map((project) => {
                  const isSelected =
                    selectedProjectId === project.id &&
                    activeTab === 'tasks';

                  return (
                    <button
                      key={project.id}
                      id={`sidebar-project-${project.id}`}
                      type="button"
                      onClick={() => {
                        onSelectProject(project.id);
                        onTabChange('tasks');
                      }}
                      className={`
                        w-full

                        flex
                        items-center
                        justify-between

                        gap-2

                        px-3
                        py-2

                        rounded-lg

                        text-left

                        cursor-pointer

                        transition-colors

                        ${
                          isSelected
                            ? `
                              bg-white
                              text-indigo-900
                              shadow-sm
                            `
                            : `
                              text-slate-600
                              hover:bg-white
                              hover:text-slate-900
                            `
                        }
                      `}
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2.5

                          min-w-0
                        "
                      >
                        <span
                          className="
                            w-2
                            h-2
                            rounded-full
                            shrink-0
                          "
                          style={{
                            backgroundColor:
                              project.color || '#6366f1',
                          }}
                        />

                        <span
                          className="
                            truncate

                            text-xs
                            font-medium
                          "
                        >
                          {project.name}
                        </span>
                      </div>

                      <span
                        className="
                          text-[10px]
                          text-slate-400
                          font-semibold
                          shrink-0
                        "
                      >
                        {project.progress}%
                      </span>
                    </button>
                  );
                })}

                {projects.length > 4 && (
                  <button
                    type="button"
                    onClick={() =>
                      onTabChange('projects')
                    }
                    className="
                      w-full

                      px-3
                      py-2

                      text-left

                      text-[11px]

                      text-indigo-600
                      hover:text-indigo-700

                      font-semibold

                      cursor-pointer
                    "
                  >
                    + View all projects
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==========================================================
  // EXPANDED SIDEBAR
  // ==========================================================

  return (
    <aside
      className="
        w-[280px]
        min-w-[280px]

        h-screen
        sticky
        top-0

        z-40
        shrink-0

        bg-white
        text-slate-700

        flex
        flex-col

        border-r
        border-slate-200

        select-none

        shadow-sm

        transition-all
        duration-200
      "
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          h-[76px]

          px-5

          flex
          items-center

          border-b
          border-slate-100

          bg-white
        "
      >
        {/* Logo */}

        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              w-11
              h-11

              rounded-xl

              bg-indigo-600

              flex
              items-center
              justify-center

              text-white

              shadow-sm
            "
          >
            <Layers className="w-6 h-6" />
          </div>

          <div>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  font-bold
                  text-slate-900
                  text-lg
                  tracking-tight
                "
              >
                TaskFlow
              </span>

              <span
                className="
                  text-[10px]
                  uppercase
                  font-extrabold
                  tracking-wider

                  px-2
                  py-0.5

                  rounded

                  bg-indigo-50
                  text-indigo-700

                  border
                  border-indigo-200/60
                "
              >
                AI
              </span>
            </div>

            <span
              className="
                text-xs
                text-slate-500
                block
                font-normal
              "
            >
              SaaS Project OS
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          MAIN NAVIGATION
      ================================================== */}

      <div
        className="
          flex-1

          overflow-y-auto

          px-3
          py-4

          space-y-5

          scrollbar-thin
        "
      >
        {/* Main Menu */}

        <section>
          <div
            className="
              px-3
              pb-2

              text-[10px]
              font-extrabold

              text-slate-400

              uppercase
              tracking-widest
            "
          >
            Main Menu
          </div>

          <nav className="space-y-1">
            {mainMenu.map(renderNavItem)}
          </nav>
        </section>

        {/* Active Projects */}

        <section>
          {renderActiveProjects()}
        </section>

        {/* Tools */}

        <section>
          <div
            className="
              px-3
              pb-2

              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                text-[10px]
                font-extrabold

                text-slate-400

                uppercase
                tracking-widest
              "
            >
              Tools
            </span>
          </div>

          <nav className="space-y-1">
            {toolsMenu.map(renderNavItem)}
          </nav>
        </section>

        {/* Settings */}

        <section>
          <div
            className="
              px-3
              pb-2

              text-[10px]
              font-extrabold

              text-slate-400

              uppercase
              tracking-widest
            "
          >
            Settings
          </div>

          <button
            id="sidebar-settings-btn"
            type="button"
            onClick={() =>
              onTabChange('settings')
            }
            className={`
              w-full

              min-h-[42px]

              px-3
              py-2.5

              rounded-xl

              flex
              items-center
              gap-3

              text-left

              cursor-pointer

              transition-all

              ${
                activeTab === 'settings'
                  ? `
                    bg-indigo-600
                    text-white
                    font-semibold
                    shadow-sm
                  `
                  : `
                    text-slate-600
                    font-medium
                    hover:bg-slate-100
                    hover:text-slate-950
                  `
              }
            `}
          >
            <Settings
              className={`
                w-[18px]
                h-[18px]

                ${
                  activeTab === 'settings'
                    ? 'text-white'
                    : 'text-slate-400'
                }
              `}
            />

            <span className="text-[14px]">
              Settings
            </span>

            <ShieldCheck
              className={`
                w-4
                h-4
                ml-auto

                ${
                  activeTab === 'settings'
                    ? 'text-emerald-300'
                    : 'text-emerald-500'
                }
              `}
            />
          </button>
        </section>
      </div>

      {/* ==================================================
          FOOTER / USER
      ================================================== */}

      <div
        className="
          p-3

          border-t
          border-slate-100

          bg-slate-50/70

          space-y-2
        "
      >
        {/* User */}

        {currentUser && (
          <div
            className="
              flex
              items-center
              justify-between

              px-2
              py-2

              rounded-xl

              bg-white

              border
              border-slate-200
            "
          >
            <div
              className="
                flex
                items-center
                gap-2

                min-w-0
              "
            >
              <span
                className="
                  w-2
                  h-2

                  rounded-full

                  bg-emerald-500

                  shrink-0
                "
              />

              <div className="min-w-0">
                <div
                  className="
                    text-xs
                    font-bold
                    text-slate-900
                    truncate
                  "
                >
                  {currentUser.name}
                </div>

                <div
                  className="
                    text-[10px]
                    text-slate-500
                    truncate
                  "
                >
                  {currentUser.department}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security */}

        <div
          className="
            flex
            items-center
            justify-center

            gap-1.5

            text-[10px]
            text-slate-400
          "
        >
          <ShieldCheck
            className="
              w-3
              h-3

              text-emerald-500
            "
          />

          Workspace secured
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;