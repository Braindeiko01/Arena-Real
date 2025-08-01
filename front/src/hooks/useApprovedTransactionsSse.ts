import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { BACKEND_URL } from '@/lib/config';

export interface ApprovedTransaction {
  id: string;
  jugadorId: string;
  monto: number;
  tipo: 'DEPOSITO' | 'RETIRO' | 'PREMIO';
  estado: 'APROBADA';
  creadoEn: string;
}


export default function useApprovedTransactionsSse() {
  const [transactions, setTransactions] = useState<ApprovedTransaction[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;

    const url = `${BACKEND_URL}/api/transacciones/stream/${encodeURIComponent(user.id)}`;
    const es = new EventSource(url);

    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data) as ApprovedTransaction;
        setTransactions(prev => [data, ...prev]);
      } catch (err) {
        console.error('Error parsing SSE event', err);
      }
    };

    es.addEventListener('transaccion-aprobada', handler as EventListener);

    es.onerror = (err) => {
      console.error('SSE error:', err);
    };

    return () => {
      es.removeEventListener('transaccion-aprobada', handler as EventListener);
      es.close();
    };
  }, [user]);

  return transactions;
}
