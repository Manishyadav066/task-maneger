import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed Data
const users = [
  {
    id: 'usr-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@taskflow.ai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'owner',
    online: true,
    department: 'Product & Design',
  },
  {
    id: 'usr-2',
    name: 'Alex Rivera',
    email: 'alex.r@taskflow.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    online: true,
    department: 'Engineering',
  },
  {
    id: 'usr-3',
    name: 'David Chen',
    email: 'david.c@taskflow.ai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    online: false,
    department: 'Frontend Lead',
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.r@taskflow.ai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    online: true,
    department: 'Backend & DevOps',
  },
  {
    id: 'usr-5',
    name: 'Marcus Vance',
    email: 'marcus.v@taskflow.ai',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    role: 'member',
    online: false,
    department: 'QA & Mobile',
  },
];

let workspaces = [
  {
    id: 'ws-1',
    name: 'Acme Corp SaaS',
    slug: 'acme-corp',
    icon: '⚡',
    membersCount: 8,
    role: 'owner',
  },
  {
    id: 'ws-2',
    name: 'Nova Studio Digital',
    slug: 'nova-studio',
    icon: '🎨',
    membersCount: 5,
    role: 'admin',
  },
  {
    id: 'ws-3',
    name: 'TaskFlow Core Enterprise',
    slug: 'taskflow-core',
    icon: '🚀',
    membersCount: 14,
    role: 'member',
  },
];

let projects = [
  {
    id: 'proj-1',
    workspaceId: 'ws-1',
    name: 'Frontend Web App',
    description: 'Modern Next.js 15 client dashboard with real-time analytics and dynamic theme system.',
    category: 'Web Platform',
    status: 'active',
    color: '#6366f1', // Indigo
    dueDate: '2026-10-15',
    members: [users[0], users[1], users[2]],
    createdAt: '2026-08-01',
  },
  {
    id: 'proj-2',
    workspaceId: 'ws-1',
    name: 'Backend Microservices',
    description: 'Scalable Go microservices architecture, GraphQL federation and distributed caching.',
    category: 'API & Infra',
    status: 'active',
    color: '#0ea5e9', // Sky
    dueDate: '2026-10-30',
    members: [users[1], users[3]],
    createdAt: '2026-08-10',
  },
  {
    id: 'proj-3',
    workspaceId: 'ws-1',
    name: 'Mobile App iOS & Android',
    description: 'Cross-platform mobile companion app built with React Native and offline sync.',
    category: 'Mobile',
    status: 'active',
    color: '#8b5cf6', // Violet
    dueDate: '2026-11-20',
    members: [users[0], users[4]],
    createdAt: '2026-08-20',
  },
  {
    id: 'proj-4',
    workspaceId: 'ws-1',
    name: 'Landing Page Redesign',
    description: 'High-converting SaaS promotional site with 3D product interactions and dynamic pricing calculator.',
    category: 'Growth & Marketing',
    status: 'active',
    color: '#10b981', // Emerald
    dueDate: '2026-09-28',
    members: [users[0], users[2]],
    createdAt: '2026-09-01',
  },
];

