
const Comment = require("../models/comment.model");
const Task = require("../models/task.model");
const Workspace = require("../models/workspace.model");
const Activity = require("../models/activity.model");

// ======================================================
// 1. CREATE COMMENT
// ======================================================
const createComment = async (req, res) => {
  try {
    const { taskId, message } = req.body;

    // Check task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Check message
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Comment message is required",
      });
    }

    // Create Comment
    const comment = await Comment.create({
      taskId,
      userId: req.user.userId,
      message: message.trim(),
    });

    // ==================================================
    // CREATE ACTIVITY
    // ==================================================
    try {
      const activity = await Activity.create({
        taskId: task._id,
        userId: req.user.userId,
        action: "comment_added",
        details: `Comment added: "${comment.message}"`,
      });

      console.log("COMMENT ACTIVITY CREATED:", activity);
    } catch (actError) {
      console.error(
        "COMMENT ACTIVITY FAILED:",
        actError.message
      );
    }

    res.status(201).json({
      message: "Comment created successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// 2. GET COMMENTS BY TASK
// ======================================================
const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({
      taskId: req.params.taskId,
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// 3. DELETE COMMENT
// ======================================================
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Only comment owner can delete
    if (
      comment.userId.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this comment",
      });
    }

    await Comment.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// 4. GET ALL COMMENTS
// ======================================================
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate("userId", "name email")
      .populate("taskId");

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// EXPORTS
// ======================================================
module.exports = {
  createComment,
  getCommentsByTask,
  getAllComments,
  deleteComment,
};

