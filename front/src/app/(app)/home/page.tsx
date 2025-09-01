'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/Card';
import { StatTile } from '@/components/ui/StatTile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SaldoIcon } from '@/components/icons/ClashRoyaleIcons';
import { useToast } from '@/hooks/use-toast';
import {
  Coins,
  UploadCloud,
  Swords,
  Layers,
  Banknote,
  Loader2,
} from '@/components/icons/lazy';
import HelmetIcon from '@/components/icons/Helmet';
import {
  requestTransactionAction,
  matchmakingAction,
  cancelMatchmakingAction,
  declineMatchAction,
  acceptMatchAction,
} from '@/lib/actions';
import useMatchmakingSse, { MatchEventData } from '@/hooks/useMatchmakingSse';
import { setLocalStorageItem } from '@/lib/storage';
import { ACTIVE_CHAT_KEY } from '@/hooks/useActiveChat';

const HomePageContent = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const storedUserId =
    typeof window !== 'undefined'
      ? localStorage.getItem('cr_duels_user_id')
      : null;

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositScreenshotFile, setDepositScreenshotFile] =
    useState<File | null>(null);
  const [isDepositLoading, setIsDepositLoading] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  const [isModeModalOpen, setIsModeModalOpen] = useState(false);

  const [isSearching, setIsSearching] = useState(false);
  const [pendingMatch, setPendingMatch] = useState<{
    apuestaId: string;
    partidaId: string;
    jugadorOponenteId: string;
    jugadorOponenteTag: string;
    jugadorOponenteNombre: string;
    chatId?: string;
  } | null>(null);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [opponentAccepted, setOpponentAccepted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMatchFound = (data: MatchEventData) => {
    console.log('Match encontrado via SSE:', data);
    setIsSearching(false);
    setTimeLeft(25);
    setPendingMatch({ ...data, chatId: undefined });
    setHasAccepted(false);
    setOpponentAccepted(false);
  };

  const handleChatReady = (data: MatchEventData) => {
    if (
      hasAccepted &&
      pendingMatch &&
      pendingMatch.partidaId === data.partidaId
    ) {
      if (data.chatId) {
        toast({
          title: 'Duelo encontrado',
          description: 'Abriendo chat con tu oponente...',
        });
        setLocalStorageItem(ACTIVE_CHAT_KEY, data.chatId);
        router.push(
          `/chat/${data.chatId}?partidaId=${data.partidaId}&opponentTag=${encodeURIComponent(data.jugadorOponenteNombre)}&opponentGoogleId=${encodeURIComponent(data.jugadorOponenteId)}`
        );
        setPendingMatch(null);
        setHasAccepted(false);
        setOpponentAccepted(false);
      } else {
        toast({
          title: 'Esperando al oponente',
          description: 'Se enviará una notificación cuando el chat esté listo.',
        });
      }
    }
  };

  const handleOpponentAccepted = (data: MatchEventData) => {
    if (pendingMatch && pendingMatch.partidaId === data.partidaId) {
      setOpponentAccepted(true);
      toast({
        title: 'Oponente listo',
        description: `${data.jugadorOponenteNombre} ha aceptado el duelo.`,
      });
    }
  };

  const handleMatchCancelled = (data: MatchEventData) => {
    if (pendingMatch && pendingMatch.partidaId === data.partidaId) {
      toast({
        title: 'Duelo cancelado',
        description: `${data.jugadorOponenteNombre} canceló el duelo.`,
      });
      setPendingMatch(null);
      setHasAccepted(false);
      setOpponentAccepted(false);
    }
  };

  const handleMatchValidated = (data: MatchEventData) => {
    toast({
      title: 'Partida validada',
      description: 'Revisa tu historial para ver el resultado.',
    });
    refreshUser();
  };

  useMatchmakingSse(
    user?.id,
    handleMatchFound,
    handleChatReady,
    handleOpponentAccepted,
    handleMatchCancelled,
    handleMatchValidated,
    undefined
  );

  useEffect(() => {
    console.log(
      '¡La página de inicio se ha cargado en el frontend! Puedes ver este mensaje en la consola del navegador.'
    );
    if (user) {
      console.log(
        'Datos del usuario actualmente en el estado del frontend:',
        user
      );
    }
  }, [user]);

  useEffect(() => {
    if (!pendingMatch) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pendingMatch]);

  useEffect(() => {
    if (hasAccepted && opponentAccepted && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [hasAccepted, opponentAccepted]);

  useEffect(() => {
    if (pendingMatch && timeLeft === 0) {
      handleDeclineMatch();
    }
  }, [timeLeft, pendingMatch]);

  if (!user) {
    return <p>Cargando datos del usuario...</p>;
  }

  const handleFindMatch = async (mode: 'CLASICO' | 'TRIPLE_ELECCION') => {
    if (!user.id) {
      toast({
        title: 'Error de Usuario',
        description: 'Falta el ID de usuario.',
        variant: 'error',
      });
      return;
    }
    if (user.balance < 6000) {
      toast({
        title: 'Saldo Insuficiente',
        description:
          'Necesitas al menos $6,000 COP para buscar un duelo. Por favor, deposita saldo.',
        variant: 'error',
      });
      return;
    }

    setIsSearching(true);

    console.log('Iniciando matchmaking con', { userId: user.id, mode });
    const result = await matchmakingAction(user.id, mode, 6000);
    console.log('Resultado de matchmakingAction:', result);

    if (result.error) {
      setIsSearching(false);
      toast({
        title: 'Error de Emparejamiento',
        description: result.error,
        variant: 'error',
      });
      return;
    }

    if (
      result.match &&
      result.match.apuestaId &&
      result.match.partidaId &&
      result.match.jugadorOponenteId &&
      result.match.jugadorOponenteNombre
    ) {
      handleMatchFound(result.match);
    }
  };

  async function handleAcceptMatch() {
    if (!pendingMatch || !user) return;
    setHasAccepted(true);
    const result = await acceptMatchAction(pendingMatch.partidaId, user.id);
    if (result.duel && result.duel.chatId) {
      toast({
        title: 'Duelo encontrado',
        description: 'Abriendo chat con tu oponente...',
      });
      setLocalStorageItem(ACTIVE_CHAT_KEY, result.duel.chatId);
      router.push(
        `/chat/${result.duel.chatId}?partidaId=${result.duel.id}&opponentTag=${encodeURIComponent(pendingMatch.jugadorOponenteNombre)}&opponentGoogleId=${encodeURIComponent(pendingMatch.jugadorOponenteId)}`
      );
      setPendingMatch(null);
      setHasAccepted(false);
    } else {
      toast({
        title: 'Esperando al oponente',
        description: 'Se enviará una notificación cuando el chat esté listo.',
      });
    }
  }

  async function handleDeclineMatch() {
    if (!pendingMatch || !user) return;
    await declineMatchAction(
      user.id,
      pendingMatch.jugadorOponenteId,
      pendingMatch.partidaId
    );
    toast({
      title: 'Duelo cancelado',
      description: 'No se iniciará este duelo.',
    });
    setPendingMatch(null);
  }

  // Deposit Modal Logic
  const handleOpenDepositModal = () => {
    setIsDepositModalOpen(true);
    setDepositAmount('6000');
    setDepositScreenshotFile(null);
  };

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  const handleDepositConfirm = async () => {
    if (!user || !user.id) {
      // user.id es googleId
      toast({
        title: 'Error',
        description: 'Usuario no identificado.',
        variant: 'error',
      });
      return;
    }
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0 || amount < 6000 || amount % 6000 !== 0) {
      toast({
        title: 'Monto Inválido',
        description:
          'El monto del depósito debe ser un mínimo de 6,000 COP y en múltiplos de 6,000 COP.',
        variant: 'error',
      });
      return;
    }
    if (!depositScreenshotFile) {
      toast({
        title: 'Comprobante Requerido',
        description: 'Por favor, adjunta el comprobante.',
        variant: 'error',
      });
      return;
    }
    if (depositScreenshotFile.size > 5 * 1024 * 1024) {
      toast({
        title: 'Archivo muy grande',
        description: 'El comprobante no debe exceder 5 MB.',
        variant: 'error',
      });
      return;
    }

    setIsDepositLoading(true);
    let comprobanteBase64: string | undefined;
    if (depositScreenshotFile) {
      comprobanteBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Error leyendo comprobante'));
        reader.readAsDataURL(depositScreenshotFile);
      });
    }

    const result = await requestTransactionAction(
      user.id,
      amount,
      'DEPOSITO',
      comprobanteBase64
    );
    setIsDepositLoading(false);

    if (result.transaction) {
      toast({
        title: '¡Solicitud de Depósito Recibida!',
        description: `Has solicitado un depósito de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)}. Tu comprobante (${depositScreenshotFile.name}) está siendo revisado. Tu saldo se actualizará una vez verificado (ID Transacción: ${result.transaction.id}).`,
        variant: 'success',
      });
      await refreshUser();
      setIsDepositModalOpen(false);
      setDepositAmount('6000');
      setDepositScreenshotFile(null);
    } else {
      toast({
        title: 'Error de Depósito',
        description:
          result.error || 'No se pudo procesar la solicitud de depósito.',
        variant: 'error',
      });
    }
  };

  // Withdraw Modal Logic
  const handleOpenWithdrawModal = () => {
    if (!user.nequiAccount) {
      toast({
        title: 'Cuenta Nequi no configurada',
        description:
          'Por favor, configura tu número de Nequi en tu perfil para poder retirar.',
        variant: 'error',
      });
      return;
    }
    setIsWithdrawModalOpen(true);
    setWithdrawAmount('');
  };

  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
  };

  const handleWithdrawConfirm = async () => {
    if (!user || !user.id) {
      // user.id es googleId
      toast({
        title: 'Error',
        description: 'Usuario no identificado.',
        variant: 'error',
      });
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Monto Inválido',
        description: 'Ingresa un monto válido.',
        variant: 'error',
      });
      return;
    }
    if (amount > user.balance) {
      toast({
        title: 'Saldo Insuficiente',
        description: 'No puedes retirar más de tu saldo.',
        variant: 'error',
      });
      return;
    }

    setIsWithdrawLoading(true);
    const result = await requestTransactionAction(user.id, amount, 'RETIRO'); // user.id es googleId
    setIsWithdrawLoading(false);

    if (result.transaction) {
      toast({
        title: '¡Solicitud de Retiro Recibida!',
        description: `Has solicitado un retiro de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)} a tu cuenta Nequi ${user.nequiAccount}. Se procesará pronto (ID Transacción: ${result.transaction.id}).`,
        variant: 'success',
      });
      await refreshUser();
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
    } else {
      toast({
        title: 'Error de Retiro',
        description:
          result.error || 'No se pudo procesar la solicitud de retiro.',
        variant: 'error',
      });
    }
  };

  // Matchmaking Modal Logic
  const handleOpenModeModal = () => {
    if (user.balance < 6000) {
      toast({
        title: 'Saldo Insuficiente',
        description:
          'Necesitas al menos $6,000 COP para buscar un duelo. Por favor, deposita saldo.',
        variant: 'error',
      });
      return;
    }
    setIsModeModalOpen(true);
  };

  const handleModeSelect = async (mode: 'CLASICO' | 'TRIPLE_ELECCION') => {
    setIsModeModalOpen(false);
    await handleFindMatch(mode);
  };

  const handleCancelSearch = async () => {
    setIsSearching(false);
    if (user?.id) {
      const result = await cancelMatchmakingAction(user.id);
      if (result.error) {
        toast({
          title: 'Error al cancelar',
          description: result.error,
          variant: 'error',
        });
      } else {
        toast({
          title: 'Búsqueda cancelada',
          description: 'Se canceló la búsqueda de oponente.',
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card className="space-y-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                user.avatarUrl ||
                `https://placehold.co/100x100.png?text=${user.username?.[0] || 'U'}`
              }
              alt={user.username}
              data-ai-hint="gaming avatar"
            />
            <AvatarFallback className="text-3xl">
              {user.username?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-[22px] font-headline flex items-center gap-2">
              <HelmetIcon className="h-6 w-6 text-gold" />
              {user.username}
            </CardTitle>
            <CardDescription>¡Bienvenido de nuevo, Gladiador!</CardDescription>
          </div>
        </div>
        <Card
          variant="alt"
          className="flex flex-col items-center text-center p-6 gap-4"
        >
          <SaldoIcon className="h-6 w-6 text-gold-1" />
          <span className="text-5xl font-bold text-gold-1 leading-none drop-shadow-[0_0_6px_var(--glow)]">
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(user.balance)}
          </span>
          <span className="text-xs text-text-3 uppercase">Saldo actual</span>
          <div className="mt-4 flex w-full flex-col gap-3">
            <Button
              variant="primary"
              onClick={handleOpenDepositModal}
              aria-busy={isDepositLoading}
              disabled={isDepositLoading}
              className="w-full rounded-full h-12 text-lg shadow-glow"
            >
              Depositar
            </Button>
            <Button
              variant="primary"
              onClick={handleOpenWithdrawModal}
              aria-busy={isWithdrawLoading}
              disabled={
                user.balance === 0 || !user.nequiAccount || isWithdrawLoading
              }
              className="w-full rounded-full h-12 text-lg shadow-glow"
            >
              Retirar
            </Button>
          </div>
        </Card>
      </Card>

      <Card className="max-w-[920px] mx-auto">
        <CardHeader className="items-center text-center space-y-3">
          <Badge className="gap-2">
            <Swords className="h-5 w-5 text-gold-1" aria-label="duelos" /> En vivo · Duelos
          </Badge>
          <CardTitle className="text-4xl font-headline text-gold-1">
            Buscar Duelo
          </CardTitle>
          <CardDescription className="text-center text-text-2">
            Inscripción $6.000 COP. Ganador recibe $10.800 COP. Requiere saldo ≥
            $6.000.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button
            variant="primary"
            onClick={handleOpenModeModal}
            className="w-full sm:w-auto px-8 py-4 text-xl font-headline shadow-glow"
            disabled={user.balance < 6000}
          >
            <Swords className="h-5 w-5" aria-hidden="true" /> Buscar Oponente
          </Button>
        </CardContent>
      </Card>

      {/* Mode Select Modal */}
      {isModeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">
                Selecciona Modo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex flex-col gap-4">
              <CartoonButton
                onClick={() => handleModeSelect('CLASICO')}
                className="w-full"
                iconLeft={<Swords className="h-6 w-6" />}
              >
                Batalla Clásica
              </CartoonButton>
              <CartoonButton
                onClick={() => handleModeSelect('TRIPLE_ELECCION')}
                className="w-full"
                variant="accent"
                iconLeft={<Layers className="h-6 w-6" />}
              >
                Triple Elección
              </CartoonButton>
            </CardContent>
            <CardFooter className="flex justify-end p-6 pt-0">
              <CartoonButton
                variant="secondary"
                size="small"
                onClick={() => setIsModeModalOpen(false)}
              >
                Cancelar
              </CartoonButton>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Searching Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-sm text-center space-y-6 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">
                Buscando oponente...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-12 w-12 mx-auto text-accent animate-spin" />
            </CardContent>
            <CardFooter className="flex justify-end">
              <CartoonButton
                variant="secondary"
                size="small"
                onClick={handleCancelSearch}
              >
                Cancelar
              </CartoonButton>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Match Found Modal */}
      {pendingMatch && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">
                ¡Duelo encontrado!
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Contra {pendingMatch.jugadorOponenteNombre}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-3 w-full bg-secondary rounded">
                <div
                  className="h-3 bg-accent rounded"
                  style={{
                    width: `${(timeLeft / 25) * 100}%`,
                    transition: 'width 1s linear',
                  }}
                ></div>
              </div>
              {hasAccepted && !opponentAccepted && (
                <p className="text-center text-sm text-muted-foreground">
                  Esperando al oponente...
                </p>
              )}
              {opponentAccepted && !hasAccepted && (
                <p className="text-center text-sm text-muted-foreground">
                  El oponente ya aceptó.
                </p>
              )}
              {hasAccepted && opponentAccepted && (
                <p className="text-center text-sm text-muted-foreground">
                  Preparando el chat...
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-end gap-3">
              <CartoonButton
                variant="secondary"
                size="small"
                onClick={handleDeclineMatch}
              >
                Cancelar
              </CartoonButton>
              {!hasAccepted && (
                <CartoonButton
                  variant="default"
                  size="small"
                  onClick={handleAcceptMatch}
                >
                  Aceptar
                </CartoonButton>
              )}
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">
                Depositar Saldo
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground mt-2">
                Realiza una transferencia Nequi a la cuenta{' '}
                <strong className="text-primary">305-288-1517</strong>. El monto
                del depósito debe ser un{' '}
                <strong className="text-primary">mínimo de 6,000 COP</strong> y
                en{' '}
                <strong className="text-primary">múltiplos de 6,000 COP</strong>{' '}
                (ej. 6.000, 12.000, 18.000, etc.). Luego, ingresa el monto
                exacto y adjunta el comprobante.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <Label
                  htmlFor="depositAmount"
                  className="text-lg text-foreground mb-2 block"
                >
                  Monto a Depositar (COP)
                </Label>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder="ej. 6000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="text-lg py-3 h-12 border-2 focus:border-primary"
                  min="6000"
                  step="6000"
                />
              </div>
              <div>
                <Label
                  htmlFor="depositScreenshot"
                  className="text-lg text-foreground mb-2 block flex items-center"
                >
                  <UploadCloud className="mr-2 h-5 w-5 text-primary" /> Adjuntar
                  Comprobante Nequi
                </Label>
                <Input
                  id="depositScreenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setDepositScreenshotFile(
                      e.target.files ? e.target.files[0] : null
                    )
                  }
                  className="h-12 w-full border border-input rounded-md px-3 py-2 text-base file:bg-primary file:text-primary-foreground hover:file:bg-primary-dark file:rounded-md file:border-0 file:px-4 file:py-2 file:mr-3 file:font-semibold"
                />
                {depositScreenshotFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Seleccionado: {depositScreenshotFile.name}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 pt-0 mt-6">
              <CartoonButton
                variant="secondary"
                onClick={handleCloseDepositModal}
                className="w-full sm:w-auto"
                size="small"
                disabled={isDepositLoading}
              >
                Cancelar
              </CartoonButton>
              <CartoonButton
                variant="default"
                onClick={handleDepositConfirm}
                className="w-full sm:w-auto"
                size="small"
                iconLeft={<Coins className="h-5 w-5" />}
                disabled={
                  !depositAmount ||
                  parseFloat(depositAmount) < 6000 ||
                  parseFloat(depositAmount) % 6000 !== 0 ||
                  !depositScreenshotFile ||
                  isDepositLoading
                }
              >
                {isDepositLoading ? 'Confirmando...' : 'Confirmar Depósito'}
              </CartoonButton>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">
                Retirar Saldo
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground mt-2">
                Ingresa el monto que deseas retirar. El dinero se enviará a tu
                cuenta Nequi registrada:{' '}
                <strong className="text-primary">
                  {user.nequiAccount || 'No configurada'}
                </strong>
                .
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <Label
                  htmlFor="withdrawAmount"
                  className="text-lg text-foreground mb-2 block"
                >
                  Monto a Retirar (COP)
                </Label>
                <Input
                  id="withdrawAmount"
                  type="number"
                  placeholder="ej. 10000"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="text-lg py-3 h-12 border-2 focus:border-primary"
                  min="1"
                  max={user.balance}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Saldo disponible para retirar:{' '}
                  {new Intl.NumberFormat('es-CO', {
                    style: 'currency',
                    currency: 'COP',
                    minimumFractionDigits: 0,
                  }).format(user.balance)}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 pt-0 mt-6">
              <CartoonButton
                variant="secondary"
                onClick={handleCloseWithdrawModal}
                className="w-full sm:w-auto"
                size="small"
                disabled={isWithdrawLoading}
              >
                Cancelar
              </CartoonButton>
              <CartoonButton
                variant="default"
                onClick={handleWithdrawConfirm}
                className="w-full sm:w-auto"
                size="small"
                iconLeft={<Banknote className="h-5 w-5" />}
                disabled={
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) <= 0 ||
                  parseFloat(withdrawAmount) > user.balance ||
                  isWithdrawLoading
                }
              >
                {isWithdrawLoading ? 'Confirmando...' : 'Confirmar Retiro'}
              </CartoonButton>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default function HomePage() {
  return (
    <AppLayout>
      <HomePageContent />
    </AppLayout>
  );
}
