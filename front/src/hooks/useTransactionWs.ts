import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import useNotifications from '@/hooks/useNotifications';
import { BACKEND_WS_URL } from '@/lib/config';

export interface ApprovedTransaction {
  id: string;
  jugadorId: string;
  monto: number;
  tipo: 'DEPOSITO' | 'RETIRO' | 'PREMIO';
  estado: 'APROBADA';
  creadoEn: string;
}

export interface UseTransactionWsOptions {
  onTransactionApproved?: (data: ApprovedTransaction) => void;
  onBalanceUpdated?: (balance: number) => void;
}

export default function useTransactionWs(options: UseTransactionWsOptions = {}) {
  const [approvedTransactions, setApprovedTransactions] = useState<ApprovedTransaction[]>([]);
  const { user, refreshUser, updateUser } = useAuth();
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectedRef = useRef(false);
  const disconnectedRef = useRef(false);
  const lastBalanceRef = useRef<number | null>(null);

  const onTransactionApprovedRef = useRef(options.onTransactionApproved);
  const onBalanceUpdatedRef = useRef(options.onBalanceUpdated);
  const connectRef = useRef<(onOpen?: () => void) => void>();

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    return new Promise<void>(resolve => {
      disconnect();
      connectRef.current?.(() => resolve());
    });
  }, [disconnect]);

  useEffect(() => {
    onTransactionApprovedRef.current = options.onTransactionApproved;
  }, [options.onTransactionApproved]);

  useEffect(() => {
    onBalanceUpdatedRef.current = options.onBalanceUpdated;
  }, [options.onBalanceUpdated]);

  useEffect(() => {
    if (!user?.id) return;

    const handleMessage = async (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data);
        switch (msg.event) {
          case 'transaccion-aprobada': {
            const data = msg.data as ApprovedTransaction;
            setApprovedTransactions(prev => [data, ...prev]);
            const msgText = `Tu transacción ${data.id} ha sido aprobada.`;
            toast({ title: 'Actualización de Transacción', description: msgText });
            addNotification(
              `Tu transacción ${data.id} ha sido aprobada por ${new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0,
              }).format(data.monto)}`
            );
            onTransactionApprovedRef.current?.(data);
            await refreshUser();
            break;
          }
          case 'saldo-actualizar': {
            if (msg.data != null) {
              const saldo = msg.data as number;
              if (saldo !== lastBalanceRef.current) {
                lastBalanceRef.current = saldo;
                await updateUser({ balance: saldo });
                onBalanceUpdatedRef.current?.(saldo);
                return;
              }
            }
            await refreshUser();
            if (typeof msg.data === 'number') {
              onBalanceUpdatedRef.current?.(msg.data);
            }
            break;
          }
        }
      } catch (err) {
        console.error('Error procesando mensaje WS', err);
      }
    };

    const connect = (onOpen?: () => void) => {
      const url = `${BACKEND_WS_URL}/ws/transacciones/${encodeURIComponent(user.id)}`;
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        connectedRef.current = true;
        onOpen?.();
        if (disconnectedRef.current) {
          refreshUser();
          disconnectedRef.current = false;
        }
      };
      ws.onmessage = handleMessage;
      ws.onerror = err => {
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
        reconnectTimeoutRef.current = setTimeout(() => connect(), 3000);
      };
    };
    connectRef.current = connect;
    connect();

    const handleResume = () => {
      reconnect();
    };
    document.addEventListener('visibilitychange', handleResume);
    window.addEventListener('online', handleResume);

    return () => {
      disconnect();
      connectedRef.current = false;
      document.removeEventListener('visibilitychange', handleResume);
      window.removeEventListener('online', handleResume);
    };
  }, [user, refreshUser, updateUser, toast, reconnect, disconnect]);

  return { approvedTransactions, reconnect };
}
