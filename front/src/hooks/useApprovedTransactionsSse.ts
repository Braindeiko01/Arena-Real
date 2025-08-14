import { useEffect, useState } from 'react';
import { EventSourcePolyfill } from 'event-source-polyfill';
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

let source: EventSource | null = null;
let lastHandled = 0;

export default function useApprovedTransactionsSse() {
  const [transactions, setTransactions] = useState<ApprovedTransaction[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?.id) return;

    const connect = () => {
      if (source) return source;
      const url = `${BACKEND_URL}/api/transacciones/stream/${encodeURIComponent(user.id)}`;
      const es = new EventSourcePolyfill(url);
      source = es;

      es.addEventListener('transaccion-aprobada', (event: MessageEvent) => {
        const id = Number((event as any).lastEventId || 0);
        if (id <= lastHandled) return;
        lastHandled = id;

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
      });

      es.onerror = () => {
        /* optional: log */
      };

      return es;
    };

    const es = connect();
    return () => {
      es?.close();
      source = null;
    };
  }, [user?.id, addNotification]);

  return transactions;
}