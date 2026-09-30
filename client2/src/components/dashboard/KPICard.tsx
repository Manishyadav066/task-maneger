import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  id?: string;
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  colorScheme: 'indigo' | 'emerald' | 'amber' | 'sky' | 'rose' | 'violet';
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  colorScheme,
  onClick,
}) => {
  const schemeClasses = {
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600',
      border: 'hover:border-indigo-200',
      badge: 'bg-indigo-50 text-indigo-700',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600',
      border: 'hover:border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600',
      border: 'hover:border-amber-200',
      badge: 'bg-amber-50 text-amber-700',
    },
    sky: {
      iconBg: 'bg-sky-50 text-sky-600',
      border: 'hover:border-sky-200',
      badge: 'bg-sky-50 text-sky-700',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600',
      border: 'hover:border-rose-200',
      badge: 'bg-rose-50 text-rose-700',
    },
    violet: {
      iconBg: 'bg-violet-50 text-violet-600',
      border: 'hover:border-violet-200',
      badge: 'bg-violet-50 text-violet-700',
    },
  }[colorScheme];

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      } ${schemeClasses.border}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${schemeClasses.iconBg} transition-transform hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="text-xs sm:text-sm font-medium text-slate-500 mt-1">{title}</div>
        {subtitle && <div className="text-[11px] text-slate-400 mt-1.5">{subtitle}</div>}
      </div>
    </div>
  );
};
