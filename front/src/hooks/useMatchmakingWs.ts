import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_WS_URL } from '@/lib/config';

export interface MatchEventData {
  apuestaId: string;
  partidaId: string;
  jugadorOponenteId: string;
  jugadorOponenteTag: string;
  jugadorOponenteNombre: string;
  chatId?: string;
}


export default function useMatchmakingWs(
  playerId: string | undefined,
  onMatchFound: (data: MatchEventData) => void,
  onChatReady: (data: MatchEventData) => void,
  onOpponentAccepted?: (data: MatchEventData) => void,
  onMatchCancelled?: (data: MatchEventData) => void,
  onMatchValidated?: (data: MatchEventData) => void,
  onRematchAvailable?: (data: MatchEventData) => void,
) {

  const { toast } = useToast();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onMatchFoundRef = useRef(onMatchFound);
  const onChatReadyRef = useRef(onChatReady);
  const onOpponentAcceptedRef = useRef(onOpponentAccepted);
  const onMatchCancelledRef = useRef(onMatchCancelled);
  const onMatchValidatedRef = useRef(onMatchValidated);
  const onRematchAvailableRef = useRef(onRematchAvailable);
  const connectRef = useRef<(onOpen?: () => void) => void>();

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  };

  const reconnect = () => {
    return new Promise<void>((resolve) => {
      disconnect();
      connectRef.current?.(() => resolve());
    });
  };

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
    onMatchValidatedRef.current = onMatchValidated;
  }, [onMatchValidated]);

  useEffect(() => {
    onRematchAvailableRef.current = onRematchAvailable;
  }, [onRematchAvailable]);

  useEffect(() => {
    if (!playerId) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        const data: MatchEventData = msg.data;
        switch (msg.event) {
          case 'match-found':
            onMatchFoundRef.current(data);
            break;
          case 'chat-ready':
            onChatReadyRef.current(data);
            break;
          case 'opponent-accepted':
            onOpponentAcceptedRef.current && onOpponentAcceptedRef.current(data);
            break;
          case 'match-cancelled':
            onMatchCancelledRef.current && onMatchCancelledRef.current(data);
            break;
          case 'match-validated':
            onMatchValidatedRef.current && onMatchValidatedRef.current(data);
            break;
          case 'rematch-available':
            onRematchAvailableRef.current && onRematchAvailableRef.current(data);
            break;
        }
      } catch (err) {
        console.error('Error procesando mensaje WebSocket:', err);
      }
    };

    const connect = (onOpen?: () => void) => {
      const url = `${BACKEND_WS_URL}/ws/matchmaking/${encodeURIComponent(playerId)}`;
      console.log('Abriendo WebSocket de matchmaking:', url);
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        onOpen?.();
      };
      ws.onmessage = handleMessage;
      ws.onerror = (err) => {
        console.error('Error en la conexión WebSocket de matchmaking:', err);
      };
      ws.onclose = () => {
        toast({
          title: 'Error de Matchmaking',
          description: 'La conexión se interrumpió. Reintentando...',
        });
        reconnectTimeoutRef.current = setTimeout(() => connect(), 3000);
      };
    };
    connectRef.current = connect;
    connect();

    return () => {
      console.log('Cerrando WebSocket de matchmaking');
      disconnect();
    };
  }, [playerId, toast]);

  useEffect(() => {
    if (!playerId) return;
    const handleResume = () => {
      reconnect();
    };
    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('online', handleResume);
    return () => {
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('online', handleResume);
    };
  }, [playerId, reconnect]);

  return { reconnect };
  
}

