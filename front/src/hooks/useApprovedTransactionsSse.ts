import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import useNotifications from '@/hooks/useNotifications';
import { BACKEND_URL } from '@/lib/config';

export interface ApprovedTransaction {
  id: string;
  jugadorId: string;
  monto: number;
  tipo: 'DEPOSITO' | 'RETIRO' | 'PREMIO';
  estado: 'APROBADA';
  creadoEn: string;
}

/*
export default function useApprovedTransactionsSse() {
  const [transactions, setTransactions] = useState<ApprovedTransaction[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const connect = () => {
      const url = `${BACKEND_URL}/api/transacciones/stream/${encodeURIComponent(user.id)}`;
      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      const handler = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as ApprovedTransaction;
          setTransactions(prev => [data, ...prev]);
          addNotification(
            `Tu transacción ${data.id} ha sido aprobada por ${new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(data.monto)}`,
          );
        } catch (err) {
          console.error('Error parsing SSE event', err);
        }
      };

      es.addEventListener('transaccion-aprobada', handler as EventListener);

      es.onerror = (err) => {
        console.error('SSE error:', err);
        es.close();
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]);

  return transactions;
}
*/