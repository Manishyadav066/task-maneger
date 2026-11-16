"use client";

import React, { useEffect, useState } from "react";

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
  LogIn,
  Building2,
  X,
} from "lucide-react";

import { Project, User } from "../../types";

export type NavigationTab =
  | "dashboard"
  | "workspaces"
  | "projects"
  | "tasks"
  | "analytics"
  | "team"
  | "notifications"
  | "ai"
  | "files"
  | "settings";

interface SidebarProps {
  activeTab: NavigationTab;

  onTabChange: (tab: NavigationTab) => void;

  projects: Project[];

  selectedProjectId?: string;

  onSelectProject: (projectId: string) => void;

  currentUser?: User;

  onOpenAuth?: () => void;

  /*
   * false = sidebar visible
   * true  = sidebar completely hidden
   */
  isCollapsed?: boolean;

  /*
   * Parent component sidebar open/close karega
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
  onOpenAuth,
  isCollapsed = false,
  onToggleCollapse,
  unreadCount = 3,
}) => {
  const [isActiveProjectsOpen, setIsActiveProjectsOpen] = useState(true);

  /*
   * ==========================================================
   * MOBILE BODY SCROLL LOCK
   * ==========================================================
   */

  useEffect(() => {
    if (
      !isCollapsed &&
      typeof window !== "undefined" &&
      window.innerWidth < 768
    ) {
      const previousOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    return undefined;
  }, [isCollapsed]);

  /*
   * ==========================================================
   * ESC KEY
   * ==========================================================
   */

  useEffect(() => {
    if (isCollapsed) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && window.innerWidth < 768) {
        onToggleCollapse?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isCollapsed, onToggleCollapse]);

  /*
   * ==========================================================
   * MOBILE NAVIGATION CLICK
   * ==========================================================
   */

  const handleTabClick = (tab: NavigationTab) => {
    onTabChange(tab);

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onToggleCollapse?.();
    }
  };

  /*
   * ==========================================================
   * NAVIGATION
   * ==========================================================
   */

