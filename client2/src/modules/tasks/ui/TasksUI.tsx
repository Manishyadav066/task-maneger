import React, { useState } from 'react';
import { Task, Project, User } from '../../../types';
import { KanbanBoard } from '../../../components/tasks/KanbanBoard';
import { TaskFilters } from '../components/TaskFilters';
import { CheckSquare, Plus, Sparkles } from 'lucide-react';

interface TasksUIProps {
  tasks: Task[];
  projects: Project[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onQuickAddTask: (status: any, title: string) => void;
  onMoveTaskStatus: (taskId: string, newStatus: any) => void;
  onOpenCreateTask: () => void;
  onOpenAIGenerator?: () => void;
}

export const TasksUI: React.FC<TasksUIProps> = ({
  tasks,
  projects,
  users,
  onSelectTask,
  onQuickAddTask,
  onMoveTaskStatus,
  onOpenCreateTask,
  onOpenAIGenerator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('all');

  const filteredTasks = tasks.filter((task) => {
    if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchTag = task.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Tasks Board</h2>
          <p className="text-xs text-slate-500">
            Sprint backlog, in-progress workflows, and completed deliverables
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAIGenerator && (
            <button
              onClick={onOpenAIGenerator}
              className="px-3.5 py-2 bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Task Generator</span>
            </button>
          )}
          <button
            onClick={onOpenCreateTask}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedProjectId={selectedProjectId}
        onProjectChange={setSelectedProjectId}
        projects={projects}
      />

      {/* Kanban Board */}
      <KanbanBoard
        tasks={filteredTasks}
        projects={projects}
        users={users}
        selectedProjectId={selectedProjectId}
        onSelectTask={onSelectTask}
        onQuickAddTask={onQuickAddTask}
        onMoveTaskStatus={onMoveTaskStatus}
        onOpenCreateModal={onOpenCreateTask}
      />
    </div>
  );
};
