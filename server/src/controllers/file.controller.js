
const fs = require("fs");
const path = require("path");

const File = require("../models/file.model");
const Task = require("../models/task.model");
const Activity = require("../models/activity.model");

// ======================================================
// 1. UPLOAD FILE
// ======================================================
const uploadFile = async (req, res) => {
  try {
    const { taskId } = req.body;

    // Check task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Only task owner can upload
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to upload file to this task",
      });
    }

    // Check file
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a file",
      });
    }

    // Create File
    const file = await File.create({
      taskId: taskId,
      uploadedBy: req.user.userId,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });

    // ==================================================
    // CREATE ACTIVITY
    // ==================================================
    try {
      const activity = await Activity.create({
        taskId: task._id,
        userId: req.user.userId,
        action: "file_uploaded",
        details: `File uploaded: "${file.originalName}"`,
      });

      console.log(
        "FILE ACTIVITY CREATED:",
        activity
      );
    } catch (actError) {
      console.error(
        "FILE ACTIVITY FAILED:",
        actError.message
      );
    }

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// 2. GET FILES BY TASK
// ======================================================
const getFilesByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Check task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    const files = await File.find({
      taskId: taskId,
    }).populate("uploadedBy", "name email");

    res.status(200).json({
      message: "Files fetched successfully",
      files,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// 3. GET / VIEW FILE
// ======================================================
const getFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find file in database
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // Find task
    const task = await Task.findById(file.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Authorization
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to access this file",
      });
    }

    // Create absolute path
    const filePath = path.resolve(file.filePath);

    // Check physical file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Physical file not found",
      });
    }

    // Send file
    res.sendFile(filePath, {
      headers: {
        "Content-Disposition":
          `inline; filename="${file.originalName}"`,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// 4. DOWNLOAD FILE
// ======================================================
const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find file
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // Find task
    const task = await Task.findById(file.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Authorization
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to download this file",
      });
    }

    // Create absolute path
    const filePath = path.resolve(file.filePath);

    // Check physical file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        message: "Physical file not found",
      });
    }

    // Download file
    res.download(
      filePath,
      file.originalName,
      (error) => {
        if (error) {
          console.error(
            "Download error:",
            error
          );

          if (!res.headersSent) {
            res.status(500).json({
              message:
                "Failed to download file",
            });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================================
// 5. DELETE FILE
// ======================================================
const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    // Find file
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // Find task
    const task = await Task.findById(file.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Authorization
    if (task.owner.toString() !== req.user.userId) {
      return res.status(403).json({
        message:
          "You are not authorized to delete this file",
      });
    }

    // Delete physical file
    const filePath = path.resolve(file.filePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete file from database
    await File.findByIdAndDelete(fileId);

    res.status(200).json({
      message: "File deleted successfully",
    });
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
  uploadFile,
  getFilesByTask,
  getFile,
  downloadFile,
  deleteFile,
};
