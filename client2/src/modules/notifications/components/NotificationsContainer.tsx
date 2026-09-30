import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationsUI } from '../ui/NotificationsUI';

export const NotificationsContainer: React.FC = () => {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <NotificationsUI
      notifications={notifications}
      loading={loading}
      unreadCount={unreadCount}
      onMarkRead={markAsRead}
      onMarkAllRead={markAllAsRead}
    />
  );
};