let tasks = [
  {
    id: 'task-1',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    title: 'Design UI Component Tokens & Atomic System',
    description: 'Build design tokens in Figma and export matching Tailwind theme variables for dark/light mode.',
    status: 'in_progress',
    priority: 'high',
    assigneeId: 'usr-1',
    assignee: users[0],
    dueDate: '2026-09-24',
    tags: ['Design', 'Tailwind', 'UI/UX'],
    estimatedHours: 12,
    subtasks: [
      { id: 'sub-1', title: 'Define color ramp and neutral palette', completed: true },
      { id: 'sub-2', title: 'Component variants for buttons, inputs, badges', completed: true },
      { id: 'sub-3', title: 'Export JSON tokens to frontend package', completed: false },
    ],
    commentsCount: 3,
    attachmentsCount: 2,
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-18T14:30:00Z',
  },
  {
    id: 'task-2',
    workspaceId: 'ws-1',
    projectId: 'proj-2',
    title: 'Setup Stripe Billing Webhooks & Metering',
    description: 'Implement idempotent webhook listener for subscription lifecycle events and seat billing.',
    status: 'todo',
    priority: 'urgent',
    assigneeId: 'usr-4',
    assignee: users[3],
    dueDate: '2026-09-22',
    tags: ['Billing', 'API', 'Security'],
    estimatedHours: 16,
    subtasks: [
      { id: 'sub-4', title: 'Verify Stripe signature middleware', completed: false },
      { id: 'sub-5', title: 'Handle invoice.payment_succeeded and failed', completed: false },
      { id: 'sub-6', title: 'Create unit tests with simulated event fixtures', completed: false },
    ],
    commentsCount: 1,
    attachmentsCount: 0,
    createdAt: '2026-09-16T11:00:00Z',
    updatedAt: '2026-09-16T11:00:00Z',
  },
  {
    id: 'task-3',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    title: 'Kanban Board Drag & Drop Reordering',
    description: 'Support fluid drag operations with optimistic UI updates and server synchronization.',
    status: 'in_progress',
    priority: 'medium',
    assigneeId: 'usr-3',
    assignee: users[2],
    dueDate: '2026-09-26',
    tags: ['Frontend', 'Kanban', 'UX'],
    estimatedHours: 14,
    subtasks: [
      { id: 'sub-7', title: 'Pointer event listeners and drag ghost item', completed: true },
      { id: 'sub-8', title: 'State reconciliation between columns', completed: false },
    ],
    commentsCount: 4,
    attachmentsCount: 1,
    createdAt: '2026-09-14T09:00:00Z',
    updatedAt: '2026-09-18T17:00:00Z',
  },
  {
    id: 'task-4',
    workspaceId: 'ws-1',
    projectId: 'proj-4',
    title: 'Landing Page Hero Section & Dynamic CTAs',
    description: 'Implement interactive product screenshot showcase with floating metric annotations.',
    status: 'review',
    priority: 'medium',
    assigneeId: 'usr-1',
    assignee: users[0],
    dueDate: '2026-09-21',
    tags: ['Marketing', 'Conversion', 'Animation'],
    estimatedHours: 10,
    subtasks: [
      { id: 'sub-9', title: 'Responsive hero typography and mesh background', completed: true },
      { id: 'sub-10', title: 'CTA conversion event tracking', completed: true },
      { id: 'sub-11', title: 'Lighthouse 95+ performance check', completed: false },
    ],
    commentsCount: 2,
    attachmentsCount: 3,
    createdAt: '2026-09-10T08:00:00Z',
    updatedAt: '2026-09-19T06:00:00Z',
  },
  {
    id: 'task-5',
    workspaceId: 'ws-1',
    projectId: 'proj-2',
    title: 'Provision Distributed Redis Cache Cluster',
    description: 'Setup AWS ElastiCache / Redis replica cluster with automated failover and TLS.',
    status: 'done',
    priority: 'high',
    assigneeId: 'usr-2',
    assignee: users[1],
    dueDate: '2026-09-18',
    tags: ['DevOps', 'Redis', 'Cloud'],
    estimatedHours: 8,
    subtasks: [
      { id: 'sub-12', title: 'Terraform script for VPC peering', completed: true },
      { id: 'sub-13', title: 'Benchmark latency under 5ms', completed: true },
    ],
    commentsCount: 0,
    attachmentsCount: 1,
    createdAt: '2026-09-12T14:00:00Z',
    updatedAt: '2026-09-18T18:00:00Z',
  },
  {
    id: 'task-6',
    workspaceId: 'ws-1',
    projectId: 'proj-3',
    title: 'Mobile Push Notifications Architecture',
    description: 'Configure APNs and FCM integration for instant task mentions and status updates.',
    status: 'todo',
    priority: 'low',
    assigneeId: 'usr-5',
    assignee: users[4],
    dueDate: '2026-10-05',
    tags: ['Mobile', 'Notifications'],
    estimatedHours: 18,
    subtasks: [
      { id: 'sub-14', title: 'Apple Developer push certificate setup', completed: false },
      { id: 'sub-15', title: 'Firebase Cloud Messaging client credentials', completed: false },
    ],
    commentsCount: 1,
    attachmentsCount: 0,
    createdAt: '2026-09-17T12:00:00Z',
    updatedAt: '2026-09-17T12:00:00Z',
  },
  {
    id: 'task-7',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    title: 'AI Task Auto-Suggester Integration',
    description: 'Connect Gemini backend endpoint to parse natural language project inputs into broken-down subtasks.',
    status: 'done',
    priority: 'urgent',
    assigneeId: 'usr-2',
    assignee: users[1],
    dueDate: '2026-09-17',
    tags: ['AI', 'Gemini', 'Backend'],
    estimatedHours: 8,
    subtasks: [
      { id: 'sub-16', title: 'API prompt engineering with structured JSON schema', completed: true },
      { id: 'sub-17', title: 'Client modal with one-click task importer', completed: true },
    ],
    commentsCount: 5,
    attachmentsCount: 2,
    createdAt: '2026-09-15T09:00:00Z',
    updatedAt: '2026-09-18T11:00:00Z',
  },
  {
    id: 'task-8',
    workspaceId: 'ws-1',
    projectId: 'proj-4',
    title: 'SEO Metadata & OpenGraph Social Cards',
    description: 'Set dynamic social preview cards and rich JSON-LD snippets for high search ranking.',
    status: 'done',
    priority: 'medium',
    assigneeId: 'usr-3',
    assignee: users[2],
    dueDate: '2026-09-19',
    tags: ['SEO', 'Marketing'],
    estimatedHours: 6,
    subtasks: [
      { id: 'sub-18', title: 'Dynamic og:image generation endpoint', completed: true },
      { id: 'sub-19', title: 'Sitemap.xml and robots.txt configuration', completed: true },
    ],
    commentsCount: 1,
    attachmentsCount: 1,
    createdAt: '2026-09-16T15:00:00Z',
    updatedAt: '2026-09-19T05:00:00Z',
  },
];

