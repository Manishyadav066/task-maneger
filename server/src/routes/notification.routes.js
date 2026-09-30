const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

router.get("/", authMiddleware, getNotifications);
router.patch("/read-all", authMiddleware, markAllAsRead);
router.patch("/:id/read", authMiddleware, markAsRead);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;
