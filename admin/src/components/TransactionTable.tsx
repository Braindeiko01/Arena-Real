import { useEffect, useMemo, useState } from 'react';
import { get, post } from '@/lib/api';
import ReviewTransactionDialog, { ReviewTransaction } from './ReviewTransactionDialog';
import Toast from './Toast';

interface Transaction {
  id: string;
  playerId: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  receipt?: string | null;
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [reviewTx, setReviewTx] = useState<ReviewTransaction | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    get<Transaction[]>('/api/admin/transactions')
      .then(setTransactions)
      .catch(err => setError(err.message));
  }, []);

  const changeStatus = async (id: string, status: 'ENTREGADA' | 'CANCELADA') => {
    try {
      await post(`/api/admin/transactions/${id}/status`, { status });
      setTransactions(prev =>
        prev.map(t => (t.id === id ? { ...t, status } : t))
      );
      setToast('Estado actualizado');
    } catch (err) {
      console.error('status failed', err);
      setError('No se pudo actualizar la transacción');
    }
  };

  const filtered = useMemo(
    () =>
      transactions.filter(t =>
        t.playerId.toLowerCase().includes(search.toLowerCase())
      )
        .filter(t => (statusFilter ? t.status === statusFilter : true))
        .filter(t => (typeFilter ? t.type === typeFilter : true)),
    [transactions, search, statusFilter, typeFilter]
  );

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        <input
          className="px-2 py-1 rounded bg-gray-800 border border-gray-700"
          placeholder="Usuario"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="px-2 py-1 rounded bg-gray-800 border border-gray-700"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="ENTREGADA">ENTREGADA</option>
          <option value="CANCELADA">CANCELADA</option>
        </select>
        <select
          className="px-2 py-1 rounded bg-gray-800 border border-gray-700"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="DEPOSITO">DEPOSITO</option>
          <option value="RETIRO">RETIRO</option>
          <option value="APUESTA">APUESTA</option>
          <option value="PREMIO">PREMIO</option>
          <option value="REEMBOLSO">REEMBOLSO</option>
        </select>
      </div>

      <table className="min-w-full bg-[#1e1e1e] text-white border border-gray-700 text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Usuario Origen</th>
            <th className="border px-2 py-1">Usuario Destino</th>
            <th className="border px-2 py-1">Tipo</th>
            <th className="border px-2 py-1">Monto</th>
            <th className="border px-2 py-1">Fecha</th>
            <th className="border px-2 py-1">Estado</th>
            <th className="border px-2 py-1">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id} className="text-center">
              <td className="border px-2 py-1">{t.playerId}</td>
              <td className="border px-2 py-1">N/A</td>
              <td className="border px-2 py-1">{t.type}</td>
              <td className="border px-2 py-1">${'' + t.amount}</td>
              <td className="border px-2 py-1">{new Date(t.createdAt).toLocaleString()}</td>
              <td className="border px-2 py-1">
                {t.status === 'ENTREGADA' ? (
                  <span className="px-2 py-1 rounded bg-green-600 text-white">ENTREGADA</span>
                ) : t.status === 'CANCELADA' ? (
                  <span className="px-2 py-1 rounded bg-red-600 text-white">CANCELADA</span>
                ) : (
                  <span className="px-2 py-1 rounded bg-yellow-600 text-white">PENDIENTE</span>
                )}
              </td>
              <td className="border px-2 py-1">
                {t.status === 'PENDIENTE' && (
                  <button
                    className="px-2 py-1 bg-blue-600 rounded"
                    onClick={() =>
                      setReviewTx({
                        id: t.id,
                        origin: t.playerId,
                        destination: '',
                        type: t.type as any,
                        amount: t.amount,
                        date: t.createdAt,
                        proofOfPayment: t.receipt || undefined,
                      })
                    }
                  >
                    Revisar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReviewTransactionDialog
        open={!!reviewTx}
        transaction={reviewTx}
        onClose={() => setReviewTx(null)}
        onReject={id => changeStatus(id.toString(), 'CANCELADA')}
        onApprove={id => changeStatus(id.toString(), 'ENTREGADA')}
      />

      {toast && <Toast message={toast} onClose={() => setToast('')} />}
    </div>
  );
}