let activities = [
  {
    id: 'act-1',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    taskId: 'task-7',
    userId: 'usr-2',
    userName: 'Alex Rivera',
    userAvatar: users[1].avatar,
    action: 'completed_task',
    targetTitle: 'AI Task Auto-Suggester Integration',
    detail: 'completed all 2 subtasks and moved to Done',
    timestamp: '15 mins ago',
  },
  {
    id: 'act-2',
    workspaceId: 'ws-1',
    projectId: 'proj-1',
    taskId: 'task-1',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    userAvatar: users[0].avatar,
    action: 'updated_status',
    targetTitle: 'Design UI Component Tokens',
    detail: 'changed status to In Progress',
    timestamp: '42 mins ago',
  },
  {
    id: 'act-3',
    workspaceId: 'ws-1',
    projectId: 'proj-4',
    taskId: 'task-4',
    userId: 'usr-3',
    userName: 'David Chen',
    userAvatar: users[2].avatar,
    action: 'added_comment',
    targetTitle: 'Landing Page Hero Section',
    detail: 'Left feedback on button micro-animations',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-4',
    workspaceId: 'ws-1',
    projectId: 'proj-4',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    userAvatar: users[0].avatar,
    action: 'created_project',
    targetTitle: 'Landing Page Redesign',
    detail: 'assigned 2 members and set deadline Sept 28',
    timestamp: '1 day ago',
  },
  {
    id: 'act-5',
    workspaceId: 'ws-1',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    userAvatar: users[0].avatar,
    action: 'added_member',
    targetTitle: 'Marcus Vance',
    detail: 'added to Acme Corp SaaS workspace with Member role',
    timestamp: '2 days ago',
  },
];

let notifications = [
  {
    id: 'notif-1',
    userId: 'usr-1',
    title: 'Task Assigned to You',
    message: 'Alex Rivera assigned you to "Design UI Component Tokens & Atomic System"',
    type: 'task',
    read: false,
    timestamp: '15 mins ago',
    link: '#task-1',
  },
  {
    id: 'notif-2',
    userId: 'usr-1',
    title: 'AI Standup Ready',
    message: 'Your automated Daily Standup digest is generated with 3 tasks completed.',
    type: 'ai',
    read: false,
    timestamp: '1 hour ago',
  },
  {
    id: 'notif-3',
    userId: 'usr-1',
    title: 'Upcoming Due Date',
    message: 'Landing Page Hero Section is due in 2 days.',
    type: 'task',
    read: false,
    timestamp: '3 hours ago',
  },
  {
    id: 'notif-4',
    userId: 'usr-1',
    title: 'Mention in Project Chat',
    message: 'David Chen mentioned you in #Frontend Web App: "Tokens look crisp!"',
    type: 'mention',
    read: true,
    timestamp: '1 day ago',
  },
];

let comments: any[] = [
  {
    id: 'comm-1',
    taskId: 'task-1',
    userId: 'usr-1',
    userName: 'Sarah Jenkins',
    userAvatar: users[0].avatar,
    content: 'Uploaded the primary and secondary color ramp definitions. Check Figma file page 2.',
    createdAt: '2026-09-17T14:30:00Z',
  },
  {
    id: 'comm-2',
    taskId: 'task-1',
    userId: 'usr-2',
    userName: 'Alex Rivera',
    userAvatar: users[1].avatar,
    content: 'Looks great Sarah! Will pull the tokens into the Tailwind config.',
    createdAt: '2026-09-18T09:15:00Z',
  },
];

let files: any[] = [
  {
    id: 'file-1',
    taskId: 'task-1',
    projectId: 'proj-1',
    name: 'Design-System-Tokens-v2.json',
    size: '142 KB',
    uploadedBy: 'Sarah Jenkins',
    createdAt: '2026-09-17',
    type: 'json',
  },
  {
    id: 'file-2',
    taskId: 'task-4',
    projectId: 'proj-4',
    name: 'Hero-Interactive-Wireframe.fig',
    size: '4.8 MB',
    uploadedBy: 'Sarah Jenkins',
    createdAt: '2026-09-18',
    type: 'figma',
  },
  {
    id: 'file-3',
    taskId: 'task-7',
    projectId: 'proj-1',
    name: 'AI-Task-Schema-Spec.pdf',
    size: '850 KB',
    uploadedBy: 'Alex Rivera',
    createdAt: '2026-09-16',
    type: 'pdf',
  },
];

