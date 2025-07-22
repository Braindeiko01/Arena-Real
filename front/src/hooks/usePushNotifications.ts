"use client";

import { useEffect } from 'react';
import { messaging } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { BACKEND_URL } from '@/lib/config';
import { useAuth } from '@/hooks/useAuth';

export default function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    if (!('Notification' in window)) return;

    navigator.serviceWorker
      .register('/firebase-messaging-sw.js')
      .catch(err => console.error('SW registration failed', err));

    Notification.requestPermission().then(async perm => {
      if (perm !== 'granted') return;
      try {
        const token = await getToken(messaging);
        await fetch(`${BACKEND_URL}/api/push/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jugadorId: user.id, token }),
        });
      } catch (err) {
        console.error('FCM registration failed', err);
      }
    });

    const unsub = onMessage(messaging, payload => {
      const { title, body } = payload.notification || {};
      if (title) new Notification(title, { body });
    });
    return () => unsub();
  }, [user]);
}
