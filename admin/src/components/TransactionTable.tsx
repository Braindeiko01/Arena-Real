import { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Coins } from 'lucide-react';
import ReviewTransactionDialog from '@/components/ReviewTransactionDialog';

export type TransactionType = 'DEPOSITO' | 'RETIRO' | 'APUESTA';
export type TransactionStatus = 'PENDIENTE' | 'ENTREGADA' | 'CANCELADA';

interface Transaction {
  id: number;
  origin: string;
  destination: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
  proofOfPayment?: string;
}

const typeIcons = {
  DEPOSITO: <ArrowDownCircle size={20} />,
  RETIRO: <ArrowUpCircle size={20} />,
  APUESTA: <Coins size={20} />
};

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      origin: 'Alice',
      destination: 'Casino',
      type: 'DEPOSITO',
      amount: 100,
      date: '2025-01-01',
      status: 'PENDIENTE',
      proofOfPayment: 'https://via.placeholder.com/300x200'
    },
    {
      id: 2,
      origin: 'Bob',
      destination: 'Casino',
      type: 'RETIRO',
      amount: 50,
      date: '2025-01-02',
      status: 'ENTREGADA'
    },
    {
      id: 3,
      origin: 'Carl',
      destination: 'Dave',
      type: 'APUESTA',
      amount: 20,
      date: '2025-01-03',
      status: 'CANCELADA'
    }
  ]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | 'ALL'>('ALL');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'ALL'>('ALL');
  const [selected, setSelected] = useState<Transaction | null>(null);

  const handleReject = (id: number) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, status: 'CANCELADA' } : t)));
    setSelected(null);
  };

  const handleApprove = (id: number) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, status: 'ENTREGADA' } : t)));
    setSelected(null);
  };

  const filtered = transactions.filter(t => {
    const matchesSearch =
      t.origin.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const statusColors: Record<TransactionStatus, string> = {
    PENDIENTE: 'bg-yellow-600',
    ENTREGADA: 'bg-green-600',
    CANCELADA: 'bg-red-600'
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Buscar"
          className="px-2 py-1 rounded bg-gray-800 text-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          aria-label="Filtrar por estado"
          className="px-2 py-1 rounded bg-gray-800 text-white"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as TransactionStatus | 'ALL')}
        >
          <option value="ALL">Todos</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="ENTREGADA">Entregada</option>
          <option value="CANCELADA">Cancelada</option>
        </select>
        <select
          aria-label="Filtrar por tipo"
          className="px-2 py-1 rounded bg-gray-800 text-white"
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as TransactionType | 'ALL')}
        >
          <option value="ALL">Todos</option>
          <option value="DEPOSITO">Depósito</option>
          <option value="RETIRO">Retiro</option>
          <option value="APUESTA">Apuesta</option>
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
              <td className="border px-2 py-1">{t.origin}</td>
              <td className="border px-2 py-1">{t.destination}</td>
              <td className="border px-2 py-1 flex items-center justify-center gap-1">
                {typeIcons[t.type]}
                {t.type}
              </td>
              <td className="border px-2 py-1">${"" + t.amount}</td>
              <td className="border px-2 py-1">{t.date}</td>
              <td className="border px-2 py-1">
                <span className={`px-2 py-1 rounded text-white ${statusColors[t.status]}`}>
                  {t.status}
                </span>
              </td>
              <td className="border px-2 py-1">
                {t.status === 'PENDIENTE' && (
                  <button
                    className="px-2 py-1 bg-blue-600 rounded"
                    onClick={() => setSelected(t)}
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
        open={!!selected}
        transaction={selected}
        onClose={() => setSelected(null)}
        onReject={handleReject}
        onApprove={handleApprove}
      />
    </div>
  );
}