// Helper to compute project stats
function enrichProjects(workspaceId?: string) {
  const filteredProjects = workspaceId
    ? projects.filter((p) => p.workspaceId === workspaceId)
    : projects;

  return filteredProjects.map((p) => {
    const projTasks = tasks.filter((t) => t.projectId === p.id);
    const total = projTasks.length;
    const completed = projTasks.filter((t) => t.status === 'done').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      ...p,
      totalTasks: total,
      completedTasks: completed,
      progress,
    };
  });
}

// ----------------------------------------------------
// 1. AUTHENTICATION ROUTES
// ----------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, department } = req.body;
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'New User',
    email: email || `user-${Date.now()}@taskflow.ai`,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'member' as const,
    online: true,
    department: department || 'Engineering',
  };
  users.push(newUser);
  res.json({ token: `jwt-${newUser.id}-${Date.now()}`, user: newUser });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = users.find((u) => u.email === email) || users[0];
  res.json({ token: `jwt-${user.id}-${Date.now()}`, user });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  // Current active user
  res.json({ user: users[0] });
});

// ----------------------------------------------------
// 2. WORKSPACES ROUTES
// ----------------------------------------------------
app.get('/api/workspaces', (req: Request, res: Response) => {
  res.json(workspaces);
});

app.post('/api/workspaces', (req: Request, res: Response) => {
  const { name, icon } = req.body;
  const newWorkspace = {
    id: `ws-${Date.now()}`,
    name: name || 'New Workspace',
    slug: (name || 'new-workspace').toLowerCase().replace(/\s+/g, '-'),
    icon: icon || '💼',
    membersCount: 1,
    role: 'owner' as const,
  };
  workspaces.push(newWorkspace);
  res.status(201).json(newWorkspace);
});

app.get('/api/workspaces/:workspaceId', (req: Request, res: Response) => {
  const ws = workspaces.find((w) => w.id === req.params.workspaceId);
  if (!ws) return res.status(404).json({ error: 'Workspace not found' });
  res.json(ws);
});

app.put('/api/workspaces/:workspaceId', (req: Request, res: Response) => {
  const index = workspaces.findIndex((w) => w.id === req.params.workspaceId);
  if (index === -1) return res.status(404).json({ error: 'Workspace not found' });
  workspaces[index] = { ...workspaces[index], ...req.body };
  res.json(workspaces[index]);
});

app.delete('/api/workspaces/:workspaceId', (req: Request, res: Response) => {
  workspaces = workspaces.filter((w) => w.id !== req.params.workspaceId);
  res.json({ success: true });
});

app.get('/api/workspaces/:workspaceId/members', (req: Request, res: Response) => {
  res.json(users);
});

app.post('/api/workspaces/:workspaceId/members', (req: Request, res: Response) => {
  const { name, email, role, department } = req.body;
  const member = {
    id: `usr-${Date.now()}`,
    name: name || 'Team Member',
    email: email || 'member@taskflow.ai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: role || 'member',
    online: true,
    department: department || 'Engineering',
  };
  users.push(member);

  activities.unshift({
    id: `act-${Date.now()}`,
    workspaceId: req.params.workspaceId,
    userId: users[0].id,
    userName: users[0].name,
    userAvatar: users[0].avatar,
    action: 'added_member',
    targetTitle: member.name,
    detail: `added to workspace with ${member.role} role`,
    timestamp: 'Just now',
  });

  res.status(201).json(member);
});

// ----------------------------------------------------
// 3. PROJECTS ROUTES
// ----------------------------------------------------
app.get('/api/projects', (req: Request, res: Response) => {
  const wsId = req.query.workspaceId as string;
  res.json(enrichProjects(wsId));
});

app.get('/api/projects/workspace/:workspaceId', (req: Request, res: Response) => {
  res.json(enrichProjects(req.params.workspaceId));
});

