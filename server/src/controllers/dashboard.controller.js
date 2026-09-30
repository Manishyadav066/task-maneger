const Task = require("../models/task.model");
const Project = require("../models/project.model");

const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.userId;

    // -----------------------------
    // STATS
    // -----------------------------

    const totalProjects = await Project.countDocuments({
      owner: userId,
    });

    const totalTasks = await Task.countDocuments({
      owner: userId,
    });

    const pendingTasks = await Task.countDocuments({
      owner: userId,
      status: "pending",
    });

    const inProgressTasks = await Task.countDocuments({
      owner: userId,
      status: "in-progress",
    });

    const completedTasks = await Task.countDocuments({
      owner: userId,
      status: "completed",
    });

    const highPriorityTasks = await Task.countDocuments({
      owner: userId,
      priority: "high",
    });

    const assignedTasks = await Task.countDocuments({
      owner: userId,
      assignedTo: { $ne: null },
    });

    const unassignedTasks = await Task.countDocuments({
      owner: userId,
      assignedTo: null,
    });

    // -----------------------------
    // ALL USER TASKS
    // -----------------------------

    const tasks = await Task.find({
      owner: userId,
    })
      .populate("projectId", "name")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // -----------------------------
    // UPCOMING TASKS
    // -----------------------------

    const upcomingTasks = await Task.find({
      owner: userId,
      status: { $ne: "completed" },
    })
      .populate("projectId", "name")
      .populate("assignedTo", "name email")
      .sort({ dueDate: 1, createdAt: -1 })
      .limit(10)
      .lean();

    // -----------------------------
    // PROJECTS
    // -----------------------------

    const projects = await Project.find({
      owner: userId,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // -----------------------------
    // PROJECT PROGRESS
    // -----------------------------

    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const projectTasks = await Task.find({
          projectId: project._id,
        })
          .select("status")
          .lean();

        const totalProjectTasks = projectTasks.length;

        const completedProjectTasks = projectTasks.filter(
          (task) => task.status === "completed",
        ).length;

        const progress =
          totalProjectTasks > 0
            ? Math.round((completedProjectTasks / totalProjectTasks) * 100)
            : 0;

        return {
          ...project,
          progress,
          totalTasks: totalProjectTasks,
          completedTasks: completedProjectTasks,
        };
      }),
    );

    // -----------------------------
    // RESPONSE
    // -----------------------------

    res.status(200).json({
      stats: {
        totalProjects,
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        highPriorityTasks,
        assignedTasks,
        unassignedTasks,
        overdueTasks: 0,
      },

      tasks,

      upcomingTasks,

      projects: projectsWithProgress,

      recentActivity: [],

      priorityData: [
        {
          name: "High",
          value: highPriorityTasks,
        },
        {
          name: "Other",
          value: totalTasks - highPriorityTasks,
        },
      ],

      statusData: [
        {
          name: "Pending",
          value: pendingTasks,
        },
        {
          name: "In Progress",
          value: inProgressTasks,
        },
        {
          name: "Completed",
          value: completedTasks,
        },
      ],
    });
  } catch (error) {
    console.error("DASHBOARD ANALYTICS ERROR =>", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardAnalytics,
};
