const User = require("../models/user.model");
const Workspace = require("../models/workspace.model");
const mongoose = require("mongoose");

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getLoggedInUserId = (req) => {
  return req.user?.userId || req.user?.id || req.user?._id;
};

const isWorkspaceOwner = (workspace, userId) => {
  if (!workspace?.owner || !userId) {
    return false;
  }

  return workspace.owner.toString() === userId.toString();
};

const getMemberUserId = (member) => {
  if (!member) {
    return null;
  }

  if (member.user?._id) {
    return member.user._id;
  }

  return member.user || null;
};

// =====================================================
// CREATE WORKSPACE
// =====================================================

const createWorkspace = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Workspace name is required",
      });
    }

    const workspace = await Workspace.create({
      name: name.trim(),
      owner: userId,
      members: [
        {
          user: userId,
          role: "admin",
        },
      ],
    });

    return res.status(201).json(workspace);
  } catch (error) {
    console.error("CREATE WORKSPACE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET ALL WORKSPACES
// =====================================================

const getWorkspaces = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const workspaces = await Workspace.find({
      $or: [
        {
          owner: userId,
        },
        {
          "members.user": userId,
        },
      ],
    })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar role status")
      .lean();

    return res.status(200).json(workspaces);
  } catch (error) {
    console.error("GET WORKSPACES ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// GET WORKSPACE BY ID
// =====================================================

const getWorkspaceById = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);
    const workspaceId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    const workspace = await Workspace.findById(workspaceId)
      .populate("owner", "name email avatar role status")
      .populate("members.user", "name email avatar role status")
      .lean();

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isOwner =
      workspace.owner &&
      workspace.owner._id &&
      workspace.owner._id.toString() === userId.toString();

    const isMember = workspace.members?.some((member) => {
      const memberUserId = getMemberUserId(member);

      return memberUserId && memberUserId.toString() === userId.toString();
    });

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    return res.status(200).json(workspace);
  } catch (error) {
    console.error("GET WORKSPACE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE WORKSPACE
// =====================================================

const updateWorkspace = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);
    const workspaceId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (!isWorkspaceOwner(workspace, userId)) {
      return res.status(403).json({
        message: "You are not authorized to update this workspace",
      });
    }

    const { name, description, color, icon } = req.body;

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({
          message: "Workspace name cannot be empty",
        });
      }

      workspace.name = String(name).trim();
    }

    if (description !== undefined) {
      workspace.description = String(description).trim();
    }

    if (color !== undefined) {
      workspace.color = color;
    }

    if (icon !== undefined) {
      workspace.icon = icon;
    }

    await workspace.save();

    return res.status(200).json(workspace);
  } catch (error) {
    console.error("UPDATE WORKSPACE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// DELETE WORKSPACE
// =====================================================

const deleteWorkspace = async (req, res) => {
  try {
    const userId = getLoggedInUserId(req);
    const workspaceId = req.params.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    if (!isWorkspaceOwner(workspace, userId)) {
      return res.status(403).json({
        message: "You are not authorized to delete this workspace",
      });
    }

    await Workspace.findByIdAndDelete(workspaceId);

    return res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
      workspace,
    });
  } catch (error) {
    console.error("DELETE WORKSPACE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// ADD / INVITE MEMBER
// =====================================================

const addMember = async (req, res) => {
  try {
    const { userId, email, name, role } = req.body;
    const workspaceId = req.params.id;
    const loggedInUserId = getLoggedInUserId(req);

    console.log("=================================");
    console.log("ADD MEMBER CONTROLLER HIT");
    console.log("WORKSPACE ID:", workspaceId);
    console.log("BODY:", JSON.stringify(req.body, null, 2));
    console.log("=================================");

    if (!loggedInUserId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    if (!userId && !email) {
      return res.status(400).json({
        message: "User ID or email is required",
      });
    }

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Only owner can add members
    if (!isWorkspaceOwner(workspace, loggedInUserId)) {
      return res.status(403).json({
        message: "Only workspace owner can add members",
      });
    }

    let user = null;
    let isNewUser = false;

    // =================================================
    // FIND USER BY USER ID
    // =================================================

    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          message: "Invalid user ID",
        });
      }

      user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
    }

    // =================================================
    // FIND USER BY EMAIL
    // =================================================

    if (!user && email) {
      const normalizedEmail = String(email).trim().toLowerCase();

      user = await User.findOne({
        email: normalizedEmail,
      });

      // =================================================
      // CREATE NEW USER
      // =================================================

      if (!user) {
        if (!name || !String(name).trim()) {
          return res.status(400).json({
            message: "Name is required when adding a new user",
          });
        }

        user = await User.create({
          name: String(name).trim(),
          email: normalizedEmail,
          password: "Temp@123456",
          role: "member",
          avatar: "",
          status: "online",
        });

        isNewUser = true;
      }
    }

    if (!user) {
      return res.status(400).json({
        message: "Unable to find or create user",
      });
    }

    // =================================================
    // CHECK DUPLICATE MEMBER
    // =================================================

    const alreadyMember = workspace.members.some((member) => {
      const memberUserId = getMemberUserId(member);

      return memberUserId && memberUserId.toString() === user._id.toString();
    });

    if (alreadyMember) {
      return res.status(409).json({
        message: "This user is already a member of this workspace",
      });
    }

    // =================================================
    // WORKSPACE ROLE
    // =================================================

    const memberRole = role === "admin" ? "admin" : "member";

    // =================================================
    // ADD MEMBER
    // =================================================

    workspace.members.push({
      user: user._id,
      role: memberRole,
    });

    await workspace.save();

    // =================================================
    // RESPONSE
    // =================================================

    const member = {
      id: user._id,
      _id: user._id,
      name: user.name || "",
      email: user.email || "",
      role: memberRole,
      status: user.status || "online",
      avatar: user.avatar || "",
    };

    const response = {
      message: isNewUser
        ? "New user created and added to workspace"
        : "Existing user added to workspace",
      member,
      isNewUser,
    };

    if (isNewUser) {
      response.temporaryPassword = "Temp@123456";
    }

    return res.status(201).json(response);
  } catch (error) {
    console.error("ADD WORKSPACE MEMBER ERROR:", error);

    return res.status(500).json({
      message: "Failed to add workspace member",
      error: error.message,
    });
  }
};

