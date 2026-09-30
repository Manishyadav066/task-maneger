const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    client: {
      type: String,
      trim: true,
      default: "Internal Panze Project",
    },

    category: {
      type: String,
      trim: true,
      default: "Product Design & Dev",
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["in_progress", "completed", "on_hold", "planning", "in-progress", "done"],
      default: "in_progress",
    },

    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },

    startDate: {
      type: String,
      default: () => new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    },

    dueDate: {
      type: String,
      default: "",
    },

    budget: {
      type: Number,
      default: 0,
    },

    spent: {
      type: Number,
      default: 0,
    },

    color: {
      type: String,
      default: "#6366F1",
    },

    team: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
