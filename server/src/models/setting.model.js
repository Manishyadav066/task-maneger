const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    profile: {
      name: {
        type: String,
        default: "Manish Kumar",
        trim: true,
      },

      email: {
        type: String,
        default: "manish@taskflow.ai",
        trim: true,
        lowercase: true,
      },

      role: {
        type: String,
        default: "Product Manager",
        trim: true,
      },
    },

    notifications: {
      emailAlerts: {
        type: Boolean,
        default: true,
      },

      taskUpdates: {
        type: Boolean,
        default: true,
      },

      weeklySummary: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  },
);

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
