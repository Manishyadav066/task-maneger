const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "created",
        "updated",
        "assigned",
        "status_changed",
        "comment_added",
        "file_uploaded",
      ],
      required: true,
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
