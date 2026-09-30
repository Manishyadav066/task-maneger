const Notification = require("../models/notification.model");

// Get All Notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark Notification As Read
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Mark All Notifications As Read
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.userId, isRead: false }, { isRead: true });

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
