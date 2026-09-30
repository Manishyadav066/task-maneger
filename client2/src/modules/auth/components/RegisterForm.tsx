import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Building } from 'lucide-react';
import { RegisterCredentials } from '../types/auth.types';

interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => Promise<void>;
  onSwitchToLogin: () => void;
  loading?: boolean;
  error?: string | null;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  onSwitchToLogin,
  loading = false,
  error = null,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Product Design');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      department,
      password,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5">
      {error && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
        <div className="relative">
          <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-indigo-500"
            placeholder="e.g. Maya Lin"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email</label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-indigo-500"
            placeholder="name@company.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
        <div className="relative">
          <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-indigo-500"
          >
            <option value="Product Design">Product Design</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Operations">Operations</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:bg-white focus:border-indigo-500"
            placeholder="At least 8 characters"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <span>Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <div className="pt-2 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};
