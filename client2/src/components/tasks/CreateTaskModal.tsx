
import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

import {
  Project,
  User as UserType,
  TaskPriority,
  TaskStatus,
} from '../../types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  users: UserType[];
  defaultProjectId?: string;
  defaultStatus?: TaskStatus;
  onSubmit: (newTask: any) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  isOpen,
  onClose,
  projects,
  users,
  defaultProjectId,
  defaultStatus = 'todo',
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  /*
   * IMPORTANT:
   * Do not use fake project id like "proj-1".
   * Backend expects a real MongoDB Project _id.
   */
  const [projectId, setProjectId] = useState(
    defaultProjectId || projects[0]?.id || ''
  );

  const [priority, setPriority] =
    useState<TaskPriority>('medium');

  const [status, setStatus] =
    useState<TaskStatus>(defaultStatus);

  const [assigneeId, setAssigneeId] =
    useState(users[0]?.id || '');

  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 7 * 86400000)
      .toISOString()
      .split('T')[0]
  );

  const [tagsInput, setTagsInput] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [subtasksInput, setSubtasksInput] = useState('');

  /*
   * Reset form
   */
  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');

    setProjectId(
      defaultProjectId || projects[0]?.id || ''
    );

    setPriority('medium');

    setStatus(defaultStatus || 'todo');

    setAssigneeId(
      users[0]?.id || ''
    );

    setDueDate(
      new Date(Date.now() + 7 * 86400000)
        .toISOString()
        .split('T')[0]
    );

    setTagsInput('');
    setEstimatedHours(8);
    setSubtasksInput('');
  }, [
    defaultProjectId,
    defaultStatus,
    projects,
    users,
  ]);

  /*
   * Reset whenever modal opens
   */
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  /*
   * Keep project selection updated
   * when projects are loaded asynchronously.
   */
  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(
        defaultProjectId || projects[0].id
      );
    }
  }, [
    projects,
    defaultProjectId,
    projectId,
  ]);

  /*
   * Keep assignee selection updated
   * when users are loaded asynchronously.
   */
  useEffect(() => {
    if (!assigneeId && users.length > 0) {
      setAssigneeId(users[0].id);
    }
  }, [users, assigneeId]);

  if (!isOpen) {
    return null;
  }

  /*
   * Close modal
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

  /*
   * Submit task
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    /*
     * Title validation
     */
    if (!title.trim()) {
      alert('Please enter task title.');
      return;
    }

    /*
     * Project validation
     *
     * Backend requires a valid projectId.
     */
    if (!projectId) {
      alert('Please select a project.');
      return;
    }

    /*
     * Convert comma-separated tags
     *
     * Example:
     * "Frontend, API, Design"
     *
     * becomes:
     * ["Frontend", "API", "Design"]
     */
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    /*
     * Convert subtasks
     *
     * Example:
     *
     * Login UI
     * API integration
     *
     * becomes:
     *
     * [
     *   {
     *     id: "...",
     *     title: "Login UI",
     *     completed: false
     *   },
     *   ...
     * ]
     */
    const subtasks = subtasksInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((subtaskTitle, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        title: subtaskTitle,
        completed: false,
      }));

    /*
     * IMPORTANT BACKEND FIX
     *
     * Backend expects:
     *
     * assignedTo
     *
     * NOT:
     *
     * assigneeId
     */
    const taskPayload = {
      title: title.trim(),
      description: description.trim(),

      // Real MongoDB project ID
      projectId,

      // Backend supported values
      priority,
      status,

      // IMPORTANT:
      // frontend assigneeId -> backend assignedTo
      assignedTo: assigneeId || null,

      dueDate,

      tags,

      estimatedHours:
        Number(estimatedHours) || 8,

      subtasks,
    };

    /*
     * Debug:
     * Browser console me exact payload dikhega.
     */
    console.log(
      '🚀 CREATE TASK PAYLOAD:',
      taskPayload
    );

    /*
     * Send to parent.
     * Parent will call api.createTask().
     */
    onSubmit(taskPayload);

    /*
     * Clear form
     */
    resetForm();

    /*
     * Close modal
     */
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <h3 className="text-base font-bold text-slate-900">
            Create New Task
          </h3>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 overflow-y-auto flex-1 text-xs"
        >
          {/* Task Title */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Task Title *
            </label>

            <input
              type="text"
              required
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="e.g. Implement WebSocket Real-time Notifications"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Provide context, acceptance criteria or links..."
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* Project + Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

            {/* Project */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Project
              </label>

              <select
                value={projectId}
                onChange={(e) =>
                  setProjectId(e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              >
                {projects.length === 0 ? (
                  <option value="">
                    No projects available
                  </option>
                ) : (
                  projects.map((project) => (
                    <option
                      key={project.id}
                      value={project.id}
                    >
                      {project.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Assignee
              </label>

              <select
                value={assigneeId}
                onChange={(e) =>
                  setAssigneeId(e.target.value)
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              >
                {users.length === 0 ? (
                  <option value="">
                    No users available
                  </option>
                ) : (
                  users.map((user) => (
                    <option
                      key={user.id}
                      value={user.id}
                    >
                      {user.name} ({user.role})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Status + Priority + Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            {/* Status */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value as TaskStatus
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
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
              <label className="font-semibold text-slate-700 block mb-1">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(
                    e.target.value as TaskPriority
                  )
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
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

            {/* Due Date */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Due Date
              </label>

              <input
                type="date"
                value={dueDate}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
                className="w-full px-3 py-1.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Tags (comma separated)
            </label>

            <input
              type="text"
              value={tagsInput}
              onChange={(e) =>
                setTagsInput(e.target.value)
              }
              placeholder="e.g. Design, Frontend, API"
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          {/* Subtasks */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Subtasks (one per line)
            </label>

            <textarea
              rows={2}
              value={subtasksInput}
              onChange={(e) =>
                setSubtasksInput(e.target.value)
              }
              placeholder={`Subtask 1
Subtask 2`}
              className="w-full px-3.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">

            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
            >
              Create Task
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

