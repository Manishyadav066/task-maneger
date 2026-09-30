import { api } from '../../../services/api';
import { NotificationItem } from '../../../types';

export const notificationService = {
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    return api.getNotifications(userId);
  },

  async markAsRead(id: string): Promise<NotificationItem> {
    return api.markNotificationRead(id);
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    return api.markAllNotificationsRead();
  },
};
