import { useState } from 'react';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';

export type MatchStatus = 'EN CURSO' | 'POR APROBAR' | 'FINALIZADA';

interface Match {
  id: number;
  player1: string;
  player2: string;
  bet: number;
  date: string;
  status: MatchStatus;
}

const statusColors: Record<MatchStatus, string> = {
  'EN CURSO': 'bg-blue-600',
  'POR APROBAR': 'bg-yellow-600',
  'FINALIZADA': 'bg-green-600'
};

export default function MatchTable() {
  const [matches, setMatches] = useState<Match[]>([
    { id: 1, player1: 'Alice', player2: 'Bob', bet: 100, date: '2025-01-01', status: 'EN CURSO' },
    { id: 2, player1: 'Carl', player2: 'Dave', bet: 50, date: '2025-01-02', status: 'POR APROBAR' },
    { id: 3, player1: 'Eve', player2: 'Frank', bet: 20, date: '2025-01-03', status: 'FINALIZADA' }
  ]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Match | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const filtered = matches.filter(m =>
    m.player1.toLowerCase().includes(search.toLowerCase()) ||
    m.player2.toLowerCase().includes(search.toLowerCase())
  );

  const handleValidate = () => {
    if (!selected) return;
    setMatches(prev => prev.map(m => m.id === selected.id ? { ...m, status: 'FINALIZADA' } : m));
    setSelected(null);
    setToastMsg('Partida validada');
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Filtrar por nombre"
        className="px-2 py-1 rounded bg-gray-800 text-white"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="min-w-full bg-[#1e1e1e] text-white border border-gray-700 text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Partida</th>
            <th className="border px-2 py-1">Apuesta</th>
            <th className="border px-2 py-1">Fecha</th>
            <th className="border px-2 py-1">Estado</th>
            <th className="border px-2 py-1">Acción</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m.id} className="text-center">
              <td className="border px-2 py-1">{m.player1} vs {m.player2}</td>
              <td className="border px-2 py-1">${"" + m.bet}</td>
              <td className="border px-2 py-1">{m.date}</td>
              <td className="border px-2 py-1">
                <span className={`px-2 py-1 rounded text-white ${statusColors[m.status]}`}>{m.status}</span>
              </td>
              <td className="border px-2 py-1">
                {m.status === 'POR APROBAR' && (
                  <button className="px-2 py-1 bg-blue-600 rounded" onClick={() => setSelected(m)}>Validar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal open={!!selected} onClose={() => setSelected(null)}>
        {selected && (
          <div>
            <h2 className="text-lg font-bold mb-4">Validar Partida</h2>
            <p>{selected.player1} vs {selected.player2}</p>
            <button className="mt-4 px-3 py-1 bg-green-600 rounded" onClick={handleValidate}>Confirmar</button>
          </div>
        )}
      </Modal>

      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg('')} />}
    </div>
  );
}
