const mongoose = require("mongoose");

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        role: {
          type: String,
          enum: [
            "admin",
            "member",
            "Backend Engineer",
            "Frontend Engineer",
            "Product Designer",
            "Design System Architect",
            "QA Engineer",
            "Product Engineer",
          ],
          default: "member",
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

module.exports = Workspace;
