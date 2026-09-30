import React, { useState } from 'react';
import { ProjectFormData } from '../types/project.types';
import { Project } from '../../../types';
import { FolderKanban, X } from 'lucide-react';

interface ProjectFormProps {
  initialProject?: Project | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialProject,
  onSubmit,
  onClose,
  loading = false,
}) => {
  const [name, setName] = useState(initialProject?.name || '');
  const [description, setDescription] = useState(initialProject?.description || '');
  const [category, setCategory] = useState(initialProject?.category || 'Web Platform');
  const [color, setColor] = useState(initialProject?.color || '#6366f1');
  const [dueDate, setDueDate] = useState(initialProject?.dueDate || '2026-11-30');

  const colorOptions = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      color,
      dueDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg border border-slate-200 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">
              {initialProject ? 'Edit Project' : 'Create New Project'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mobile App Redesign"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope, objectives, and deliverable targets..."
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              >
                <option value="Web Platform">Web Platform</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Design System">Design System</option>
                <option value="Growth & Sales">Growth & Sales</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Brand Accent Color</label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                    color === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="pt-3 flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : initialProject ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
