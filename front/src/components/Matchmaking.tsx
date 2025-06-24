"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { CartoonButton } from '@/components/ui/CartoonButton';

interface MatchmakingProps {
  usuarioId: string;
}

interface SseMessage {
  match?: boolean;
  partida?: { id: string };
  timeout?: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';

export default function Matchmaking({ usuarioId }: MatchmakingProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'esperando' | 'matched' | 'timeout' | 'cancelado'>('idle');
  const [message, setMessage] = useState('');
  const eventSourceRef = useRef<EventSource | null>(null);

  const closeEventSource = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const startSearch = async () => {
    if (status === 'esperando') return; // evitar duplicados
    setStatus('esperando');
    setMessage('Buscando oponente...');
    try {
      const res = await fetch(`${BACKEND_URL}/api/matchmaking/ejecutar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jugadorId: usuarioId, modoJuego: 'CLASICO', monto: 6000 })
      });
      const data = await res.json();
      if (data.status === 'esperando') {
        openSse();
      } else if (data.match && data.partida) {
        setStatus('matched');
        setMessage('Emparejado');
        router.push(`/partida/${data.partida.id}`);
      } else {
        setStatus('idle');
        setMessage(data.error || 'Error');
      }
    } catch (err) {
      setStatus('idle');
      setMessage('Error de red');
    }
  };

  const openSse = () => {
    closeEventSource();
    const es = new EventSource(`${BACKEND_URL}/sse/matchmaking/${usuarioId}`);
    eventSourceRef.current = es;

    es.onmessage = (event) => {
      try {
        const data: SseMessage = JSON.parse(event.data);
        if (data.match && data.partida) {
          setStatus('matched');
          setMessage('Emparejado');
          closeEventSource();
          router.push(`/partida/${data.partida.id}`);
        } else if (data.timeout) {
          setStatus('timeout');
          setMessage('No se encontró oponente. Inténtalo más tarde.');
          closeEventSource();
        }
      } catch (err) {
        console.error('Error procesando mensaje SSE', err);
      }
    };

    es.onerror = (err) => {
      console.error('Error SSE', err);
      setMessage('Error de conexión');
    };
  };
  

  const cancelSearch = async () => {
    if (status !== 'esperando') return;
    try {
      await fetch(`${BACKEND_URL}/api/matchmaking/cancelar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId })
      });
    } catch (err) {
      // ignore error
    }
    closeEventSource();
    setStatus('cancelado');
    setMessage('Búsqueda cancelada');
  };

  useEffect(() => {
    return () => {
      closeEventSource();
    };
  }, []);

  return (
    <div className="space-y-2">
      {status !== 'esperando' ? (
        <CartoonButton onClick={startSearch}>Buscar oponente</CartoonButton>
      ) : (
        <CartoonButton variant="secondary" onClick={cancelSearch}>
          Cancelar búsqueda
        </CartoonButton>
      )}
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}

