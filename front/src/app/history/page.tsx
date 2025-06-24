
"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import type { Bet } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollTextIcon, VictoryIcon, DefeatIcon, InfoIcon } from '@/components/icons/ClashRoyaleIcons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

const HistoryPageContent = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (!authIsLoading) {
      if (user) {
        // En un sistema real, aquí se haría un fetch del historial de apuestas del usuario desde un backend.
        // Por ahora, el historial de `bets` permanecerá vacío ya que no hay persistencia de apuestas.
        /*
        const fetchBets = async () => {
          if (user?.id) { // Asumiendo que user.id es el googleId
            // const result = await getUserBetsAction(user.id); // Necesitaría una acción para esto
            // if (result.bets) {
            //   setBets(result.bets);
            // } else {
            //   console.error("Error fetching bets:", result.error);
            //   setBets([]);
            // }
            setBets([]); // Placeholder
          }
        };
        fetchBets();
        */
        setBets([]); // Inicializa como vacío.
      } else {
        setBets([]); // También vacío si no hay usuario
      }
      setIsPageLoading(false);
    }
  }, [user, authIsLoading]);

  if (isPageLoading || authIsLoading) return <p>Cargando historial de duelos...</p>;
  if (!user) return <p>Debes iniciar sesión para ver tu historial.</p>;

  const wonBets = bets.filter(bet => bet.result === 'win');
  const lostBets = bets.filter(bet => bet.result === 'loss');
  const pendingBets = bets.filter(bet => !bet.result);

  const BetCard = ({ bet }: { bet: Bet }) => (
    <Card className="mb-4 shadow-md border-border hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl text-primary">Duelo: {bet.modoJuego}</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Apuesta ID: {bet.id} <br />
              Fecha: {new Date(bet.matchDate).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge 
            variant={bet.result === 'win' ? 'default' : bet.result === 'loss' ? 'destructive' : 'secondary'}
            className={`capitalize ${bet.result === 'win' ? 'bg-green-500 text-white' : bet.result === 'loss' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'}`}
          >
            {bet.result || bet.status || 'Pendiente'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-base">Monto: <span className="font-semibold text-accent">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(bet.amount)}</span></p>
            {bet.opponentTag && <p className="text-base">Oponente: <span className="font-semibold">{bet.opponentTag}</span></p>}
          </div>
          {bet.result === 'win' && <VictoryIcon className="h-8 w-8 text-green-500" />}
          {bet.result === 'loss' && <DefeatIcon className="h-8 w-8 text-destructive" />}
          {!bet.result && <InfoIcon className="h-8 w-8 text-muted-foreground" />}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-card-medieval border-2 border-primary-dark overflow-hidden">
      <CardHeader className="bg-primary/10">
        <div className="flex items-center space-x-3">
          <ScrollTextIcon className="h-8 w-8 text-accent" />
          <CardTitle className="text-3xl font-headline text-primary">Historial de Duelos</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-lg pt-1">Aquí verás tus apuestas y sus resultados.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 p-1.5 bg-secondary rounded-lg gap-1.5">
            <TabsTrigger value="all" className="py-2.5 px-3 text-base rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-md hover:bg-primary/20">Todos ({bets.length})</TabsTrigger>
            <TabsTrigger value="ganadas" className="py-2.5 px-3 text-base rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-primary/20">Ganadas ({wonBets.length})</TabsTrigger>
            <TabsTrigger value="perdidas" className="py-2.5 px-3 text-base rounded-md data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:shadow-md hover:bg-primary/20">Perdidas ({lostBets.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {bets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tienes apuestas en tu historial todavía.</p>
            ) : (
              bets.map((bet) => <BetCard key={bet.id} bet={bet} />)
            )}
          </TabsContent>
          <TabsContent value="ganadas">
            {wonBets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No has ganado ninguna apuesta todavía.</p>
            ) : (
              wonBets.map((bet) => <BetCard key={bet.id} bet={bet} />)
            )}
          </TabsContent>
          <TabsContent value="perdidas">
            {lostBets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No has perdido ninguna apuesta todavía.</p>
            ) : (
              lostBets.map((bet) => <BetCard key={bet.id} bet={bet} />)
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default function HistoryPage() {
  return (
    <AppLayout>
      <HistoryPageContent />
    </AppLayout>
  );
}
