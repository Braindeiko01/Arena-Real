import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import useNotifications from '@/hooks/useNotifications';
import { BACKEND_URL } from '@/lib/config';
import { auth } from '@/lib/firebase';


/**
 * Hook to subscribe to transaction updates via Server-Sent Events (SSE).
 * Listens for backend notifications and refreshes user data when a
 * transaction changes status (e.g., deposit approved).
 */
export default function useTransactionUpdates() {
  const { user, refreshUser, updateUser } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectedRef = useRef(false);
  const disconnectedRef = useRef(false);
  const lastBalanceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && disconnectedRef.current) {
        refreshUser();
        disconnectedRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const connect = async () => {
      let token: string | null = null;
      if (typeof window !== 'undefined') {
        try {
          token = await auth.currentUser?.getIdToken() || null;
        } catch {
          token = null;
        }
      }
      const url = `${BACKEND_URL}/api/transacciones/stream/${encodeURIComponent(user.id)}${token ? `?token=${token}` : ''}`;
      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.onopen = () => {
        connectedRef.current = true;
        if (disconnectedRef.current) {
          refreshUser();
          disconnectedRef.current = false;
        }
      };

      const handler = async (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const msg = `Tu transacción ${data.id} ha sido aprobada.`;
          toast({ title: 'Actualización de Transacción', description: msg });
          addNotification(msg);
          await refreshUser();
        } catch (err) {
          console.error('Error procesando evento SSE', err);
        }
      };

      es.addEventListener('transaccion-aprobada', handler as unknown as EventListener);
      es.addEventListener('saldo-actualizar', async (e: MessageEvent) => {
        if (e.data) {
          try {
            const saldo = JSON.parse(e.data);
            if (saldo !== lastBalanceRef.current) {
              lastBalanceRef.current = saldo;
              await updateUser({ balance: saldo });
            }
            return;
          } catch (err) {
            console.error('Error actualizando saldo desde SSE', err);
          }
        }
        await refreshUser();
      });

      es.onerror = err => {
        console.error('SSE error:', err);
        if (connectedRef.current) {
          toast({
            title: 'Error de Transacciones',
            description: 'Conexión interrumpida. Reintentando...',
          });
        }
        disconnectedRef.current = true;
        es.close();
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
        if (eventSourceRef.current) {
          eventSourceRef.current.close();
        }
        connectedRef.current = false;
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        document.removeEventListener('visibilitychange', onVisibility);
      };
  }, [user, refreshUser, updateUser, toast]);
}
