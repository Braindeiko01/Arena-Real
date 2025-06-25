import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import type { ChatMessage } from '@/types';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';


export default function useChatSocket(matchId: string | undefined, onMessage: (msg: ChatMessage) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!matchId) return;

    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.emit('joinMatch', matchId);

    socket.on('chatMessage', (msg: ChatMessage) => {
      if (msg.matchId === matchId) {
        onMessage(msg);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [matchId, onMessage]);

  const sendMessage = (msg: ChatMessage) => {
    socketRef.current?.emit('chatMessage', msg);
  };

  return sendMessage;
}
