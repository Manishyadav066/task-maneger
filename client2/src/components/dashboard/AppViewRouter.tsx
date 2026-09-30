
import React from "react";

import { NavigationTab } from "../layout/Sidebar";

import { DashboardOverview } from "./DashboardOverview";
import { ProjectsView } from "../projects/ProjectsView";
import { KanbanBoard } from "../tasks/KanbanBoard";
import { AnalyticsView } from "../analytics/AnalyticsView";

import { WorkspacesPage } from "../../app/(dashboard)/workspaces/page";
import { NotificationsPage } from "../../app/(dashboard)/notifications/page";

import { TeamContainer } from "../../modules/team/components/TeamContainer";

import { FilesView } from "../files/FilesView";
import { SettingsView } from "../settings/SettingsView";

import type {
  User,
  Workspace,
  Project,
  Task,
  Activity,
  DashboardKPIs,
  TaskStatus,
} from "../../types";

interface AppViewRouterProps {
  activeTab: NavigationTab;

  kpis: DashboardKPIs;

  projects: Project[];

  tasks: Task[];

  displayTasks: Task[];

  users: User[];

  activities: Activity[];

  analytics: {
    statusBreakdown: {
      status: string;
      name: string;
      count: number;
      color: string;
    }[];

    weeklyVelocity: {
      day: string;
      created: number;
      completed: number;
    }[];
  };

  currentUser: User;

  selectedProjectId?: string;

  activeWorkspace: Workspace | null;

  onSelectProject: (
    projectId: string | undefined
  ) => void;

  onSelectTask: (
    task: Task
  ) => void;

  onOpenTasks: (
    projectId?: string
  ) => void;

  onOpenAISummary: (
    projectId: string
  ) => void;

  onOpenAIGenerator: () => void;

  onOpenCreateTask: () => void;

  onInviteMember: (
    memberData: Partial<User>
  ) => void;

  /*
   * Team member ke "View Tasks" button se
   * ye callback call hoga.
   */
  onViewMemberTasks: (
    memberId: string
  ) => void;

  onCreateProject: (
    projectData: Partial<Project>
  ) => void;

  onUpdateProject: (
    projectId: string,
    updates: Partial<Project>
  ) => void;

  onDeleteProject: (
    projectId: string
  ) => void;

  onUpdateTaskStatus: (
    taskId: string,
    status: TaskStatus
  ) => void;

  onQuickAddTask: (
    status: TaskStatus,
    title: string
  ) => void;

  onSelectWorkspace: (
    workspace: Workspace
  ) => void;

  onUpdateWorkspace: (
    updated: Partial<Workspace>
  ) => void;

  onShowToast: (
    message: string
  ) => void;
}

export const AppViewRouter: React.FC<
  AppViewRouterProps
> = ({
  activeTab,

  kpis,

  projects,

  tasks,

  displayTasks,

  users,

  activities,

  analytics,

  currentUser,

  selectedProjectId,

  activeWorkspace,

  onSelectProject,

  onSelectTask,

  onOpenTasks,

  onOpenAISummary,

  onOpenAIGenerator,

  onOpenCreateTask,

  onInviteMember,

  onViewMemberTasks,

  onCreateProject,

  onUpdateProject,

  onDeleteProject,

  onUpdateTaskStatus,

  onQuickAddTask,

  onSelectWorkspace,

  onUpdateWorkspace,

  onShowToast,
}) => {
  switch (activeTab) {
    /*
     * =========================
     * DASHBOARD
     * =========================
     */
    case "dashboard":
      return (
        <DashboardOverview
          kpis={kpis}
          projects={projects}
          tasks={displayTasks}
          users={users}
          activities={activities}
          analytics={analytics}
          currentUser={currentUser}
          onOpenTasks={onOpenTasks}
          onOpenAISummary={onOpenAISummary}
          onOpenAIGenerator={onOpenAIGenerator}
          onOpenCreateTask={onOpenCreateTask}
          onInviteMember={onInviteMember}
          onUpdateProject={onUpdateProject}
          onDeleteProject={onDeleteProject}
        />
      );

    /*
     * =========================
     * PROJECTS
     * =========================
     */
    case "projects":
      return (
        <ProjectsView
          projects={projects}
          onOpenTasks={onOpenTasks}
          onOpenAISummary={onOpenAISummary}
          onCreateProject={onCreateProject}
          onUpdateProject={onUpdateProject}
          onDeleteProject={onDeleteProject}
        />
      );

    /*
     * =========================
     * TASKS
     * =========================
     */
    case "tasks":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Sprint Kanban Board
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Drag, advance status, and coordinate sprint
                deliverables across columns.
              </p>
            </div>
          </div>

          <KanbanBoard
            tasks={displayTasks}
            projects={projects}
            users={users}
            selectedProjectId={selectedProjectId}
            onSelectProject={onSelectProject}
            onSelectTask={onSelectTask}
            onUpdateStatus={onUpdateTaskStatus}
            onQuickAddTask={onQuickAddTask}
            onOpenAIGenerator={onOpenAIGenerator}
          />
        </div>
      );

    /*
     * =========================
     * ANALYTICS
     * =========================
     */
    case "analytics":
      return (
        <AnalyticsView
          tasks={tasks}
          users={users}
        />
      );

    /*
     * =========================
     * WORKSPACES
     * =========================
     */
    case "workspaces":
      return (
        <WorkspacesPage
          currentWorkspaceId={
            activeWorkspace?.id
          }
          onSelectWorkspace={
            onSelectWorkspace
          }
        />
      );

    /*
     * =========================
     * NOTIFICATIONS
     * =========================
     */
    case "notifications":
      return (
        <NotificationsPage />
      );

    /*
     * =========================
     * TEAM
     * =========================
     *
     * TeamContainer ko member task
     * callback pass kiya ja raha hai.
     */
    case "team":
      return (
        <TeamContainer
          workspaceId={
            activeWorkspace?.id
          }
          onViewMemberTasks={
            onViewMemberTasks
          }
        />
      );

    /*
     * =========================
     * FILES
     * =========================
     */
    case "files":
      return (
        <FilesView
          projects={projects}
        />
      );

    /*
     * =========================
     * SETTINGS
     * =========================
     */
    case "settings":
      return (
        <SettingsView
          workspace={
            activeWorkspace || {
              id: "ws-1",
              name: "Acme Corp",
              slug: "acme-corp",
              icon: "⚡",
              membersCount: 12,
              role: "owner",
            }
          }
          currentUser={currentUser}
          onUpdateWorkspace={
            onUpdateWorkspace
          }
          onShowToast={
            onShowToast
          }
        />
      );

    /*
     * =========================
     * DEFAULT
     * =========================
     */
    default:
      return null;
  }
};
