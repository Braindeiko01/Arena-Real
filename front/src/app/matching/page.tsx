
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SwordsIcon, CrownIcon } from '@/components/icons/ClashRoyaleIcons';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion'; // For animations
import { createBetAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


// Mock opponent data - opponent's googleId would be used if joining their bet
const mockOpponents = [
  { id: 'google-opp1-id', clashTag: 'DuelKing#123', avatarUrl: 'https://placehold.co/128x128.png?text=DK', dataAiHint: 'gaming avatar king' },
  { id: 'google-opp2-id', clashTag: 'ArenaPro#456', avatarUrl: 'https://placehold.co/128x128.png?text=AP', dataAiHint: 'gaming avatar pro' },
  { id: 'google-opp3-id', clashTag: 'Legend#789', avatarUrl: 'https://placehold.co/128x128.png?text=L', dataAiHint: 'gaming avatar legend' },
];

const MatchingPageContent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const mode = searchParams.get('mode') as 'CLASICO' | 'TRIPLE_ELECCION' | null;
  const modeDisplay = mode === 'CLASICO' ? 'Batalla Clásica' : mode === 'TRIPLE_ELECCION' ? 'Triple Elección' : 'Duelo Estándar';

  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [opponent, setOpponent] = useState<{ id: string; clashTag: string; avatarUrl: string; dataAiHint: string; } | null>(null);
  const [betId, setBetId] = useState<string | null>(null); // This will be the bet's UUID from backend

  // Effect for setting up search and progress
  useEffect(() => {
    if (!user || !user.id) { // user.id es googleId
      if (user && !user.id) {
        toast({ title: "Error de Usuario", description: "No se pudo identificar al usuario. Intenta recargar.", variant: "destructive" });
        router.replace('/');
      }
      return;
    }


    if (!mode || (mode !== 'CLASICO' && mode !== 'TRIPLE_ELECCION')) {
      router.replace('/');
      return;
    }
    if (user.balance < 6000) {
      toast({ title: "Saldo Insuficiente", description: "Necesitas al menos $6,000 COP para crear una apuesta.", variant: "destructive" });
      router.replace('/');
      return;
    }

    setOpponent(null);
    setProgress(0);
    setStatus(`Creando apuesta para ${modeDisplay}...`);
    setBetId(null);

    const initBet = async () => {
      if (!user.id) return;
      console.log('Creando apuesta para matchmaking:', { userId: user.id, mode });
      const result = await createBetAction(user.id, 6000, mode); // Use user.id (googleId)
      console.log('Resultado de createBetAction:', result);
      if (result.bet && result.bet.id) {
        setBetId(result.bet.id); // Store the bet's UUID from backend
        setStatus(`Apuesta ${result.bet.id} creada. Buscando oponente para ${modeDisplay}...`);

        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 10, 100));
        }, 250);

        // Simulate finding an opponent
        const searchTimeoutId = setTimeout(() => {
          const randomOpponent = mockOpponents[Math.floor(Math.random() * mockOpponents.length)];
          console.log('Oponente simulado encontrado:', randomOpponent);
          setOpponent(randomOpponent);
          clearInterval(progressInterval);
          setProgress(100);
          // TODO: En un sistema real, aquí se podría llamar a un endpoint para unir la apuesta `betId`
          // con el `jugador2Id` siendo `randomOpponent.id` (googleId del oponente).
          // O el backend manejaría el emparejamiento de forma automática.
        }, 5000);

        return () => {
          clearInterval(progressInterval);
          clearTimeout(searchTimeoutId);
        };
      } else {
        toast({ title: "Error al Crear Apuesta", description: result.error || "No se pudo iniciar la búsqueda.", variant: "destructive" });
        router.replace('/');
      }
    };

    // initBet(); todo: chat gpt elimina este metodo initBet

  }, [user, router, mode, modeDisplay, toast]);

  // Effect to handle navigation once an opponent is found
  useEffect(() => {
    if (opponent && user && mode && modeDisplay && router && betId) {
      console.log('Oponente listo para iniciar duelo:', opponent);
      setStatus(`¡Oponente Encontrado: ${opponent.clashTag} para ${modeDisplay}!`);

      const matchStartTimeoutId = setTimeout(() => {
        setStatus(`¡Duelo iniciando con ${opponent.clashTag} (${modeDisplay})!`);
        // El matchId para el chat ahora es el ID de la apuesta del backend (betId - UUID)
        // Se pasa el googleId del oponente para referencia en el chat si es necesario.
        console.log('Navegando a chat con betId', betId);
        router.push(`/chat/${betId}?opponentTag=${encodeURIComponent(opponent.clashTag)}&opponentAvatar=${encodeURIComponent(opponent.avatarUrl)}&opponentGoogleId=${encodeURIComponent(opponent.id)}`);
      }, 3000);

      return () => {
        clearTimeout(matchStartTimeoutId);
      };
    }
  }, [opponent, user, router, mode, modeDisplay, betId]);


  if (!user) return <p>Cargando...</p>;
  if (!mode || (mode !== 'CLASICO' && mode !== 'TRIPLE_ELECCION')) {
    return <p>Modo de juego no válido. Redirigiendo...</p>;
  }


  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 min-h-[calc(100vh-200px)]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CardTitle className="text-4xl md:text-5xl font-headline text-primary flex items-center justify-center">
          <CrownIcon className="h-10 w-10 md:h-12 md:w-12 mr-3 text-accent animate-pulse" />
          Matchmaking: {modeDisplay}
        </CardTitle>
      </motion.div>

      <div className="relative w-full max-w-3xl mx-auto p-8">
        <div className="flex items-center justify-around">
          <motion.div
            initial={{ x: -100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center space-y-2"
          >
            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-accent shadow-xl">
              <AvatarImage src={user.avatarUrl || `https://placehold.co/128x128.png?text=${user.username?.[0] || 'U'}`} alt={user.username} data-ai-hint="gaming avatar user" />
              <AvatarFallback className="text-5xl bg-primary/30">{user.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <p className="text-xl font-semibold text-foreground">{user.clashTag || user.username}</p>
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5, type: "spring", stiffness: 120 }}
          >
            <SwordsIcon className="h-16 w-16 md:h-24 md:w-24 text-destructive animate-subtle-bounce" />
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0, scale: 0.8 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center space-y-2"
          >
            <AnimatePresence>
              {opponent ? (
                <motion.div
                  key="opponent-found"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-destructive shadow-xl">
                    <AvatarImage src={opponent.avatarUrl} alt={opponent.clashTag} data-ai-hint={opponent.dataAiHint} />
                    <AvatarFallback className="text-5xl bg-destructive/30">{opponent.clashTag?.[0] || '?'}</AvatarFallback>
                  </Avatar>
                  <p className="text-xl font-semibold text-foreground">{opponent.clashTag}</p>
                </motion.div>
              ) : (
                <motion.div
                  key="opponent-searching"
                  className="flex flex-col items-center space-y-2"
                >
                  <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-muted bg-muted/50 animate-pulse">
                    <AvatarFallback className="text-5xl text-muted-foreground">?</AvatarFallback>
                  </Avatar>
                  <p className="text-xl font-semibold text-muted-foreground">Buscando...</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <Card className="w-full max-w-lg shadow-card-medieval border-2 border-primary-dark">
        <CardHeader>
          <CardTitle className="text-2xl text-primary">{status}</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-4 [&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary" />
          <p className="text-sm text-muted-foreground mt-2">Monto de Apuesta: $6,000 COP</p>
          {betId && <p className="text-xs text-muted-foreground mt-1">ID Apuesta (Backend): {betId}</p>}
        </CardContent>
      </Card>
    </div>
  );
};

export default function MatchingPage() {
  return (
    <AppLayout>
      <MatchingPageContent />
    </AppLayout>
  );
}
