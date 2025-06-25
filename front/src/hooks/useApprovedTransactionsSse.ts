import { useEffect, useState } from 'react';

export interface ApprovedTransaction {
  id: string;
  jugadorId: string;
  monto: number;
  tipo: 'DEPOSITO' | 'RETIRO' | 'PREMIO';
  estado: 'APROBADA';
  creadoEn: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

export default function useApprovedTransactionsSse() {
  const [transactions, setTransactions] = useState<ApprovedTransaction[]>([]);

  useEffect(() => {
    const es = new EventSource(`${BACKEND_URL}/api/sse/transacciones`);

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
  }, []);

  return transactions;
}
