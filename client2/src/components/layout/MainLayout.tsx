import React from 'react';
import { Header } from './Header';
import { Sidebar, NavigationTab } from './Sidebar';
import { Project, Workspace, User, Notification } from '../../types';

export interface MainLayoutProps {
  currentWorkspace: Workspace;
  workspaces: Workspace[];
  onSelectWorkspace: (ws: Workspace) => void;
  currentUser: User;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (id: string) => void;
  notifications: Notification[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  onDeleteNotification: (id: string) => void;
  onOpenCreateTask: () => void;
  onOpenAIGenerator: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenLanding?: () => void;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentWorkspace,
  workspaces,
  onSelectWorkspace,
  currentUser,
  activeTab,
  onTabChange,
  projects,
  selectedProjectId,
  onSelectProject,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  onDeleteNotification,
  onOpenCreateTask,
  onOpenAIGenerator,
  searchQuery,
  onSearchChange,
  onOpenLanding,
  onOpenAuth,
  onSignOut,
  isSidebarCollapsed,
  onToggleSidebar,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar with zero duplicate toggle button */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={onSelectProject}
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          isCollapsed={isSidebarCollapsed}
        />

        {/* Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Header with the ONE toggle button */}
          <Header
            activeWorkspace={currentWorkspace}
            workspaces={workspaces}
            onSelectWorkspace={onSelectWorkspace}
            currentUser={currentUser}
            notifications={notifications}
            onMarkNotificationRead={onMarkNotificationRead}
            onMarkAllNotificationsRead={onMarkAllNotificationsRead}
            onDeleteNotification={onDeleteNotification}
            onOpenCreateTask={onOpenCreateTask}
            onOpenAIGenerator={onOpenAIGenerator}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onOpenLanding={onOpenLanding}
            onOpenAuth={onOpenAuth}
            onSignOut={onSignOut}
            isSidebarCollapsed={isSidebarCollapsed}
            onToggleSidebar={onToggleSidebar}
          />

          {/* Main Page Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
