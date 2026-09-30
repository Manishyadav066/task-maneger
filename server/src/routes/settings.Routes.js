const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  getSettings,
  updateSettings,
  changePassword,
} = require("../controllers/settings.Controller");

router.get("/", authMiddleware, getSettings);
router.put("/", authMiddleware, updateSettings);
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;
