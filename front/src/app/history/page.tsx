
"use client";

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import type { Bet, BackendPartidaResponseDto } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollTextIcon, VictoryIcon, DefeatIcon, InfoIcon } from '@/components/icons/ClashRoyaleIcons';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { getUserDuelsAction } from '@/lib/actions';
import { BACKEND_URL } from '@/lib/config';

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);

const HistoryPageContent = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const [bets, setBets] = useState<Bet[]>([]);
  const [opponents, setOpponents] = useState<Record<string, string>>({});
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const loadOpponents = async () => {
      const ids = Array.from(new Set(bets.map(b => b.opponentId).filter(Boolean))) as string[];
      await Promise.all(
        ids.map(async id => {
          if (opponents[id]) return;
          try {
            const res = await fetch(`${BACKEND_URL}/api/jugadores/${id}`);
            if (res.ok) {
              const data = await res.json();
              setOpponents(prev => ({ ...prev, [id]: data.nombre }));
            }
          } catch (err) {
            console.error('Error al obtener oponente', err);
          }
        })
      );
    };
    if (bets.length > 0) {
      loadOpponents();
    }
  }, [bets, opponents]);

  useEffect(() => {
    const fetchDuels = async () => {
      if (user?.id) {
        const duelResult = await getUserDuelsAction(user.id);
        if (duelResult.duels) {
          const mapped = duelResult.duels.map((d: BackendPartidaResponseDto) => {
            const matchDate = d.validadaEn || d.creada;
            return {
              id: d.apuestaId,
              userId: user.id,
              matchId: d.id,
              amount: d.monto,
              opponentId: d.jugador1Id === user.id ? d.jugador2Id : d.jugador1Id,
              matchDate,
              result: d.ganadorId ? (d.ganadorId === user.id ? 'win' : 'loss') : undefined,
              status: d.estado as any,
              modoJuego: d.modoJuego,
              opponentTag: undefined,
              prize: Number(d.premio ?? 0),
            } as Bet;
          });
          setBets(mapped);
        } else {
          setBets([]);
        }
      } else {
        setBets([]);
      }
      setIsPageLoading(false);
    };

    if (!authIsLoading) {
      fetchDuels();
    }
  }, [user, authIsLoading]);

  if (isPageLoading || authIsLoading) return <p>Cargando historial de duelos...</p>;
  if (!user) return <p>Debes iniciar sesión para ver tu historial.</p>;

  const wonBets = bets.filter(bet => bet.result === 'win');
  const lostBets = bets.filter(bet => bet.result === 'loss');

  const BetCard = ({ bet }: { bet: Bet }) => {
    const name = bet.opponentId ? opponents[bet.opponentId] : undefined;
    const statusLabel =
      bet.result === 'win'
        ? 'Ganada'
        : bet.result === 'loss'
        ? 'Perdida'
        : bet.status
        ? bet.status
            .toLowerCase()
            .split('_')
            .map(s => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' ')
        : 'Pendiente';
    const formattedDate = new Date(bet.matchDate).toLocaleString('es-CO', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    return (
      <Card className="mb-4 shadow-soft border-border transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl text-primary">Duelo: {bet.modoJuego}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Partida ID: {bet.matchId} <br />
                Fecha y hora: {formattedDate}
              </CardDescription>
            </div>
            <Badge
              className={`capitalize ${
                bet.result === 'win'
                  ? '!bg-success !text-bg'
                  : bet.result === 'loss'
                  ? '!bg-error !text-bg'
                  : ''
              }`}
            >
              {statusLabel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base">
                Inscripción:{' '}
                <span className="font-semibold text-accent">{formatCOP(bet.amount)}</span>
              </p>
              {bet.result !== 'loss' && (
                <p className="text-base">
                  Premio:{' '}
                  <span className="font-semibold text-accent">
                    {formatCOP(bet.prize ?? 0)}
                  </span>
                </p>
              )}
              {name && (
                <p className="text-base">
                  Oponente: <span className="font-semibold">{name}</span>
                </p>
              )}
            </div>
            {bet.result === 'win' && <VictoryIcon className="h-8 w-8 text-green-500" />}
            {bet.result === 'loss' && <DefeatIcon className="h-8 w-8 text-destructive" />}
            {!bet.result && <InfoIcon className="h-8 w-8 text-muted-foreground" />}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/10">
        <div className="flex items-center space-x-3">
          <ScrollTextIcon className="h-8 w-8 text-accent" />
          <CardTitle className="text-3xl font-headline text-primary">Historial de Duelos</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground text-lg pt-1">Aquí verás tus duelos y sus resultados.</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 p-1.5 bg-secondary rounded-lg gap-1.5">
            <TabsTrigger value="all" className="py-2.5 px-3 text-base rounded-md data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-soft hover:bg-primary/20">Todos ({bets.length})</TabsTrigger>
            <TabsTrigger value="ganadas" className="py-2.5 px-3 text-base rounded-md data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-soft hover:bg-primary/20">Ganadas ({wonBets.length})</TabsTrigger>
            <TabsTrigger value="perdidas" className="py-2.5 px-3 text-base rounded-md data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground data-[state=active]:shadow-soft hover:bg-primary/20">Perdidas ({lostBets.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {bets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No tienes Duelos en tu historial todavía.</p>
            ) : (
              bets.map((bet) => <BetCard key={bet.id} bet={bet} />)
            )}
          </TabsContent>
          <TabsContent value="ganadas">
            {wonBets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No has ganado ningun duelo todavía.</p>
            ) : (
              wonBets.map((bet) => <BetCard key={bet.id} bet={bet} />)
            )}
          </TabsContent>
          <TabsContent value="perdidas">
            {lostBets.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No has perdido ningun duelo todavía.</p>
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
