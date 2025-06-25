import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

interface MatchEventData {
  apuestaId: string;
  jugadorOponenteId: string;
  jugadorOponenteTag: string;
  chatId: string;
}

export default function useMatchmakingSse(playerId: string | undefined, onMatch: (data: MatchEventData) => void) {
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);
  const handlerRef = useRef<(event: MessageEvent) => void>();

  useEffect(() => {
    if (!playerId) return;

    const handler = (event: MessageEvent) => {
      try {
        const data: MatchEventData = JSON.parse(event.data);
        console.log('Match encontrado:', data);
        onMatch(data);
        eventSourceRef.current?.close();
      } catch (err) {
        console.error('Error al procesar evento SSE de matchmaking:', err);
      }
    };
    handlerRef.current = handler;

    const connect = () => {
      const url = `${BACKEND_URL}/sse/matchmaking/${encodeURIComponent(playerId)}`;
      console.log('Abriendo conexión SSE de matchmaking:', url);
      const es = new EventSource(url);
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
  }, [playerId, onMatch, toast]);
}
