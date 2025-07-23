import { useEffect, useState } from 'react'
import { get, post } from '@/lib/api'
import Modal from './Modal'

interface GameResult {
  id: string
  jugadorAId?: string
  jugadorA?: string
  jugadorATag?: string
  jugadorBId?: string
  jugadorB?: string
  jugadorBTag?: string
  capturaA?: string | null
  capturaB?: string | null
  resultadoA?: string | null
  resultadoB?: string | null
  monto?: number
  winnerId?: string | null
  distributed: boolean
  revanchaCount?: number
}

export default function MatchTable() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [error, setError] = useState('');
  const [image, setImage] = useState<string | null>(null)

  const loadResults = () => {
    get<{ results?: GameResult[] }>('/api/admin/games/results')
      .then((data) => {
        console.log('📦 Respuesta de la API /games/results:', data);
        setResults(data.results ?? []);
      })
      .catch(err => {
        console.error('❌ Error en GET /games/results:', err);
        setError(err.message);
      });
  };

  useEffect(() => {
    loadResults();
  }, []);

  const distribute = async (id: string) => {
    try {
      await post(`/api/admin/games/${id}/distribute`);
      setResults(prev => prev.map(r => (r.id === id ? { ...r, distributed: true } : r)));
    } catch (err) {
      console.error('❌ Distribute failed:', err);
      setError('No se pudo distribuir el premio');
    }
  };

  const assignWinner = async (id: string, playerId: string) => {
    try {
      await post(`/api/admin/games/${id}/winner/${playerId}`);
      setResults(prev => prev.map(r => (r.id === id ? { ...r, winnerId: playerId } : r)));
    } catch (err) {
      console.error('❌ Assign winner failed:', err);
      setError('No se pudo asignar el ganador');
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <button
        className="px-2 py-1 bg-gray-700 rounded"
        onClick={loadResults}
      >
        Actualizar
      </button>
      <table className="min-w-full bg-[#1e1e1e] text-white border border-gray-700 text-sm">
        <thead>
          <tr>
            <th className="border px-2 py-1">Partida</th>
            <th className="border px-2 py-1">Jugador A</th>
            <th className="border px-2 py-1">Captura A</th>
            <th className="border px-2 py-1">Resultado A</th>
            <th className="border px-2 py-1">Jugador B</th>
            <th className="border px-2 py-1">Captura B</th>
            <th className="border px-2 py-1">Resultado B</th>
            <th className="border px-2 py-1">Revancha</th>
            <th className="border px-2 py-1">Apuesta</th>
            <th className="border px-2 py-1">Ganador</th>
            <th className="border px-2 py-1">Estado</th>
            <th className="border px-2 py-1">Acción</th>
          </tr>
        </thead>
        <tbody>
          {results.length === 0 && (
            <tr>
              <td colSpan={8} className="text-center text-gray-500 py-4">
                No hay partidas registradas.
              </td>
            </tr>
          )}
          {results.map(r => (
            <tr key={r.id} className="text-center">
              <td className="border px-2 py-1">{r.id}</td>
              <td className="border px-2 py-1">
                <div>{r.jugadorA || '-'}</div>
                {r.jugadorATag && (
                  <div className="text-xs text-gray-400">{r.jugadorATag}</div>
                )}
              </td>
              <td className="border px-2 py-1">
                {r.capturaA && (
                  <img
                    src={r.capturaA}
                    alt="captura A"
                    className="h-12 mx-auto cursor-pointer"
                    onClick={() => setImage(r.capturaA!)}
                  />
                )}
              </td>
              <td className="border px-2 py-1">{r.resultadoA || '-'}</td>
              <td className="border px-2 py-1">
                <div>{r.jugadorB || '-'}</div>
                {r.jugadorBTag && (
                  <div className="text-xs text-gray-400">{r.jugadorBTag}</div>
                )}
              </td>
              <td className="border px-2 py-1">
                {r.capturaB && (
                  <img
                    src={r.capturaB}
                    alt="captura B"
                    className="h-12 mx-auto cursor-pointer"
                    onClick={() => setImage(r.capturaB!)}
                  />
                )}
              </td>
              <td className="border px-2 py-1">{r.resultadoB || '-'}</td>
              <td className="border px-2 py-1">{r.revanchaCount ?? 0}</td>
              <td className="border px-2 py-1">
                {r.monto !== undefined ? `$${r.monto}` : '-'}
              </td>
              <td className="border px-2 py-1">{r.winnerId || '-'}</td>
              <td className="border px-2 py-1">
                {r.distributed ? (
                  <span className="px-2 py-1 rounded bg-green-600 text-white">Distribuido</span>
                ) : (
                  <span className="px-2 py-1 rounded bg-yellow-600 text-white">Pendiente</span>
                )}
              </td>
              <td className="border px-2 py-1 space-y-1">
                {!r.winnerId && (
                  <div className="flex flex-col gap-1">
                    {r.jugadorAId && (
                      <button
                        className="px-2 py-1 bg-gray-700 rounded"
                        onClick={() => assignWinner(r.id, r.jugadorAId!)}
                      >
                        Ganador A
                      </button>
                    )}
                    {r.jugadorBId && (
                      <button
                        className="px-2 py-1 bg-gray-700 rounded"
                        onClick={() => assignWinner(r.id, r.jugadorBId!)}
                      >
                        Ganador B
                      </button>
                    )}
                  </div>
                )}
                {r.winnerId && !r.distributed && (
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
      <Modal open={!!image} onClose={() => setImage(null)}>
        {image && (
          <img src={image} alt="captura" className="max-h-[80vh]" />
        )}
      </Modal>
    </div>
  );
}
