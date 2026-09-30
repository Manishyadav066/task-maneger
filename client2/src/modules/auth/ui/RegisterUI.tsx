import React from 'react';
import { RegisterForm } from '../components/RegisterForm';
import { RegisterCredentials } from '../types/auth.types';
import { Layers } from 'lucide-react';

interface RegisterUIProps {
  onSubmit: (data: RegisterCredentials) => Promise<void>;
  onSwitchToLogin: () => void;
  loading?: boolean;
  error?: string | null;
}

export const RegisterUI: React.FC<RegisterUIProps> = (props) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-xs text-slate-500">Get started with TaskFlow AI</p>
          </div>
        </div>

        <RegisterForm {...props} />
      </div>
    </div>
  );
};
