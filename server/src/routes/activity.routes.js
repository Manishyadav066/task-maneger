const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const { getTaskActivities, getRecentActivities } = require("../controllers/activity.controller");

router.get("/", authMiddleware, getRecentActivities);
router.get("/task/:taskId", authMiddleware, getTaskActivities);

module.exports = router;
