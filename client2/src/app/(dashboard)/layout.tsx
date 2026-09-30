import React from 'react';
import { Sidebar, NavigationTab } from '../../components/layout/Sidebar';
import { Header } from '../../components/layout/Header';
import { Project, User, Workspace } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject: (projectId: string) => void;
  currentUser?: User;
  onOpenAuth?: () => void;
  onOpenCreateTask?: () => void;
  onOpenAIAssistant?: () => void;
  unreadCount?: number;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  activeTab,
  onTabChange,
  projects,
  selectedProjectId,
  onSelectProject,
  currentUser,
  onOpenAuth,
  onOpenCreateTask,
  onOpenAIAssistant,
  unreadCount = 3,
}) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={onSelectProject}
        currentUser={currentUser}
        onOpenAuth={onOpenAuth}
        unreadCount={unreadCount}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onOpenCreateTask={onOpenCreateTask}
          onOpenAIAssistant={onOpenAIAssistant}
          onOpenNotifications={() => onTabChange('notifications')}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
