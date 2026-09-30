import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { Layers } from 'lucide-react';

interface LoginUIProps {
  onSubmit: (email: string) => Promise<void>;
  onSwitchToRegister: () => void;
  onForgotPassword?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const LoginUI: React.FC<LoginUIProps> = (props) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200/80 shadow-xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">TaskFlow AI</h1>
            <p className="text-xs text-slate-500">Sign in to your workspace</p>
          </div>
        </div>

        <LoginForm {...props} />
      </div>
    </div>
  );
};
