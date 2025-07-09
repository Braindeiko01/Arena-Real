import { useEffect, useState } from 'react';
import { get, post } from '@/lib/api';

interface GameResult {
  id: string;
  winnerId?: string | null;
  distributed: boolean;
}

export default function MatchTable() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    get<GameResult[]>('/api/admin/games/results')
      .then(setResults)
      .catch(err => setError(err.message));
  }, []);

  const distribute = async (id: string) => {
    try {
      await post(`/api/admin/games/${id}/distribute`);
      setResults(prev => prev.map(r => (r.id === id ? { ...r, distributed: true } : r)));
    } catch (err) {
      console.error('distribute failed', err);
      setError('No se pudo distribuir el premio');
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <table className="min-w-full bg-[#1e1e1e] text-white border border-gray-700 text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Partida</th>
            <th className="border px-2 py-1">Ganador</th>
            <th className="border px-2 py-1">Estado</th>
            <th className="border px-2 py-1">Acción</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id} className="text-center">
              <td className="border px-2 py-1">{r.id}</td>
              <td className="border px-2 py-1">{r.winnerId || '-'}</td>
              <td className="border px-2 py-1">
                {r.distributed ? (
                  <span className="px-2 py-1 rounded bg-green-600 text-white">Distribuido</span>
                ) : (
                  <span className="px-2 py-1 rounded bg-yellow-600 text-white">Pendiente</span>
                )}
              </td>
              <td className="border px-2 py-1">
                {!r.distributed && (
                  <button
                    className="px-2 py-1 bg-blue-600 rounded"
                    onClick={() => distribute(r.id)}
                  >
                    Distribuir
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
