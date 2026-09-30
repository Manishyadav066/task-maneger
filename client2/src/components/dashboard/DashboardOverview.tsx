
import React, { useState } from "react";

import {
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  X,
} from "lucide-react";

import {
  Project,
  Task,
  User,
  Activity,
  DashboardKPIs,
} from "../../types";

import { KPICard } from "./KPICard";
import { ProjectProgressCard } from "./ProjectProgressCard";
import { AnalyticsChartWidget } from "./AnalyticsChartWidget";
import { RecentActivityWidget } from "./RecentActivityWidget";
import { TeamWidget } from "./TeamWidget";

interface DashboardOverviewProps {
  kpis: DashboardKPIs | null | undefined;

  projects: Project[];

  tasks: Task[];

  users: User[];

  activities: Activity[];

  analytics:
    | {
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
      }
    | null
    | undefined;

  currentUser: User | null | undefined;

  onOpenTasks: (projectId?: string) => void;

  onOpenAISummary: (projectId: string) => void;

  onOpenAIGenerator: () => void;

  onOpenCreateTask: () => void;

  onInviteMember: (member: Partial<User>) => void;

  onUpdateProject?: (
    projectId: string,
    updates: Partial<Project>,
  ) => void;

  onDeleteProject?: (projectId: string) => void;
}

export const DashboardOverview: React.FC<
  DashboardOverviewProps
