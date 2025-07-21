import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import useNotifications from '@/hooks/useNotifications';
import { BACKEND_URL } from '@/lib/config';


/**
 * Hook to subscribe to transaction updates via Server-Sent Events (SSE).
 * Listens for backend notifications and refreshes user data when a
 * transaction changes status (e.g., deposit approved).
 */
export default function useTransactionUpdates() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    if (!user?.id) return;

    const connect = () => {
      const url = `${BACKEND_URL}/api/transacciones/stream/${encodeURIComponent(user.id)}`;
      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      es.onopen = () => {
        connectedRef.current = true;
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
      es.addEventListener('saldo-actualizar', async () => {
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
      };
  }, [user, refreshUser, toast]);
}
