const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Workspace = require("../models/workspace.model");

const toClientUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role || "Team Member",
  avatar:
    user.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  status: user.status || "online",
  activeTasksCount: 4,
  workloadPercentage: 70,
});

const ensureDefaultWorkspace = async (user) => {
  const workspace = await Workspace.findOne({
    $or: [{ owner: user._id }, { "members.user": user._id }],
  });
  if (!workspace) {
    await Workspace.create({
      name: `${user.name}'s Workspace`,
      owner: user._id,
      members: [{ user: user._id, role: "admin" }],
    });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role ? String(role).trim() : "Team Member",
      avatar:
        avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    });

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    await ensureDefaultWorkspace(user);

    res.status(201).json({
      message: "User Registered Successfully",
      token,
      user: toClientUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({
        field: "email",
        message: "Email not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        field: "password",
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    await ensureDefaultWorkspace(user);

    res.status(200).json({
      message: "Login Successful",
      token,
      user: toClientUser(user),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: toClientUser(user),
      jwtClaims: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getDemoUsers = async (req, res) => {
  try {
    const demoEmails = [
      "manish6201456762@gmail.com",
      "rakibul@trior.io",
      "sarah.j@trior.io",
      "david.k@trior.io",
    ];

    const users = await User.find({ email: { $in: demoEmails } }).select("-password");

    const defaultAvatars = {
      "manish6201456762@gmail.com":
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      "rakibul@trior.io":
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      "sarah.j@trior.io":
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      "david.k@trior.io":
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    };

    const userList = users.map((u) => ({
      name: u.name,
      email: u.email,
      role: u.role || "Team Member",
      avatar: u.avatar || defaultAvatars[u.email] || "",
      defaultPassword: "password123",
    }));

    res.status(200).json({
      users: userList.length > 0 ? userList : [
        {
          name: "Manish Kumar",
          email: "manish6201456762@gmail.com",
          role: "Lead Product Architect",
          avatar: defaultAvatars["manish6201456762@gmail.com"],
          defaultPassword: "password123",
        },
        {
          name: "Rakibul Islam",
          email: "rakibul@trior.io",
          role: "Lead UI/UX Designer",
          avatar: defaultAvatars["rakibul@trior.io"],
          defaultPassword: "password123",
        },
        {
          name: "Sarah Jenkins",
          email: "sarah.j@trior.io",
          role: "Senior Product Manager",
          avatar: defaultAvatars["sarah.j@trior.io"],
          defaultPassword: "password123",
        },
        {
          name: "David Kim",
          email: "david.k@trior.io",
          role: "Lead Full-Stack Engineer",
          avatar: defaultAvatars["david.k@trior.io"],
          defaultPassword: "password123",
        },
      ],
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getDemoUsers,
};
