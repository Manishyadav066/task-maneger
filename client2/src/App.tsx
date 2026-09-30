import React, { useState } from "react";

import { Sidebar, NavigationTab } from "./components/layout/Sidebar";
import { Header } from "./components/layout/Header";
import { AppViewRouter } from "./components/dashboard/AppViewRouter";
import { TaskModal } from "./components/tasks/TaskModal";
import { CreateTaskModal } from "./components/tasks/CreateTaskModal";
import { AuthPage } from "./components/auth/AuthPage";
import { LandingContainer } from "./modules/landing/components/LandingContainer";
import { Toast } from "./components/ui/Toast";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { useTaskFlowState } from "./hooks/useTaskFlowState";

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("dashboard");

  const [currentView, setCurrentView] = useState<"landing" | "app" | "auth">(
    "landing",
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const [authInitialMode, setAuthInitialMode] = useState<"signin" | "register">(
    "signin",
  );

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // UI State
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | undefined
  >(undefined);

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // Core state + business logic
  const {
    loading,
    workspaces,
    setWorkspaces,
    activeWorkspace,
    setActiveWorkspace,
    projects,
    tasks,
    setTasks,
    users,
    setUsers,
    activities,
    notifications,
    kpis,
    analytics,
    currentUser,
    setCurrentUser,
    selectedTask,
    setSelectedTask,
    taskComments,
    toastMessage,
    showToast,

    refreshStats,

    handleUpdateTaskStatus,
    handleUpdateTaskPriority,
    handleAssignUser,
    handleToggleSubtask,
    handleAddSubtask,
    handleAddComment,
    handleDeleteTask,
    handleEditTask,
    handleCreateTask,
    handleCreateProject,
    handleUpdateProject,
    handleDeleteProject,
    handleInviteMember,

    handleMarkNotificationRead,
    handleMarkAllNotificationsRead,
    handleDeleteNotification,
  } = useTaskFlowState();

  /*
   * Initial loading
   */
  if (loading) {
    return <LoadingScreen />;
  }

  /*
   * Search
   */
  const displayTasks = searchQuery.trim()
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      )
    : tasks;

  /*
   * VIEW 1: LANDING PAGE
   */
  if (currentView === "landing") {
    return (
      <LandingContainer
        onStartFree={() => {
          setAuthInitialMode("register");
          setCurrentView("auth");
        }}
        onSignIn={() => {
          setAuthInitialMode("signin");
          setCurrentView("auth");
        }}
        onOpenDashboard={() => setCurrentView("app")}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  /*
   * VIEW 2: AUTHENTICATION
   */
  if (currentView === "auth") {
    return (
      <AuthPage
        initialMode={authInitialMode}
        showBackToDashboard={isAuthenticated}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthenticated(true);
          setCurrentView("app");

          setUsers((prev) =>
            prev.some((u) => u.email === user.email) ? prev : [...prev, user],
          );

          showToast(`Welcome, ${user.name}!`);
        }}
        onCancel={() => setCurrentView(isAuthenticated ? "app" : "landing")}
      />
    );
  }

  /*
   * VIEW 3: MAIN SAAS APPLICATION
   */
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 antialiased font-sans">
      <Toast message={toastMessage} />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          /*
           * AI tab intentionally removed for now.
           * Normal navigation continues to work.
           */
          if (tab === "ai") {
            return;
          }

          setActiveTab(tab);
        }}
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={(projectId) => setSelectedProjectId(projectId)}
        currentUser={currentUser}
        onOpenAuth={() => {
          setAuthInitialMode("signin");
          setCurrentView("auth");
        }}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        <Header
          currentUser={currentUser}
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={setActiveWorkspace}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onDeleteNotification={handleDeleteNotification}
          /*
           * AI callback removed.
           *
           * Existing Header component may still expect this prop.
           * We temporarily keep a no-op callback so UI does not break.
           */
          onOpenAIGenerator={() => {}}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenLanding={() => setCurrentView("landing")}
          onSignOut={() => {
            setIsAuthenticated(false);
            setAuthInitialMode("signin");
            setCurrentView("landing");
            showToast("You have signed out.");
          }}
          onOpenAuth={() => {
            setAuthInitialMode("signin");
            setCurrentView("auth");
          }}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Dynamic Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AppViewRouter
            activeTab={activeTab}
            kpis={kpis}
            projects={projects}
            tasks={tasks}
            displayTasks={displayTasks}
            users={users}
            activities={activities}
            analytics={analytics}
            currentUser={currentUser}
            selectedProjectId={selectedProjectId}
            activeWorkspace={activeWorkspace}
            onSelectProject={setSelectedProjectId}
            onSelectTask={setSelectedTask}
            onOpenTasks={(projectId) => {
              setSelectedProjectId(projectId);
              setActiveTab("tasks");
            }}
            /*
             * AI callbacks are temporarily disabled.
             * They remain as no-op callbacks only if
             * AppViewRouter currently requires these props.
             */
            onOpenAISummary={() => {}}
            onOpenAIGenerator={() => {}}
            onOpenCreateTask={() => setIsCreateTaskOpen(true)}
            onInviteMember={handleInviteMember}
            onCreateProject={handleCreateProject}
            onUpdateProject={handleUpdateProject}
            onDeleteProject={handleDeleteProject}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onQuickAddTask={(status, title) => {
              handleCreateTask({
                title,
                projectId: selectedProjectId || projects[0]?.id || "",
                status,
                priority: "medium",
                dueDate: new Date(Date.now() + 7 * 86400000)
                  .toISOString()
                  .split("T")[0],
                tags: ["Sprint"],
                subtasks: [],
              });
            }}
            onSelectWorkspace={(workspace) => {
              setActiveWorkspace(workspace);
              showToast(`Switched workspace to ${workspace.name}`);
            }}
            onUpdateWorkspace={(updated) => {
              setActiveWorkspace((prev) =>
                prev
                  ? {
                      ...prev,
                      ...updated,
                    }
                  : prev,
              );

              setWorkspaces((prev) =>
                prev.map((workspace) =>
                  workspace.id === activeWorkspace.id
                    ? {
                        ...workspace,
                        ...updated,
                      }
                    : workspace,
                ),
              );
            }}
            onShowToast={showToast}
          />
        </main>
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          project={projects.find(
            (project) => project.id === selectedTask.projectId,
          )}
          projects={projects}
          users={users}
          comments={taskComments}
          onClose={() => setSelectedTask(null)}
          onEditTask={handleEditTask}
          onUpdateStatus={handleUpdateTaskStatus}
          onUpdatePriority={handleUpdateTaskPriority}
          onAssignUser={handleAssignUser}
          onToggleSubtask={handleToggleSubtask}
          onAddSubtask={handleAddSubtask}
          onAddComment={handleAddComment}
          onDeleteTask={handleDeleteTask}
        />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        projects={projects}
        users={users}
        defaultProjectId={selectedProjectId}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
