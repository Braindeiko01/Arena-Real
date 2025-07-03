
"use client";

import React, { useState, useEffect, FormEvent, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Link as LinkIconLucide, CheckCircle, XCircle, UploadCloud } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import useFirestoreChat from '@/hooks/useFirestoreChat';
import { BACKEND_URL } from '@/lib/config';
import type { ChatMessage, User } from '@/types';
import { submitMatchResultAction } from '@/lib/actions';

import { Label } from '@/components/ui/label';


const ChatPageContent = () => {
  const { user } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();


  const chatId = params.matchId as string | undefined;
  const opponentTagParam = searchParams.get('opponentTag');
  const opponentGoogleIdParam = searchParams.get('opponentGoogleId');
  const partidaIdParam = searchParams.get('partidaId');

  const paramsLoaded =
    chatId !== undefined &&
    opponentTagParam !== null &&
    opponentGoogleIdParam !== null;
  const hasValidParams =
    paramsLoaded &&
    opponentTagParam !== 'null' &&
    opponentTagParam !== 'undefined' &&
    opponentGoogleIdParam !== 'null' &&
    opponentGoogleIdParam !== 'undefined';

  const incompleteData = !hasValidParams;

  useEffect(() => {
    console.log('router.query', { chatId, opponentTag: opponentTagParam, opponentGoogleId: opponentGoogleIdParam });
    if (!paramsLoaded) {
      console.warn('Faltan parámetros para cargar el chat', { chatId, opponentTag: opponentTagParam, opponentGoogleId: opponentGoogleIdParam });
    } else if (!hasValidParams) {
      console.warn('Parámetros inválidos', { chatId, opponentTag: opponentTagParam, opponentGoogleId: opponentGoogleIdParam });
    }
  }, [chatId, opponentTagParam, opponentGoogleIdParam, paramsLoaded, hasValidParams]);

  const { toast } = useToast();
  const { messages, sendMessage, isLoading, chatActive } = useFirestoreChat(hasValidParams ? chatId : undefined);
  const opponentTag = hasValidParams ? opponentTagParam! : undefined;
  const opponentGoogleId = hasValidParams ? opponentGoogleIdParam! : undefined;
  const opponentAvatar = hasValidParams ? (searchParams.get('opponentAvatar') || `https://placehold.co/40x40.png?text=${opponentTag![0]}`) : undefined;
  const validChatId = chatId as string;
  const validOpponentTag = opponentTag as string;
  const validOpponentGoogleId = opponentGoogleId as string;
  const [partidaId, setPartidaId] = useState<string | null>(partidaIdParam);
  const [opponentProfile, setOpponentProfile] = useState<User | null>(null);
  const opponentDisplayName = opponentProfile?.username || validOpponentTag;
  const sendMessageSafely = (msg: Omit<ChatMessage, 'id'>) => {
    if (!opponentTag || !opponentGoogleId) {
      console.error('❌ Datos incompletos para iniciar chat');
      return;
    }
    sendMessage(msg);
  };
  const [newMessage, setNewMessage] = useState('');
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [resultSubmitted, setResultSubmitted] = useState(false);

  const startMessageSentRef = useRef(false);

  useEffect(() => {
    startMessageSentRef.current = false;
  }, [validChatId]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchPartida = async () => {
      if (partidaId || !chatId) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/partidas/chat/${encodeURIComponent(chatId)}`);
        if (res.ok) {
          const data = await res.json();
          setPartidaId(data.id);
        } else {
          console.error('Error al obtener partida por chat', res.status);
        }
      } catch (err) {
        console.error('Error al obtener partida por chat', err);
      }
    };
    fetchPartida();
  }, [chatId, partidaId, BACKEND_URL]);

  useEffect(() => {
    const fetchOpponent = async () => {
      if (!hasValidParams) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/jugadores/${validOpponentGoogleId}`);
        if (res.ok) {
          const data = await res.json();
          const profile: User = {
            id: data.id,
            username: data.nombre,
            email: data.email,
            phone: data.telefono,
            clashTag: data.tagClash,
            nequiAccount: data.telefono,
            avatarUrl: `https://placehold.co/40x40.png?text=${data.nombre?.[0] ?? 'O'}`,
            balance: data.saldo ?? 0,
            friendLink: data.linkAmistad,
            reputacion: data.reputacion ?? 0,
          };
          setOpponentProfile(profile);
        } else {
          console.error('Error al obtener datos del oponente');
        }
      } catch (err) {
        console.error('Error al obtener datos del oponente', err);
      }
    };
    fetchOpponent();
  }, [hasValidParams, validOpponentGoogleId, BACKEND_URL]);

  useEffect(() => {
    if (incompleteData || isLoading || !user || !opponentProfile || startMessageSentRef.current) return;
    if (messages.length === 0) {
      const startMsg = {
        matchId: validChatId,
        senderId: 'system',
        text: `Chat iniciado para el duelo (Chat ID: ${validChatId}) con ${opponentDisplayName}.`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true,
      };
      sendMessageSafely(startMsg);
      startMessageSentRef.current = true;
    }
  }, [user, opponentProfile, validChatId, validOpponentTag, opponentDisplayName, messages.length, incompleteData, isLoading]);

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !user.id) return; // user.id es googleId

    const message = {
      matchId: validChatId, // ID del chat (UUID)
      senderId: user.id, // googleId del remitente
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    sendMessageSafely(message);
    setNewMessage('');
  };
  
  const handleShareFriendLink = () => {
    if (!user || !user.id) return; 
    const linkToShare = user.friendLink;
    const userDisplayName = user.clashTag || user.username;
    
    let friendLinkMessage: string;

    if (linkToShare) {
      friendLinkMessage = `${userDisplayName} compartió su link de amigo: <a href="${linkToShare}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">${linkToShare}</a>`;
    } else {
      friendLinkMessage = `${userDisplayName} intentó compartir su link de amigo, pero no lo tiene configurado en su perfil.`;
    }
    
    const message = {
      matchId: validChatId, // ID del chat (UUID)
      senderId: 'system',
      text: friendLinkMessage,
      timestamp: new Date().toISOString(),
      isSystemMessage: true,
    };
    sendMessageSafely(message);
    toast({ title: "Link de Amigo Compartido", description: `Tu link de amigo ${user.friendLink ? '' : '(o un aviso de que no lo tienes) '}ha sido publicado en el chat.` });
  };

  const handleResultSubmission = async (result: 'win' | 'loss') => {
    if (!user || !user.id || resultSubmitted) {
      toast({ title: 'Error', description: 'No se puede enviar el resultado sin identificación de usuario.', variant: 'destructive' })
      return
    }

    let screenshotBase64: string | undefined
    if (screenshotFile) {
      screenshotBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('Error leyendo captura'))
        reader.readAsDataURL(screenshotFile)
      })
    }

    if (!partidaId) {
      toast({ title: 'Error', description: 'No se encontró la partida asociada al chat.', variant: 'destructive' })
      return
    }

    const response = await submitMatchResultAction(
      partidaId,
      user.id,
      result === 'win' ? 'VICTORIA' : 'DERROTA',
      screenshotBase64,
    )

    if (response.error) {
      toast({ title: 'Error', description: response.error, variant: 'destructive' })
      return
    }
    
    toast({
      title: "¡Resultado Enviado!",
      description: `Reportaste una ${result === 'win' ? 'victoria' : 'derrota'}. ${screenshotFile ? 'Comprobante adjuntado.' : 'Sin comprobante.'} Esperando al oponente si es necesario, o verificación del administrador.`,
      variant: "default",
    });
    
    setResultSubmitted(true);
    setIsSubmittingResult(false); 
    setScreenshotFile(null);
    
     const userDisplayName = user.clashTag || user.username;
     const resultMessageText = `${userDisplayName} envió el resultado del duelo como ${result === 'win' ? 'VICTORIA' : 'DERROTA'}. ${screenshotFile ? 'Captura de pantalla proporcionada.' : 'No se proporcionó captura.'}`;
    const resultSystemMessage = {
      matchId: validChatId, // ID del chat (UUID)
      senderId: 'system',
      text: resultMessageText,
      timestamp: new Date().toISOString(),
      isSystemMessage: true,
    };
    sendMessageSafely(resultSystemMessage);
  };


  if (!user) return <p>Cargando chat...</p>;
  if (!paramsLoaded) return <p>Cargando datos del chat...</p>;
  if (!hasValidParams) return <p>Datos de la partida incompletos.</p>;


  return (
    <div className="flex flex-col h-[calc(100vh-150px)] md:h-[calc(100vh-180px)]">
      <Card className="flex-grow flex flex-col shadow-card-medieval border-2 border-primary-dark overflow-hidden">
        <CardHeader className="bg-primary/10 p-4 flex flex-wrap items-center justify-between gap-2 border-b border-border">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <Avatar className="h-10 w-10 border-2 border-accent">
              <AvatarImage src={opponentAvatar} alt={opponentDisplayName} data-ai-hint="gaming avatar opponent" />
              <AvatarFallback>{opponentDisplayName?.[0] || 'O'}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline text-primary truncate">
              {opponentDisplayName}
            </CardTitle>
            {chatActive && (
              <Badge className="text-sm sm:text-xs flex-none">En curso</Badge>
            )}
          </div>
          <CartoonButton
            size="small"
            variant="destructive"
            onClick={() => setIsSubmittingResult(true)}
            disabled={resultSubmitted || !chatActive}
          >
            {resultSubmitted ? 'Resultado Enviado' : 'Enviar Resultado'}
          </CartoonButton>
        </CardHeader>
        {!chatActive && (
          <p className="text-center text-sm text-muted-foreground py-2">Chat finalizado. No puedes enviar nuevos mensajes.</p>
        )}

        <ScrollArea className="flex-grow bg-background/50 p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : msg.senderId === 'system' ? 'justify-center' : 'justify-start'}`}>
              {msg.isSystemMessage ? (
                <div className="text-xs text-center text-muted-foreground italic bg-muted p-2 rounded-lg shadow-sm max-w-md my-1 break-words">
                  {msg.text.includes("compartió su link de amigo:") && msg.text.includes("<a href=") ? (
                    <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                  ) : (
                    msg.text
                  )}
                </div>
              ) : (
                <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl shadow-md ${msg.senderId === user.id ? 'bg-primary text-primary-foreground rounded-br-none ml-auto' : 'bg-card text-card-foreground rounded-bl-none mr-auto'}`}>
                  <p className="text-base break-words">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.senderId === user.id ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70 text-left'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t border-border p-4 bg-card">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <Button type="button" variant="ghost" size="icon" onClick={handleShareFriendLink} aria-label="Compartir Link de Amigo" disabled={!chatActive}>
              <LinkIconLucide className="h-6 w-6 text-primary hover:text-accent" />
            </Button>
            <Input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow text-lg py-3 h-12 border-2 focus:border-primary"
              aria-label="Entrada de mensaje de chat"
              disabled={!chatActive}
            />
            <CartoonButton type="submit" size="small" className="px-5 py-3" aria-label="Enviar Mensaje" disabled={!chatActive}>
              <Send className="h-5 w-5" />
            </CartoonButton>
          </form>
        </div>
      </Card>

      {isSubmittingResult && !resultSubmitted && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-lg shadow-xl border-2 border-accent">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">Enviar Resultado del Duelo</CardTitle>
              <CardDescription className="text-center text-muted-foreground">Declara el resultado de tu duelo con {opponentDisplayName}.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="screenshot" className="text-lg text-foreground mb-2 block flex items-center">
                  <UploadCloud className="mr-2 h-5 w-5 text-primary" /> Subir Captura (Opcional)
                </Label>
                <Input 
                  id="screenshot" 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setScreenshotFile(e.target.files ? e.target.files[0] : null)}
                  className="text-base file:bg-primary file:text-primary-foreground hover:file:bg-primary-dark file:rounded-md file:border-0 file:px-4 file:py-2 file:mr-3 file:font-semibold"
                />
                {screenshotFile && <p className="text-sm text-muted-foreground mt-2">Seleccionado: {screenshotFile.name}</p>}
              </div>
              <div className="flex justify-around space-x-4">
                <CartoonButton
                  variant="default"
                  onClick={() => handleResultSubmission('win')}
                  className="flex-1 bg-green-500 hover:bg-green-600 border-green-700 text-white"
                  iconLeft={<CheckCircle />}
                  disabled={!chatActive}
                >
                  Gané
                </CartoonButton>
                <CartoonButton
                  variant="destructive"
                  onClick={() => handleResultSubmission('loss')}
                  className="flex-1"
                  disabled={!chatActive}
                  iconLeft={<XCircle />}
                >
                  Perdí
                </CartoonButton>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
                <Button variant="outline" onClick={() => { setIsSubmittingResult(false); setScreenshotFile(null); }} className="w-full text-lg py-3">Cancelar</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};


export default function ChatPage() {
  return (
    <AppLayout>
      <ChatPageContent />
    </AppLayout>
  );
}
