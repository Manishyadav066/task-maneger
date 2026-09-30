import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-white border text-xs sm:text-sm rounded-xl py-2 px-3 transition-colors placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 ${
              leftIcon ? 'pl-9' : ''
            } ${
              error ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
            } ${className}`}
            {...props}
          />
        </div>
        {error && <p className="text-[11px] text-rose-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-[11px] text-slate-400">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
