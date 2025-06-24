import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8080';

interface MatchEventData {
  apuestaId: string;
  jugadorOponenteId: string;
  jugadorOponenteTag: string;
}

export default function useMatchmakingSse(playerId: string | undefined, onMatch: (data: MatchEventData) => void) {
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!playerId) return;

    const url = `${BACKEND_URL}/sse/match?jugadorId=${encodeURIComponent(playerId)}`;
    console.log('Abriendo conexión SSE de matchmaking:', url);
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data: MatchEventData = JSON.parse(event.data);
        console.log('Match encontrado:', data);
        onMatch(data);
        es.close();
      } catch (err) {
        console.error('Error al procesar evento SSE de matchmaking:', err);
      }
    };

    es.onerror = (err) => {
      console.error('Error en la conexión SSE de matchmaking:', err);
      toast({ title: 'Error de Matchmaking', description: 'La conexión se interrumpió.' });
    };

    return () => {
      console.log('Cerrando conexión SSE de matchmaking');
      es.close();
    };
  }, [playerId, onMatch, toast]);
}
