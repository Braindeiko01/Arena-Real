import { useEffect, useState } from 'react';

export interface ApprovedTransaction {
  id: string;
  usuarioId: string;
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

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as ApprovedTransaction;
        setTransactions(prev => [data, ...prev]);
      } catch (err) {
        console.error('Error parsing SSE event', err);
      }
    };

    es.onerror = (err) => {
      console.error('SSE error:', err);
    };

    return () => {
      es.close();
    };
  }, []);

  return transactions;
}
