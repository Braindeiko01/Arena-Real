import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatSummary {
  id: string;
  jugadores: string[];
  activo: boolean;
}

export default function useFirestoreChats(userId: string | undefined) {
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const q = query(collection(db, 'chats'), where('jugadores', 'array-contains', userId));
    const unsub = onSnapshot(
      q,
      snapshot => {
        const data: ChatSummary[] = [];
        snapshot.forEach(doc => {
          const d = doc.data() as any;
          data.push({
            id: doc.id,
            jugadores: Array.isArray(d.jugadores) ? d.jugadores : [],
            activo: d.activo ?? false,
          });
        });
        data.sort((a, b) => Number(b.activo) - Number(a.activo));
        setChats(data);
        setError(null);
        setLoading(false);
      },
      err => {
        console.error('Error listening chats', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [userId]);

  return { chats, error, loading };
}
