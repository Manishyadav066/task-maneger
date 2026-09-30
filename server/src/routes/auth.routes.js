const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  getDemoUsers,
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/demo-users", getDemoUsers);

router.get("/profile", authMiddleware, getProfile);
router.get("/me", authMiddleware, getProfile);

module.exports = router;
