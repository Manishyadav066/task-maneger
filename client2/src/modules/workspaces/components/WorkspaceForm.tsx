import React, { useState } from 'react';
import { WorkspaceFormInput } from '../types/workspace.types';
import { Building2, X } from 'lucide-react';

interface WorkspaceFormProps {
  onSubmit: (input: WorkspaceFormInput) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const WorkspaceForm: React.FC<WorkspaceFormProps> = ({
  onSubmit,
  onClose,
  loading = false,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [plan, setPlan] = useState<'free' | 'pro' | 'enterprise'>('pro');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      slug: (slug || name).toLowerCase().replace(/\s+/g, '-'),
      plan,
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-900">Create New Workspace</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                }
              }}
              placeholder="e.g. Acme Studio"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Workspace URL Slug
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 text-xs bg-slate-100 text-slate-500 border border-r-0 border-slate-200 rounded-l-xl">
                taskflow.ai/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="acme-studio"
                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-r-xl focus:outline-hidden focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Plan</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as any)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-indigo-500"
            >
              <option value="free">Free (Up to 5 members)</option>
              <option value="pro">Pro (Unlimited projects & AI features)</option>
              <option value="enterprise">Enterprise (SLA & Dedicated VPC)</option>
            </select>
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
              {loading ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