app.get('/api/projects/:id', (req: Request, res: Response) => {
  const project = enrichProjects().find((p) => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

app.post('/api/projects', (req: Request, res: Response) => {
  const { name, description, category, color, dueDate, workspaceId } = req.body;
  const newProject = {
    id: `proj-${Date.now()}`,
    workspaceId: workspaceId || 'ws-1',
    name: name || 'New Project',
    description: description || '',
    category: category || 'Web Platform',
    status: 'active' as const,
    color: color || '#6366f1',
    dueDate: dueDate || '2026-11-30',
    members: [users[0], users[1]],
    createdAt: new Date().toISOString().split('T')[0],
  };
  projects.push(newProject);

  activities.unshift({
    id: `act-${Date.now()}`,
    workspaceId: newProject.workspaceId,
    projectId: newProject.id,
    userId: users[0].id,
    userName: users[0].name,
    userAvatar: users[0].avatar,
    action: 'created_project',
    targetTitle: newProject.name,
    detail: `created in category ${newProject.category}`,
    timestamp: 'Just now',
  });

  res.status(201).json(enrichProjects().find((p) => p.id === newProject.id));
});

app.put('/api/projects/:id', (req: Request, res: Response) => {
  const index = projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });
  projects[index] = { ...projects[index], ...req.body };
  res.json(enrichProjects().find((p) => p.id === req.params.id));
});

app.delete('/api/projects/:id', (req: Request, res: Response) => {
  projects = projects.filter((p) => p.id !== req.params.id);
  tasks = tasks.filter((t) => t.projectId !== req.params.id);
  res.json({ success: true });
});

// ----------------------------------------------------
// 4. TASKS ROUTES
// ----------------------------------------------------
app.get('/api/tasks', (req: Request, res: Response) => {
  const { workspaceId, projectId, status } = req.query;
  let result = tasks;
  if (workspaceId) result = result.filter((t) => t.workspaceId === workspaceId);
  if (projectId) result = result.filter((t) => t.projectId === projectId);
  if (status) result = result.filter((t) => t.status === status);
  res.json(result);
});

app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, description, projectId, workspaceId, priority, status, assigneeId, dueDate, tags, subtasks, estimatedHours } = req.body;
  const assignee = users.find((u) => u.id === assigneeId) || users[0];

  const newTask = {
    id: `task-${Date.now()}`,
    workspaceId: workspaceId || 'ws-1',
    projectId: projectId || projects[0]?.id || 'proj-1',
    title: title || 'Untitled Task',
    description: description || '',
    status: status || 'todo',
    priority: priority || 'medium',
    assigneeId: assignee.id,
    assignee,
    dueDate: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    tags: Array.isArray(tags) ? tags : ['General'],
    subtasks: Array.isArray(subtasks)
      ? subtasks.map((s: any, idx: number) => ({
          id: `sub-${Date.now()}-${idx}`,
          title: typeof s === 'string' ? s : s.title,
          completed: typeof s === 'object' ? !!s.completed : false,
        }))
      : [],
    estimatedHours: estimatedHours || 8,
    commentsCount: 0,
    attachmentsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.unshift(newTask);

  activities.unshift({
    id: `act-${Date.now()}`,
    workspaceId: newTask.workspaceId,
    projectId: newTask.projectId,
    taskId: newTask.id,
    userId: users[0].id,
    userName: users[0].name,
    userAvatar: users[0].avatar,
    action: 'created_task',
    targetTitle: newTask.title,
    detail: `priority set to ${newTask.priority}`,
    timestamp: 'Just now',
  });

  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const index = tasks.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });

  tasks[index] = {
    ...tasks[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  res.json(tasks[index]);
});

app.put('/api/tasks/:id/status', (req: Request, res: Response) => {
  const { status } = req.body;
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const oldStatus = task.status;
  task.status = status;
  task.updatedAt = new Date().toISOString();

  activities.unshift({
    id: `act-${Date.now()}`,
    workspaceId: task.workspaceId,
    projectId: task.projectId,
    taskId: task.id,
    userId: users[0].id,
    userName: users[0].name,
    userAvatar: users[0].avatar,
    action: status === 'done' ? 'completed_task' : 'updated_status',
    targetTitle: task.title,
    detail: `moved from ${oldStatus} to ${status}`,
    timestamp: 'Just now',
  });

  res.json(task);
});

app.put('/api/tasks/:id/assign', (req: Request, res: Response) => {
  const { userId } = req.body;
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const user = users.find((u) => u.id === userId);
  if (user) {
    task.assigneeId = user.id;
    task.assignee = user;
  }
  task.updatedAt = new Date().toISOString();
  res.json(task);
});

app.put('/api/tasks/:id/subtasks', (req: Request, res: Response) => {
  const { subtaskId, completed, newSubtaskTitle } = req.body;
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  if (newSubtaskTitle) {
    task.subtasks.push({
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle,
      completed: false,
    });
  } else if (subtaskId !== undefined) {
    const sub = task.subtasks.find((s) => s.id === subtaskId);
    if (sub) {
      sub.completed = completed !== undefined ? completed : !sub.completed;
    }
  }

  task.updatedAt = new Date().toISOString();
  res.json(task);
});

app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  tasks = tasks.filter((t) => t.id !== req.params.id);
  res.json({ success: true });
});

// ----------------------------------------------------
// 5. COMMENTS ROUTES
// ----------------------------------------------------
app.get('/api/comments', (req: Request, res: Response) => {
  const { taskId } = req.query;
  if (taskId) {
    return res.json(comments.filter((c) => c.taskId === taskId));
  }
  res.json(comments);
});

app.post('/api/comments', (req: Request, res: Response) => {
  const { taskId, content } = req.body;
  const newComment = {
    id: `comm-${Date.now()}`,
    taskId,
    userId: users[0].id,
    userName: users[0].name,
    userAvatar: users[0].avatar,
    content,
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);

  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.commentsCount = (task.commentsCount || 0) + 1;
    activities.unshift({
      id: `act-${Date.now()}`,
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      taskId: task.id,
      userId: users[0].id,
      userName: users[0].name,
      userAvatar: users[0].avatar,
      action: 'added_comment',
      targetTitle: task.title,
      detail: `added a comment: "${content.substring(0, 40)}..."`,
      timestamp: 'Just now',
    });
  }

  res.status(201).json(newComment);
});

