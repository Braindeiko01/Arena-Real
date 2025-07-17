"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import useFirestoreChats from '@/hooks/useFirestoreChats';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BACKEND_URL } from '@/lib/config';

interface OpponentInfo { id: string; name: string; }

const ChatListPageContent = () => {
  const { user } = useAuth();
  const { chats, error } = useFirestoreChats(user?.id);
  const [opponents, setOpponents] = useState<Record<string, OpponentInfo>>({});

  const handleDeleteChat = async (chatId: string) => {
    const confirmDelete = window.confirm('¿Eliminar este chat?');
    if (!confirmDelete) return;
    try {
      await deleteDoc(doc(db, 'chats', chatId));
    } catch (err) {
      console.error('Error deleting chat', err);
    }
  };

  useEffect(() => {
    const loadOpponents = async () => {
      if (!user) return;
      const ids = Array.from(new Set(
        chats.map(c => c.jugadores.find(j => j !== user.id)).filter(Boolean)
      )) as string[];
      await Promise.all(
        ids.map(async id => {
          if (opponents[id]) return;
          try {
            const res = await fetch(`${BACKEND_URL}/api/jugadores/${id}`);
            if (res.ok) {
              const data = await res.json();
              setOpponents(prev => ({
                ...prev,
                [id]: { id: data.id, name: data.nombre },
              }));
            }
          } catch (err) {
            console.error('Error fetching opponent', err);
          }
        })
      );
    };
    loadOpponents();
  }, [chats, user]);

  if (!user) return <p>Cargando chats...</p>;
  if (error) return <p>Error al cargar chats.</p>;

  const activeChats = chats.filter(c => c.activo);
  const pastChats = chats.filter(c => !c.activo);

  return (
    <Card className="shadow-card-medieval border-2 border-primary-dark overflow-hidden">
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-3xl font-headline text-primary">Chats</CardTitle>
        <CardDescription className="text-muted-foreground text-lg pt-1">
          Conversaciones de tus partidas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        {error ? (
          <p className="text-center text-destructive">Ocurrió un error al cargar los chats.</p>
        ) : activeChats.length === 0 && pastChats.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tienes chats todavía.</p>
        ) : (
          <>
            {activeChats.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Chat activo</h3>
                <ul className="space-y-3">
                  {activeChats.map(chat => {
                    const opponentId = chat.jugadores.find(j => j !== user.id) as string | undefined;
                    const opponent = opponentId ? opponents[opponentId] : undefined;
                    const name = opponent ? opponent.name : opponentId || 'Oponente';
                    const href = `/chat/${chat.id}?opponentTag=${encodeURIComponent(name)}&opponentGoogleId=${encodeURIComponent(opponentId ?? '')}`;
                    return (
                      <li key={chat.id}>
                        <Link href={href} className="block border rounded-lg p-3 hover:bg-primary/10">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{name}</span>
                            {chat.activo && <Badge className="ml-2">En curso</Badge>}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {pastChats.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-2">Chats anteriores</h3>
                <ul className="space-y-3">
                  {pastChats.map(chat => {
                    const opponentId = chat.jugadores.find(j => j !== user.id) as string | undefined;
                    const opponent = opponentId ? opponents[opponentId] : undefined;
                    const name = opponent ? opponent.name : opponentId || 'Oponente';
                    const href = `/chat/${chat.id}?opponentTag=${encodeURIComponent(name)}&opponentGoogleId=${encodeURIComponent(opponentId ?? '')}`;
                    return (
                      <li key={chat.id} className="flex items-center justify-between gap-2">
                        <Link href={href} className="flex-1 border rounded-lg p-3 hover:bg-primary/10">
                          <span className="font-medium">{name}</span>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteChat(chat.id)} aria-label="Eliminar chat">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </>
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
