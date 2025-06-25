import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';
import useChatSocket from './useChatSocket';

export default function useSocketChat(matchId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleIncoming = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
  }, []);

  const sendMessage = useChatSocket(matchId, handleIncoming);

  return { messages, sendMessage };
}
