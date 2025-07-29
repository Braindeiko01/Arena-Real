"use client";

import { useEffect } from 'react';
import { messaging, auth } from '@/lib/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { BACKEND_URL } from '@/lib/config';
import { useAuth } from '@/hooks/useAuth';

export default function usePushNotifications() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    if (!messaging) return;
    if (!('Notification' in window)) return;
    let authUnsub: (() => void) | undefined;
    let onMessageUnsub: (() => void) | undefined;

    const register = () => {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js', { scope: '/' })
        .then(async reg => {
          const perm = await Notification.requestPermission();
          if (perm !== 'granted') return;
          try {
            const token = await getToken(messaging!, {
              serviceWorkerRegistration: reg
            });
            let authToken: string | null = null;
            try {
              authToken = (await auth.currentUser?.getIdToken(true)) || null;
            } catch {
              authToken = null;
            }
            if (!authToken) {
              console.warn('Push registration skipped: no auth token');
              return;
            }
            await fetch(`${BACKEND_URL}/api/push/register`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
              },
              body: JSON.stringify({ jugadorId: user.id, token })
            });
          } catch (err) {
            console.error('FCM registration failed', err);
          }
        })
        .catch(err => console.error('SW registration failed', err));

      onMessageUnsub = onMessage(messaging!, payload => {
        const { title, body } = payload.notification || {};
        if (title) new Notification(title, { body });
      });
    };

    if (!auth.currentUser) {
      console.info('Push registration skipped: no Firebase user. Waiting for login...');
      authUnsub = auth.onAuthStateChanged(u => {
        if (u) {
          console.info('Firebase user logged in, registering push notifications');
          register();
          authUnsub && authUnsub();
          authUnsub = undefined;
        }
      });
    } else {
      register();
    }

    return () => {
      onMessageUnsub && onMessageUnsub();
      authUnsub && authUnsub();
    };
  }, [user]);
}