  const mainMenu: NavItem[] = [
    {
      id: "dashboard",
      label: "Overview",
      icon: LayoutDashboard,
    },

    {
      id: "workspaces",
      label: "Workspaces",
      icon: Building2,
    },

    {
      id: "projects",
      label: "Projects",
      icon: FolderKanban,
      badge: projects.length,
    },

    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
    },
  ];

  const toolsMenu: NavItem[] = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount,
    },

    {
      id: "files",
      label: "Files",
      icon: FileText,
    },

    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },

    {
      id: "team",
      label: "Team",
      icon: Users,
    },

    {
      id: "ai",
      label: "AI Assistant",
      icon: Sparkles,
      highlight: true,
    },
  ];

  /*
   * ==========================================================
   * COLLAPSED STATE
   *
   * Sidebar completely invisible.
   *
   * Header ka hamburger parent/header se control hoga.
   * ==========================================================
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

  /*
   * ==========================================================
   * NAV ITEM
   * ==========================================================
   */

  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;

    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        id={`nav-${item.id}-btn`}
        type="button"
        onClick={() => handleTabClick(item.id)}
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
        {/* LEFT */}
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
                  ? "text-white"
                  : item.highlight
                    ? "text-indigo-600"
                    : "text-slate-400 group-hover:text-slate-700"
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

        {/* BADGE */}
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
                item.id === "notifications"
                  ? "bg-red-500 text-white"
                  : isActive
                    ? "bg-indigo-700 text-white"
                    : "bg-slate-100 text-slate-600"
              }
            `}
          >
            {item.badge}
          </span>
        )}

        {/* NEW */}
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

  /*
   * ==========================================================
   * ACTIVE PROJECTS
   * ==========================================================
   */

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
        {/* HEADER */}
        <button
          id="sidebar-active-projects-btn"
          type="button"
          onClick={() => setIsActiveProjectsOpen(!isActiveProjectsOpen)}
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

              ${isActiveProjectsOpen ? "rotate-180 text-indigo-600" : ""}
            `}
          />
        </button>

        {/* PROJECTS */}
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
                    selectedProjectId === project.id && activeTab === "tasks";

                  return (
                    <button
                      key={project.id}
                      id={`sidebar-project-${project.id}`}
                      type="button"
                      onClick={() => {
                        onSelectProject(project.id);

                        handleTabClick("tasks");
                      }}
                      className={`
                          w-full

                          px-3
                          py-2

                          rounded-lg

                          flex
                          items-center
                          gap-2.5

                          text-left

                          cursor-pointer

                          transition-colors

                          ${
                            isSelected
                              ? `
                                bg-indigo-50
                                text-indigo-700
                              `
                              : `
                                text-slate-500
                                hover:bg-white
                                hover:text-slate-800
                              `
                          }
                        `}
                    >
                      <span
                        className="
                            w-2
                            h-2

                            rounded-full

                            bg-indigo-500

                            shrink-0
                          "
                      />

                      <span
                        className="
                            text-xs
                            font-medium

                            truncate

                            flex-1
                          "
                      >
                        {project.name}
                      </span>

                      {isSelected && (
                        <span
                          className="
                              text-[9px]
                              font-bold
                              text-indigo-500
                            "
                        >
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </>
            )}

            {projects.length > 4 && (
              <button
                type="button"
                onClick={() => handleTabClick("projects")}
                className="
                  w-full

                  mt-1
                  px-3
                  py-2

                  text-left

                  text-[10px]
                  font-bold

                  text-indigo-600

                  hover:bg-white

                  rounded-lg

                  cursor-pointer
                "
              >
                View all projects →
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* ======================================================
          MOBILE OVERLAY

          IMPORTANT:
          Sidebar open hone par overlay mobile me hi dikhega.

          z-[250]
          Sidebar z-[300]

          Isse Header ka purana hamburger/close button
          sidebar ke neeche chala jayega.
      ====================================================== */}

      {onToggleCollapse && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onToggleCollapse}
          className="
            fixed
            inset-0

            z-[250]

            bg-black/25

            md:hidden

            cursor-pointer
          "
        />
      )}

      {/* ======================================================
          SIDEBAR

          MOBILE:
          fixed
          82vw
          max 320px

          DESKTOP:
          sticky
          280px

          z-[300] intentionally rakha gaya hai.
          Isse Header ka hamburger sidebar ke open state me
          visible nahi rahega.
      ====================================================== */}

      <aside
        id="main-sidebar"
        className="
          fixed

          left-0
          top-0

          z-[300]

          w-[82vw]
          max-w-[320px]

          h-screen

          bg-white
          text-slate-700

          flex
          flex-col

          border-r
          border-slate-200

          select-none

          shadow-2xl

          overflow-hidden

          md:sticky
          md:top-0
          md:z-40

          md:w-[280px]
          md:min-w-[280px]
          md:max-w-none

          md:shadow-sm
        "
      >
        {/* ====================================================
            MOBILE CLOSE BUTTON

            Mobile open state me ye ONLY close control hai.

            Header ka hamburger sidebar ke peeche rahega.
        ==================================================== */}

        {onToggleCollapse && (
          <button
            id="sidebar-mobile-close-btn"
            type="button"
            onClick={onToggleCollapse}
            aria-label="Close sidebar"
            title="Close sidebar"
            className="
              absolute

              top-3
              right-3

              z-[320]

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

              shadow-lg

              hover:bg-slate-50
              hover:text-slate-900

              active:scale-95

              transition-all
              duration-150

              cursor-pointer

              md:hidden
            "
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* ====================================================
            BRAND
        ==================================================== */}

        <div
          className="
            px-5
            pt-5
            pb-4

            border-b
            border-slate-100

            shrink-0
          "
        >
          <div
            className="
              flex
              items-center
              gap-3

              pr-12
            "
          >
            {/* LOGO */}
            <div
              className="
                w-10
                h-10

                rounded-xl

                bg-indigo-600

                flex
                items-center
                justify-center

                text-white

                shadow-sm
                shadow-indigo-200

                shrink-0
              "
            >
              <Layers className="w-5 h-5" />
            </div>

            {/* BRAND TEXT */}
            <div className="min-w-0">
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                    text-slate-950
                  "
                >
                  TaskFlow
                </span>

                <span
                  className="
                    px-2
                    py-0.5

                    rounded-md

                    bg-indigo-50

                    border
                    border-indigo-100

                    text-[10px]
                    font-extrabold

                    text-indigo-700
                  "
                >
                  AI
                </span>
              </div>

              <span
                className="
                  block

                  text-xs

                  text-slate-500

                  font-medium
                "
              >
                SaaS Project OS
              </span>
            </div>
          </div>
        </div>

        {/* ====================================================
            MAIN CONTENT
        ==================================================== */}

        <div
          className="
            flex-1

            overflow-y-auto

            px-3
            py-4

            scrollbar-thin
          "
        >
          {/* ==================================================
              MAIN MENU
          ================================================== */}

          <section>
            <div
              className="
                px-3
                mb-2
              "
            >
              <span
                className="
                  text-[10px]

                  font-extrabold

                  uppercase
                  tracking-widest

                  text-slate-400
                "
              >
                Main Menu
              </span>
            </div>

            <nav className="space-y-1">{mainMenu.map(renderNavItem)}</nav>
          </section>

          {/* ==================================================
              ACTIVE PROJECTS
          ================================================== */}

          <section className="mt-5">{renderActiveProjects()}</section>

          {/* ==================================================
              TOOLS
          ================================================== */}

          <section className="mt-6">
            <div
              className="
                px-3
                mb-2
              "
            >
              <span
                className="
                  text-[10px]

                  font-extrabold

                  uppercase
                  tracking-widest

                  text-slate-400
                "
              >
                Tools
              </span>
            </div>

            <nav className="space-y-1">{toolsMenu.map(renderNavItem)}</nav>
          </section>

          {/* ==================================================
              SETTINGS
          ================================================== */}

          <section
            className="
              mt-6
              pt-4

              border-t
              border-slate-100
            "
          >
            <button
              id="nav-settings-btn"
              type="button"
              onClick={() => handleTabClick("settings")}
              className={`
                group

                w-full
                min-h-[42px]

                px-3
                py-2

                rounded-xl

                flex
                items-center
                gap-3

                text-left

                cursor-pointer

                transition-all
                duration-200

                ${
                  activeTab === "settings"
                    ? `
                      bg-indigo-600
                      text-white
                      font-semibold
                      shadow-sm
                      shadow-indigo-200
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

                  shrink-0

                  ${
                    activeTab === "settings"
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-700"
                  }
                `}
              />

              <span
                className="
                  text-[14px]
                "
              >
                Settings
              </span>
            </button>
          </section>
        </div>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <div
          className="
            shrink-0

            border-t
            border-slate-200

            bg-slate-50/60

            px-4
            py-4
          "
        >
          {/* USER */}
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* AVATAR */}
            <div
              className="
                w-9
                h-9

                rounded-full

                bg-indigo-100

                flex
                items-center
                justify-center

                text-indigo-600

                shrink-0
              "
            >
              <Users className="w-4 h-4" />
            </div>

            {/* USER INFO */}
            <div className="min-w-0">
              <p
                className="
                  text-xs
                  font-bold

                  text-slate-900

                  truncate
                "
              >
                {currentUser?.name || "User"}
              </p>

              <p
                className="
                  text-[10px]

                  text-slate-400

                  truncate

                  mt-0.5
                "
              >
                {currentUser?.role === "owner"
                  ? "Workspace Owner"
                  : currentUser?.role || "Member"}
              </p>
            </div>
          </div>

          {/* SECURITY */}
          <div
            className="
              mt-3

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
            <ShieldCheck
              className="
                w-4
                h-4

                text-emerald-600

                shrink-0
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

          {/* LOGIN */}
          {!currentUser && onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="
                  w-full

                  mt-3

                  h-10

                  rounded-xl

                  bg-indigo-600

                  text-white

                  text-xs
                  font-bold

                  flex
                  items-center
                  justify-center
                  gap-2

                  hover:bg-indigo-700

                  active:scale-[0.99]

                  transition-all

                  cursor-pointer
                "
            >
              <LogIn
                className="
                    w-4
                    h-4
                  "
              />
              Login
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