// ----------------------------------------------------
// 6. FILES ROUTES
// ----------------------------------------------------
app.get('/api/files', (req: Request, res: Response) => {
  const { taskId, projectId } = req.query;
  let result = files;
  if (taskId) result = result.filter((f) => f.taskId === taskId);
  if (projectId) result = result.filter((f) => f.projectId === projectId);
  res.json(result);
});

app.post('/api/files', (req: Request, res: Response) => {
  const { name, size, type, taskId, projectId } = req.body;
  const newFile = {
    id: `file-${Date.now()}`,
    name: name || 'Document.pdf',
    size: size || '1.2 MB',
    type: type || 'pdf',
    uploadedBy: users[0].name,
    createdAt: new Date().toISOString().split('T')[0],
    taskId,
    projectId,
  };
  files.push(newFile);

  if (taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (task) task.attachmentsCount = (task.attachmentsCount || 0) + 1;
  }

  res.status(201).json(newFile);
});

app.delete('/api/files/:id', (req: Request, res: Response) => {
  files = files.filter((f) => f.id !== req.params.id);
  res.json({ success: true });
});

// ----------------------------------------------------
// 7. ACTIVITY SYSTEM ROUTES
// ----------------------------------------------------
app.get('/api/activities', (req: Request, res: Response) => {
  const { workspaceId, projectId, limit } = req.query;
  let result = activities;
  if (workspaceId) result = result.filter((a) => a.workspaceId === workspaceId);
  if (projectId) result = result.filter((a) => a.projectId === projectId);
  if (limit) result = result.slice(0, Number(limit));
  res.json(result);
});

// ----------------------------------------------------
// 8. NOTIFICATIONS ROUTES
// ----------------------------------------------------
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json(notifications);
});

app.put('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = notifications.find((n) => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true, notification: notif });
});

app.put('/api/notifications/mark-all-read', (req: Request, res: Response) => {
  notifications.forEach((n) => (n.read = true));
  res.json({ success: true });
});

app.delete('/api/notifications/:id', (req: Request, res: Response) => {
  notifications = notifications.filter((n) => n.id !== req.params.id);
  res.json({ success: true });
});

// ----------------------------------------------------
// 9. DASHBOARD APIs
// ----------------------------------------------------
app.get('/api/dashboard', (req: Request, res: Response) => {
  const workspaceId = (req.query.workspaceId as string) || 'ws-1';
  const wsTasks = tasks.filter((t) => t.workspaceId === workspaceId);
  const wsProjects = enrichProjects(workspaceId);

  const totalTasks = wsTasks.length;
  const completedTasks = wsTasks.filter((t) => t.status === 'done').length;
  const pendingTasks = wsTasks.filter((t) => t.status !== 'done').length;
  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = wsTasks.filter((t) => t.status !== 'done' && t.dueDate < today).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  res.json({
    overview: {
      totalProjects: wsProjects.length,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      completionRate,
      activeMembersCount: users.filter((u) => u.online).length,
    },
    projects: wsProjects,
    recentTasks: wsTasks.slice(0, 5),
    recentActivities: activities.filter((a) => a.workspaceId === workspaceId).slice(0, 6),
    members: users,
  });
});

app.get('/api/dashboard/analytics', (req: Request, res: Response) => {
  const workspaceId = (req.query.workspaceId as string) || 'ws-1';
  const wsTasks = tasks.filter((t) => t.workspaceId === workspaceId);

  const statusCount = {
    todo: wsTasks.filter((t) => t.status === 'todo').length,
    in_progress: wsTasks.filter((t) => t.status === 'in_progress').length,
    review: wsTasks.filter((t) => t.status === 'review').length,
    done: wsTasks.filter((t) => t.status === 'done').length,
  };

  res.json({
    statusBreakdown: [
      { status: 'todo', name: 'To Do', count: statusCount.todo, color: '#94a3b8' },
      { status: 'in_progress', name: 'In Progress', count: statusCount.in_progress, color: '#f59e0b' },
      { status: 'review', name: 'Review', count: statusCount.review, color: '#8b5cf6' },
      { status: 'done', name: 'Done', count: statusCount.done, color: '#10b981' },
    ],
    weeklyVelocity: [
      { day: 'Mon', created: 3, completed: 2 },
      { day: 'Tue', created: 5, completed: 4 },
      { day: 'Wed', created: 2, completed: 6 },
      { day: 'Thu', created: 7, completed: 5 },
      { day: 'Fri', created: 4, completed: 8 },
      { day: 'Sat', created: 1, completed: 2 },
      { day: 'Sun', created: 0, completed: 1 },
    ],
  });
});

