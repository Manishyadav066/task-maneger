const express = require("express");

const router = express.Router();

const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,

  addMember,
  getWorkspaceMembers,
  updateMember,
  removeMember,
} = require("../controllers/workspace.controller");

const authMiddleware = require("../middleware/auth.middleware");

// =====================================================
// WORKSPACE ROUTES
// =====================================================

// Create workspace
router.post("/", authMiddleware, createWorkspace);

// Get all workspaces
router.get("/", authMiddleware, getWorkspaces);

// Get single workspace
router.get("/:id", authMiddleware, getWorkspaceById);

// Update workspace
router.put("/:id", authMiddleware, updateWorkspace);

// Delete workspace
router.delete("/:id", authMiddleware, deleteWorkspace);

// =====================================================
// WORKSPACE MEMBER ROUTES
// =====================================================

// -----------------------------------------------------
// Add / Invite Member
// POST /api/workspaces/:id/members
// -----------------------------------------------------

router.post("/:id/members", authMiddleware, addMember);

// -----------------------------------------------------
// Get Workspace Members
// GET /api/workspaces/:id/members
// -----------------------------------------------------

router.get("/:id/members", authMiddleware, getWorkspaceMembers);

// -----------------------------------------------------
// Update Workspace Member
// PUT /api/workspaces/:id/members/:userId
// -----------------------------------------------------

router.put("/:id/members/:userId", authMiddleware, updateMember);

// -----------------------------------------------------
// Remove Workspace Member
// DELETE /api/workspaces/:id/members/:userId
// -----------------------------------------------------

router.delete("/:id/members/:userId", authMiddleware, removeMember);

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;