> = ({
  kpis,
  projects,
  tasks,
  users,
  activities,
  analytics,
  currentUser,
  onOpenTasks,
  onOpenAISummary,
  onOpenAIGenerator,
  onOpenCreateTask,
  onInviteMember,
  onUpdateProject,
  onDeleteProject,
}) => {
  /*
   * =========================================================
   * SAFE DATA
   * =========================================================
   *
   * Backend data load hone me thoda time lag sakta hai.
   * Isliye null/undefined ke case me default values use
   * kar rahe hain.
   *
   * UI/design same rahega.
   */

  const safeKpis: DashboardKPIs = {
    totalProjects: Number(
      kpis?.totalProjects ?? projects?.length ?? 0,
    ),

    totalTasks: Number(
      kpis?.totalTasks ?? tasks?.length ?? 0,
    ),

    completedTasks: Number(
      kpis?.completedTasks ??
        tasks?.filter(
          (task: any) =>
            task.status === "completed" ||
            task.status === "done",
        ).length ??
        0,
    ),

    overdueTasks: Number(
      kpis?.overdueTasks ?? 0,
    ),

    pendingTasks: Number(
      kpis?.pendingTasks ??
        Math.max(
          0,
          Number(
            kpis?.totalTasks ??
              tasks?.length ??
              0,
          ) -
            Number(
              kpis?.completedTasks ?? 0,
            ),
        ),
    ),
  };

  const safeProjects: Project[] =
    Array.isArray(projects)
      ? projects
      : [];

  const safeTasks: Task[] =
    Array.isArray(tasks)
      ? tasks
      : [];

  const safeUsers: User[] =
    Array.isArray(users)
      ? users
      : [];

  const safeActivities: Activity[] =
    Array.isArray(activities)
      ? activities
      : [];

  const safeAnalytics = {
    statusBreakdown:
      Array.isArray(
        analytics?.statusBreakdown,
      )
        ? analytics.statusBreakdown
        : [],

    weeklyVelocity:
      Array.isArray(
        analytics?.weeklyVelocity,
      )
        ? analytics.weeklyVelocity
        : [],
  };

  const safeCurrentUser = currentUser || ({
    id: "",
    name: "User",
    email: "",
  } as User);

  /*
   * =========================================================
   * EDIT PROJECT STATE
   * =========================================================
   */

  const [editingProject, setEditingProject] =
    useState<Project | null>(null);

  const [editName, setEditName] =
    useState("");

  const [editDescription, setEditDescription] =
    useState("");

  const [editCategory, setEditCategory] =
    useState("Web Platform");

  const [editStatus, setEditStatus] =
    useState<
      "active" | "completed" | "on_hold"
    >("active");

  const [editDueDate, setEditDueDate] =
    useState("2026-11-15");

  const [editColor, setEditColor] =
    useState("#6366f1");

  /*
   * =========================================================
   * START EDIT PROJECT
   * =========================================================
   */

  const startEditProject = (
    proj: Project,
  ) => {
    if (!proj) return;

    setEditingProject(proj);

    setEditName(proj.name || "");

    setEditDescription(
      proj.description || "",
    );

    setEditCategory(
      proj.category || "Web Platform",
    );

    /*
     * Backend may return:
     *
     * active
     * in_progress
     * in-progress
     * completed
     * done
     * on_hold
     *
     * UI uses:
     * active | completed | on_hold
     */

    let normalizedStatus:
      | "active"
      | "completed"
      | "on_hold" = "active";

    if (
      proj.status === "completed" ||
      proj.status === "done"
    ) {
      normalizedStatus = "completed";
    } else if (
      proj.status === "on_hold"
    ) {
      normalizedStatus = "on_hold";
    } else {
      normalizedStatus = "active";
    }

    setEditStatus(normalizedStatus);

    setEditDueDate(
      proj.dueDate || "2026-11-15",
    );

    setEditColor(
      proj.color || "#6366f1",
    );
  };

  /*
   * =========================================================
   * EDIT PROJECT SUBMIT
   * =========================================================
   */

  const handleEditSubmit = (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    if (
      !editingProject ||
      !editName.trim()
    ) {
      return;
    }

    if (onUpdateProject) {
      onUpdateProject(
        editingProject.id,
        {
          name: editName.trim(),

          description:
            editDescription.trim(),

          category: editCategory,

          status: editStatus,

          dueDate: editDueDate,

          color: editColor,
        },
      );
    }

    setEditingProject(null);
  };

  /*
   * =========================================================
   * CALCULATE PROGRESS
   * =========================================================
   */

  const totalTasks = Number(
    safeKpis.totalTasks || 0,
  );

  const completedTasks = Number(
    safeKpis.completedTasks || 0,
  );

  const completionPercentage =
    totalTasks > 0
      ? Math.round(
          (completedTasks /
            totalTasks) *
            100,
        )
      : 0;

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div className="space-y-7">
      {/* =====================================================
          Welcome Banner
          ===================================================== */}

      <div className="bg-white rounded-3xl p-6 sm:p-7 text-slate-900 border border-slate-200/80 shadow-xs relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-100">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />

              <span>
                Sprint 5 Active • 88% Target Pace
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              Welcome back,{" "}
              {safeCurrentUser.name ||
                "User"}{" "}
              ! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              You have{" "}
              <span className="text-slate-900 font-semibold">
                {safeKpis.overdueTasks}{" "}
                overdue
              </span>{" "}
              and{" "}
              <span className="text-slate-900 font-semibold">
                {safeKpis.pendingTasks}{" "}
                pending
              </span>{" "}
              tasks across 4 active sprint
              tracks.
            </p>
          </div>

          {/* Sprint Progress */}

          <div className="flex items-center gap-4 self-start md:self-auto bg-slate-50 border border-slate-200/70 px-4 py-3 rounded-2xl">
            <div className="text-right">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Sprint Progress
              </div>

              <div className="text-sm font-extrabold text-slate-900">
                {completedTasks} of{" "}
                {totalTasks} Done
              </div>
            </div>

            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              {completionPercentage}%
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          KPI CARDS
          ===================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPICard
          id="kpi-projects"
          title="Active Projects"
          value={safeKpis.totalProjects}
          change="+12% vs mo"
          isPositive={true}
          icon={FolderKanban}
          colorScheme="indigo"
          subtitle="4 active repositories"
        />

        <KPICard
          id="kpi-tasks"
          title="Total Tasks"
          value={safeKpis.totalTasks}
          change="+4 today"
          isPositive={true}
          icon={CheckSquare}
          colorScheme="sky"
          subtitle="Across all sprint boards"
        />

        <KPICard
          id="kpi-completed"
          title="Completed Tasks"
          value={
            safeKpis.completedTasks
          }
          change="88% rate"
          isPositive={true}
          icon={CheckCircle2}
          colorScheme="emerald"
          subtitle="Verified by QA"
        />

        <KPICard
          id="kpi-overdue"
          title="Pending / Overdue"
          value={
            safeKpis.overdueTasks
          }
          change="Action required"
          isPositive={false}
          icon={AlertCircle}
          colorScheme="rose"
          subtitle="Requires attention"
        />
      </div>

      {/* =====================================================
          PROJECT PROGRESS
          ===================================================== */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Project Progress
            </h2>

            <p className="text-xs text-slate-500">
              Live milestones, completion
              ratios, and team leads
            </p>
          </div>

          <button
            onClick={() =>
              onOpenTasks()
            }
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
          >
            <span>
              View All Projects
            </span>

            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {safeProjects.map(
            (project) => (
              <ProjectProgressCard
                key={
                  project.id ||
                  (project as any)._id
                }
                project={project}
                onOpenTasks={
                  onOpenTasks
                }
                onOpenAISummary={
                  onOpenAISummary
                }
                onEditProject={
                  startEditProject
                }
                onDeleteProject={
                  onDeleteProject
                }
              />
            ),
          )}
        </div>
      </div>

      {/* =====================================================
          ANALYTICS
          ===================================================== */}

      <div className="space-y-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Task Analytics &
            Velocity
          </h2>

          <p className="text-xs text-slate-500">
            Sprint velocity trendline and
            real-time status distribution
          </p>
        </div>

        <AnalyticsChartWidget
          statusBreakdown={
            safeAnalytics.statusBreakdown
          }
          weeklyVelocity={
            safeAnalytics.weeklyVelocity
          }
        />
      </div>

      {/* =====================================================
          ACTIVITY + TEAM
          ===================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Activity */}

        <div className="lg:col-span-7">
          <RecentActivityWidget
            activities={
              safeActivities
            }
          />
        </div>

        {/* Team */}

        <div className="lg:col-span-5">
          <TeamWidget
            members={safeUsers}
            onInviteMember={
              onInviteMember
            }
          />
        </div>
      </div>

      {/* =====================================================
          EDIT PROJECT MODAL
          ===================================================== */}

      {editingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">
                Edit Project
              </h3>

              <button
                onClick={() =>
                  setEditingProject(
                    null,
                  )
                }
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={
                handleEditSubmit
              }
              className="space-y-3.5 text-xs"
            >
              {/* Project Name */}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Project Name *
                </label>

                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value,
                    )
                  }
                  placeholder="e.g. AI Workflow Engine"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Description */}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={
                    editDescription
                  }
                  onChange={(e) =>
                    setEditDescription(
                      e.target.value,
                    )
                  }
                  placeholder="Key deliverables, timeline expectations..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>

              {/* Category + Status */}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Category
                  </label>

                  <select
                    value={
                      editCategory
                    }
                    onChange={(e) =>
                      setEditCategory(
                        e.target.value,
                      )
                    }
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Web Platform">
                      Web Platform
                    </option>

                    <option value="API & Infra">
                      API & Infra
                    </option>

                    <option value="Mobile">
                      Mobile
                    </option>

                    <option value="Growth & Marketing">
                      Growth & Marketing
                    </option>

                    <option value="Data & AI">
                      Data & AI
                    </option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Status
                  </label>

                  <select
                    value={
                      editStatus
                    }
                    onChange={(e) =>
                      setEditStatus(
                        e.target
                          .value as
                          | "active"
                          | "completed"
                          | "on_hold",
                      )
                    }
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="active">
                      Active
                    </option>

                    <option value="completed">
                      Completed
                    </option>

                    <option value="on_hold">
                      On Hold
                    </option>
                  </select>
                </div>
              </div>

              {/* Due Date */}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Due Date
                </label>

                <input
                  type="date"
                  value={
                    editDueDate
                  }
                  onChange={(e) =>
                    setEditDueDate(
                      e.target.value,
                    )
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Color */}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Accent Theme Color
                </label>

                <div className="flex items-center gap-3">
                  {[
                    "#6366f1",
                    "#0ea5e9",
                    "#8b5cf6",
                    "#10b981",
                    "#f59e0b",
                    "#ec4899",
                  ].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() =>
                        setEditColor(
                          c,
                        )
                      }
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        editColor ===
                        c
                          ? "scale-125 ring-2 ring-offset-2 ring-slate-400"
                          : "hover:scale-110"
                      }`}
                      style={{
                        backgroundColor:
                          c,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() =>
                    setEditingProject(
                      null,
                    )
                  }
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

