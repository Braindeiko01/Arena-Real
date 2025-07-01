import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/lib/config';

export interface MatchEventData {
  apuestaId: string;
  partidaId: string;
  jugadorOponenteId: string;
  jugadorOponenteTag: string;
  chatId?: string;
}

export default function useMatchmakingSse(
  playerId: string | undefined,
  onMatchFound: (data: MatchEventData) => void,
  onChatReady: (data: MatchEventData) => void,
  onOpponentAccepted?: (data: MatchEventData) => void,
  onMatchCancelled?: (data: MatchEventData) => void
) {
  const { toast } = useToast();
  const eventSourceRef = useRef<EventSource | null>(null);
  const onMatchFoundRef = useRef(onMatchFound);
  const onChatReadyRef = useRef(onChatReady);
  const onOpponentAcceptedRef = useRef(onOpponentAccepted);
  const onMatchCancelledRef = useRef(onMatchCancelled);
  const matchHandlerRef = useRef<(event: MessageEvent) => void>();
  const readyHandlerRef = useRef<(event: MessageEvent) => void>();
  const acceptedHandlerRef = useRef<(event: MessageEvent) => void>();
  const cancelledHandlerRef = useRef<(event: MessageEvent) => void>();

  // Mantener la referencia a la función onMatch sin provocar que el efecto se reinicie
  useEffect(() => {
    onMatchFoundRef.current = onMatchFound;
  }, [onMatchFound]);

  useEffect(() => {
    onChatReadyRef.current = onChatReady;
  }, [onChatReady]);

  useEffect(() => {
    onOpponentAcceptedRef.current = onOpponentAccepted;
  }, [onOpponentAccepted]);

  useEffect(() => {
    onMatchCancelledRef.current = onMatchCancelled;
  }, [onMatchCancelled]);

  useEffect(() => {
    if (!playerId) return;

    const matchHandler = (event: MessageEvent) => {
      try {
        const data: MatchEventData = JSON.parse(event.data);
        console.log('Match encontrado:', data);
        onMatchFoundRef.current(data);
      } catch (err) {
        console.error('Error al procesar evento SSE de matchmaking:', err);
      }
    };
    matchHandlerRef.current = matchHandler;

    const readyHandler = (event: MessageEvent) => {
      try {
        const data: MatchEventData = JSON.parse(event.data);
        console.log('Chat listo:', data);
        onChatReadyRef.current(data);
      } catch (err) {
        console.error('Error al procesar evento SSE de chat listo:', err);
      }
    };
    readyHandlerRef.current = readyHandler;

    const acceptedHandler = (event: MessageEvent) => {
      try {
        const data: MatchEventData = JSON.parse(event.data);
        console.log('Oponente aceptó:', data);
        onOpponentAcceptedRef.current && onOpponentAcceptedRef.current(data);
      } catch (err) {
        console.error('Error al procesar evento SSE de aceptación:', err);
      }
    };
    acceptedHandlerRef.current = acceptedHandler;

    const cancelledHandler = (event: MessageEvent) => {
      try {
        const data: MatchEventData = JSON.parse(event.data);
        console.log('Duelo cancelado:', data);
        onMatchCancelledRef.current && onMatchCancelledRef.current(data);
      } catch (err) {
        console.error('Error al procesar evento SSE de cancelación:', err);
      }
    };
    cancelledHandlerRef.current = cancelledHandler;

    const connect = () => {
      const url = `${BACKEND_URL}/sse/matchmaking/${encodeURIComponent(playerId)}`;
      console.log('Abriendo conexión SSE de matchmaking:', url);
      const es = new EventSource(url, { withCredentials: true });
      eventSourceRef.current = es;

      if (matchHandlerRef.current) {
        es.addEventListener('match-found', matchHandlerRef.current as EventListener);
      }
      if (readyHandlerRef.current) {
        es.addEventListener('chat-ready', readyHandlerRef.current as EventListener);
      }
      if (acceptedHandlerRef.current) {
        es.addEventListener('opponent-accepted', acceptedHandlerRef.current as EventListener);
      }
      if (cancelledHandlerRef.current) {
        es.addEventListener('match-cancelled', cancelledHandlerRef.current as EventListener);
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
      if (eventSourceRef.current) {
        if (matchHandlerRef.current) {
          eventSourceRef.current.removeEventListener('match-found', matchHandlerRef.current as EventListener);
        }
        if (readyHandlerRef.current) {
          eventSourceRef.current.removeEventListener('chat-ready', readyHandlerRef.current as EventListener);
        }
        if (acceptedHandlerRef.current) {
          eventSourceRef.current.removeEventListener('opponent-accepted', acceptedHandlerRef.current as EventListener);
        }
        if (cancelledHandlerRef.current) {
          eventSourceRef.current.removeEventListener('match-cancelled', cancelledHandlerRef.current as EventListener);
        }
        eventSourceRef.current.close();
      }

    };
  }, [playerId, toast]);
}
