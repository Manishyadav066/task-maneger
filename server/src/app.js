const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true, // Allow all client origins in dev/preview
    credentials: true,
  }),
);

const authRoutes = require("./routes/auth.routes");
const workspaceRoutes = require("./routes/workspace.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const commentRoutes = require("./routes/comment.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const fileRoutes = require("./routes/file.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const activityRoutes = require("./routes/activity.routes");
const notificationRoutes = require("./routes/notification.routes");
const userRoutes = require("./routes/user.routes");
const settingsRoutes = require("./routes/settings.Routes");
const meetingRoutes = require("./routes/meeting.routes");

app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/meetings", meetingRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

module.exports = app;