// =====================================================
// GET WORKSPACE MEMBERS
// =====================================================

const getWorkspaceMembers = async (req, res) => {
  try {
    const workspaceId = req.params.id;
    const loggedInUserId = getLoggedInUserId(req);

    if (!loggedInUserId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    const workspace = await Workspace.findById(workspaceId)
      .populate("owner", "name email avatar role status")
      .populate("members.user", "name email avatar role status");

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // =================================================
    // CHECK ACCESS
    // =================================================

    const isOwner = isWorkspaceOwner(workspace, loggedInUserId);

    const isMember = workspace.members.some((member) => {
      const memberUserId = getMemberUserId(member);

      return (
        memberUserId && memberUserId.toString() === loggedInUserId.toString()
      );
    });

    if (!isOwner && !isMember) {
      return res.status(403).json({
        message: "You do not have access to this workspace",
      });
    }

    // =================================================
    // GET OWNER ID
    // =================================================

    const ownerId =
      workspace.owner?._id?.toString() ||
      workspace.owner?.id?.toString() ||
      workspace.owner?.toString();

    console.log("=================================");
    console.log("GET WORKSPACE MEMBERS");
    console.log("WORKSPACE ID:", workspaceId);
    console.log("OWNER ID:", ownerId);
    console.log("=================================");

    // =================================================
    // IMPORTANT:
    // OWNER KO NORMAL TEAM MEMBERS LIST SE EXCLUDE KARO
    // =================================================

    const members = workspace.members
      .filter((member) => {
        const memberUserId = getMemberUserId(member);

        if (!memberUserId) {
          return false;
        }

        return memberUserId.toString() !== ownerId;
      })
      .map((member) => {
        const user = member.user;

        const memberId = user?._id?.toString() || user?.id?.toString();

        return {
          id: memberId,
          _id: memberId,
          name: user?.name || "",
          email: user?.email || "",
          role: member.role || "member",
          status: user?.status || "online",
          avatar: user?.avatar || "",
        };
      });

    console.log("MEMBERS RESPONSE:", JSON.stringify(members, null, 2));

    return res.status(200).json(members);
  } catch (error) {
    console.error("GET WORKSPACE MEMBERS ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE MEMBER
// =====================================================

const updateMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { name, email, role } = req.body;
    const loggedInUserId = getLoggedInUserId(req);

    console.log("=================================");
    console.log("UPDATE MEMBER CONTROLLER HIT");
    console.log("WORKSPACE ID:", id);
    console.log("USER ID:", userId);
    console.log("BODY:", JSON.stringify(req.body, null, 2));
    console.log("=================================");

    // =================================================
    // AUTH
    // =================================================

    if (!loggedInUserId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // =================================================
    // VALIDATE IDS
    // =================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid member user ID",
      });
    }

    // =================================================
    // FIND WORKSPACE
    // =================================================

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // =================================================
    // ONLY OWNER CAN UPDATE
    // =================================================

    if (!isWorkspaceOwner(workspace, loggedInUserId)) {
      return res.status(403).json({
        message: "Only workspace owner can update members",
      });
    }

    // =================================================
    // FIND MEMBER
    // =================================================

    const workspaceMember = workspace.members.find((member) => {
      const memberUserId = getMemberUserId(member);

      return memberUserId && memberUserId.toString() === userId.toString();
    });

    if (!workspaceMember) {
      return res.status(404).json({
        message: "Member not found in this workspace",
      });
    }

    // =================================================
    // OWNER PROTECTION
    // =================================================

    if (workspace.owner && workspace.owner.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Workspace owner cannot be modified as a member",
      });
    }

    // =================================================
    // FIND USER
    // =================================================

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // =================================================
    // VALIDATE ROLE
    // =================================================

    if (role !== undefined && role !== "admin" && role !== "member") {
      return res.status(400).json({
        message: "Role must be admin or member",
      });
    }

    // =================================================
    // UPDATE NAME
    // =================================================

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          message: "Member name cannot be empty",
        });
      }

      user.name = cleanName;
    }

    // =================================================
    // UPDATE EMAIL
    // =================================================

    if (email !== undefined) {
      const newEmail = String(email).trim().toLowerCase();

      if (!newEmail) {
        return res.status(400).json({
          message: "Member email cannot be empty",
        });
      }

      const existingUser = await User.findOne({
        email: newEmail,
        _id: {
          $ne: userId,
        },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already used by another user",
        });
      }

      user.email = newEmail;
    }

    // =================================================
    // SAVE USER
    // =================================================

    await user.save();

    // =================================================
    // UPDATE WORKSPACE ROLE
    // =================================================

    if (role !== undefined) {
      workspaceMember.role = role;
    }

    await workspace.save();

    // =================================================
    // GET UPDATED WORKSPACE
    // =================================================

    const updatedWorkspace = await Workspace.findById(id)
      .populate("owner", "name email avatar role status")
      .populate("members.user", "name email avatar role status");

    // =================================================
    // FIND UPDATED MEMBER
    // =================================================

    const updatedMemberEntry = updatedWorkspace.members.find((member) => {
      const memberUserId = getMemberUserId(member);

      return memberUserId && memberUserId.toString() === userId.toString();
    });

    const updatedUser = updatedMemberEntry?.user || user;

    const updatedMember = {
      id: updatedUser?._id || updatedUser?.id || userId,

      _id: updatedUser?._id || updatedUser?.id || userId,

      name: updatedUser?.name || "",
      email: updatedUser?.email || "",

      role: updatedMemberEntry?.role || "member",

      status: updatedUser?.status || "online",

      avatar: updatedUser?.avatar || "",
    };

    console.log("MEMBER UPDATED SUCCESSFULLY:", updatedMember);

    return res.status(200).json({
      success: true,
      message: "Member updated successfully",
      member: updatedMember,
      workspace: updatedWorkspace,
    });
  } catch (error) {
    console.error("UPDATE MEMBER ERROR:", error);

    return res.status(500).json({
      message: "Failed to update workspace member",
      error: error.message,
    });
  }
};

