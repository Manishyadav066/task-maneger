const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  getMeetings,
  createMeeting,
  deleteMeeting,
} = require("../controllers/meeting.controller");

router.get("/", authMiddleware, getMeetings);
router.post("/", authMiddleware, createMeeting);
router.delete("/:id", authMiddleware, deleteMeeting);

module.exports = router;
