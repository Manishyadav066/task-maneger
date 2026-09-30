import {
  Workspace,
  Project,
  Task,
  User,
  Activity,
  Notification,
  Comment,
  TaskFile,
  DashboardOverview,
  TaskStatus,
} from "../types";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "/api"
)
  .replace(/\/+$/, "")
  .trim();

console.log("API BASE URL:", API_BASE_URL);

// =====================================================
// HELPERS
// =====================================================

function normalizeProject(project: any): Project {
  return {
    ...project,

    id: project.id || project._id,

    workspaceId:
      typeof project.workspaceId === "object"
        ? project.workspaceId?._id ||
          project.workspaceId?.id ||
          ""
        : project.workspaceId || "",

    members: Array.isArray(project.members)
      ? project.members.map((member: any) => ({
          ...member,
          id: member.id || member._id,
        }))
      : Array.isArray(project.team)
      ? project.team.map((member: any) => ({
          ...member,
          id: member.id || member._id,
        }))
      : [],

    status:
      project.status === "in_progress" ||
      project.status === "in-progress"
        ? "active"
        : project.status === "done" ||
          project.status === "completed"
        ? "completed"
        : project.status || "active",

    totalTasks: Number(
      project.totalTasks ??
        project.tasksCount ??
        0
    ),

    tasksCount: Number(
      project.tasksCount ??
        project.totalTasks ??
        0
    ),

    completedTasks: Number(
      project.completedTasks ??
        project.completedTasksCount ??
        0
    ),

    completedTasksCount: Number(
      project.completedTasksCount ??
        project.completedTasks ??
        0
    ),

    progress: Number(
      project.progress ?? 0
    ),

    dueDate: project.dueDate || "",
    description: project.description || "",
    category: project.category || "",
    color: project.color || "#6366F1",
    createdAt: project.createdAt || "",
  };
}

function normalizeTask(task: any): Task {
  if (!task) {
    return task;
  }

  return {
    ...task,

    id:
      task.id ||
      task._id,

    projectId:
      typeof task.projectId === "object"
        ? task.projectId?._id ||
          task.projectId?.id ||
          ""
        : task.projectId || "",

    workspaceId:
      typeof task.workspaceId === "object"
        ? task.workspaceId?._id ||
          task.workspaceId?.id ||
          ""
        : task.workspaceId || "",

    owner:
      typeof task.owner === "object"
        ? task.owner?._id ||
          task.owner?.id ||
          ""
        : task.owner,

    assignedTo:
      typeof task.assignedTo === "object"
        ? task.assignedTo?._id ||
          task.assignedTo?.id ||
          ""
        : task.assignedTo,

    status:
      task.status === "pending" ||
      task.status === "todo"
        ? "todo"
        : task.status === "in-progress" ||
          task.status === "in_progress"
        ? "in_progress"
        : task.status === "completed" ||
          task.status === "done"
        ? "done"
        : task.status,

    priority:
      task.priority || "medium",

    subtasks: Array.isArray(task.subtasks)
      ? task.subtasks.map(
          (subtask: any) => ({
            ...subtask,
            id:
              subtask.id ||
              subtask._id,
          })
        )
      : [],
  };
}

// =====================================================
// URL HELPER
// =====================================================

