import React, { useState } from 'react';
import { Plus, Search, Filter, Sparkles, FolderKanban, X, Calendar, CheckCircle2 } from 'lucide-react';
import { Project } from '../../types';
import { ProjectProgressCard } from '../dashboard/ProjectProgressCard';

interface ProjectsViewProps {
  projects: Project[];
  onOpenTasks: (projectId: string) => void;
  onOpenAISummary: (projectId: string) => void;
  onCreateProject: (project: Partial<Project>) => void;
  onUpdateProject?: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onOpenTasks,
  onOpenAISummary,
  onCreateProject,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // New Project Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web Platform');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [color, setColor] = useState('#6366f1');

  // Edit Project Form
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState('Web Platform');
  const [editStatus, setEditStatus] = useState<'active' | 'completed' | 'on_hold'>('active');
  const [editDueDate, setEditDueDate] = useState('2026-11-15');
  const [editColor, setEditColor] = useState('#6366f1');

  const startEditProject = (proj: Project) => {
    setEditingProject(proj);
    setEditName(proj.name);
    setEditDescription(proj.description || '');
    setEditCategory(proj.category);
    setEditStatus(proj.status);
    setEditDueDate(proj.dueDate);
    setEditColor(proj.color || '#6366f1');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) return;

    if (onUpdateProject) {
      onUpdateProject(editingProject.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        category: editCategory,
        status: editStatus,
        dueDate: editDueDate,
        color: editColor,
      });
    }
    setEditingProject(null);
  };

  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];
console.log("PROJECTS RECEIVED IN PROJECTSVIEW:", projects);
  const filtered = projects.filter((p) => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (searchFilter && !p.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject({
      name: name.trim(),
      description: description.trim(),
      category,
      dueDate,
      color,
      status: 'active',
    });

    setName('');
    setDescription('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Projects Portfolio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor deliverables, completion velocity, and sprint roadmaps.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors capitalize cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((project) => (
          <ProjectProgressCard
            key={project.id}
            project={project}
            onOpenTasks={onOpenTasks}
            onOpenAISummary={onOpenAISummary}
            onEditProject={startEditProject}
            onDeleteProject={onDeleteProject}
          />
        ))}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Project</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AI Workflow Engine"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key deliverables, timeline expectations..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Web Platform">Web Platform</option>
                    <option value="API & Infra">API & Infra</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Growth & Marketing">Growth & Marketing</option>
                    <option value="Data & AI">Data & AI</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Accent Theme Color</label>
                <div className="flex items-center gap-3">
                  {['#6366f1', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-md border border-slate-200 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Edit Project</h3>
              <button
                onClick={() => setEditingProject(null)}
                className="text-slate-400 hover:text-slate-600 text-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. AI Workflow Engine"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Key deliverables, timeline expectations..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="Web Platform">Web Platform</option>
                    <option value="API & Infra">API & Infra</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Growth & Marketing">Growth & Marketing</option>
                    <option value="Data & AI">Data & AI</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Due Date</label>
                <input
                  type="date"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Accent Theme Color</label>
                <div className="flex items-center gap-3">
                  {['#6366f1', '#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setEditColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        editColor === c ? 'scale-125 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
