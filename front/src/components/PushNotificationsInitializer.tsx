"use client";
import usePushNotifications from '@/hooks/usePushNotifications';

export default function PushNotificationsInitializer() {
  usePushNotifications();
  return null;
}
