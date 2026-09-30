import React from 'react';
import { NotificationItem as NotificationType } from '../../../types';
import { Bell, CheckCircle2, Sparkles, MessageSquare, Clock } from 'lucide-react';

interface NotificationItemProps {
  notification: NotificationType;
  onMarkRead: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkRead,
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'ai':
        return <Sparkles className="w-4 h-4 text-violet-600" />;
      case 'mention':
        return <MessageSquare className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getBg = () => {
    switch (notification.type) {
      case 'ai':
        return 'bg-violet-50 border-violet-100';
      case 'mention':
        return 'bg-blue-50 border-blue-100';
      default:
        return 'bg-indigo-50 border-indigo-100';
    }
  };

  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
        notification.read
          ? 'bg-white border-slate-200/70 hover:border-slate-300'
          : 'bg-indigo-50/30 border-indigo-200/80 hover:bg-indigo-50/50 shadow-xs'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${getBg()}`}>
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4
            className={`text-xs font-bold truncate ${
              notification.read ? 'text-slate-700' : 'text-slate-900'
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {notification.timestamp}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{notification.message}</p>
      </div>

      {!notification.read && (
        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-2" />
      )}
    </div>
  );
};
