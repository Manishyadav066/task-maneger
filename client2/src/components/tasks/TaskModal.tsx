
import React, { useState, useEffect } from 'react';

import {
  X,
  Calendar,
  User as UserIcon,
  Tag,
  CheckSquare,
  MessageSquare,
  Paperclip,
  Clock,
  Trash2,
  Plus,
  Send,
  AlertCircle,
  Pencil,
} from 'lucide-react';

import {
  Task,
  User,
  Project,
  TaskStatus,
  TaskPriority,
  Comment,
} from '../../types';

interface TaskModalProps {
  task: Task;
  project?: Project;
  projects?: Project[];
  users: User[];
  comments: Comment[];

  onClose: () => void;

  onEditTask?: (
    taskId: string,
    updates: Partial<Task>
  ) => void | Promise<void>;

  onUpdateStatus: (
    taskId: string,
    status: TaskStatus
  ) => void | Promise<void>;

  onUpdatePriority: (
    taskId: string,
    priority: TaskPriority
  ) => void | Promise<void>;

  onAssignUser: (
    taskId: string,
    userId: string
  ) => void | Promise<void>;

  onToggleSubtask: (
    taskId: string,
    subtaskId: string,
    completed: boolean
  ) => void | Promise<void>;

  onAddSubtask: (
    taskId: string,
    title: string
  ) => void | Promise<void>;

  onAddComment: (
    taskId: string,
    text: string
  ) => void | Promise<void>;

