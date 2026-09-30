import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoaderProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({
  label = 'Loading...',
  size = 'md',
  fullScreen = false,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-2.5 p-6">
      <Loader2 className={`${sizeMap[size]} animate-spin text-indigo-600`} />
      {label && <p className="text-xs font-semibold text-slate-500">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-xs flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};
