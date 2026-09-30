import React from 'react';
import { Sparkles } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div
      id="app-loading-screen"
      className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-900 p-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200 animate-pulse mb-4 text-white">
        <Sparkles className="w-6 h-6 text-amber-200" />
      </div>
      <h2 className="text-lg font-bold text-slate-900 tracking-tight">TaskFlow AI</h2>
      <p className="text-xs text-slate-500 mt-1">Booting workspace and AI telemetry...</p>
    </div>
  );
};
