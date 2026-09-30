
import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../services/api";

import type {
  Workspace,
  Project,
  Task,
  User,
  Activity,
  Notification,
} from "../types";

type AnyObject = Record<string, any>;

/* =========================================================
   HELPERS
   ========================================================= */

const getId = (value: any): string => {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  return String(
    value.id ||
      value._id ||
      value.userId ||
      value.user?._id ||
      value.user?.id ||
      "",
  );
};

/* =========================================================
   NORMALIZE WORKSPACE
   ========================================================= */

const normalizeWorkspace = (
  workspace: any,
): Workspace => {
  if (!workspace) {
    return workspace;
  }

  const workspaceId = getId(workspace);

  const members = Array.isArray(workspace.members)
    ? workspace.members.map((member: any) => ({
        ...member,
        id: getId(member),
        userId: getId(member.user || member),

        user:
          typeof member.user === "object"
            ? {
                ...member.user,
                id: getId(member.user),
              }
            : member.user,
      }))
    : [];

  return {
    ...workspace,

    id: workspaceId,

    _id:
      workspace._id ||
      workspaceId,

    members,

    membersCount:
      workspace.membersCount ??
      (workspace.membersCount === 0
        ? workspace.membersCount
        : members.length),
  } as Workspace;
};

/* =========================================================
   NORMALIZE PROJECT
   ========================================================= */

const normalizeProject = (
  project: any,
): Project => {
  if (!project) {
    return project;
  }

  const projectId = getId(project);

  const workspaceId =
    typeof project.workspaceId === "object"
      ? getId(project.workspaceId)
      : String(project.workspaceId || "");

  return {
    ...project,

    id: projectId,

    _id:
      project._id ||
      projectId,

    workspaceId,

    members: Array.isArray(project.members)
      ? project.members.map((member: any) => ({
          ...member,
          id: getId(member),
        }))
      : Array.isArray(project.team)
        ? project.team.map((member: any) => ({
            ...member,
            id: getId(member),
          }))
        : [],

    status:
      project.status === "in_progress" ||
      project.status === "in-progress"
        ? "active"
        : project.status === "done"
          ? "completed"
          : project.status || "active",

    totalTasks: Number(
      project.totalTasks ??
        project.tasksCount ??
        0,
    ),

    tasksCount: Number(
      project.tasksCount ??
        project.totalTasks ??
        0,
    ),

    completedTasks: Number(
      project.completedTasks ??
        project.completedTasksCount ??
        0,
    ),

    completedTasksCount: Number(
      project.completedTasksCount ??
        project.completedTasks ??
        0,
    ),

    progress: Number(
      project.progress ?? 0,
    ),

    dueDate:
      project.dueDate ||
      "",

    description:
      project.description ||
      "",

    category:
      project.category ||
      "",

    color:
      project.color ||
      "#6366F1",

    createdAt:
      project.createdAt ||
      "",
  } as Project;
};

/* =========================================================
   NORMALIZE TASK
   ========================================================= */

const normalizeTask = (
  task: any,
): Task => {
  if (!task) {
    return task;
  }

  const taskId = getId(task);

  return {
    ...task,

    id: taskId,

    _id:
      task._id ||
      taskId,

    projectId:
      typeof task.projectId === "object"
        ? getId(task.projectId)
        : String(
            task.projectId || "",
          ),

    workspaceId:
      typeof task.workspaceId === "object"
        ? getId(task.workspaceId)
        : String(
            task.workspaceId || "",
          ),

    assigneeId:
      typeof task.assigneeId === "object"
        ? getId(task.assigneeId)
        : String(
            task.assigneeId || "",
          ),

    assignedTo:
      typeof task.assignedTo === "object"
        ? getId(task.assignedTo)
        : String(
            task.assignedTo || "",
          ),
  } as Task;
};

/* =========================================================
   NORMALIZE USER
   ========================================================= */

const normalizeUser = (
  user: any,
): User => {
  if (!user) {
    return user;
  }

  const userId = getId(user);

  return {
    ...user,

    id: userId,

    _id:
      user._id ||
      userId,
  } as User;
};

