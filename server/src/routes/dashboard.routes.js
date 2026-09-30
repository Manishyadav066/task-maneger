const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getDashboardAnalytics,
} = require("../controllers/dashboard.controller");

router.get("/analytics", authMiddleware, getDashboardAnalytics);

module.exports = router;
