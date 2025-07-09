import { useEffect, useState } from 'react';
import { get, post } from '@/lib/api';

interface Transaction {
  id: string;
  playerId: string;
  amount: number;
  approved: boolean;
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    get<Transaction[]>('/api/admin/transactions')
      .then(setTransactions)
      .catch(err => setError(err.message));
  }, []);

  const approve = async (id: string) => {
    try {
      await post(`/api/admin/transactions/${id}/approve`);
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, approved: true } : t))
      );
    } catch (err) {
      console.error('approve failed', err);
      setError('No se pudo aprobar la transacción');
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-[#1e1e1e] text-white border border-gray-700 text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Jugador</th>
            <th className="border px-2 py-1">Monto</th>
            <th className="border px-2 py-1">Estado</th>
            <th className="border px-2 py-1">Acción</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t.id} className="text-center">
              <td className="border px-2 py-1">{t.playerId}</td>
              <td className="border px-2 py-1">${'' + t.amount}</td>
              <td className="border px-2 py-1">
                {t.approved ? (
                  <span className="px-2 py-1 rounded bg-green-600 text-white">Aprobada</span>
                ) : (
                  <span className="px-2 py-1 rounded bg-yellow-600 text-white">Pendiente</span>
                )}
              </td>
              <td className="border px-2 py-1">
                {!t.approved && (
                  <button
                    className="px-2 py-1 bg-blue-600 rounded"
                    onClick={() => approve(t.id)}
                  >
                    Aprobar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