/* =========================================================
   MAIN HOOK
   ========================================================= */

export function useTaskFlowState() {
  /* =======================================================
     STATE
     ======================================================= */

  const [loading, setLoading] =
    useState(true);

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [workspaces, setWorkspaces] =
    useState<Workspace[]>([]);

  const [activeWorkspace, setActiveWorkspace] =
    useState<Workspace | null>(null);

  const [projects, setProjects] =
    useState<Project[]>([]);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [users, setUsers] =
    useState<User[]>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [kpis, setKpis] =
    useState<any>(null);

  const [analytics, setAnalytics] =
    useState<any>(null);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     CURRENT USER
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadCurrentUser() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        console.log(
          "🔐 NO TOKEN - SKIPPING CURRENT USER",
        );

        if (mounted) {
          setCurrentUser(null);
        }

        return;
      }

      try {
        console.log(
          "🔐 TOKEN FOUND - LOADING CURRENT USER",
        );

        const response =
          await api.getCurrentUser();

        if (!mounted) return;

        const userData =
          (response as any)?.user ||
          response;

        if (userData) {
          setCurrentUser(
            normalizeUser(userData),
          );
        }
      } catch (error) {
        console.error(
          "❌ CURRENT USER LOAD FAILED:",
          error,
        );

        if (mounted) {
          setCurrentUser(null);
        }
      }
    }

    loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     INITIAL WORKSPACES
     ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      console.log(
        "🚀 INITIAL DATA LOAD START",
      );

      const token =
        localStorage.getItem("token");

      if (!token) {
        console.log(
          "🔐 NO TOKEN - SKIPPING INITIAL DATA LOAD",
        );

        if (mounted) {
          setLoading(false);
        }

        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log(
          "📁 GETTING WORKSPACES...",
        );

        const workspaceResponse =
          await api.getWorkspaces();

        console.log(
          "📁 WORKSPACES RESPONSE:",
          workspaceResponse,
        );

        const workspaceList =
          Array.isArray(workspaceResponse)
            ? workspaceResponse
            : [];

        const normalizedWorkspaces =
          workspaceList
            .map(normalizeWorkspace)
            .filter(
              (workspace: any) =>
                Boolean(workspace?.id),
            );

        console.log(
          "📁 NORMALIZED WORKSPACES:",
          normalizedWorkspaces,
        );

        if (!mounted) return;

        setWorkspaces(
          normalizedWorkspaces,
        );

        const firstWorkspace =
          normalizedWorkspaces[0] ||
          null;

        console.log(
          "📁 ACTIVE WORKSPACE:",
          firstWorkspace,
        );

        setActiveWorkspace(
          firstWorkspace,
        );

        /* ===================================================
           CREATE DEFAULT WORKSPACE
           =================================================== */

        if (!firstWorkspace) {
          try {
            console.log(
              "⚠️ NO WORKSPACE FOUND. CREATING WORKSPACE...",
            );

            const userName =
              currentUser?.name ||
              "Manish";

            const createdWorkspace =
              await api.createWorkspace({
                name: `${userName}'s Workspace`,
              } as any);

            console.log(
              "✅ WORKSPACE CREATED:",
              createdWorkspace,
            );

            if (!mounted) return;

            const normalizedCreated =
              normalizeWorkspace(
                createdWorkspace,
              );

            if (normalizedCreated?.id) {
              setWorkspaces([
                normalizedCreated,
              ]);

              setActiveWorkspace(
                normalizedCreated,
              );
            }
          } catch (workspaceError) {
            console.error(
              "❌ WORKSPACE CREATION FAILED:",
              workspaceError,
            );
          }
        }
      } catch (error: any) {
        console.error(
          "❌ INITIAL DATA LOAD FAILED:",
          error,
        );

        if (mounted) {
          setError(
            error?.message ||
              "Failed to load initial data",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }

        console.log(
          "🏁 INITIAL DATA LOAD FINISHED",
        );
      }
    }

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     ACTIVE WORKSPACE DATA
     ======================================================= */

  useEffect(() => {
    const workspaceId =
      activeWorkspace?.id ||
      getId(activeWorkspace);

    console.log(
      "🔥 WORKSPACE EFFECT:",
      activeWorkspace,
    );

    console.log(
      "🔥 WORKSPACE ID:",
      workspaceId,
    );

    if (!workspaceId) {
      console.log(
        "⚠️ NO ACTIVE WORKSPACE ID",
      );

      return;
    }

    let mounted = true;

    async function loadWorkspaceData() {
      console.log(
        "🔥 LOADING WORKSPACE DATA:",
        workspaceId,
      );

      /* ===================================================
         PROJECTS
         =================================================== */

      try {
        console.log(
          "📦 GET PROJECTS:",
          workspaceId,
        );

        const projectResponse =
          await api.getProjects({
            workspaceId,
          });

        const projectList =
          Array.isArray(projectResponse)
            ? projectResponse
                .map(normalizeProject)
                .filter(
                  (project: any) =>
                    Boolean(project?.id),
                )
            : [];

        console.log(
          "📦 PROJECTS RECEIVED:",
          projectList,
        );

        if (mounted) {
          setProjects(projectList);
        }
      } catch (error) {
        console.error(
          "❌ PROJECT LOAD FAILED:",
          error,
        );
      }

      /* ===================================================
         TASKS
         =================================================== */

      try {
        console.log(
          "📋 GET TASKS",
        );

        const taskResponse =
          await api.getTasks();

        const taskList =
          Array.isArray(taskResponse)
            ? taskResponse.map(
                normalizeTask,
              )
            : [];

        if (mounted) {
          setTasks(taskList);
        }
      } catch (error) {
        console.error(
          "❌ TASK LOAD FAILED:",
          error,
        );
      }

      /* ===================================================
         WORKSPACE MEMBERS
         =================================================== */

      try {
        console.log(
          "👥 GET WORKSPACE MEMBERS",
        );

        const userResponse =
          await api.getWorkspaceMembers(
            workspaceId,
          );

        const userList =
          Array.isArray(userResponse)
            ? userResponse.map(
                normalizeUser,
              )
            : [];

        if (mounted) {
          setUsers(userList);
        }
      } catch (error) {
        console.error(
          "❌ MEMBERS LOAD FAILED:",
          error,
        );
      }

      /* ===================================================
         ACTIVITIES
         =================================================== */

      try {
        console.log(
          "📝 GET ACTIVITIES",
        );

        const activityResponse =
          await api.getActivities(
            workspaceId,
          );

        if (mounted) {
          setActivities(
            Array.isArray(
              activityResponse,
            )
              ? activityResponse
              : [],
          );
        }
      } catch (error) {
        console.error(
          "❌ ACTIVITIES LOAD FAILED:",
          error,
        );
      }

      /* ===================================================
         NOTIFICATIONS
         =================================================== */

      try {
        console.log(
          "🔔 GET NOTIFICATIONS",
        );

        const notificationResponse =
          await api.getNotifications();

        if (mounted) {
          setNotifications(
            Array.isArray(
              notificationResponse,
            )
              ? notificationResponse
              : [],
          );
        }
      } catch (error) {
        console.error(
          "❌ NOTIFICATIONS LOAD FAILED:",
          error,
        );
      }

      /* ===================================================
         DASHBOARD KPIs
         =================================================== */

      try {
        console.log(
          "📊 GET DASHBOARD KPIs",
        );

        const kpiResponse =
          await api.getDashboardKPIs(
            workspaceId,
          );

        if (mounted) {
          setKpis(kpiResponse);
        }
      } catch (error) {
        console.error(
          "❌ KPI LOAD FAILED:",
          error,
        );
      }

      /* ===================================================
         ANALYTICS
         =================================================== */

      try {
        console.log(
          "📈 GET ANALYTICS",
        );

        const analyticsResponse =
          await api.getAnalytics(
            workspaceId,
          );

        if (mounted) {
          setAnalytics(
            analyticsResponse,
          );
        }
      } catch (error) {
        console.error(
          "❌ ANALYTICS LOAD FAILED:",
          error,
        );
      }

      console.log(
        "✅ WORKSPACE DATA LOAD FINISHED",
      );
    }

    loadWorkspaceData();

    return () => {
      mounted = false;
    };
  }, [activeWorkspace?.id]);

  /* =======================================================
     PROJECT CREATE
     ======================================================= */

  const createProject = useCallback(
    async (
      projectData: Partial<Project>,
    ) => {
      const workspaceId =
        activeWorkspace?.id ||
        getId(activeWorkspace);

      if (!workspaceId) {
        console.error(
          "❌ CREATE PROJECT: WORKSPACE ID MISSING",
        );

        return;
      }

      try {
        const payload = {
          ...projectData,

          workspaceId,

          status:
            projectData.status === "active"
              ? "in_progress"
              : projectData.status,
        };

        console.log(
          "🚀 CREATE PROJECT PAYLOAD:",
          payload,
        );

        const createdProject =
          await api.createProject(
            payload,
          );

        const normalizedProject =
          normalizeProject(
            createdProject,
          );

        setProjects((previous) => [
          normalizedProject,
          ...previous,
        ]);

        /* Refresh */

        try {
          const refreshedProjects =
            await api.getProjects({
              workspaceId,
            });

          setProjects(
            Array.isArray(
              refreshedProjects,
            )
              ? refreshedProjects.map(
                  normalizeProject,
                )
              : [],
          );
        } catch (refreshError) {
          console.error(
            "⚠️ PROJECT REFRESH FAILED:",
            refreshError,
          );
        }

        return normalizedProject;
      } catch (error) {
        console.error(
          "❌ CREATE PROJECT FAILED:",
          error,
        );

        throw error;
      }
    },
    [activeWorkspace],
  );

  /* =======================================================
     PROJECT UPDATE
     ======================================================= */

  const updateProject = useCallback(
    async (
      projectId: string,
      updates: Partial<Project>,
    ) => {
      if (!projectId) {
        console.error(
          "❌ UPDATE PROJECT: PROJECT ID MISSING",
        );

        throw new Error(
          "Project ID is missing",
        );
      }

      try {
        const payload = {
          ...updates,

          status:
            updates.status === "active"
              ? "in_progress"
              : updates.status,
        };

        console.log(
          "✏️ UPDATE PROJECT PAYLOAD:",
          payload,
        );

        const updated =
          await api.updateProject(
            projectId,
            payload,
          );

        const normalized =
          normalizeProject(updated);

        setProjects((previous) =>
          previous.map((project) =>
            getId(project) === projectId
              ? {
                  ...project,
                  ...normalized,
                }
              : project,
          ),
        );

        console.log(
          "✅ PROJECT UPDATED:",
          normalized,
        );

        return normalized;
      } catch (error) {
        console.error(
          "❌ UPDATE PROJECT FAILED:",
          error,
        );

        throw error;
      }
    },
    [],
  );

  /* =======================================================
     PROJECT DELETE
     ======================================================= */

  const deleteProject = useCallback(
    async (
      projectId: string,
    ) => {
      if (!projectId) {
        console.error(
          "❌ DELETE PROJECT: PROJECT ID MISSING",
        );

        throw new Error(
          "Project ID is missing",
        );
      }

      try {
        console.log(
          "🗑️ DELETE PROJECT:",
          projectId,
        );

        await api.deleteProject(
          projectId,
        );

        setProjects((previous) =>
          previous.filter(
            (project) =>
              getId(project) !== projectId,
          ),
        );

        console.log(
          "✅ PROJECT DELETED:",
          projectId,
        );
      } catch (error) {
        console.error(
          "❌ DELETE PROJECT FAILED:",
          error,
        );

        throw error;
      }
    },
    [],
  );

  /* =======================================================
     TASK CREATE
     ======================================================= */

  const createTask = useCallback(
    async (
      taskData: Partial<Task>,
    ) => {
      try {
        console.log(
          "🚀 HOOK CREATE TASK PAYLOAD:",
          taskData,
        );

        const createdTask =
          await api.createTask(
            taskData,
          );

        console.log(
          "✅ TASK CREATED FROM API:",
          createdTask,
        );

        const normalized =
          normalizeTask(
            createdTask,
          );

        setTasks((previous) => [
          normalized,
          ...previous,
        ]);

        return normalized;
      } catch (error) {
        console.error(
          "❌ CREATE TASK FAILED:",
          error,
        );

        throw error;
      }
    },
    [],
  );

  /* =======================================================
     TASK UPDATE
     ======================================================= */

  const updateTask = useCallback(
    async (
      taskId: string,
      updates: Partial<Task>,
    ) => {
      if (!taskId) {
        console.error(
          "❌ UPDATE TASK: TASK ID MISSING",
        );

        throw new Error(
          "Task ID is missing",
        );
      }

      try {
        console.log(
          "✏️ UPDATE TASK START",
        );

        console.log(
          "🆔 TASK ID:",
          taskId,
        );

        console.log(
          "📦 UPDATE DATA:",
          updates,
        );

        const updated =
          await api.updateTask(
            taskId,
            updates,
          );

        console.log(
          "✅ TASK UPDATED FROM API:",
          updated,
        );

        const normalized =
          normalizeTask(updated);

        console.log(
          "🔄 NORMALIZED UPDATED TASK:",
          normalized,
        );

        setTasks((previous) =>
          previous.map((task) => {
            const existingTaskId =
              getId(task);

            return existingTaskId === taskId
              ? {
                  ...task,
                  ...normalized,
                }
              : task;
          }),
        );

        console.log(
          "✅ LOCAL TASK STATE UPDATED",
        );

        return normalized;
      } catch (error) {
        console.error(
          "❌ UPDATE TASK FAILED:",
          error,
        );

        throw error;
      }
    },
    [],
  );

  /* =======================================================
     TASK DELETE
     ======================================================= */

  const deleteTask = useCallback(
    async (
      taskId: string,
    ) => {
      if (!taskId) {
        console.error(
          "❌ DELETE TASK: TASK ID MISSING",
        );

        throw new Error(
          "Task ID is missing",
        );
      }

      try {
        console.log(
          "🗑️ DELETE TASK:",
          taskId,
        );

        await api.deleteTask(
          taskId,
        );

        setTasks((previous) =>
          previous.filter(
            (task) =>
              getId(task) !== taskId,
          ),
        );

        console.log(
          "✅ TASK DELETED:",
          taskId,
        );
      } catch (error) {
        console.error(
          "❌ DELETE TASK FAILED:",
          error,
        );

        throw error;
      }
    },
    [],
  );

  /* =======================================================
     TASK STATUS
     ======================================================= */

  const updateTaskStatus =
    useCallback(
      async (
        taskId: string,
        status: string,
      ) => {
        if (!taskId) {
          console.error(
            "❌ UPDATE STATUS: TASK ID MISSING",
          );

          throw new Error(
            "Task ID is missing",
          );
        }

        try {
          console.log(
            "🔄 UPDATE TASK STATUS:",
            {
              taskId,
              status,
            },
          );

          const updated =
            await api.updateTaskStatus(
              taskId,
              status,
            );

          const normalized =
            normalizeTask(updated);

          setTasks((previous) =>
            previous.map((task) =>
              getId(task) === taskId
                ? {
                    ...task,
                    ...normalized,
                  }
                : task,
            ),
          );

          return normalized;
        } catch (error) {
          console.error(
            "❌ UPDATE TASK STATUS FAILED:",
            error,
          );

          throw error;
        }
      },
      [],
    );

  /* =======================================================
     TASK ASSIGN
     ======================================================= */

  const assignTask = useCallback(
    async (
      taskId: string,
      userId: string,
    ) => {
      if (!taskId) {
        console.error(
          "❌ ASSIGN TASK: TASK ID MISSING",
        );

        throw new Error(
          "Task ID is missing",
        );
      }

      if (!userId) {
        console.error(
          "❌ ASSIGN TASK: USER ID MISSING",
        );

        throw new Error(
          "User ID is missing",
        );
      }

      try {
        console.log(
          "👤 ASSIGN TASK:",
          {
            taskId,
            userId,
          },
        );

        const updated =
          await api.assignTask(
            taskId,
            userId,
          );

        const normalized =
          normalizeTask(updated);

        setTasks((previous) =>
          previous.map((task) =>
            getId(task) === taskId
              ? {
                  ...task,
                  ...normalized,
                }
              : task,
          ),
        );

        return normalized;
      } catch (error) {
        console.error(
          "❌ ASSIGN TASK FAILED:",
          error,
        );

        throw error;
      }
    },
    [],
  );

  /* =======================================================
     SUBTASK TOGGLE
     ======================================================= */

  const toggleSubtask = useCallback(
    async (
      taskId: string,
      subtaskId: string,
    ) => {
      if (!taskId) {
        console.error(
          "❌ TOGGLE SUBTASK: TASK ID MISSING",
        );

        throw new Error(
          "Task ID is missing",
        );
      }

      try {
        const response =
          await api.toggleSubtask(
            taskId,
            subtaskId,
          );

        setTasks((previous) =>
          previous.map((task) =>
            getId(task) === taskId
              ? {
                  ...task,
                  ...(response || {}),
                }
              : task,
          ),
        );

        return response;
      } catch (error) {
        console.error(
          "❌ TOGGLE SUBTASK FAILED:",
          error,
        );

        throw error;
      }
    },
    [],
  );

  /* =======================================================
     NOTIFICATION - MARK READ
     ======================================================= */

  const markNotificationAsRead =
    useCallback(
      async (
        notificationId: string,
      ) => {
        try {
          await api.markNotificationAsRead(
            notificationId,
          );

          setNotifications(
            (previous) =>
              previous.map(
                (notification: any) =>
                  getId(notification) ===
                  notificationId
                    ? {
                        ...notification,
                        read: true,
                        isRead: true,
                      }
                    : notification,
              ),
          );
        } catch (error) {
          console.error(
            "❌ MARK NOTIFICATION READ FAILED:",
            error,
          );

          throw error;
        }
      },
      [],
    );

  /* =======================================================
     NOTIFICATION - MARK ALL READ
     ======================================================= */

  const markAllNotificationsAsRead =
    useCallback(async () => {
      try {
        await api.markAllNotificationsAsRead();

        setNotifications(
          (previous) =>
            previous.map(
              (notification: any) => ({
                ...notification,
                read: true,
                isRead: true,
              }),
            ),
        );
      } catch (error) {
        console.error(
          "❌ MARK ALL NOTIFICATIONS FAILED:",
          error,
        );

        throw error;
      }
    }, []);

  /* =======================================================
     NOTIFICATION - DELETE
     ======================================================= */

  const deleteNotification =
    useCallback(
      async (
        notificationId: string,
      ) => {
        try {
          await api.deleteNotification(
            notificationId,
          );

          setNotifications(
            (previous) =>
              previous.filter(
                (notification: any) =>
                  getId(notification) !==
                  notificationId,
              ),
          );
        } catch (error) {
          console.error(
            "❌ DELETE NOTIFICATION FAILED:",
            error,
          );

          throw error;
        }
      },
      [],
    );

  /* =======================================================
     ADD WORKSPACE MEMBER
     ======================================================= */

  const addWorkspaceMember =
    useCallback(
      async (
        userId: string,
      ) => {
        const workspaceId =
          activeWorkspace?.id ||
          getId(activeWorkspace);

        if (!workspaceId) {
          throw new Error(
            "Workspace ID is missing",
          );
        }

        try {
          await api.addWorkspaceMember(
            workspaceId,
            userId,
          );

          const refreshedMembers =
            await api.getWorkspaceMembers(
              workspaceId,
            );

          setUsers(
            Array.isArray(
              refreshedMembers,
            )
              ? refreshedMembers.map(
                  normalizeUser,
                )
              : [],
          );
        } catch (error) {
          console.error(
            "❌ ADD MEMBER FAILED:",
            error,
          );

          throw error;
        }
      },
      [activeWorkspace],
    );

  /* =======================================================
     REMOVE WORKSPACE MEMBER
     ======================================================= */

  const removeWorkspaceMember =
    useCallback(
      async (
        userId: string,
      ) => {
        const workspaceId =
          activeWorkspace?.id ||
          getId(activeWorkspace);

        if (!workspaceId) {
          throw new Error(
            "Workspace ID is missing",
          );
        }

        try {
          await api.removeWorkspaceMember(
            workspaceId,
            userId,
          );

          setUsers((previous) =>
            previous.filter(
              (user) =>
                getId(user) !== userId,
            ),
          );
        } catch (error) {
          console.error(
            "❌ REMOVE MEMBER FAILED:",
            error,
          );

          throw error;
        }
      },
      [activeWorkspace],
    );

  /* =======================================================
     REFRESH PROJECTS
     ======================================================= */

  const refreshProjects =
    useCallback(async () => {
      const workspaceId =
        activeWorkspace?.id ||
        getId(activeWorkspace);

      if (!workspaceId) {
        return;
      }

      try {
        const response =
          await api.getProjects({
            workspaceId,
          });

        const projectList =
          Array.isArray(response)
            ? response.map(
                normalizeProject,
              )
            : [];

        setProjects(projectList);

        console.log(
          "🔄 PROJECTS REFRESHED:",
          projectList,
        );
      } catch (error) {
        console.error(
          "❌ REFRESH PROJECTS FAILED:",
          error,
        );
      }
    }, [activeWorkspace]);

  /* =======================================================
     MEMOIZED COUNTS
     ======================================================= */

  const unreadNotifications =
    useMemo(() => {
      return notifications.filter(
        (notification: any) =>
          !notification.read &&
          !notification.isRead,
      ).length;
    }, [notifications]);

  const activeProjects =
    useMemo(() => {
      return projects.filter(
        (project: any) =>
          project.status === "active" ||
          project.status === "in_progress" ||
          project.status === "in-progress",
      ).length;
    }, [projects]);

  const completedProjects =
    useMemo(() => {
      return projects.filter(
        (project: any) =>
          project.status === "completed" ||
          project.status === "done",
      ).length;
    }, [projects]);

  /* =======================================================
     RETURN
     ======================================================= */

  return {
    /* =====================================================
       STATE
       ===================================================== */

    loading,
    error,

    currentUser,
    setCurrentUser,

    workspaces,
    setWorkspaces,

    activeWorkspace,
    setActiveWorkspace,

    projects,
    setProjects,

    tasks,
    setTasks,

    users,
    setUsers,

    activities,
    setActivities,

    notifications,
    setNotifications,

    kpis,
    setKpis,

    analytics,
    setAnalytics,

    unreadNotifications,

    activeProjects,

    completedProjects,

    refreshProjects,

    /* =====================================================
       PROJECT FUNCTIONS
       ===================================================== */

    createProject,

    updateProject,

    deleteProject,

    handleCreateProject:
      createProject,

    handleUpdateProject:
      updateProject,

    handleDeleteProject:
      deleteProject,

    /* =====================================================
       TASK FUNCTIONS
       ===================================================== */

    createTask,

    updateTask,

    deleteTask,

    handleCreateTask:
      createTask,

    handleUpdateTask:
      updateTask,

    /*
      IMPORTANT:

      TaskModal expects:

      onEditTask={handleEditTask}

      Therefore handleEditTask must point
      to the same updateTask function.
    */

    handleEditTask:
      updateTask,

    handleDeleteTask:
      deleteTask,

    handleUpdateTaskStatus:
      updateTaskStatus,

    handleAssignUser:
      assignTask,

    handleToggleSubtask:
      toggleSubtask,

    /* =====================================================
       NOTIFICATION FUNCTIONS
       ===================================================== */

    markNotificationAsRead,

    markAllNotificationsAsRead,

    deleteNotification,

    /* =====================================================
       WORKSPACE MEMBER FUNCTIONS
       ===================================================== */

    addWorkspaceMember,

    removeWorkspaceMember,

    /* =====================================================
       COMPATIBILITY ALIASES
       ===================================================== */

    handleMarkNotificationRead:
      markNotificationAsRead,

    handleMarkAllNotificationsRead:
      markAllNotificationsAsRead,

    handleDeleteNotification:
      deleteNotification,

    handleInviteMember:
      addWorkspaceMember,
  };
}
