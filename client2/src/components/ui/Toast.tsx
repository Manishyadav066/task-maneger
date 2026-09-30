import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      id="app-toast"
      className="fixed bottom-5 right-5 z-50 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 border border-slate-200"
    >
      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
      <span>{message}</span>
    </div>
  );
};
