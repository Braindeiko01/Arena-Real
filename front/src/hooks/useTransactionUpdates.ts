import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

/**
 * Hook to subscribe to transaction updates via Server-Sent Events (SSE).
 * Listens for backend notifications and refreshes user data when a
 * transaction changes status (e.g., deposit approved).
 */
export default function useTransactionUpdates() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const url = `${BACKEND_URL}/api/transacciones/stream/${user.id}`;
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        toast({
          title: 'Actualización de Transacción',
          description: `Tu transacción ${data.id} está ahora ${data.estado}.`,
        });
        await refreshUser();
      } catch (err) {
        console.error('Error procesando evento SSE', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE error:', err);
    };

    return () => {
      es.close();
    };
  }, [user, refreshUser, toast]);
}
