import { useEffect, useState } from 'react';
import useFirestoreChats from './useFirestoreChats';
import { getLocalStorageItem, setLocalStorageItem } from '@/lib/storage';

export const ACTIVE_CHAT_KEY = 'cr_active_chat_id';

export default function useActiveChat(userId: string | undefined) {
  const { chats } = useFirestoreChats(userId);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    const active = chats.find(c => c.activo);
    if (active) {
      setActiveChatId(active.id);
      setLocalStorageItem(ACTIVE_CHAT_KEY, active.id);
    } else {
      const stored = getLocalStorageItem<string>(ACTIVE_CHAT_KEY);
      if (stored) {
        setActiveChatId(stored);
      } else {
        setActiveChatId(null);
      }
    }
  }, [chats]);

  return { activeChatId };
}