// =====================================================
// REMOVE MEMBER
// =====================================================

const removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const loggedInUserId = getLoggedInUserId(req);

    console.log("=================================");
    console.log("REMOVE MEMBER CONTROLLER HIT");
    console.log("WORKSPACE ID:", id);
    console.log("USER ID:", userId);
    console.log("=================================");

    // =================================================
    // AUTH
    // =================================================

    if (!loggedInUserId) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // =================================================
    // VALIDATE IDS
    // =================================================

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid workspace ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid member user ID",
      });
    }

    // =================================================
    // FIND WORKSPACE
    // =================================================

    const workspace = await Workspace.findById(id);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // =================================================
    // ONLY OWNER CAN REMOVE
    // =================================================

    if (!isWorkspaceOwner(workspace, loggedInUserId)) {
      return res.status(403).json({
        message: "Only workspace owner can remove members",
      });
    }

    // =================================================
    // OWNER PROTECTION
    // =================================================

    if (workspace.owner && workspace.owner.toString() === userId.toString()) {
      return res.status(400).json({
        message: "Workspace owner cannot be removed",
      });
    }

    // =================================================
    // CHECK MEMBER EXISTS
    // =================================================

    const memberExists = workspace.members.some((member) => {
      const memberUserId = getMemberUserId(member);

      return memberUserId && memberUserId.toString() === userId.toString();
    });

    if (!memberExists) {
      return res.status(404).json({
        message: "Member is not part of this workspace",
      });
    }

    // =================================================
    // REMOVE MEMBER
    // =================================================

    workspace.members = workspace.members.filter((member) => {
      const memberUserId = getMemberUserId(member);

      return !(memberUserId && memberUserId.toString() === userId.toString());
    });

    await workspace.save();

    console.log("MEMBER REMOVED SUCCESSFULLY:", userId);

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("REMOVE MEMBER ERROR:", error);

    return res.status(500).json({
      message: "Failed to remove workspace member",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  addMember,
  getWorkspaceMembers,
  updateMember,
  removeMember,
};