  onDeleteTask: (
    taskId: string
  ) => void | Promise<void>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  project,
  projects = [],
  users = [],
  comments = [],
  onClose,
  onEditTask,
  onUpdateStatus,
  onUpdatePriority,
  onAssignUser,
  onToggleSubtask,
  onAddSubtask,
  onAddComment,
  onDeleteTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editTitle, setEditTitle] = useState(task.title || '');
  const [editDescription, setEditDescription] = useState(
    task.description || ''
  );

  const [editProjectId, setEditProjectId] = useState(
    task.projectId || projects[0]?.id || ''
  );

  const [editStatus, setEditStatus] = useState<TaskStatus>(
    task.status || 'todo'
  );

  const [editPriority, setEditPriority] = useState<TaskPriority>(
    task.priority || 'medium'
  );

  const [editAssigneeId, setEditAssigneeId] = useState(
    task.assigneeId || ''
  );

  const [editDueDate, setEditDueDate] = useState(
    task.dueDate || ''
  );

  const [editTags, setEditTags] = useState(
    Array.isArray(task.tags) ? task.tags.join(', ') : ''
  );

  const [editEstimatedHours, setEditEstimatedHours] = useState(
    task.estimatedHours || 8
  );

  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  /*
   * ---------------------------------------------------------
   * GET TASK ID
   * ---------------------------------------------------------
   * Backend MongoDB may return _id while frontend normally
   * uses id. We support both safely.
   */
  const getTaskId = (): string => {
    const taskAny = task as any;

    return String(
      taskAny?.id ||
        taskAny?._id ||
        ''
    );
  };

  const taskId = getTaskId();

  /*
   * ---------------------------------------------------------
   * GET ASSIGNEE ID
   * ---------------------------------------------------------
   */
  const getCurrentAssigneeId = (): string => {
    const taskAny = task as any;

    if (taskAny?.assigneeId) {
      return String(taskAny.assigneeId);
    }

    if (taskAny?.assignedTo) {
      if (typeof taskAny.assignedTo === 'string') {
        return taskAny.assignedTo;
      }

      if (taskAny.assignedTo?.id) {
        return String(taskAny.assignedTo.id);
      }

      if (taskAny.assignedTo?._id) {
        return String(taskAny.assignedTo._id);
      }
    }

    if (taskAny?.assignee?.id) {
      return String(taskAny.assignee.id);
    }

    if (taskAny?.assignee?._id) {
      return String(taskAny.assignee._id);
    }

    return '';
  };

  /*
   * ---------------------------------------------------------
   * RESET EDIT FORM WHEN TASK CHANGES
   * ---------------------------------------------------------
   */
  useEffect(() => {
    setEditTitle(task.title || '');
    setEditDescription(task.description || '');

    setEditProjectId(
      task.projectId || projects[0]?.id || ''
    );

    setEditStatus(
      task.status || 'todo'
    );

    setEditPriority(
      task.priority || 'medium'
    );

    setEditAssigneeId(
      getCurrentAssigneeId()
    );

    setEditDueDate(
      task.dueDate || ''
    );

    setEditTags(
      Array.isArray(task.tags)
        ? task.tags.join(', ')
        : ''
    );

    setEditEstimatedHours(
      task.estimatedHours || 8
    );

    setIsEditing(false);
    setIsSaving(false);
  }, [task, projects, users]);

  /*
   * ---------------------------------------------------------
   * OPEN EDIT MODE
   * ---------------------------------------------------------
   */
  const handleStartEditing = () => {
    setEditTitle(task.title || '');

    setEditDescription(
      task.description || ''
    );

    setEditProjectId(
      task.projectId || projects[0]?.id || ''
    );

    setEditStatus(
      task.status || 'todo'
    );

    setEditPriority(
      task.priority || 'medium'
    );

    setEditAssigneeId(
      getCurrentAssigneeId()
    );

    setEditDueDate(
      task.dueDate || ''
    );

    setEditTags(
      Array.isArray(task.tags)
        ? task.tags.join(', ')
        : ''
    );

    setEditEstimatedHours(
      task.estimatedHours || 8
    );

    setIsEditing(true);
  };

  /*
   * ---------------------------------------------------------
   * SAVE EDITED TASK
   * ---------------------------------------------------------
   */
  const handleEditSave = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (isSaving) {
      return;
    }

    if (!editTitle.trim()) {
      return;
    }

    if (!taskId) {
      console.error(
        '❌ UPDATE TASK FAILED: Task ID is missing',
        task
      );

      alert('Task ID is missing. Please reopen the task and try again.');

      return;
    }

    if (!onEditTask) {
      console.error(
        '❌ UPDATE TASK FAILED: onEditTask prop is missing'
      );

      alert(
        'Update function is not connected. Please check TaskModal parent.'
      );

      return;
    }

    try {
      setIsSaving(true);

      const selectedAssignee = users.find(
        (u) =>
          String(u.id) ===
          String(editAssigneeId)
      );

      /*
       * Frontend update object.
       *
       * We keep assigneeId for frontend compatibility
       * and also send assignedTo for backend compatibility.
       */
      const updates: Partial<Task> & {
        assignedTo?: string;
      } = {
        title: editTitle.trim(),

        description:
          editDescription.trim(),

        projectId:
          editProjectId || undefined,

        status:
          editStatus,

        priority:
          editPriority,

        assigneeId:
          editAssigneeId || undefined,

        assignedTo:
          editAssigneeId || undefined,

        assignee:
          selectedAssignee,

        dueDate:
          editDueDate || undefined,

        tags:
          editTags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),

        estimatedHours:
          Number(editEstimatedHours) || 8,
      };

      console.log(
        '================================='
      );

      console.log(
        '✏️ EDIT TASK'
      );

      console.log(
        '🆔 TASK ID:',
        taskId
      );

      console.log(
        '📦 UPDATE DATA:',
        updates
      );

      console.log(
        '================================='
      );

      /*
       * IMPORTANT:
       * Wait for API request to complete.
       */
      await onEditTask(
        taskId,
        updates
      );

      console.log(
        '✅ TASK UPDATE COMPLETED'
      );

      /*
       * Only close edit mode after successful update.
       */
      setIsEditing(false);
    } catch (error) {
      console.error(
        '❌ TASK UPDATE FAILED FROM MODAL:',
        error
      );

      alert(
        'Task update failed. Please check the browser console.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * SUBTASKS
   * ---------------------------------------------------------
   */
  const subtasks = Array.isArray(task.subtasks)
    ? task.subtasks
    : [];

  const completedSubtasks =
    subtasks.filter(
      (sub) =>
        sub &&
        sub.completed
    ).length;

  const totalSubtasks =
    subtasks.length;

  const handleSubtaskSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newSubtaskText.trim()) {
      return;
    }

    if (!taskId) {
      return;
    }

    try {
      await onAddSubtask(
        taskId,
        newSubtaskText.trim()
      );

      setNewSubtaskText('');
    } catch (error) {
      console.error(
        '❌ ADD SUBTASK FAILED:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * COMMENT
   * ---------------------------------------------------------
   */
  const handleCommentSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!newCommentText.trim()) {
      return;
    }

    if (!taskId) {
      return;
    }

    try {
      await onAddComment(
        taskId,
        newCommentText.trim()
      );

      setNewCommentText('');
    } catch (error) {
      console.error(
        '❌ ADD COMMENT FAILED:',
        error
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * PRIORITY COLOR
   * ---------------------------------------------------------
   */
  const priorityColors =
    ({
      urgent:
        'bg-rose-50 text-rose-700 border-rose-200',

      high:
        'bg-amber-50 text-amber-700 border-amber-200',

      medium:
        'bg-indigo-50 text-indigo-700 border-indigo-200',

      low:
        'bg-slate-50 text-slate-700 border-slate-200',
    } as Record<string, string>)[
      task.priority
    ] ||
    'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">

      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">

        {/* Modal Header */}

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">

          <div className="flex items-center gap-2.5">

            {project && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                {project.name}
              </span>
            )}

            <span
              className={`text-xs font-bold uppercase px-2 py-0.5 rounded-md border ${priorityColors}`}
            >
              {task.priority}
            </span>

          </div>

          <div className="flex items-center gap-2">

            {!isEditing && onEditTask && (
              <button
                type="button"
                onClick={handleStartEditing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-700 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-slate-200 transition-colors text-xs font-semibold cursor-pointer shadow-2xs"
                title="Edit task"
              >
                <Pencil className="w-3.5 h-3.5" />

                <span>
                  Edit Task
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={async () => {
                if (!taskId) {
                  return;
                }

                if (
                  confirm(
                    'Are you sure you want to delete this task?'
                  )
                ) {
                  try {
                    await onDeleteTask(taskId);

                    onClose();
                  } catch (error) {
                    console.error(
                      '❌ DELETE TASK FAILED:',
                      error
                    );
                  }
                }
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* Modal Body */}

        {isEditing ? (

          <form
            onSubmit={handleEditSave}
            className="flex-1 overflow-y-auto p-6 space-y-4 text-xs"
          >

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">

              <h3 className="text-base font-bold text-slate-900">
                Edit Task Details
              </h3>

              <span className="text-xs text-slate-400">
                Modify any field and click save
              </span>

            </div>

            {/* Title */}

            <div>

              <label className="font-semibold text-slate-700 block mb-1">
                Task Title *
              </label>

              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
                className="w-full text-sm font-semibold px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />

            </div>

            {/* Description */}

            <div>

              <label className="font-semibold text-slate-700 block mb-1">
                Description
              </label>

              <textarea
                rows={4}
                value={editDescription}
                onChange={(e) =>
                  setEditDescription(e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
              />

            </div>

            {/* Project + Status */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Project
                </label>

                <select
                  value={editProjectId}
                  onChange={(e) =>
                    setEditProjectId(
                      e.target.value
                    )
                  }
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                >

                  {projects.map((p) => (
                    <option
                      key={p.id}
                      value={p.id}
                    >
                      {p.name}
                    </option>
                  ))}

                </select>

              </div>

              <div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Status
                </label>

                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(
                      e.target.value as TaskStatus
                    )
                  }
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                >

                  <option value="todo">
                    To Do
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="review">
                    Review
                  </option>

                  <option value="done">
                    Done
                  </option>

                </select>

              </div>

            </div>

            {/* Priority + Assignee + Due Date */}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Priority
                </label>

                <select
                  value={editPriority}
                  onChange={(e) =>
                    setEditPriority(
                      e.target.value as TaskPriority
                    )
                  }
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                >

                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                  <option value="urgent">
                    Urgent
                  </option>

                </select>

              </div>

              <div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Assignee
                </label>

                <select
                  value={editAssigneeId}
                  onChange={(e) =>
                    setEditAssigneeId(
                      e.target.value
                    )
                  }
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                >

                  <option value="">
                    Unassigned
                  </option>

                  {users.map((u) => (
                    <option
                      key={u.id}
                      value={u.id}
                    >
                      {u.name}
                    </option>
                  ))}

                </select>

              </div>

              <div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Due Date
                </label>

                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) =>
                    setEditDueDate(
                      e.target.value
                    )
                  }
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />

              </div>

            </div>

            {/* Tags + Estimated Hours */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              <div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Tags (comma separated)
                </label>

                <input
                  type="text"
                  value={editTags}
                  onChange={(e) =>
                    setEditTags(e.target.value)
                  }
                  placeholder="e.g. Frontend, React, Bug"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />

              </div>

              <div>

                <label className="font-semibold text-slate-700 block mb-1">
                  Estimated Hours
                </label>

                <input
                  type="number"
                  min={1}
                  max={200}
                  value={editEstimatedHours}
                  onChange={(e) =>
                    setEditEstimatedHours(
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />

              </div>

            </div>

            {/* Save / Cancel */}

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 mt-6">

              <button
                type="button"
                disabled={isSaving}
                onClick={() =>
                  setIsEditing(false)
                }
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  isSaving ||
                  !editTitle.trim()
                }
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
              >
                {isSaving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>

            </div>

          </form>

        ) : (

          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Title & Description */}

            <div>

              <h2 className="text-xl font-bold text-slate-900 leading-snug">
                {task.title}
              </h2>

              <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                {task.description ||
                  'No description provided.'}
              </p>

            </div>

            {/* Quick Properties Grid */}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">

              {/* Status */}

              <div>

                <span className="text-slate-400 font-medium block mb-1">
                  Status
                </span>

                <select
                  value={task.status}
                  onChange={(e) => {
                    if (!taskId) return;

                    onUpdateStatus(
                      taskId,
                      e.target.value as TaskStatus
                    );
                  }}
                  className="w-full font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-indigo-500"
                >

                  <option value="todo">
                    To Do
                  </option>

                  <option value="in_progress">
                    In Progress
                  </option>

                  <option value="review">
                    Review
                  </option>

                  <option value="done">
                    Done
                  </option>

                </select>

              </div>

              {/* Priority */}

              <div>

                <span className="text-slate-400 font-medium block mb-1">
                  Priority
                </span>

                <select
                  value={task.priority}
                  onChange={(e) => {
                    if (!taskId) return;

                    onUpdatePriority(
                      taskId,
                      e.target.value as TaskPriority
                    );
                  }}
                  className="w-full font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-indigo-500"
                >

                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>

                  <option value="urgent">
                    Urgent
                  </option>

                </select>

              </div>

              {/* Assignee */}

              <div>

                <span className="text-slate-400 font-medium block mb-1">
                  Assignee
                </span>

                <select
                  value={getCurrentAssigneeId()}
                  onChange={(e) => {
                    if (!taskId) return;

                    onAssignUser(
                      taskId,
                      e.target.value
                    );
                  }}
                  className="w-full font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-hidden focus:border-indigo-500"
                >

                  <option value="">
                    Unassigned
                  </option>

                  {users.map((u) => (
                    <option
                      key={u.id}
                      value={u.id}
                    >
                      {u.name}
                    </option>
                  ))}

                </select>

              </div>

              {/* Due Date */}

              <div>

                <span className="text-slate-400 font-medium block mb-1">
                  Due Date
                </span>

                <div className="font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1.5 flex items-center gap-1.5">

                  <Calendar className="w-3.5 h-3.5 text-slate-400" />

                  <span>
                    {task.dueDate ||
                      'No due date'}
                  </span>

                </div>

              </div>

            </div>

            {/* Subtasks */}

            <div>

              <div className="flex items-center justify-between mb-2.5">

                <div className="flex items-center gap-2">

                  <CheckSquare className="w-4 h-4 text-indigo-600" />

                  <h3 className="text-sm font-bold text-slate-900">
                    Subtasks
                  </h3>

                  <span className="text-xs text-slate-400 font-medium">
                    ({completedSubtasks}/
                    {totalSubtasks})
                  </span>

                </div>

                {totalSubtasks > 0 && (
                  <span className="text-xs font-semibold text-indigo-600">
                    {Math.round(
                      (completedSubtasks /
                        totalSubtasks) *
                        100
                    )}
                    %
                  </span>
                )}

              </div>

              {totalSubtasks > 0 && (
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">

                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (completedSubtasks /
                          totalSubtasks) *
                        100
                      }%`,
                    }}
                  />

                </div>
              )}

              <div className="space-y-1.5 mb-3">

                {subtasks.map((sub) => (

                  <label
                    key={sub.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 cursor-pointer"
                  >

                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={(e) => {
                        if (!taskId) return;

                        onToggleSubtask(
                          taskId,
                          sub.id,
                          e.target.checked
                        );
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
                    />

                    <span
                      className={`text-xs ${
                        sub.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-800 font-medium'
                      }`}
                    >
                      {sub.title}
                    </span>

                  </label>

                ))}

              </div>

              <form
                onSubmit={handleSubtaskSubmit}
                className="flex gap-2"
              >

                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) =>
                    setNewSubtaskText(
                      e.target.value
                    )
                  }
                  placeholder="Add new subtask item..."
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-hidden focus:border-indigo-500"
                />

                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >

                  <Plus className="w-3.5 h-3.5" />

                  <span>
                    Add
                  </span>

                </button>

              </form>

            </div>

            {/* Comments */}

            <div>

              <div className="flex items-center gap-2 mb-3">

                <MessageSquare className="w-4 h-4 text-indigo-600" />

                <h3 className="text-sm font-bold text-slate-900">
                  Discussion
                </h3>

                <span className="text-xs text-slate-400 font-medium">
                  ({comments.length})
                </span>

              </div>

              <div className="space-y-3 mb-4">

                {comments.length === 0 ? (

                  <div className="text-xs text-slate-400 py-3 text-center">
                    No comments yet. Start the conversation below!
                  </div>

                ) : (

                  comments.map((comm) => (

                    <div
                      key={comm.id}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
                    >

                      <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">

                        {comm.userName
                          ? comm.userName.charAt(0)
                          : 'U'}

                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex items-center justify-between">

                          <span className="text-xs font-bold text-slate-900">
                            {comm.userName}
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {new Date(
                              comm.createdAt
                            ).toLocaleDateString()}
                          </span>

                        </div>

                        <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                          {comm.content}
                        </p>

                      </div>

                    </div>

                  ))

                )}

              </div>

              <form
                onSubmit={handleCommentSubmit}
                className="flex gap-2"
              >

                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) =>
                    setNewCommentText(
                      e.target.value
                    )
                  }
                  placeholder="Write a comment or mention @teammate..."
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
                />

                <button
                  type="submit"
                  disabled={
                    !newCommentText.trim()
                  }
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >

                  <Send className="w-3.5 h-3.5" />

                  <span>
                    Post
                  </span>

                </button>

              </form>

            </div>

          </div>

        )}

      </div>

    </div>
  );
};

