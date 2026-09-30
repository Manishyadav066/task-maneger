const Project = require("../models/project.model");
const Workspace = require("../models/workspace.model");
const Task = require("../models/task.model");

const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      workspaceId,
      client,
      category,
      status,
      priority,
      startDate,
      dueDate,
      budget,
      spent,
      color,
      team,
    } = req.body;

    let targetWorkspaceId = workspaceId;

    if (!targetWorkspaceId) {
      let ws = await Workspace.findOne({
        $or: [{ owner: req.user.userId }, { "members.user": req.user.userId }],
      });
      if (!ws) {
        ws = await Workspace.create({
          name: `${req.user.name || "My"} Workspace`,
          owner: req.user.userId,
          members: [{ user: req.user.userId, role: "admin" }],
        });
      }
      targetWorkspaceId = ws._id;
    }

    const workspace = await Workspace.findById(targetWorkspaceId);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const project = await Project.create({
      name,
      description: description || "",
      client: client || "Internal Panze Project",
      category: category || "Product Design & Dev",
      status: status || "in_progress",
      priority: priority || "high",
      startDate: startDate || new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      dueDate: dueDate || "",
      budget: Number(budget) || 0,
      spent: Number(spent) || 0,
      color: color || "#6366F1",
      team: Array.isArray(team) && team.length > 0 ? team : [req.user.userId],
      workspaceId: targetWorkspaceId,
      owner: req.user.userId,
    });

    const populatedProject = await Project.findById(project._id).populate(
      "team",
      "name email avatar role status",
    );

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    // Find all workspaces where user is owner or member
    const userWorkspaces = await Workspace.find({
      $or: [{ owner: req.user.userId }, { "members.user": req.user.userId }],
    }).select("_id");

    const workspaceIds = userWorkspaces.map((w) => w._id);

    const query = {
      $or: [
        { owner: req.user.userId },
        { team: req.user.userId },
        { workspaceId: { $in: workspaceIds } },
      ],
    };

    if (req.query.workspaceId) {
      query.workspaceId = req.query.workspaceId;
    }

    const projects = await Project.find(query)
      .populate("team", "name email avatar role status")
      .sort({ createdAt: -1 })
      .lean();

    // Dynamically calculate task counts and progress
    const projectsWithCounts = await Promise.all(
      projects.map(async (p) => {
        const tasks = await Task.find({ projectId: p._id }).select("status").lean();
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(
          (t) => t.status === "completed" || t.status === "done",
        ).length;

        const progress =
          totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : p.progress || 0;

        return {
          ...p,
          totalTasks,
          completedTasks,
          tasksCount: totalTasks,
          completedTasksCount: completedTasks,
          progress,
        };
      }),
    );

    res.status(200).json(projectsWithCounts);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("workspaceId", "name")
      .populate("team", "name email avatar role status")
      .lean();

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const tasks = await Task.find({ projectId: project._id }).select("status").lean();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
      (t) => t.status === "completed" || t.status === "done",
    ).length;

    const progress =
      totalTasks > 0
        ? Math.round((completedTasks / totalTasks) * 100)
        : project.progress || 0;

    res.status(200).json({
      ...project,
      totalTasks,
      completedTasks,
      tasksCount: totalTasks,
      completedTasksCount: completedTasks,
      progress,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const updatableFields = [
      "name",
      "description",
      "client",
      "category",
      "status",
      "priority",
      "startDate",
      "dueDate",
      "budget",
      "spent",
      "color",
      "team",
      "progress",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    const updated = await Project.findById(project._id)
      .populate("team", "name email avatar role status")
      .lean();

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await Task.deleteMany({ projectId: project._id });
    await project.deleteOne();

    res.status(200).json({
      message: "Project and associated tasks deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
