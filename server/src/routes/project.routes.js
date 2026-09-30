const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, getProjects);
router.get("/:id", authMiddleware, getProjectById);
router.put("/:id", authMiddleware, updateProject);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;