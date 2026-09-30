const Activity = require("../models/activity.model");
const Task = require("../models/task.model");

// Get all activities of a task
const getTaskActivities = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const activities = await Activity.find({ taskId })
      .populate("userId", "name email avatar role status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Task activities fetched successfully",
      activities,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get global recent activities for dashboard & activity feed
const getRecentActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("userId", "name email avatar role status")
      .populate({
        path: "taskId",
        select: "title projectId",
        populate: { path: "projectId", select: "name color" },
      })
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    const formatted = activities.map((act) => {
      const user = act.userId || {
        id: "u-sys",
        name: "System",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Automated",
      };

      const task = act.taskId;
      const project = task?.projectId?.name || "TaskFlow AI";

      let type = "task_status";
      let actionText = act.details || "updated task";
      if (act.action === "comment_added") type = "comment";
      if (act.action === "file_uploaded") type = "upload";
      if (act.action === "assigned") type = "assign";

      const timeAgo = () => {
        const diff = Date.now() - new Date(act.createdAt).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "Just now";
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
      };

      return {
        id: act._id.toString(),
        user: {
          id: user._id?.toString() || user.id || "u-sys",
          name: user.name || "Team Member",
          email: user.email || "",
          role: user.role || "Team Member",
          avatar:
            user.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          status: user.status || "online",
        },
        action: actionText,
        target: task?.title || "Project task",
        project: project,
        timestamp: timeAgo(),
        type,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getTaskActivities,
  getRecentActivities,
};
