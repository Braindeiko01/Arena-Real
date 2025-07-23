import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import useNotifications from '@/hooks/useNotifications';
import { BACKEND_WS_URL } from '@/lib/config';
/*
export default function useTransactionUpdatesWs() {
  const { user, refreshUser, updateUser } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectedRef = useRef(false);
  const disconnectedRef = useRef(false);
  const lastBalanceRef = useRef<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && disconnectedRef.current) {
        refreshUser();
        disconnectedRef.current = false;
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const handleMessage = async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.event === 'transaccion-aprobada') {
          const data = msg.data;
          const msgText = `Tu transacción ${data.id} ha sido aprobada.`;
          toast({ title: 'Actualización de Transacción', description: msgText });
          addNotification(msgText);
          await refreshUser();
        }
        if (msg.event === 'saldo-actualizar') {
          if (msg.data != null) {
            const saldo = msg.data as number;
            if (saldo !== lastBalanceRef.current) {
              lastBalanceRef.current = saldo;
              await updateUser({ balance: saldo });
              return;
            }
          }
          await refreshUser();
        }
      } catch (err) {
        console.error('Error procesando mensaje WS', err);
      }
    };

    const connect = () => {
      const url = `${BACKEND_WS_URL}/ws/transacciones/${encodeURIComponent(user.id)}`;
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        connectedRef.current = true;
        if (disconnectedRef.current) {
          refreshUser();
          disconnectedRef.current = false;
        }
      };
      ws.onmessage = handleMessage;
      ws.onerror = (err) => {
        console.error('WS error:', err);
      };
      ws.onclose = () => {
        if (connectedRef.current) {
          toast({
            title: 'Error de Transacciones',
            description: 'Conexión interrumpida. Reintentando...',
          });
        }
        disconnectedRef.current = true;
        reconnectTimeoutRef.current = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      connectedRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user, refreshUser, updateUser, toast]);
}

*/