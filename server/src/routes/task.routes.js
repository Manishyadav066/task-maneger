const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  assignTask,
  updateTaskStatus,
  updateSubtasks,
  getTasksByProject,
  getKanbanTasks,
} = require("../controllers/task.controller");

router.post("/", authMiddleware, createTask);
router.get("/", authMiddleware, getTasks);
router.get("/:id", authMiddleware, getTaskById);
router.patch("/:id/status", authMiddleware, updateTaskStatus);
router.patch("/:id/subtasks", authMiddleware, updateSubtasks);
router.patch("/:id/assign", authMiddleware, assignTask);
router.patch("/:id", authMiddleware, updateTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.get("/project/:projectId", authMiddleware, getTasksByProject);
router.get("/kanban/:projectId", authMiddleware, getKanbanTasks);

module.exports = router;