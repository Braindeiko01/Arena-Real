import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/lib/config';

interface MatchEventData {
  apuestaId: string;
  jugadorOponenteId: string;
  jugadorOponenteTag: string;
  chatId: string;
}

export default function useMatchmakingSse(
  playerId: string | undefined,
  onMatch: (data: MatchEventData) => void
) {
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);
  const onMatchRef = useRef(onMatch);
  const handlerRef = useRef<(event: MessageEvent) => void>();

  // Mantener la referencia a la función onMatch sin provocar que el efecto se reinicie
  useEffect(() => {
    onMatchRef.current = onMatch;
  }, [onMatch]);

  useEffect(() => {
    if (!playerId) return;

    const handler = (event: MessageEvent) => {
      try {
        const data: MatchEventData = JSON.parse(event.data);
        console.log('Match encontrado:', data);
        onMatchRef.current(data);
        eventSourceRef.current?.close();
      } catch (err) {
        console.error('Error al procesar evento SSE de matchmaking:', err);
      }
    };
    handlerRef.current = handler;

    const connect = () => {
      const url = `${BACKEND_URL}/sse/matchmaking/${encodeURIComponent(playerId)}`;
      console.log('Abriendo conexión SSE de matchmaking:', url);
      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      if (handlerRef.current) {
        es.addEventListener('match-found', handlerRef.current as EventListener);
      }

      es.onerror = (err) => {
        console.error('Error en la conexión SSE de matchmaking:', err);
        toast({ title: 'Error de Matchmaking', description: 'La conexión se interrumpió. Reintentando...' });
        es.close();
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      console.log('Cerrando conexión SSE de matchmaking');
      if (eventSourceRef.current && handlerRef.current) {
        eventSourceRef.current.removeEventListener('match-found', handlerRef.current as EventListener);
        eventSourceRef.current.close();
      }

    };
  }, [playerId, toast]);
}
