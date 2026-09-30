import { NotificationItem } from '../../../types';

export type { NotificationItem };

export interface NotificationFilters {
  unreadOnly?: boolean;
  type?: 'task' | 'ai' | 'mention';
}
