export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export type DashboardKPIs = DashboardOverview;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  online?: boolean;
  department?: string;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface TaskFile {
  id: string;
  taskId?: string;
  projectId?: string;
  name: string;
  size: string;
  uploadedBy: string;
  createdAt: string;
  type: string;
}

export type FileItem = TaskFile;

export interface Task {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  assignee?: User;
  dueDate: string;
  tags: string[];
  subtasks: Subtask[];
  estimatedHours?: number;
  commentsCount?: number;
  attachmentsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'completed' | 'on_hold';
  color: string;
  totalTasks: number;
  tasksCount?: number;
  completedTasks: number;
  completedTasksCount?: number;
  progress: number; // completedTasks / totalTasks * 100
  dueDate: string;
  members: User[];
  createdAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  icon: string;
  membersCount: number;
  role: 'owner' | 'admin' | 'member';
  plan?: 'free' | 'pro' | 'enterprise';
}

export interface Activity {
  id: string;
  workspaceId: string;
  projectId?: string;
  taskId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: 'created_task' | 'updated_status' | 'completed_task' | 'created_project' | 'added_member' | 'added_comment';
  targetTitle: string;
  detail?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'project' | 'mention' | 'ai' | 'system';
  read: boolean;
  timestamp: string;
  link?: string;
}

export type NotificationItem = Notification;

export interface DashboardOverview {
  totalProjects: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  activeMembersCount: number;
}

export interface TaskAnalytics {
  statusBreakdown: {
    status: TaskStatus;
    name: string;
    count: number;
    color: string;
  }[];
  priorityBreakdown: {
    priority: TaskPriority;
    count: number;
  }[];
  weeklyVelocity: {
    day: string;
    created: number;
    completed: number;
  }[];
}

export interface AISummaryResult {
  projectName: string;
  progressPercent: number;
  executiveSummary: string;
  completedHighlights: string[];
  pendingBottlenecks: string[];
  riskAnalysis: {
    level: 'Low' | 'Medium' | 'High';
    description: string;
    actionItem: string;
  }[];
  recommendedActions: string[];
}

export interface AIGeneratedTaskItem {
  title: string;
  description: string;
  priority: TaskPriority;
  estimatedHours: number;
  tags: string[];
  subtasks: string[];
}

export interface AIDailyReportResult {
  generatedAt: string;
  standupSummary: string;
  completedTodayCount: number;
  inProgressCount: number;
  overdueCount: number;
  keyHighlights: string[];
  urgentActionItems: string[];
}
