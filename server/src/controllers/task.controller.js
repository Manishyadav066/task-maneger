const Task = require("../models/task.model");
const Project = require("../models/project.model");
const User = require("../models/user.model");
const Workspace = require("../models/workspace.model");
const Activity = require("../models/activity.model");
const Notification = require("../models/notification.model");
const Comment = require("../models/comment.model");

const normalizeStatus = (status) => {
  if (!status) return "todo";
  const s = String(status).toLowerCase();
  if (s === "pending" || s === "todo") return "todo";
  if (s === "in-progress" || s === "in_progress") return "in_progress";
  if (s === "review") return "review";
  if (s === "completed" || s === "done") return "done";
  return s;
};

const normalizePriority = (priority) => {
  if (!priority) return "medium";
  const p = String(priority).toLowerCase();
  if (["urgent", "high", "medium", "low"].includes(p)) return p;
  return "medium";
};

// 1. CREATE TASK
const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      projectId,
      priority,
      dueDate,
      estimatedHours,
      spentHours,
      tags,
      subtasks,
      assignedTo,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    let targetProjectId = projectId;
    if (!targetProjectId) {
      const firstProject = await Project.findOne({
        $or: [{ owner: req.user.userId }, { team: req.user.userId }],
      });
      if (firstProject) {
        targetProjectId = firstProject._id;
      } else {
        return res.status(400).json({ message: "Project ID is required" });
      }
    }

    const project = await Project.findById(targetProjectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description || "",
      status: normalizeStatus(status),
      priority: normalizePriority(priority),
      dueDate: dueDate || "",
      estimatedHours: Number(estimatedHours) || 0,
      spentHours: Number(spentHours) || 0,
      tags: Array.isArray(tags) ? tags : [],
      subtasks: Array.isArray(subtasks) ? subtasks : [],
      projectId: targetProjectId,
      owner: req.user.userId,
      assignedTo: assignedTo || null,
    });

    try {
      await Activity.create({
        taskId: task._id,
        userId: req.user.userId,
        action: "created",
        details: `Task "${task.title}" created`,
      });
    } catch (actErr) {
      console.error("Activity error on task creation:", actErr.message);
    }

    if (assignedTo && assignedTo.toString() !== req.user.userId) {
      try {
        await Notification.create({
          userId: assignedTo,
          title: "New Task Assigned",
          message: `You were assigned task: "${task.title}" in ${project.name}`,
        });
      } catch (notifErr) {
        console.error("Notification error:", notifErr.message);
      }
    }

    const populatedTask = await Task.findById(task._id)
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. GET TASKS
const getTasks = async (req, res) => {
  try {
    const { status, priority, assignedTo, search, dueDate, overdue, projectId } = req.query;

    const query = {};

    if (projectId) {
      query.projectId = projectId;
    }

    if (status && status !== "all") {
      const normalized = normalizeStatus(status);
      query.status = { $in: [normalized, status] };
    }

    if (priority && priority !== "all") {
      query.priority = normalizePriority(priority);
    }

    if (assignedTo && assignedTo !== "all") {
      query.assignedTo = assignedTo;
    }

    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    if (dueDate) {
      query.dueDate = { $regex: dueDate, $options: "i" };
    }

    if (overdue === "true") {
      query.status = { $nin: ["completed", "done"] };
    }

    const tasks = await Task.find(query)
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color")
      .sort({ createdAt: -1 })
      .lean();

    // Populate comments count
    const tasksWithCounts = await Promise.all(
      tasks.map(async (t) => {
        const commentsCount = await Comment.countDocuments({ taskId: t._id });
        return {
          ...t,
          commentsCount: commentsCount || t.commentsCount || 0,
        };
      }),
    );

    res.status(200).json(tasksWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. GET TASK BY ID
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color")
      .lean();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Attach comments
    const comments = await Comment.find({ taskId: task._id })
      .populate("userId", "name email avatar role status")
      .sort({ createdAt: 1 })
      .lean();

    const formattedComments = comments.map((c) => ({
      id: c._id.toString(),
      user: c.userId || {
        id: "u-unknown",
        name: "Anonymous",
        avatar: "",
        email: "",
      },
      text: c.message,
      createdAt: c.createdAt,
    }));

    res.status(200).json({
      ...task,
      comments: formattedComments,
      commentsCount: formattedComments.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. UPDATE TASK
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedHours,
      spentHours,
      tags,
      subtasks,
      assignedTo,
    } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = normalizeStatus(status);
    if (priority !== undefined) task.priority = normalizePriority(priority);
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (estimatedHours !== undefined) task.estimatedHours = Number(estimatedHours);
    if (spentHours !== undefined) task.spentHours = Number(spentHours);
    if (tags !== undefined) task.tags = tags;
    if (subtasks !== undefined) task.subtasks = subtasks;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;

    await task.save();

    try {
      await Activity.create({
        taskId: task._id,
        userId: req.user.userId,
        action: "updated",
        details: `Task "${task.title}" updated`,
      });
    } catch (actErr) {
      console.error("Activity error on task update:", actErr.message);
    }

    const updatedTask = await Task.findById(task._id)
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color");

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldStatus = task.status;
    const newStatus = normalizeStatus(status);
    task.status = newStatus;

    await task.save();

    try {
      await Activity.create({
        taskId: task._id,
        userId: req.user.userId,
        action: "status_changed",
        details: `Status changed from "${oldStatus}" to "${newStatus}"`,
      });
    } catch (actErr) {
      console.error("Activity error on status update:", actErr.message);
    }

    const updatedTask = await Task.findById(task._id)
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color");

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 6. TOGGLE / UPDATE SUBTASKS
const updateSubtasks = async (req, res) => {
  try {
    const { subtaskId, completed, subtasks } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (Array.isArray(subtasks)) {
      task.subtasks = subtasks;
    } else if (subtaskId !== undefined) {
      const sub = task.subtasks.find((s) => s.id === subtaskId || s._id.toString() === subtaskId);
      if (sub) {
        sub.completed = completed !== undefined ? completed : !sub.completed;
      }
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color");

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 7. ASSIGN TASK
const assignTask = async (req, res) => {
  try {
    const { userId } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.assignedTo = userId || null;
    await task.save();

    if (userId) {
      const user = await User.findById(userId);
      try {
        await Activity.create({
          taskId: task._id,
          userId: req.user.userId,
          action: "assigned",
          details: `Task assigned to ${user ? user.name : "member"}`,
        });

        await Notification.create({
          userId: userId,
          title: "Task Assigned",
          message: `You were assigned: "${task.title}"`,
        });
      } catch (e) {
        console.error("Notification/Activity error:", e.message);
      }
    }

    const updatedTask = await Task.findById(task._id)
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color");

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 8. DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await Comment.deleteMany({ taskId: task._id });
    await Activity.deleteMany({ taskId: task._id });
    await task.deleteOne();

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 9. GET TASKS BY PROJECT
const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color");

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 10. GET KANBAN TASKS
const getKanbanTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId })
      .populate("owner", "name email avatar")
      .populate("assignedTo", "name email avatar role status")
      .populate("projectId", "name color");

    const kanban = {
      todo: tasks.filter((t) => t.status === "todo" || t.status === "pending"),
      inProgress: tasks.filter((t) => t.status === "in_progress" || t.status === "in-progress"),
      review: tasks.filter((t) => t.status === "review"),
      done: tasks.filter((t) => t.status === "done" || t.status === "completed"),
    };

    res.status(200).json(kanban);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  updateSubtasks,
  assignTask,
  deleteTask,
  getTasksByProject,
  getKanbanTasks,
};
