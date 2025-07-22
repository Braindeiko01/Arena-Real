import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import useNotifications from '@/hooks/useNotifications';
import { BACKEND_WS_URL } from '@/lib/config';

export interface ApprovedTransaction {
  id: string;
  jugadorId: string;
  monto: number;
  tipo: 'DEPOSITO' | 'RETIRO' | 'PREMIO';
  estado: 'APROBADA';
  creadoEn: string;
}

export default function useApprovedTransactionsWs() {
  const [transactions, setTransactions] = useState<ApprovedTransaction[]>([]);
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'transaccion-aprobada') {
          const data = msg.data as ApprovedTransaction;
          setTransactions(prev => [data, ...prev]);
          addNotification(
            `Tu transacción ${data.id} ha sido aprobada por ${new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(data.monto)}`,
          );
        }
      } catch (err) {
        console.error('Error parsing WS event', err);
      }
    };

    const connect = () => {
      const url = `${BACKEND_WS_URL}/ws/transacciones/${encodeURIComponent(user.id)}`;
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onmessage = handleMessage;
      ws.onclose = () => {
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
      ws.onerror = (err) => {
        console.error('WS error:', err);
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]);

  return transactions;
}

