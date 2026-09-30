// Lightweight state management for TaskFlow AI
import { User, Project, Task, Workspace, NotificationItem } from '../types';

export interface AppState {
  currentUser: User | null;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  notifications: NotificationItem[];
  selectedTaskId: string | null;
}

type Listener = () => void;

class Store {
  private state: AppState = {
    currentUser: null,
    currentWorkspace: null,
    workspaces: [],
    projects: [],
    tasks: [],
    notifications: [],
    selectedTaskId: null,
  };

  private listeners: Set<Listener> = new Set();

  getState(): AppState {
    return this.state;
  }

  setState(partial: Partial<AppState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }
}

export const store = new Store();
