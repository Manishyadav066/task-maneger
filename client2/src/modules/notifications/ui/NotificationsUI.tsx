import React, { useState } from 'react';
import { NotificationItem as NotificationType } from '../../../types';
import { NotificationItem } from '../components/NotificationItem';
import { Bell, CheckCheck, Loader2, Filter } from 'lucide-react';

interface NotificationsUIProps {
  notifications: NotificationType[];
  loading: boolean;
  unreadCount: number;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export const NotificationsUI: React.FC<NotificationsUIProps> = ({
  notifications,
  loading,
  unreadCount,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'task' | 'ai'>('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'task') return n.type === 'task';
    if (filter === 'ai') return n.type === 'ai';
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white">
                {unreadCount} new
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            Task assignments, project updates, and automated AI digests
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'unread'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('task')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'task'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setFilter('ai')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            filter === 'ai'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          AI Digests
        </button>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/80">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No notifications found</h3>
          <p className="text-xs text-slate-400 mt-1">You're all caught up with your workspace</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <NotificationItem key={item.id} notification={item} onMarkRead={onMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
};
