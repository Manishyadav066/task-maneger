const Task = require("../models/task.model");
const Project = require("../models/project.model");
const Workspace = require("../models/workspace.model");
const Activity = require("../models/activity.model");

const getTaskAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Current user's tasks
    const tasks = await Task.find({
      owner: userId,
    });

    // Total tasks
    const totalTasks = tasks.length;

    // Status count
    const pendingTasks = tasks.filter(
      (task) => task.status === "pending",
    ).length;

    const inProgressTasks = tasks.filter(
      (task) => task.status === "in-progress",
    ).length;

    const completedTasks = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    // Priority count
    const highPriorityTasks = tasks.filter(
      (task) => task.priority === "high",
    ).length;

    const mediumPriorityTasks = tasks.filter(
      (task) => task.priority === "medium",
    ).length;

    const lowPriorityTasks = tasks.filter(
      (task) => task.priority === "low",
    ).length;

    res.status(200).json({
      message: "Task analytics fetched successfully",

      analytics: {
        totalTasks,

        status: {
          pending: pendingTasks,
          inProgress: inProgressTasks,
          completed: completedTasks,
        },

        priority: {
          high: highPriorityTasks,
          medium: mediumPriorityTasks,
          low: lowPriorityTasks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // User ke projects
    const projects = await Project.find({
      owner: userId,
    });

    // User ke tasks
    const tasks = await Task.find({
      owner: userId,
    });

    // Project count
    const totalProjects = projects.length;

    // Task count
    const totalTasks = tasks.length;

    // Status
    const pending = tasks.filter((task) => task.status === "pending").length;

    const inProgress = tasks.filter(
      (task) => task.status === "in-progress",
    ).length;

    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    // Priority
    const highPriority = tasks.filter(
      (task) => task.priority === "high",
    ).length;

    const mediumPriority = tasks.filter(
      (task) => task.priority === "medium",
    ).length;

    const lowPriority = tasks.filter((task) => task.priority === "low").length;

    res.status(200).json({
      message: "Dashboard analytics fetched successfully",

      analytics: {
        projects: totalProjects,

        tasks: totalTasks,

        status: {
          pending,
          inProgress,
          completed,
        },

        priority: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getWorkspaceAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { workspaceId } = req.params;

    // 1. Workspace find
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // 2. Check owner/member
    const isOwner = workspace.owner.toString() === userId;

    const isMember = workspace.members.some(
      (memberId) => memberId.toString() === userId,
    );

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    // 3. Workspace ke projects find karo
    const projects = await Project.find({
      workspaceId: workspaceId,
    });

    const projectIds = projects.map((project) => project._id);

    // 4. Workspace ke saare tasks find karo
    const tasks = await Task.find({
      projectId: {
        $in: projectIds,
      },
    });

    // 5. Task counts
    const totalProjects = projects.length;
    const totalTasks = tasks.length;

    const pending = tasks.filter((task) => task.status === "pending").length;

    const inProgress = tasks.filter(
      (task) => task.status === "in-progress",
    ).length;

    const completed = tasks.filter(
      (task) => task.status === "completed",
    ).length;

    // 6. Priority counts
    const highPriority = tasks.filter(
      (task) => task.priority === "high",
    ).length;

    const mediumPriority = tasks.filter(
      (task) => task.priority === "medium",
    ).length;

    const lowPriority = tasks.filter((task) => task.priority === "low").length;

    // 7. Response
    res.status(200).json({
      message: "Workspace analytics fetched successfully",

      analytics: {
        workspaceId: workspace._id,
        workspaceName: workspace.name,

        projects: totalProjects,

        tasks: totalTasks,

        status: {
          pending,
          inProgress,
          completed,
        },

        priority: {
          high: highPriority,
          medium: mediumPriority,
          low: lowPriority,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();

    const pendingTasks = await Task.countDocuments({
      status: "pending",
    });

    const inProgressTasks = await Task.countDocuments({
      status: "in-progress",
    });

    const completedTasks = await Task.countDocuments({
      status: "completed",
    });

    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: "completed" },
    });

    res.status(200).json({
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};

const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("userId", "name email")
      .populate("taskId", "title")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTaskAnalytics,
  getDashboardAnalytics,
  getWorkspaceAnalytics,
  getDashboardStats,
  getRecentActivities,
};