// ----------------------------------------------------
// 10. ANALYTICS ROUTES
// ----------------------------------------------------
app.get('/api/analytics/tasks', (req: Request, res: Response) => {
  const wsTasks = tasks;
  const statusBreakdown = [
    { status: 'todo', name: 'To Do', count: wsTasks.filter((t) => t.status === 'todo').length, color: '#94a3b8' },
    { status: 'in_progress', name: 'In Progress', count: wsTasks.filter((t) => t.status === 'in_progress').length, color: '#f59e0b' },
    { status: 'review', name: 'Review', count: wsTasks.filter((t) => t.status === 'review').length, color: '#8b5cf6' },
    { status: 'done', name: 'Done', count: wsTasks.filter((t) => t.status === 'done').length, color: '#10b981' },
  ];

  const priorityBreakdown = [
    { priority: 'urgent', count: wsTasks.filter((t) => t.priority === 'urgent').length, color: '#ef4444' },
    { priority: 'high', count: wsTasks.filter((t) => t.priority === 'high').length, color: '#f97316' },
    { priority: 'medium', count: wsTasks.filter((t) => t.priority === 'medium').length, color: '#eab308' },
    { priority: 'low', count: wsTasks.filter((t) => t.priority === 'low').length, color: '#3b82f6' },
  ];

  res.json({
    statusBreakdown,
    priorityBreakdown,
    totalCount: wsTasks.length,
    velocityChart: [
      { week: 'W1', planned: 12, completed: 10 },
      { week: 'W2', planned: 18, completed: 15 },
      { week: 'W3', planned: 14, completed: 16 },
      { week: 'W4', planned: 20, completed: 19 },
    ],
  });
});

app.get('/api/analytics/workspace/:workspaceId', (req: Request, res: Response) => {
  const wsTasks = tasks.filter((t) => t.workspaceId === req.params.workspaceId);
  const memberProductivity = users.map((u) => {
    const assigned = wsTasks.filter((t) => t.assigneeId === u.id);
    const completed = assigned.filter((t) => t.status === 'done').length;
    return {
      userId: u.id,
      name: u.name,
      avatar: u.avatar,
      assignedCount: assigned.length,
      completedCount: completed,
      productivityScore: assigned.length > 0 ? Math.round((completed / assigned.length) * 100) : 100,
    };
  });

  res.json({
    workspaceId: req.params.workspaceId,
    memberProductivity,
  });
});

