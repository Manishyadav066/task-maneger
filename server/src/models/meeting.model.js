const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    time: {
      type: String,
      default: "11:00 AM - 12:00 PM",
    },

    duration: {
      type: String,
      default: "45m",
    },

    platform: {
      type: String,
      enum: ["Google Meet", "Zoom", "Figma"],
      default: "Google Meet",
    },

    link: {
      type: String,
      default: "https://meet.google.com/xyz-taskflow",
    },

    status: {
      type: String,
      enum: ["upcoming", "live", "ended"],
      default: "upcoming",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;
