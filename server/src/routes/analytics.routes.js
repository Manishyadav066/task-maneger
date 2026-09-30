const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
    getTaskAnalytics,
    getDashboardAnalytics,
    getWorkspaceAnalytics,
    getRecentActivities,

 } = require("../controllers/analytics.controller");

router.get("/tasks", authMiddleware, getTaskAnalytics);
router.get("/dashboard", authMiddleware, getDashboardAnalytics);
router.get("/workspace/:workspaceId", authMiddleware, getWorkspaceAnalytics);
router.get("/activities", authMiddleware, getRecentActivities);

module.exports = router;
