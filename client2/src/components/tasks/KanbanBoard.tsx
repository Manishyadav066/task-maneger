import React, { useState } from "react";

import {
  Plus,
  Calendar,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Filter,
  Pencil,
} from "lucide-react";

import { Task, Project, User, TaskStatus, TaskPriority } from "../../types";

interface KanbanBoardProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  selectedProjectId?: string;

  onSelectProject?: (projectId: string | undefined) => void;

  onSelectTask?: (task: Task) => void;

  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;

  onQuickAddTask?: (columnStatus: TaskStatus, title: string) => void;

  onOpenAIGenerator?: () => void;

  onMoveTaskStatus?: (taskId: string, newStatus: TaskStatus) => void;

  onOpenCreateModal?: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  projects,
  users,
  selectedProjectId,

  onSelectProject = () => {},

  onSelectTask,

  onUpdateStatus = () => {},

  onQuickAddTask = () => {},

  onOpenAIGenerator = () => {},

  onMoveTaskStatus,

  onOpenCreateModal,
}) => {
  const [addingColumn, setAddingColumn] = useState<TaskStatus | null>(null);

  const [quickTitle, setQuickTitle] = useState("");

  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // =====================================================
  // SAFE TASK SELECT CALLBACK
  // =====================================================

  const handleSelectTask = (task: Task) => {
    if (typeof onSelectTask === "function") {
      console.log("🖱️ KANBAN TASK SELECTED:", task);

      onSelectTask(task);
      return;
    }

    console.error(
      "❌ KanbanBoard: onSelectTask callback is missing or is not a function.",
      task,
    );
  };

  // =====================================================
  // KANBAN COLUMNS
  // =====================================================

  const columns: {
    id: TaskStatus;
    title: string;
    color: string;
    badgeBg: string;
  }[] = [
    {
      id: "todo",
      title: "To Do",
      color: "#64748b",
      badgeBg: "bg-slate-100 text-slate-700",
    },
    {
      id: "in_progress",
      title: "In Progress",
      color: "#f59e0b",
      badgeBg: "bg-amber-50 text-amber-700",
    },
    {
      id: "review",
      title: "Review",
      color: "#8b5cf6",
      badgeBg: "bg-violet-50 text-violet-700",
    },
    {
      id: "done",
      title: "Done",
      color: "#10b981",
      badgeBg: "bg-emerald-50 text-emerald-700",
    },
  ];

  // =====================================================
  // SAFE DATA
  // =====================================================

  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const safeProjects = Array.isArray(projects) ? projects : [];

  const safeUsers = Array.isArray(users) ? users : [];

  // =====================================================
  // NORMALIZE TASK STATUS
  // =====================================================

  const normalizeStatus = (status: any): TaskStatus => {
    if (status === "pending" || status === "todo") {
      return "todo";
    }

    if (status === "in-progress" || status === "in_progress") {
      return "in_progress";
    }

    if (status === "review") {
      return "review";
    }

    if (status === "completed" || status === "done") {
      return "done";
    }

    return "todo";
  };

  // =====================================================
  // FILTERING TASKS
  // =====================================================

  const filteredTasks = safeTasks.filter((task: any) => {
    if (!task) {
      return false;
    }

    const taskProjectId =
      typeof task.projectId === "object"
        ? task.projectId?._id || task.projectId?.id || ""
        : task.projectId || "";

    if (selectedProjectId && taskProjectId !== selectedProjectId) {
      return false;
    }

    if (priorityFilter !== "all" && task.priority !== priorityFilter) {
      return false;
    }

    return true;
  });

  // =====================================================
  // QUICK ADD
  // =====================================================

  const handleQuickSubmit = (status: TaskStatus) => {
    const title = quickTitle.trim();

    if (!title) {
      return;
    }

    onQuickAddTask(status, title);

    setQuickTitle("");
    setAddingColumn(null);
  };

  // =====================================================
  // PRIORITY BADGE
  // =====================================================

  const getPriorityBadge = (priority: TaskPriority | string) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-50 text-rose-700 border-rose-200";

      case "high":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "medium":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "low":
        return "bg-slate-50 text-slate-600 border-slate-200";

      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  // =====================================================
  // GET PROJECT
  // =====================================================

  const getTaskProject = (task: any): Project | undefined => {
    if (!task) {
      return undefined;
    }

    const projectId =
      typeof task.projectId === "object"
        ? task.projectId?._id || task.projectId?.id || ""
        : task.projectId || "";

    if (!projectId) {
      return undefined;
    }

    return safeProjects.find(
      (project: any) => project?.id === projectId || project?._id === projectId,
    );
  };

  // =====================================================
  // GET ASSIGNEE
  // =====================================================

  const getTaskAssignee = (task: any): any | null => {
    if (!task) {
      return null;
    }

    // Already populated assignee
    if (task.assignee && typeof task.assignee === "object") {
      return task.assignee;
    }

    // Backend assignedTo populated object
    if (task.assignedTo && typeof task.assignedTo === "object") {
      return task.assignedTo;
    }

    const assignedUserId =
      typeof task.assignedTo === "string"
        ? task.assignedTo
        : task.assignedTo?._id || task.assignedTo?.id;

    if (!assignedUserId) {
      return null;
    }

    return (
      safeUsers.find(
        (user: any) =>
          user?.id === assignedUserId || user?._id === assignedUserId,
      ) || null
    );
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-5">
      {/* =================================================
          TOP FILTER BAR
      ================================================= */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* ALL PROJECTS */}

          <button
            onClick={() => onSelectProject(undefined)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              !selectedProjectId
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Projects ({safeTasks.length})
          </button>

          {/* PROJECTS */}

          {safeProjects.map((project: any) => {
            if (!project) {
              return null;
            }

            const projectId = project.id || project._id;

            if (!projectId) {
              return null;
            }

            const count = safeTasks.filter((task: any) => {
              if (!task) {
                return false;
              }

              const taskProjectId =
                typeof task.projectId === "object"
                  ? task.projectId?._id || task.projectId?.id || ""
                  : task.projectId || "";

              return taskProjectId === projectId;
            }).length;

            const isSelected = selectedProjectId === projectId;

            return (
              <button
                key={projectId}
                onClick={() => onSelectProject(projectId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: project.color || "#6366f1",
                  }}
                />

                <span>{project.name || "Untitled Project"}</span>

                <span className="opacity-70 text-[11px]">({count})</span>
              </button>
            );
          })}
        </div>

        {/* =================================================
            PRIORITY FILTER + AI
        ================================================= */}

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium focus:outline-hidden"
            >
              <option value="all">All Priorities</option>

              <option value="urgent">Urgent</option>

              <option value="high">High</option>

              <option value="medium">Medium</option>

              <option value="low">Low</option>
            </select>
          </div>

          <button
            onClick={onOpenAIGenerator}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />

            <span>AI Task Suggester</span>
          </button>
        </div>
      </div>

      {/* =================================================
          KANBAN COLUMNS
      ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter(
            (task: any) => normalizeStatus(task?.status) === column.id,
          );

          return (
            <div
              key={column.id}
              className="bg-slate-100/70 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col min-h-[480px]"
            >
              {/* =================================================
                  COLUMN HEADER
              ================================================= */}

              <div className="flex items-center justify-between pb-3 px-1 border-b border-slate-200/60 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: column.color,
                    }}
                  />

                  <h3 className="font-bold text-slate-900 text-sm">
                    {column.title}
                  </h3>

                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${column.badgeBg}`}
                  >
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => setAddingColumn(column.id)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                  title="Add task in this column"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* =================================================
                  TASK CARDS
              ================================================= */}

              <div className="space-y-3 flex-1">
                {columnTasks.map((task: any, index) => {
                  if (!task) {
                    return null;
                  }

                  /*
                   * MongoDB me _id ho sakta hai aur
                   * frontend me id ho sakta hai.
                   */

                  const taskId =
                    task.id || task._id || `task-${column.id}-${index}`;

                  const project = getTaskProject(task);

                  /*
                   * Always make sure subtasks is array.
                   */

                  const subtasksList = Array.isArray(task.subtasks)
                    ? task.subtasks
                    : [];

                  const completedSubs = subtasksList.filter((subtask: any) =>
                    Boolean(subtask?.completed),
                  ).length;

                  /*
                   * Always make sure tags is array.
                   */

                  const tagsList = Array.isArray(task.tags) ? task.tags : [];

                  const assignee = getTaskAssignee(task);

                  const taskPriority = task.priority || "medium";

                  return (
                    <div
                      key={taskId}
                      id={`task-card-${taskId}`}
                      onClick={() => handleSelectTask(task)}
                      className="bg-white rounded-xl p-4 border border-slate-200/70 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group select-none active:scale-[0.99]"
                    >
                      {/* =================================================
                            TAGS + PRIORITY
                        ================================================= */}

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {tagsList
                            .slice(0, 2)
                            .map((tag: any, tagIndex: number) => (
                              <span
                                key={tagIndex}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                              >
                                {typeof tag === "string"
                                  ? tag
                                  : tag?.name || tag?.label || ""}
                              </span>
                            ))}
                        </div>

                        <span
                          className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border ${getPriorityBadge(
                            taskPriority,
                          )}`}
                        >
                          {taskPriority}
                        </span>
                      </div>

                      {/* =================================================
                            TITLE
                        ================================================= */}

                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {task.title || "Untitled Task"}
                      </h4>

                      {/* =================================================
                            PROJECT
                        ================================================= */}

                      {project && (
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                          <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{
                              backgroundColor: project.color || "#6366f1",
                            }}
                          />

                          <span className="truncate">
                            {project.name || "Project"}
                          </span>
                        </div>
                      )}

                      {/* =================================================
                            SUBTASKS
                        ================================================= */}

                      {subtasksList.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                            <span className="flex items-center gap-1">
                              <CheckSquare className="w-3 h-3 text-slate-400" />

                              <span>Subtasks</span>
                            </span>

                            <span className="font-semibold">
                              {completedSubs}/{subtasksList.length}
                            </span>
                          </div>

                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    (completedSubs / subtasksList.length) * 100,
                                  ),
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}

                      {/* =================================================
                            FOOTER
                        ================================================= */}

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />

                          <span>
                            {task.dueDate ? task.dueDate : "No due date"}
                          </span>
                        </span>

                        <div className="flex items-center gap-2">
                          {/* =================================================
                                QUICK MOVE + EDIT
                            ================================================= */}

                          <div
                            className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {/* EDIT */}

                            <button
                              onClick={() => handleSelectTask(task)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600"
                              title="Edit Task"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>

                            {/* MOVE LEFT */}

                            {column.id !== "todo" && (
                              <button
                                onClick={() => {
                                  const currentIndex = columns.findIndex(
                                    (item) => item.id === column.id,
                                  );

                                  if (currentIndex > 0) {
                                    const newStatus =
                                      columns[currentIndex - 1].id;

                                    onUpdateStatus(taskId, newStatus);
                                  }
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                                title="Move left"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {/* MOVE RIGHT */}

                            {column.id !== "done" && (
                              <button
                                onClick={() => {
                                  const currentIndex = columns.findIndex(
                                    (item) => item.id === column.id,
                                  );

                                  if (currentIndex < columns.length - 1) {
                                    const newStatus =
                                      columns[currentIndex + 1].id;

                                    onUpdateStatus(taskId, newStatus);
                                  }
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                                title="Move right"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {/* =================================================
                                ASSIGNEE
                            ================================================= */}

                          {assignee ? (
                            <span
                              className="text-[11px] font-medium text-slate-600 truncate max-w-[100px]"
                              title={
                                assignee.name ||
                                assignee.email ||
                                "Assigned User"
                              }
                            >
                              {assignee.name || assignee.email || "Assigned"}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-medium">
                              Unassigned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* =================================================
                    QUICK ADD FORM
                ================================================= */}

                {addingColumn === column.id ? (
                  <div className="bg-white rounded-xl p-3 border border-indigo-200 shadow-xs animate-in fade-in">
                    <input
                      type="text"
                      autoFocus
                      value={quickTitle}
                      onChange={(event) => setQuickTitle(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          handleQuickSubmit(column.id);
                        }

                        if (event.key === "Escape") {
                          setAddingColumn(null);
                          setQuickTitle("");
                        }
                      }}
                      placeholder="What needs to be done?"
                      className="w-full text-xs font-medium text-slate-900 border-none p-1 focus:outline-hidden mb-2"
                    />

                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setAddingColumn(null);
                          setQuickTitle("");
                        }}
                        className="px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-100 rounded-md"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={() => handleQuickSubmit(column.id)}
                        className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-xs"
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingColumn(column.id)}
                    className="w-full py-2 border-2 border-dashed border-slate-200/80 hover:border-indigo-300 hover:bg-white/60 rounded-xl text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />

                    <span>Add Task</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
