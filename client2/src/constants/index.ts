export const APP_NAME = 'TaskFlow AI';
export const APP_TAGLINE = 'AI-Powered Project Management Platform';

export const TASK_STATUSES = [
  { id: 'todo', label: 'To Do', color: 'slate' },
  { id: 'in_progress', label: 'In Progress', color: 'indigo' },
  { id: 'in_review', label: 'In Review', color: 'amber' },
  { id: 'done', label: 'Done', color: 'emerald' },
] as const;

export const TASK_PRIORITIES = [
  { id: 'low', label: 'Low', color: 'slate' },
  { id: 'medium', label: 'Medium', color: 'blue' },
  { id: 'high', label: 'High', color: 'orange' },
  { id: 'urgent', label: 'Urgent', color: 'rose' },
] as const;