function getUrl(endpoint: string): string {
  // Already complete URL
  if (
    endpoint.startsWith("http://") ||
    endpoint.startsWith("https://")
  ) {
    return endpoint;
  }

  // Prevent /api/api duplication
  if (
    endpoint.startsWith("/api") &&
    API_BASE_URL.endsWith("/api")
  ) {
    return `${API_BASE_URL.slice(0, -4)}${endpoint}`;
  }

  return `${API_BASE_URL}${
    endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`
  }`;
}

// =====================================================
// REQUEST HELPER
// =====================================================

async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const url = getUrl(endpoint);

  console.log("=================================");
  console.log("🌐 API REQUEST:", url);
  console.log(
    "🔑 TOKEN:",
    token ? "FOUND" : "MISSING"
  );
  console.log("=================================");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (
    token &&
    !headers.Authorization
  ) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  console.log(
    "📡 AUTH HEADER:",
    headers.Authorization
      ? "ATTACHED"
      : "MISSING"
  );

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType =
    response.headers.get(
      "content-type"
    ) || "";

  let data: any;

  if (
    contentType.includes(
      "application/json"
    )
  ) {
    data = await response.json();
  } else {
    const text =
      await response.text();

    try {
      data = text
        ? JSON.parse(text)
        : null;
    } catch {
      data = text;
    }
  }

  console.log(
    "📥 RESPONSE STATUS:",
    response.status
  );

  console.log(
    "📦 RESPONSE DATA:",
    data
  );

  if (!response.ok) {
    const message =
      typeof data === "object" &&
      data?.message
        ? data.message
        : `Request failed with status ${response.status}`;

    console.error(
      "❌ API ERROR:",
      response.status,
      message,
      url
    );

    throw new Error(message);
  }

  return data as T;
}

// =====================================================
// API
// =====================================================

export const api = {

  // =====================================================
  // AUTH
  // =====================================================

  async getCurrentUser(): Promise<{
    user: User;
  }> {
    return request(
      "/api/auth/me"
    );
  },

  async login(
    email: string,
    password?: string
  ): Promise<{
    token: string;
    user: User;
  }> {
    const res =
      await request<{
        token: string;
        user: User;
      }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

    if (
      res?.token &&
      typeof localStorage !==
        "undefined"
    ) {
      localStorage.setItem(
        "token",
        res.token
      );
    }

    return res;
  },

  async register(data: {
    name: string;
    email: string;
    department?: string;
    password?: string;
    role?: string;
  }): Promise<{
    token: string;
    user: User;
  }> {
    const res =
      await request<{
        token: string;
        user: User;
      }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      });

    if (
      res?.token &&
      typeof localStorage !==
        "undefined"
    ) {
      localStorage.setItem(
        "token",
        res.token
      );
    }

    return res;
  },

  async forgotPassword(
    email: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    return {
      success: true,
      message:
        `Password reset instructions have been sent to ${email}. Check your inbox!`,
    };
  },

  // =====================================================
  // WORKSPACES
  // =====================================================

  async getWorkspaces(): Promise<
    Workspace[]
  > {
    const data =
      await request<any>(
        "/api/workspaces"
      );

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(
      (workspace: any) => ({
        ...workspace,
        id:
          workspace.id ||
          workspace._id,
      })
    );
  },

  async getWorkspace(
    id: string
  ): Promise<Workspace> {
    const workspaces =
      await this.getWorkspaces();

    const workspace =
      workspaces.find(
        (workspace) =>
          workspace.id === id
      );

    if (!workspace) {
      throw new Error(
        "Workspace not found"
      );
    }

    return workspace;
  },

  async createWorkspace(
    data: Partial<Workspace>
  ): Promise<Workspace> {
    const response =
      await request<any>(
        "/api/workspaces",
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      );

    return {
      ...response,
      id:
        response?.id ||
        response?._id,
    };
  },

  async updateWorkspace(
    id: string,
    data: Partial<Workspace>
  ): Promise<Workspace> {
    const response =
      await request<any>(
        `/api/workspaces/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(data),
        }
      );

    return {
      ...response,
      id:
        response?.id ||
        response?._id,
    };
  },

  async deleteWorkspace(
    id: string
  ): Promise<{
    success: boolean;
  }> {
    return request(
      `/api/workspaces/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // =====================================================
  // WORKSPACE MEMBERS - GET
  // =====================================================

 async getWorkspaceMembers(
  workspaceId: string
): Promise<User[]> {
  if (!workspaceId) {
    return [];
  }

  const data = await request<any>(
    `/api/workspaces/${workspaceId}/members`
  );

  // Debug: backend se exactly kya aa raha hai
  console.log(
    "🔍 RAW MEMBERS FROM BACKEND:",
    JSON.stringify(data, null, 2)
  );

  console.log(
    "👥 WORKSPACE MEMBERS RESPONSE:",
    data
  );

  if (!Array.isArray(data)) {
    console.error(
      "❌ MEMBERS RESPONSE IS NOT ARRAY:",
      data
    );

    return [];
  }

  return data.map(
    (item: any) => {
      /*
       * Backend response normally can be:
       *
       * {
       *   id: "...",
       *   name: "...",
       *   email: "...",
       *   role: "member"
       * }
       *
       * OR:
       *
       * {
       *   user: {
       *     _id: "...",
       *     name: "...",
       *     email: "..."
       *   },
       *   role: "member"
       * }
       */

      const user =
        item?.user &&
        typeof item.user === "object"
          ? item.user
          : item;

      // ---------------------------------------------
      // GET ACTUAL USER ID
      // ---------------------------------------------

      const userId =
        user?._id?.toString?.() ||
        user?.id?.toString?.() ||
        item?._id?.toString?.() ||
        item?.id?.toString?.();

      // ---------------------------------------------
      // DEBUG EACH MEMBER
      // ---------------------------------------------

      console.log(
        "👤 NORMALIZING MEMBER:",
        {
          rawItem: item,
          user,
          userId,
          name: user?.name,
          email: user?.email,
          role:
            item?.role ||
            user?.role ||
            "member",
        }
      );

      // ---------------------------------------------
      // RETURN NORMALIZED USER
      // ---------------------------------------------

      return {
        ...user,

        // Important:
        // frontend CRUD will use this ID
        id: userId,

        // Keep _id also available
        _id: userId,

        name:
          user?.name ||
          item?.name ||
          "",

        email:
          user?.email ||
          item?.email ||
          "",

        avatar:
          user?.avatar ||
          item?.avatar ||
          "",

        status:
          user?.status ||
          item?.status ||
          "online",

        role:
          item?.role ||
          user?.role ||
          "member",
      };
    }
  );
},

  async getMembers(
    workspaceId: string
  ): Promise<User[]> {
    return this.getWorkspaceMembers(
      workspaceId
    );
  },

  // =====================================================
  // USERS
  // =====================================================

  async getUsers(
    _workspaceId?: string
  ): Promise<User[]> {
    const data =
      await request<any>(
        "/api/users"
      );

    console.log(
      "👥 ALL USERS RESPONSE:",
      data
    );

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(
      (user: any) => ({
        ...user,

        id:
          user?.id ||
          user?._id,

        _id:
          user?._id ||
          user?.id,

        name:
          user?.name || "",

        email:
          user?.email || "",

        avatar:
          user?.avatar || "",

        status:
          user?.status ||
          "online",

        role:
          user?.role ||
          "member",
      })
    );
  },

  // =====================================================
  // ADD WORKSPACE MEMBER
  // =====================================================

  async addWorkspaceMember(
    workspaceId: string,
    member: Partial<User>
  ): Promise<User> {
    if (!workspaceId) {
      throw new Error(
        "Workspace ID is required"
      );
    }

    if (!member?.email) {
      throw new Error(
        "Member email is required"
      );
    }

    const payload = {
      name:
        member.name?.trim() || "",

      email:
        member.email
          .trim()
          .toLowerCase(),

      role:
        member.role === "admin"
          ? "admin"
          : "member",
    };

    console.log(
      "📤 ADD MEMBER PAYLOAD:",
      payload
    );

    const response =
      await request<any>(
        `/api/workspaces/${workspaceId}/members`,
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      );

    console.log(
      "📥 ADD MEMBER RESPONSE:",
      response
    );

    const addedMember =
      response?.member ||
      response?.user ||
      response;

    if (!addedMember) {
      throw new Error(
        "Member was not returned by server"
      );
    }

    return {
      ...addedMember,

      id:
        addedMember.id ||
        addedMember._id,

      _id:
        addedMember._id ||
        addedMember.id,

      name:
        addedMember.name ||
        payload.name,

      email:
        addedMember.email ||
        payload.email,

      role:
        addedMember.role ||
        payload.role,

      status:
        addedMember.status ||
        "online",

      avatar:
        addedMember.avatar ||
        "",
    };
  },

  async addMember(
    workspaceId: string,
    member: Partial<User>
  ): Promise<User> {
    return this.addWorkspaceMember(
      workspaceId,
      member
    );
  },

  async inviteMember(
    member: Partial<User>,
    workspaceId: string
  ): Promise<User> {
    return this.addWorkspaceMember(
      workspaceId,
      member
    );
  },

  // =====================================================
  // UPDATE WORKSPACE MEMBER
  // =====================================================

  async updateWorkspaceMember(
    workspaceId: string,
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "member";
    }
  ): Promise<User> {
    if (!workspaceId) {
      throw new Error(
        "Workspace ID is required"
      );
    }

    if (!userId) {
      throw new Error(
        "Member user ID is required"
      );
    }

    const payload: {
      name?: string;
      email?: string;
      role?: "admin" | "member";
    } = {};

    if (
      data.name !== undefined
    ) {
      payload.name =
        data.name.trim();
    }

    if (
      data.email !== undefined
    ) {
      payload.email =
        data.email
          .trim()
          .toLowerCase();
    }

    if (
      data.role !== undefined
    ) {
      payload.role =
        data.role === "admin"
          ? "admin"
          : "member";
    }

    console.log(
      "================================="
    );

    console.log(
      "✏️ API - UPDATE WORKSPACE MEMBER"
    );

    console.log(
      "🏢 WORKSPACE ID:",
      workspaceId
    );

    console.log(
      "👤 USER ID:",
      userId
    );

    console.log(
      "📤 UPDATE PAYLOAD:",
      payload
    );

    console.log(
      "================================="
    );

    const endpoint =
      `/api/workspaces/${workspaceId}/members/${userId}`;

    console.log(
      "🌐 UPDATE URL:",
      getUrl(endpoint)
    );

    const response =
      await request<any>(
        endpoint,
        {
          method: "PUT",
          body: JSON.stringify(
            payload
          ),
        }
      );

    console.log(
      "📥 UPDATE MEMBER RESPONSE:",
      response
    );

    const updatedMember =
      response?.member ||
      response?.user ||
      response;

    if (!updatedMember) {
      throw new Error(
        "Updated member was not returned by server"
      );
    }

    return {
      ...updatedMember,

      id:
        updatedMember.id ||
        updatedMember._id ||
        userId,

      _id:
        updatedMember._id ||
        updatedMember.id ||
        userId,

      name:
        updatedMember.name ||
        payload.name ||
        "",

      email:
        updatedMember.email ||
        payload.email ||
        "",

      role:
        updatedMember.role ||
        payload.role ||
        "member",

      status:
        updatedMember.status ||
        "online",

      avatar:
        updatedMember.avatar ||
        "",
    };
  },

  // =====================================================
  // DELETE / REMOVE WORKSPACE MEMBER
  // =====================================================

  async deleteWorkspaceMember(
    workspaceId: string,
    userId: string
  ): Promise<{
    success: boolean;
  }> {
    if (!workspaceId) {
      throw new Error(
        "Workspace ID is required"
      );
    }

    if (!userId) {
      throw new Error(
        "Member user ID is required"
      );
    }

    console.log(
      "================================="
    );

    console.log(
      "🗑️ API - DELETE WORKSPACE MEMBER"
    );

    console.log(
      "🏢 WORKSPACE ID:",
      workspaceId
    );

    console.log(
      "👤 USER ID:",
      userId
    );

    const endpoint =
      `/api/workspaces/${workspaceId}/members/${userId}`;

    console.log(
      "🌐 DELETE URL:",
      getUrl(endpoint)
    );

    console.log(
      "================================="
    );

    const response =
      await request<any>(
        endpoint,
        {
          method: "DELETE",
        }
      );

    console.log(
      "📥 DELETE MEMBER RESPONSE:",
      response
    );

    return {
      success:
        response?.success !== false,
    };
  },

  // =====================================================
  // COMPATIBILITY - UPDATE MEMBER
  // =====================================================

  async updateMember(
    workspaceId: string,
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: "admin" | "member";
    }
  ): Promise<User> {
    return this.updateWorkspaceMember(
      workspaceId,
      userId,
      data
    );
  },

  // =====================================================
  // COMPATIBILITY - DELETE MEMBER
  // =====================================================

  async deleteMember(
    workspaceId: string,
    userId: string
  ): Promise<{
    success: boolean;
  }> {
    return this.deleteWorkspaceMember(
      workspaceId,
      userId
    );
  },

  // =====================================================
  // PROJECTS
  // =====================================================

  async getProjects(
    filter?:
      | string
      | {
          workspaceId?: string;
          status?: string;
        }
  ): Promise<Project[]> {
    let url =
      "/api/projects";

    if (
      typeof filter === "string"
    ) {
      url =
        `/api/projects?workspaceId=${encodeURIComponent(
          filter
        )}`;
    } else if (filter) {
      const params =
        new URLSearchParams();

      if (filter.workspaceId) {
        params.append(
          "workspaceId",
          filter.workspaceId
        );
      }

      if (filter.status) {
        params.append(
          "status",
          filter.status
        );
      }

      const query =
        params.toString();

      if (query) {
        url =
          `/api/projects?${query}`;
      }
    }

    const data =
      await request<any[]>(url);

    return Array.isArray(data)
      ? data.map(
          normalizeProject
        )
      : [];
  },

  async getProject(
    id:
      | string
      | {
          projectId: string;
        }
  ): Promise<Project> {
    const projectId =
      typeof id === "string"
        ? id
        : id.projectId;

    const data =
      await request<any>(
        `/api/projects/${projectId}`
      );

    return normalizeProject(
      data
    );
  },

  async createProject(
    project: Partial<Project>
  ): Promise<Project> {
    const payload = {
      ...project,

      status:
        project.status ===
        "active"
          ? "in_progress"
          : project.status,
    };

    const data =
      await request<any>(
        "/api/projects",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      );

    return normalizeProject(
      data
    );
  },

  async updateProject(
    id: string,
    updates: Partial<Project>
  ): Promise<Project> {
    const data =
      await request<any>(
        `/api/projects/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(
            updates
          ),
        }
      );

    return normalizeProject(
      data
    );
  },

  async deleteProject(
    id: string
  ): Promise<{
    success: boolean;
    message: string;
  }> {
    return request(
      `/api/projects/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // =====================================================
  // TASKS
  // =====================================================

  async getTasks(
    filter?:
      | string
      | {
          workspaceId?: string;
          projectId?: string;
          status?: string;
        }
  ): Promise<Task[]> {
    let url =
      "/api/tasks";

    if (
      typeof filter === "string"
    ) {
      url =
        `/api/tasks?projectId=${encodeURIComponent(
          filter
        )}`;
    } else if (filter) {
      const params =
        new URLSearchParams();

      if (filter.projectId) {
        params.append(
          "projectId",
          filter.projectId
        );
      }

      if (filter.workspaceId) {
        params.append(
          "workspaceId",
          filter.workspaceId
        );
      }

      if (filter.status) {
        params.append(
          "status",
          filter.status
        );
      }

      const query =
        params.toString();

      if (query) {
        url =
          `/api/tasks?${query}`;
      }
    }

    const data =
      await request<any>(url);

    const tasks =
      Array.isArray(data)
        ? data
        : Array.isArray(
            data?.tasks
          )
        ? data.tasks
        : [];

    return tasks.map(
      normalizeTask
    );
  },

  async getTask(
    id: string
  ): Promise<Task> {
    const data =
      await request<any>(
        `/api/tasks/${id}`
      );

    const task =
      data?.task || data;

    return normalizeTask(task);
  },

  async createTask(
    task: Partial<Task>
  ): Promise<Task> {
    const payload: any = {
      ...task,
    };

    if (
      payload.status === "active"
    ) {
      payload.status =
        "in_progress";
    }

    if (
      payload.status === "completed"
    ) {
      payload.status = "done";
    }

    if (
      payload.status === "pending"
    ) {
      payload.status = "todo";
    }

    const data =
      await request<any>(
        "/api/tasks",
        {
          method: "POST",
          body: JSON.stringify(
            payload
          ),
        }
      );

    const createdTask =
      data?.task || data;

    console.log(
      "✅ TASK CREATED FROM API:",
      createdTask
    );

    return normalizeTask(
      createdTask
    );
  },

  // =====================================================
  // UPDATE TASK
  // =====================================================

  async updateTask(
    id: string,
    updates: Partial<Task>
  ): Promise<Task> {
    if (!id) {
      throw new Error(
        "Task ID is required for update"
      );
    }

    console.log(
      "✏️ UPDATE TASK ID:",
      id
    );

    console.log(
      "✏️ UPDATE TASK DATA:",
      updates
    );

    const payload: any = {};

    if (
      updates.title !==
      undefined
    ) {
      payload.title =
        updates.title;
    }

    if (
      updates.description !==
      undefined
    ) {
      payload.description =
        updates.description;
    }

    if (
      updates.status !==
      undefined
    ) {
      let status: any =
        updates.status;

      if (status === "pending") {
        status = "todo";
      }

      if (status === "active") {
        status =
          "in_progress";
      }

      if (
        status ===
        "in-progress"
      ) {
        status =
          "in_progress";
      }

      if (
        status === "completed"
      ) {
        status = "done";
      }

      payload.status =
        status;
    }

    if (
      updates.priority !==
      undefined
    ) {
      payload.priority =
        updates.priority;
    }

    if (
      updates.dueDate !==
      undefined
    ) {
      payload.dueDate =
        updates.dueDate;
    }

    if (
      updates.estimatedHours !==
      undefined
    ) {
      payload.estimatedHours =
        updates.estimatedHours;
    }

    if (
      updates.spentHours !==
      undefined
    ) {
      payload.spentHours =
        updates.spentHours;
    }

    if (
      updates.tags !==
      undefined
    ) {
      payload.tags =
        updates.tags;
    }

    if (
      updates.subtasks !==
      undefined
    ) {
      payload.subtasks =
        updates.subtasks;
    }

    if (
      updates.assignedTo !==
      undefined
    ) {
      payload.assignedTo =
        updates.assignedTo;
    }

    if (
      updates.projectId !==
      undefined
    ) {
      payload.projectId =
        updates.projectId;
    }

    console.log(
      "📤 FINAL UPDATE PAYLOAD:",
      payload
    );

    const data =
      await request<any>(
        `/api/tasks/${encodeURIComponent(
          id
        )}`,
        {
          method: "PUT",
          body: JSON.stringify(
            payload
          ),
        }
      );

    const updatedTask =
      data?.task ||
      data?.updatedTask ||
      data;

    console.log(
      "✅ TASK UPDATED FROM API:",
      updatedTask
    );

    return normalizeTask(
      updatedTask
    );
  },

  // =====================================================
  // UPDATE TASK STATUS
  // =====================================================

  async updateTaskStatus(
    taskId: string,
    status: string
  ): Promise<Task> {
    if (!taskId) {
      throw new Error(
        "Task ID is required"
      );
    }

    let backendStatus =
      status;

    if (status === "pending") {
      backendStatus =
        "todo";
    }

    if (
      status === "active" ||
      status === "in-progress"
    ) {
      backendStatus =
        "in_progress";
    }

    if (
      status === "completed"
    ) {
      backendStatus = "done";
    }

    const data =
      await request<any>(
        `/api/tasks/${encodeURIComponent(
          taskId
        )}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status:
              backendStatus,
          }),
        }
      );

    const updatedTask =
      data?.task ||
      data?.updatedTask ||
      data;

    return normalizeTask(
      updatedTask
    );
  },

  // =====================================================
  // ASSIGN TASK
  // =====================================================

  async assignTask(
    taskId: string,
    userId: string
  ): Promise<Task> {
    const data =
      await request<any>(
        `/api/tasks/${encodeURIComponent(
          taskId
        )}/assign`,
        {
          method: "PATCH",
          body: JSON.stringify({
            userId,
          }),
        }
      );

    const updatedTask =
      data?.task ||
      data?.updatedTask ||
      data;

    return normalizeTask(
      updatedTask
    );
  },

  // =====================================================
  // DELETE TASK
  // =====================================================

  async deleteTask(
    id: string
  ): Promise<{
    success: boolean;
    message?: string;
  }> {
    return request(
      `/api/tasks/${encodeURIComponent(
        id
      )}`,
      {
        method: "DELETE",
      }
    );
  },

  // =====================================================
  // SUBTASKS
  // =====================================================

  async toggleSubtask(
    taskId: string,
    subtaskId: string,
    completed: boolean
  ): Promise<Task> {
    const data =
      await request<any>(
        `/api/tasks/${encodeURIComponent(
          taskId
        )}/subtasks`,
        {
          method: "PATCH",
          body: JSON.stringify({
            subtaskId,
            completed,
          }),
        }
      );

    const updatedTask =
      data?.task ||
      data?.updatedTask ||
      data;

    return normalizeTask(
      updatedTask
    );
  },

  async addSubtask(
    taskId: string,
    title: string
  ): Promise<Task> {
    const currentTask =
      await this.getTask(
        taskId
      );

    const existingSubtasks =
      Array.isArray(
        (currentTask as any)
          ?.subtasks
      )
        ? (currentTask as any)
            .subtasks
        : [];

    const newSubtask = {
      id: `subtask-${Date.now()}`,
      title,
      completed: false,
    };

    const data =
      await request<any>(
        `/api/tasks/${encodeURIComponent(
          taskId
        )}/subtasks`,
        {
          method: "PATCH",
          body: JSON.stringify({
            subtasks: [
              ...existingSubtasks,
              newSubtask,
            ],
          }),
        }
      );

    const updatedTask =
      data?.task ||
      data?.updatedTask ||
      data;

    return normalizeTask(
      updatedTask
    );
  },

  // =====================================================
  // COMMENTS
  // =====================================================

  async getTaskComments(
    taskId: string
  ): Promise<Comment[]> {
    return request(
      `/api/tasks/${taskId}/comments`
    );
  },

  async addComment(
    taskId: string,
    content: string
  ): Promise<Comment> {
    return request(
      `/api/tasks/${taskId}/comments`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
        }),
      }
    );
  },

  // =====================================================
  // FILES
  // =====================================================

  async getFiles(
    projectId?: string
  ): Promise<TaskFile[]> {
    const url = projectId
      ? `/api/files?projectId=${encodeURIComponent(
          projectId
        )}`
      : "/api/files";

    return request(url);
  },

  async uploadFile(
    fileData: FormData
  ): Promise<TaskFile> {
    const token =
      typeof localStorage !==
      "undefined"
        ? localStorage.getItem(
            "token"
          )
        : null;

    const headers: Record<
      string,
      string
    > = {};

    if (token) {
      headers.Authorization =
        `Bearer ${token}`;
    }

    const response =
      await fetch(
        getUrl(
          "/api/files/upload"
        ),
        {
          method: "POST",
          headers,
          body: fileData,
        }
      );

    const contentType =
      response.headers.get(
        "content-type"
      ) || "";

    const data =
      contentType.includes(
        "application/json"
      )
        ? await response.json()
        : await response.text();

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data?.message
          ? data.message
          : `File upload failed with status ${response.status}`;

      throw new Error(
        message
      );
    }

    return data;
  },

  async deleteFile(
    id: string
  ): Promise<{
    success: boolean;
  }> {
    return request(
      `/api/files/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // =====================================================
  // ACTIVITIES
  // =====================================================

  async getActivities(
    workspaceId?: string
  ): Promise<Activity[]> {
    const url = workspaceId
      ? `/api/activities?workspaceId=${encodeURIComponent(
          workspaceId
        )}`
      : "/api/activities";

    return request(url);
  },

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  async getNotifications(
    _workspaceId?: string
  ): Promise<Notification[]> {
    return request(
      "/api/notifications"
    );
  },

  async markNotificationRead(
    id: string
  ): Promise<Notification> {
    return request(
      `/api/notifications/${id}/read`,
      {
        method: "PATCH",
      }
    );
  },

  async markAllNotificationsRead(): Promise<{
    success: boolean;
  }> {
    return request(
      "/api/notifications/read-all",
      {
        method: "PATCH",
      }
    );
  },

  async markNotificationAsRead(
    id: string
  ): Promise<Notification> {
    return this.markNotificationRead(
      id
    );
  },

  async markAllNotificationsAsRead(): Promise<{
    success: boolean;
  }> {
    return this.markAllNotificationsRead();
  },

  async deleteNotification(
    id: string
  ): Promise<{
    success: boolean;
  }> {
    return request(
      `/api/notifications/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // =====================================================
  // DASHBOARD
  // =====================================================

  async getDashboard(
    param?:
      | string
      | {
          workspaceId?: string;
        }
  ): Promise<any> {
    const workspaceId =
      typeof param === "string"
        ? param
        : param?.workspaceId;

    const url = workspaceId
      ? `/api/dashboard/analytics?workspaceId=${encodeURIComponent(
          workspaceId
        )}`
      : "/api/dashboard/analytics";

    return request(url);
  },

  async getDashboardAnalytics(
    param?:
      | string
      | {
          workspaceId?: string;
        }
  ): Promise<any> {
    const workspaceId =
      typeof param === "string"
        ? param
        : param?.workspaceId;

    const url = workspaceId
      ? `/api/dashboard/analytics?workspaceId=${encodeURIComponent(
          workspaceId
        )}`
      : "/api/dashboard/analytics";

    return request(url);
  },

  async getDashboardKPIs(
    param?:
      | string
      | {
          workspaceId?: string;
        }
  ): Promise<DashboardOverview> {
    const data =
      await this.getDashboard(
        param
      );

    const stats =
      data?.stats || {};

    const totalTasks =
      Number(
        stats.totalTasks || 0
      );

    const completedTasks =
      Number(
        stats.completedTasks ||
          0
      );

    return {
      totalProjects: Number(
        stats.totalProjects || 0
      ),

      totalTasks,

      pendingTasks: Number(
        stats.pendingTasks || 0
      ),

      inProgressTasks:
        Number(
          stats.inProgressTasks ||
            0
        ),

      completedTasks,

      highPriorityTasks:
        Number(
          stats.highPriorityTasks ||
            0
        ),

      assignedTasks: Number(
        stats.assignedTasks || 0
      ),

      unassignedTasks:
        Number(
          stats.unassignedTasks || 0
        ),

      overdueTasks: Number(
        stats.overdueTasks || 0
      ),

      completionRate:
        totalTasks > 0
          ? Math.round(
              (completedTasks /
                totalTasks) *
                100
            )
          : 0,

      activeMembersCount: 0,
    };
  },

  // =====================================================
  // ANALYTICS
  // =====================================================

  async getAnalyticsDashboard(
    workspaceId?: string
  ): Promise<any> {
    const kpis =
      await this.getDashboardKPIs(
        workspaceId
      );

    return {
      totalProjects:
        kpis.totalProjects,

      completedTasks:
        kpis.completedTasks,

      pendingTasks:
        kpis.pendingTasks,

      overdueTasks:
        kpis.overdueTasks,

      completionRate:
        kpis.completionRate,

      activeMembersCount:
        kpis.activeMembersCount,
    };
  },

  async getAnalytics(
    workspaceId?: string
  ): Promise<any> {
    return this.getDashboardAnalytics(
      workspaceId
    );
  },

  async getTaskAnalytics(): Promise<any> {
    return request(
      "/api/analytics/tasks"
    );
  },
};