// ----------------------------------------------------
// 11. AI FEATURES (Task Generator, Summary, Daily Report)
// ----------------------------------------------------
app.post('/api/ai/generate-tasks', async (req: Request, res: Response) => {
  const { prompt, projectId } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Fallback template builder if Gemini API key isn't provided or request fails
  const fallbackTasks = [
    {
      title: `Research & Architecture Plan for ${prompt}`,
      description: `Establish technical specifications, UX wireframes, and data contracts for ${prompt}.`,
      priority: 'high',
      estimatedHours: 8,
      tags: ['Architecture', 'Planning'],
      subtasks: ['Review technical constraints', 'Create system flow diagram', 'Define API interface definitions'],
    },
    {
      title: `Design UI/UX Mockups & Component Specs`,
      description: `Create high-fidelity responsive screens and interaction states for ${prompt}.`,
      priority: 'medium',
      estimatedHours: 12,
      tags: ['Design', 'Figma', 'UI'],
      subtasks: ['Draft wireframes in Figma', 'Review tokens with design system', 'Finalize mobile & desktop responsive states'],
    },
    {
      title: `Core Backend API & Database Implementation`,
      description: `Develop relational schemas, business logic controllers, and automated validation rules.`,
      priority: 'urgent',
      estimatedHours: 16,
      tags: ['Backend', 'Database', 'API'],
      subtasks: ['Migrate database schema tables', 'Write secure CRUD controllers', 'Setup unit and integration tests'],
    },
    {
      title: `Frontend State Management & Integration`,
      description: `Connect client views to backend endpoints with optimistic mutations and error boundaries.`,
      priority: 'high',
      estimatedHours: 14,
      tags: ['Frontend', 'React', 'Integration'],
      subtasks: ['Build reusable UI components', 'Integrate server queries and cache', 'Add loading skeletons and toast feedback'],
    },
    {
      title: `QA Testing, Performance & Production Deployment`,
      description: `Execute comprehensive smoke tests, verify security headers, and release to staging.`,
      priority: 'medium',
      estimatedHours: 6,
      tags: ['DevOps', 'QA', 'Release'],
      subtasks: ['Cross-browser & mobile testing', 'Lighthouse 95+ performance optimization', 'Deploy to Cloud Run production environment'],
    },
  ];

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      tasks: fallbackTasks,
      source: 'fallback',
      message: 'Generated using TaskFlow AI heuristic engine (Gemini API key not configured).',
    });
  }

  try {
    const aiPrompt = `You are TaskFlow AI, an elite SaaS Project Management assistant.
Break down the following project or feature goal into 4 to 6 actionable, structured engineering & product tasks:
Goal: "${prompt}"

Return ONLY a valid JSON array matching this exact format:
[
  {
    "title": "Task title (concise, action-oriented)",
    "description": "Detailed description of the deliverable",
    "priority": "low" | "medium" | "high" | "urgent",
    "estimatedHours": 8,
    "tags": ["Tag1", "Tag2"],
    "subtasks": ["Subtask 1", "Subtask 2", "Subtask 3"]
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: aiPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({
      tasks: Array.isArray(parsed) && parsed.length > 0 ? parsed : fallbackTasks,
      source: 'gemini',
    });
  } catch (err: any) {
    console.error('Gemini API Error in /api/ai/generate-tasks:', err);
    res.json({
      tasks: fallbackTasks,
      source: 'fallback',
      error: err.message,
    });
  }
});

app.post('/api/ai/project-summary', async (req: Request, res: Response) => {
  const { projectId } = req.body;
  const project = enrichProjects().find((p) => p.id === projectId) || projects[0];
  const projTasks = tasks.filter((t) => t.projectId === project.id);

  const total = projTasks.length;
  const completed = projTasks.filter((t) => t.status === 'done').length;
  const inProgress = projTasks.filter((t) => t.status === 'in_progress').length;
  const todo = projTasks.filter((t) => t.status === 'todo').length;

  const fallbackSummary = {
    projectName: project.name,
    progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    executiveSummary: `${project.name} is currently tracking at ${total > 0 ? Math.round((completed / total) * 100) : 0}% completion with ${completed} of ${total} tasks finalized. Velocity is consistent, though attention is needed on pending items before the upcoming deadline (${project.dueDate}).`,
    completedHighlights: projTasks
      .filter((t) => t.status === 'done')
      .slice(0, 3)
      .map((t) => t.title),
    pendingBottlenecks: projTasks
      .filter((t) => t.status === 'in_progress' || t.priority === 'urgent')
      .slice(0, 3)
      .map((t) => `${t.title} (${t.priority} priority)`),
    riskAnalysis: [
      {
        level: inProgress > 2 ? 'Medium' : 'Low',
        description: `${inProgress} critical tasks are concurrently in development, which may cause merge conflicts or review lag.`,
        actionItem: 'Prioritize PR reviews and schedule mid-sprint sync.',
      },
    ],
    recommendedActions: [
      'Unblock critical path items in Review before starting new Todo tasks.',
      'Reassign overdue subtasks to distribute workload evenly.',
      'Verify automated CI/CD pipeline builds ahead of staging deployment.',
    ],
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallbackSummary);
  }

  try {
    const prompt = `You are TaskFlow AI, an executive agile project manager.
Analyze this project and generate a structured JSON summary:
Project: ${project.name} (${project.description})
Progress: ${completed}/${total} tasks completed
Tasks: ${JSON.stringify(projTasks.map((t) => ({ title: t.title, status: t.status, priority: t.priority })))}

Return ONLY valid JSON matching this schema:
{
  "projectName": "${project.name}",
  "progressPercent": number,
  "executiveSummary": "2-3 sentences overview",
  "completedHighlights": ["item1", "item2"],
  "pendingBottlenecks": ["item1", "item2"],
  "riskAnalysis": [
    { "level": "Low" | "Medium" | "High", "description": "...", "actionItem": "..." }
  ],
  "recommendedActions": ["action 1", "action 2", "action 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json(parsed.executiveSummary ? parsed : fallbackSummary);
  } catch (err: any) {
    console.error('Gemini error in /api/ai/project-summary:', err);
    res.json(fallbackSummary);
  }
});

app.post('/api/ai/daily-report', async (req: Request, res: Response) => {
  const workspaceId = (req.body.workspaceId as string) || 'ws-1';
  const wsTasks = tasks.filter((t) => t.workspaceId === workspaceId);

  const completedToday = wsTasks.filter((t) => t.status === 'done');
  const inProgress = wsTasks.filter((t) => t.status === 'in_progress');
  const today = new Date().toISOString().split('T')[0];
  const overdue = wsTasks.filter((t) => t.status !== 'done' && t.dueDate < today);

  const fallbackReport = {
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    standupSummary: `Team completed ${completedToday.length} tasks today. There are ${inProgress.length} items currently in flight and ${overdue.length} overdue tickets requiring immediate attention. Overall sprint velocity is healthy.`,
    completedTodayCount: completedToday.length,
    inProgressCount: inProgress.length,
    overdueCount: overdue.length,
    keyHighlights: completedToday.slice(0, 4).map((t) => t.title),
    urgentActionItems: inProgress
      .concat(overdue)
      .slice(0, 3)
      .map((t) => `Unblock "${t.title}" assigned to ${t.assignee?.name || 'team'}`),
  };

  res.json(fallbackReport);
});

// ----------------------------------------------------
// VITE MIDDLEWARE / STATIC ASSETS
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TaskFlow AI Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
