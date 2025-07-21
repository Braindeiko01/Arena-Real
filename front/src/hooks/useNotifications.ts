import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addNotification as addNotificationAction,
  markAsRead as markAsReadAction,
  markAllRead as markAllReadAction,
  clearNotifications as clearNotificationsAction,
} from '@/store/notificationsSlice';

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(state => state.notifications.list);
  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (message: string) =>
    dispatch(addNotificationAction({ message }));

  const markAsRead = (id: string) => dispatch(markAsReadAction(id));
  const markAllRead = () => dispatch(markAllReadAction());
  const clearNotifications = () => dispatch(clearNotificationsAction());

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllRead,
    clearNotifications,
  };
};

export default useNotifications;
