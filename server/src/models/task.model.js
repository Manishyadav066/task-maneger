const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: ["todo", "in_progress", "in-progress", "pending", "review", "completed", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },

    dueDate: {
      type: String,
      default: "",
    },

    estimatedHours: {
      type: Number,
      default: 0,
    },

    spentHours: {
      type: Number,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    subtasks: [
      {
        id: {
          type: String,
          default: () => `st-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        },
        title: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    attachmentsCount: {
      type: Number,
      default: 0,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
