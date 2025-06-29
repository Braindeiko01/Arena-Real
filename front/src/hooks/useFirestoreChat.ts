import { useEffect, useState, useCallback } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ChatMessage } from '@/types';

export default function useFirestoreChat(chatId: string | undefined) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chatId) return;
    setIsLoading(true);

    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('timestamp'));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          msgs.push({
            id: doc.id,
            matchId: chatId,
            senderId: data.senderId,
            text: data.text,
            timestamp: data.timestamp.toDate().toISOString(),
            isSystemMessage: data.isSystemMessage || false,
          });
        });
        setMessages(msgs);
        setIsLoading(false);
      },
      err => {
        console.error('Error listening to chat messages', err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [chatId]);

  const sendMessage = useCallback(async (message: Omit<ChatMessage, 'id'>) => {
    if (!chatId) return;
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: message.senderId,
        text: message.text,
        timestamp: Timestamp.now(),
        isSystemMessage: message.isSystemMessage || false,
      });
    } catch (err) {
      console.error('Error sending chat message', err);
      setError(err as Error);
    }
  }, [chatId]);

  return { messages, sendMessage, error, isLoading };
}
