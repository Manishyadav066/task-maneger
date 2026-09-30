const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const {
  createComment,
  getCommentsByTask,
  getAllComments,
  deleteComment,
} = require("../controllers/comment.controller");

router.post("/", authMiddleware, createComment);

router.get("/task/:taskId", authMiddleware, getCommentsByTask);
router.get("/", authMiddleware, getAllComments);

router.delete("/:id", authMiddleware, deleteComment);

module.exports = router;
