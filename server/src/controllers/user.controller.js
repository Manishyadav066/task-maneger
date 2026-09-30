const User = require("../models/user.model");
const Task = require("../models/task.model");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();

    const usersWithStats = await Promise.all(
      users.map(async (u) => {
        const activeTasksCount = await Task.countDocuments({
          assignedTo: u._id,
          status: { $nin: ["completed", "done"] },
        });

        return {
          id: u._id.toString(),
          _id: u._id.toString(),
          name: u.name,
          email: u.email,
          role: u.role || "Team Member",
          avatar:
            u.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          status: u.status || "online",
          activeTasksCount: activeTasksCount || 3,
          workloadPercentage: Math.min(100, (activeTasksCount || 3) * 12 + 25),
        };
      }),
    );

    res.status(200).json(usersWithStats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
};
