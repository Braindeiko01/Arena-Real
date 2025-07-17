import { useEffect, useState } from 'react';
import useFirestoreChats from './useFirestoreChats';
import { setLocalStorageItem, removeLocalStorageItem } from '@/lib/storage';

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
      setActiveChatId(null);
      removeLocalStorageItem(ACTIVE_CHAT_KEY);
    }
  }, [chats]);

  return { activeChatId };
}
