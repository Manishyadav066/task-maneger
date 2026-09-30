const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const Workspace = require("../models/workspace.model");
const Project = require("../models/project.model");
const Task = require("../models/task.model");
const Meeting = require("../models/meeting.model");
const Notification = require("../models/notification.model");
const Activity = require("../models/activity.model");

const demoUsersData = [
  {
    name: "Manish Kumar",
    email: "manish6201456762@gmail.com",
    role: "Lead Product Architect",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    status: "online",
  },
  {
    name: "Rakibul Islam",
    email: "rakibul@trior.io",
    role: "Lead UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    status: "online",
  },
  {
    name: "Sarah Jenkins",
    email: "sarah.j@trior.io",
    role: "Senior Product Manager",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    status: "busy",
  },
  {
    name: "David Kim",
    email: "david.k@trior.io",
    role: "Lead Full-Stack Engineer",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    status: "online",
  },
];

const seedInitialData = async () => {
  try {
    const password = await bcrypt.hash("password123", 10);
    const users = [];

    // 1. Seed or Update Users
    for (const data of demoUsersData) {
      let user = await User.findOne({ email: data.email });
      if (!user) {
        user = await User.create({
          ...data,
          password,
        });
      } else {
        user.role = data.role;
        user.avatar = data.avatar;
        user.status = data.status;
        await user.save();
      }
      users.push(user);
    }

    const primaryUser = users[0];

    // 2. Ensure Workspace
    let workspace = await Workspace.findOne();
    if (!workspace) {
      workspace = await Workspace.create({
        name: "Panze Studio HQ",
        owner: primaryUser._id,
        members: users.map((u, i) => ({
          user: u._id,
          role: i === 0 ? "admin" : "member",
        })),
      });
      console.log("Seeded default workspace: Panze Studio HQ");
    }

    // 3. Ensure Projects
    let projectCount = await Project.countDocuments();
    let projects = [];

    if (projectCount === 0) {
      const initialProjectsData = [
        {
          name: "Trior SaaS Web Application",
          client: "Panze Studio",
          category: "Product Design & Dev",
          description:
            "All-in-one project management and workspace dashboard platform for growing agencies.",
          status: "in_progress",
          priority: "high",
          startDate: "12 Aug 2026",
          dueDate: "28 Sep 2026",
          budget: 48000,
          spent: 37400,
          color: "#6366F1",
          team: users.map((u) => u._id),
          workspaceId: workspace._id,
          owner: primaryUser._id,
        },
        {
          name: "Fintech Mobile Banking App",
          client: "StashFlow Inc.",
          category: "Mobile iOS/Android",
          description:
            "Next-gen crypto and multi-currency mobile wallet with biometric transactions.",
          status: "in_progress",
          priority: "urgent",
          startDate: "01 Jul 2026",
          dueDate: "22 Sep 2026",
          budget: 65000,
          spent: 59800,
          color: "#3B82F6",
          team: [users[1]._id, users[2]._id, users[3]._id],
          workspaceId: workspace._id,
          owner: primaryUser._id,
        },
        {
          name: "Panze Design System v2.4",
          client: "Internal Core",
          category: "Design System",
          description:
            "Unified multi-brand design tokens, accessible components, and Figma token variables.",
          status: "in_progress",
          priority: "medium",
          startDate: "15 Aug 2026",
          dueDate: "15 Oct 2026",
          budget: 24000,
          spent: 15300,
          color: "#10B981",
          team: [users[0]._id, users[1]._id],
          workspaceId: workspace._id,
          owner: primaryUser._id,
        },
        {
          name: "AI Meeting Note Taker",
          client: "OmniAI Labs",
          category: "AI / SaaS",
          description:
            "Intelligent real-time transcription, task item extractor, and calendar integrator.",
          status: "in_progress",
          priority: "high",
          startDate: "01 Sep 2026",
          dueDate: "10 Nov 2026",
          budget: 72000,
          spent: 32400,
          color: "#8B5CF6",
          team: [users[0]._id, users[3]._id],
          workspaceId: workspace._id,
          owner: primaryUser._id,
        },
      ];

      projects = await Project.insertMany(initialProjectsData);
      console.log(`Seeded ${projects.length} starter projects`);
    } else {
      projects = await Project.find();
    }

    // 4. Ensure Tasks
    let taskCount = await Task.countDocuments();
    if (taskCount === 0 && projects.length > 0) {
      const p1 = projects[0]._id;
      const p2 = projects[1] ? projects[1]._id : p1;
      const p3 = projects[2] ? projects[2]._id : p1;

      const initialTasksData = [
        {
          title: "Refactor Global Navigation & Breadcrumbs",
          description:
            "Implement responsive multi-level navigation tree with accessible keyboard support and instant breadcrumbs.",
          status: "in_progress",
          priority: "high",
          dueDate: "Today, 5:00 PM",
          estimatedHours: 4,
          spentHours: 2.5,
          tags: ["Frontend", "A11y", "Navigation"],
          subtasks: [
            { title: "Audit mobile hamburger breakpoints", completed: true },
            { title: "Implement ARIA live region for page changes", completed: true },
            { title: "Review with design team", completed: false },
          ],
          projectId: p1,
          owner: primaryUser._id,
          assignedTo: users[1]._id,
        },
        {
          title: "Setup Biometric Auth & FaceID Flow",
          description:
            "Integrate Native WebAuthn API for instant one-touch authentication on supported mobile and tablet devices.",
          status: "todo",
          priority: "urgent",
          dueDate: "Tomorrow, 2:00 PM",
          estimatedHours: 6,
          spentHours: 0,
          tags: ["Security", "Mobile", "Auth"],
          subtasks: [
            { title: "Prepare cryptographic nonce generator", completed: false },
            { title: "Build biometric permission prompt modal", completed: false },
          ],
          projectId: p2,
          owner: primaryUser._id,
          assignedTo: users[3]._id,
        },
        {
          title: "Design System Dark Mode Token Audit",
          description:
            "Review all neutral slate and zinc color tokens to guarantee WCAG AAA contrast ratio in dark theme mode.",
          status: "done",
          priority: "medium",
          dueDate: "Yesterday",
          estimatedHours: 3,
          spentHours: 3,
          tags: ["Design System", "Tokens", "UI"],
          subtasks: [
            { title: "Inspect border contrast ratios", completed: true },
            { title: "Export token dictionary JSON", completed: true },
          ],
          projectId: p3,
          owner: primaryUser._id,
          assignedTo: users[0]._id,
        },
        {
          title: "Deploy Production Kubernetes Cluster",
          description:
            "Set up multi-region ingress controllers, horizontal pod autoscalers, and Prometheus monitoring stack.",
          status: "review",
          priority: "high",
          dueDate: "24 Sep 2026",
          estimatedHours: 8,
          spentHours: 7,
          tags: ["DevOps", "Infrastructure"],
          subtasks: [
            { title: "Configure Helm chart values", completed: true },
            { title: "Run staging smoke tests", completed: true },
            { title: "Final security review", completed: false },
          ],
          projectId: p1,
          owner: primaryUser._id,
          assignedTo: users[3]._id,
        },
      ];

      await Task.insertMany(initialTasksData);
      console.log("Seeded starter tasks");
    }

    // 5. Ensure Meetings
    let meetingCount = await Meeting.countDocuments();
    if (meetingCount === 0) {
      await Meeting.insertMany([
        {
          title: "Sprint 14 Product Alignment & Demo",
          time: "10:00 AM - 11:00 AM",
          duration: "1h",
          platform: "Google Meet",
          link: "https://meet.google.com/xyz-taskflow",
          status: "upcoming",
          participants: users.map((u) => u._id),
          workspaceId: workspace._id,
          createdBy: primaryUser._id,
        },
        {
          title: "Design Systems & Token Sync",
          time: "02:30 PM - 03:15 PM",
          duration: "45m",
          platform: "Figma",
          link: "https://figma.com/file/xyz-design",
          status: "upcoming",
          participants: [users[0]._id, users[1]._id],
          workspaceId: workspace._id,
          createdBy: primaryUser._id,
        },
      ]);
      console.log("Seeded starter meetings");
    }

    // 6. Ensure Notifications
    let notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      await Notification.insertMany([
        {
          userId: primaryUser._id,
          title: "Sprint Milestone Reached",
          message: "Panze Design System v2.4 passed 60% completion rate.",
          isRead: false,
        },
        {
          userId: primaryUser._id,
          title: "New Team Member Joined",
          message: "David Kim accepted invitation to Panze Studio workspace.",
          isRead: false,
        },
      ]);
      console.log("Seeded starter notifications");
    }
  } catch (err) {
    console.error("Data Seeding Error:", err.message);
  }
};

module.exports = {
  seedInitialData,
};
