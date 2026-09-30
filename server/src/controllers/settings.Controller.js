const Settings = require("../models/setting.model");

// GET SETTINGS
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne({
      user: req.user.userId,
    });

    if (!settings) {
      return res.status(200).json(null);
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE / CREATE SETTINGS
exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { profile, notifications } = req.body;

    let settings = await Settings.findOne({
      user: userId,
    });

    // If settings don't exist, create new document
    if (!settings) {
      settings = new Settings({
        user: userId,
        profile: profile || {},
        notifications: notifications || {},
      });

      await settings.save();

      return res.status(201).json(settings);
    }

    // Update profile
    if (profile) {
      settings.profile = {
        ...(settings.profile && settings.profile.toObject
          ? settings.profile.toObject()
          : settings.profile || {}),
        ...profile,
      };
    }

    // Update notifications
    if (notifications) {
      settings.notifications = {
        ...(settings.notifications && settings.notifications.toObject
          ? settings.notifications.toObject()
          : settings.notifications || {}),
        ...notifications,
      };
    }

    await settings.save();

    res.status(200).json(settings);
  } catch (error) {
    console.error("UPDATE SETTINGS ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Required fields check
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "All password fields are required",
      });
    }

    // New password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New passwords do not match",
      });
    }

    // Find user
    const User = require("../models/user.model");

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // bcrypt
    const bcrypt = require("bcryptjs");

    // Check current password
    const isPasswordCorrect = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("CHANGE PASSWORD ERROR:", error);

    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};
