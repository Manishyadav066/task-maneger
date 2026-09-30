const Workspace = require("../models/workspace.model");

const checkRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const workspaceId = req.params.workspaceId || req.body.workspaceId;

      const workspace = await Workspace.findById(workspaceId);

      if (!workspace) {
        return res.status(404).json({
          message: "Workspace not found",
        });
      }

      if (workspace.owner.toString() === req.user.userId) {
        return next();
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === req.user.userId,
      );

      if (!member) {
        return res.status(403).json({
          message: "Access denied",
        });
      }

      if (!roles.includes(member.role)) {
        return res.status(403).json({
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };
};

module.exports = checkRole;
