"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import useFirestoreChats from '@/hooks/useFirestoreChats';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BACKEND_URL } from '@/lib/config';

interface OpponentInfo { id: string; tag: string; }

const ChatListPageContent = () => {
  const { user } = useAuth();
  const { chats } = useFirestoreChats(user?.id);
  const [opponents, setOpponents] = useState<Record<string, OpponentInfo>>({});

  useEffect(() => {
    const loadOpponents = async () => {
      if (!user) return;
      const ids = Array.from(new Set(chats.map(c => c.jugadores.find(j => j !== user.id)).filter(Boolean))) as string[];
      await Promise.all(ids.map(async id => {
        if (opponents[id]) return;
        try {
          const res = await fetch(`${BACKEND_URL}/api/jugadores/${id}`);
          if (res.ok) {
            const data = await res.json();
            setOpponents(prev => ({ ...prev, [id]: { id: data.id, tag: data.tagClash || data.nombre } }));
          }
        } catch (err) {
          console.error('Error fetching opponent', err);
        }
      }));
    };
    loadOpponents();
  }, [chats, user, opponents]);

  if (!user) return <p>Cargando chats...</p>;

  return (
    <Card className="shadow-card-medieval border-2 border-primary-dark overflow-hidden">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-3xl font-headline text-primary">Chats</CardTitle>
        <CardDescription className="text-muted-foreground text-lg pt-1">
          Conversaciones de tus partidas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        {chats.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tienes chats todavía.</p>
        ) : (
          <ul className="space-y-3">
            {chats.map(chat => {
              const opponentId = chat.jugadores.find(j => j !== user.id) as string | undefined;
              const opponent = opponentId ? opponents[opponentId] : undefined;
              const tag = opponent ? opponent.tag : opponentId || 'Oponente';
              const href = `/chat/${chat.id}?opponentTag=${encodeURIComponent(tag)}&opponentGoogleId=${encodeURIComponent(opponentId ?? '')}`;
              return (
                <li key={chat.id}>
                  <Link href={href} className="block border rounded-lg p-3 hover:bg-primary/10">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{tag}</span>
                      {chat.activo && <Badge className="ml-2">En curso</Badge>}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default function ChatListPage() {
  return (
    <AppLayout>
      <ChatListPageContent />
    </AppLayout>
  );
}
