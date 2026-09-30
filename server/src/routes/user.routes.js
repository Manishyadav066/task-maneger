const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const { getAllUsers } = require("../controllers/user.controller");

router.get("/", authMiddleware, getAllUsers);

module.exports = router;