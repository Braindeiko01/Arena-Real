
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
import { Send, Link as LinkIconLucide, CheckCircle, XCircle, UploadCloud } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage } from '@/types'; 
import { Label } from '@/components/ui/label';


const ChatPageContent = () => {
  const { user } = useAuth();
  const params = useParams();
  const searchParams = useSearchParams();

  const matchId = params.matchId as string; // Este es el ID de la apuesta del backend (UUID)
  const opponentTag = searchParams.get('opponentTag') || 'Oponente';
  const opponentAvatar = searchParams.get('opponentAvatar') || `https://placehold.co/40x40.png?text=${opponentTag[0] || 'O'}`;
  const opponentGoogleId = searchParams.get('opponentGoogleId'); // googleId del oponente

  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmittingResult, setIsSubmittingResult] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [resultSubmitted, setResultSubmitted] = useState(false); 

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (!user || !matchId) return; // user.id es googleId
      const initialMessage: ChatMessage = {
        id: `sys-${Date.now()}`, 
        matchId, // ID de la apuesta del backend (UUID)
        senderId: 'system', 
        text: `Chat iniciado para el duelo (Apuesta ID: ${matchId}) con ${opponentTag}. ¡Compartan sus links de amigo de Clash Royale para comenzar!`,
        timestamp: new Date().toISOString(),
        isSystemMessage: true,
      };
      setMessages([initialMessage]);
  }, [user, matchId, opponentTag]);

  const saveMessages = (updatedMessages: ChatMessage[]) => {
    // La API actual no tiene endpoints para chat.
    // console.log("Mensajes (no persistidos):", updatedMessages);
  }

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !user.id) return; // user.id es googleId

    const message: ChatMessage = {
      id: `${user.id}-${Date.now()}`, 
      matchId, // ID de la apuesta del backend (UUID)
      senderId: user.id, // googleId del remitente
      text: newMessage,
      timestamp: new Date().toISOString(),
    };
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveMessages(updatedMessages); 
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
    
    const message: ChatMessage = {
      id: `sys-link-${user.id}-${Date.now()}`,
      matchId, // ID de la apuesta del backend (UUID)
      senderId: 'system',
      text: friendLinkMessage,
      timestamp: new Date().toISOString(),
      isSystemMessage: true,
    };
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    toast({ title: "Link de Amigo Compartido", description: `Tu link de amigo ${user.friendLink ? '' : '(o un aviso de que no lo tienes) '}ha sido publicado en el chat.` });
  };

  const handleResultSubmission = (result: 'win' | 'loss') => {
    if (!user || !user.id || resultSubmitted) { // user.id es googleId
        toast({ title: "Error", description: "No se puede enviar el resultado sin identificación de usuario.", variant: "destructive"});
        return;
    }
    
    // Aquí se llamaría a una acción para enviar el resultado al backend (ej. POST /api/partidas)
    // Se necesitaría: apuestaId (que es matchId - UUID de la apuesta)
    // y ganadorId (user.id - googleId, o opponentGoogleId)
    console.log(`Resultado enviado: Usuario con googleId ${user.id} ${result === 'win' ? 'ganó' : 'perdió'} la apuesta ${matchId}. Oponente googleId: ${opponentGoogleId}. Adjunto: ${screenshotFile?.name || 'ninguno'}`);
    
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
     const resultSystemMessage: ChatMessage = {
      id: `sys-result-${user.id}-${Date.now()}`, // user.id es googleId
      matchId, // ID de la apuesta del backend (UUID)
      senderId: 'system',
      text: resultMessageText,
      timestamp: new Date().toISOString(),
      isSystemMessage: true,
    };
    const updatedMessages = [...messages, resultSystemMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
  };


  if (!user) return <p>Cargando chat...</p>;

  return (
    <div className="flex flex-col h-[calc(100vh-150px)] md:h-[calc(100vh-180px)]">
      <Card className="flex-grow flex flex-col shadow-card-medieval border-2 border-primary-dark overflow-hidden">
        <CardHeader className="bg-primary/10 p-4 flex flex-row items-center justify-between border-b border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-accent">
              <AvatarImage src={opponentAvatar} alt={opponentTag} data-ai-hint="gaming avatar opponent" />
              <AvatarFallback>{opponentTag?.[0] || 'O'}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl font-headline text-primary">{opponentTag}</CardTitle>
          </div>
          <CartoonButton size="small" variant="destructive" onClick={() => setIsSubmittingResult(true)} disabled={resultSubmitted}>
            {resultSubmitted ? 'Resultado Enviado' : 'Enviar Resultado'}
          </CartoonButton>
        </CardHeader>

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
            <Button type="button" variant="ghost" size="icon" onClick={handleShareFriendLink} aria-label="Compartir Link de Amigo">
              <LinkIconLucide className="h-6 w-6 text-primary hover:text-accent" />
            </Button>
            <Input
              type="text"
              placeholder="Escribe tu mensaje..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow text-lg py-3 h-12 border-2 focus:border-primary"
              aria-label="Entrada de mensaje de chat"
            />
            <CartoonButton type="submit" size="small" className="px-5 py-3" aria-label="Enviar Mensaje">
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
              <CardDescription className="text-center text-muted-foreground">Declara el resultado de tu duelo con {opponentTag}.</CardDescription>
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
                >
                  Gané
                </CartoonButton>
                <CartoonButton 
                  variant="destructive" 
                  onClick={() => handleResultSubmission('loss')} 
                  className="flex-1"
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
