
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SaldoIcon, FindMatchIcon } from '@/components/icons/ClashRoyaleIcons';
import { useToast } from "@/hooks/use-toast";
import { Coins, UploadCloud, Swords, Layers, Banknote, Loader2 } from 'lucide-react';
import { requestTransactionAction, matchmakingAction } from '@/lib/actions';
import useTransactionUpdates from '@/hooks/useTransactionUpdates';
import useMatchmakingSse from '@/hooks/useMatchmakingSse';


const HomePageContent = () => {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  useTransactionUpdates();

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositScreenshotFile, setDepositScreenshotFile] = useState<File | null>(null);
  const [isDepositLoading, setIsDepositLoading] = useState(false);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);

  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleMatchFound = (data: { apuestaId: string; jugadorOponenteId: string; jugadorOponenteTag: string; }) => {
    console.log('Match encontrado via SSE:', data);
    setIsSearching(false);
    toast({ title: 'Duelo encontrado', description: 'Abriendo chat con tu oponente...' });
    router.push(
      `/chat/${data.apuestaId}?opponentTag=${encodeURIComponent(data.jugadorOponenteTag)}&opponentGoogleId=${encodeURIComponent(data.jugadorOponenteId)}`
    );
  };

  useMatchmakingSse(isSearching ? user?.id : undefined, handleMatchFound);

  useEffect(() => {
    console.log("¡La página de inicio se ha cargado en el frontend! Puedes ver este mensaje en la consola del navegador.");
    if (user) {
      console.log("Datos del usuario actualmente en el estado del frontend:", user);
    }
  }, [user]);

  if (!user) {
    return <p>Cargando datos del usuario...</p>;
  }

  const handleFindMatch = async (mode: 'CLASICO' | 'TRIPLE_ELECCION') => {
    if (!user.id) {
      toast({
        title: "Error de Usuario",
        description: "Falta el ID de usuario.",
        variant: "destructive",
      });
      return;
    }
    if (user.balance < 6000) {
      toast({
        title: "Saldo Insuficiente",
        description:
          "Necesitas al menos $6,000 COP para buscar un duelo. Por favor, deposita saldo.",
        variant: "destructive",
      });
      return;
    }

    console.log('Iniciando matchmaking con', { userId: user.id, mode });
    const result = await matchmakingAction(user.id,  mode, 6000 );
    console.log('Resultado de matchmakingAction:', result);

    if (result.error) {
      toast({
        title: "Error de Emparejamiento",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);

    if (
      result.match &&
      result.match.apuestaId &&
      result.match.jugadorOponenteId &&
      result.match.jugadorOponenteTag
    ) {
      handleMatchFound(result.match);
    }
  };

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
    if (!user || !user.id) { // user.id es googleId
      toast({ title: "Error", description: "Usuario no identificado.", variant: "destructive" });
      return;
    }
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0 || amount < 6000 || amount % 6000 !== 0) {
      toast({
        title: "Monto Inválido",
        description: "El monto del depósito debe ser un mínimo de 6,000 COP y en múltiplos de 6,000 COP.",
        variant: "destructive",
      });
      return;
    }
    if (!depositScreenshotFile) {
      toast({ title: "Comprobante Requerido", description: "Por favor, adjunta el comprobante.", variant: "destructive" });
      return;
    }

    setIsDepositLoading(true);
    // TODO: La subida de archivos (depositScreenshotFile) necesitará un manejo especial.
    // requestTransactionAction actualmente no maneja la subida de archivos.
    // Esto es una simplificación; en una app real, subirías el archivo a un storage
    // y pasarías la URL del archivo al backend, o el backend tendría un endpoint para multipart/form-data.
    const result = await requestTransactionAction(user.id, amount, "DEPOSITO"); // user.id es googleId
    setIsDepositLoading(false);

    if (result.transaction) {
      toast({
        title: "¡Solicitud de Depósito Recibida!",
        description: `Has solicitado un depósito de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)}. Tu comprobante (${depositScreenshotFile.name}) está siendo revisado. Tu saldo se actualizará una vez verificado (ID Transacción: ${result.transaction.id}).`,
        variant: "default",
      });
      await refreshUser();
      setIsDepositModalOpen(false);
      setDepositAmount('6000');
      setDepositScreenshotFile(null);
    } else {
      toast({
        title: "Error de Depósito",
        description: result.error || "No se pudo procesar la solicitud de depósito.",
        variant: "destructive",
      });
    }
  };

  // Withdraw Modal Logic
  const handleOpenWithdrawModal = () => {
    if (!user.nequiAccount) {
      toast({
        title: "Cuenta Nequi no configurada",
        description: "Por favor, configura tu número de Nequi en tu perfil para poder retirar.",
        variant: "destructive",
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
    if (!user || !user.id) { // user.id es googleId
      toast({ title: "Error", description: "Usuario no identificado.", variant: "destructive" });
      return;
    }
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Monto Inválido", description: "Ingresa un monto válido.", variant: "destructive" });
      return;
    }
    if (amount > user.balance) {
      toast({ title: "Saldo Insuficiente", description: "No puedes retirar más de tu saldo.", variant: "destructive" });
      return;
    }

    setIsWithdrawLoading(true);
    const result = await requestTransactionAction(user.id, amount, "RETIRO"); // user.id es googleId
    setIsWithdrawLoading(false);

    if (result.transaction) {
      toast({
        title: "¡Solicitud de Retiro Recibida!",
        description: `Has solicitado un retiro de ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount)} a tu cuenta Nequi ${user.nequiAccount}. Se procesará pronto (ID Transacción: ${result.transaction.id}).`,
        variant: "default",
      });
      await refreshUser();
      setIsWithdrawModalOpen(false);
      setWithdrawAmount('');
    } else {
      toast({
        title: "Error de Retiro",
        description: result.error || "No se pudo procesar la solicitud de retiro.",
        variant: "destructive",
      });
    }
  };

  // Matchmaking Modal Logic
  const handleOpenModeModal = () => {
    if (user.balance < 6000) {
      toast({
        title: "Saldo Insuficiente",
        description: "Necesitas al menos $6,000 COP para buscar un duelo. Por favor, deposita saldo.",
        variant: "destructive",
      });
      return;
    }
    setIsModeModalOpen(true);
  };

  const handleModeSelect = async (mode: 'CLASICO' | 'TRIPLE_ELECCION  ') => {
    setIsModeModalOpen(false);
    await handleFindMatch(mode);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
  };


  return (
    <div className="space-y-8">
      <Card className="bg-card/80 backdrop-blur-sm shadow-card-medieval border-2 border-primary-dark overflow-hidden">
        <CardHeader className="bg-primary/10 p-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20 border-4 border-accent shadow-lg">
              <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png?text=${user.username?.[0] || 'U'}`} alt={user.username} data-ai-hint="gaming avatar" />
              <AvatarFallback className="text-3xl bg-primary/30 text-primary-foreground">{user.username?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-3xl font-headline text-primary">{user.username}</CardTitle>
              <CardDescription className="text-muted-foreground text-lg">¡Bienvenido de nuevo, Duelista!</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end text-2xl font-bold text-accent">
              <SaldoIcon className="h-7 w-7 mr-2" />
              {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}
            </div>
            <p className="text-sm text-muted-foreground">Saldo Actual</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CartoonButton
              size="medium"
              variant="default"
              onClick={handleOpenDepositModal}
              className="flex-1 text-lg py-3"
              iconLeft={<Coins className="h-6 w-6" />}
              disabled={isDepositLoading}
            >
              {isDepositLoading ? "Procesando..." : "Depositar Saldo"}
            </CartoonButton>
            <CartoonButton
              size="medium"
              variant="accent"
              onClick={handleOpenWithdrawModal}
              className="flex-1 text-lg py-3"
              iconLeft={<Banknote className="h-6 w-6" />}
              disabled={user.balance === 0 || !user.nequiAccount || isWithdrawLoading}
            >
              {isWithdrawLoading ? "Procesando..." : "Retirar Saldo"}
            </CartoonButton>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm shadow-card-medieval border-2 border-primary-dark">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary flex items-center justify-center">
            <FindMatchIcon className="mr-3 h-8 w-8 text-accent" />
            Buscar Duelo
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Elige tu modo de juego preferido. ¡La apuesta es de $6,000 COP! El ganador se lleva $11,000 COP (después de una comisión de $1,000 COP).
            <br /> Necesitas tener al menos $6,000 COP de saldo.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex justify-center">
          <CartoonButton
            onClick={handleOpenModeModal}
            className="w-full sm:w-auto"
            iconLeft={<Swords className="h-6 w-6" />}
            disabled={user.balance < 6000}
          >
            Buscar Oponente
          </CartoonButton>
        </CardContent>
      </Card>

      {/* Mode Select Modal */}
      {isModeModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md shadow-xl border-2 border-accent">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">Selecciona Modo</CardTitle>
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
              <CartoonButton variant="secondary" size="small" onClick={() => setIsModeModalOpen(false)}>Cancelar</CartoonButton>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Searching Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-sm shadow-xl border-2 border-accent text-center space-y-6 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-headline text-primary">Buscando oponente...</CardTitle>
            </CardHeader>
            <CardContent>
              <Loader2 className="h-12 w-12 mx-auto text-accent animate-spin" />
            </CardContent>
            <CardFooter className="flex justify-end">
              <CartoonButton variant="secondary" size="small" onClick={handleCancelSearch}>
                Cancelar
              </CartoonButton>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md shadow-xl border-2 border-accent">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">Depositar Saldo</CardTitle>
              <CardDescription className="text-center text-muted-foreground mt-2">
                Realiza una transferencia Nequi a la cuenta <strong className="text-primary">305-288-1517</strong>.
                El monto del depósito debe ser un <strong className="text-primary">mínimo de 6,000 COP</strong> y en <strong className="text-primary">múltiplos de 6,000 COP</strong> (ej. 6.000, 12.000, 18.000, etc.).
                Luego, ingresa el monto exacto y adjunta el comprobante.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <Label htmlFor="depositAmount" className="text-lg text-foreground mb-2 block">
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
                <Label htmlFor="depositScreenshot" className="text-lg text-foreground mb-2 block flex items-center">
                  <UploadCloud className="mr-2 h-5 w-5 text-primary" /> Adjuntar Comprobante Nequi
                </Label>
                <Input
                  id="depositScreenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setDepositScreenshotFile(e.target.files ? e.target.files[0] : null)}
                  className="h-12 w-full border border-input rounded-md px-3 py-2 text-base file:bg-primary file:text-primary-foreground hover:file:bg-primary-dark file:rounded-md file:border-0 file:px-4 file:py-2 file:mr-3 file:font-semibold"
                />
                {depositScreenshotFile && <p className="text-sm text-muted-foreground mt-2">Seleccionado: {depositScreenshotFile.name}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 pt-0 mt-6">
              <CartoonButton variant="secondary" onClick={handleCloseDepositModal} className="w-full sm:w-auto" size="small" disabled={isDepositLoading}>Cancelar</CartoonButton>
              <CartoonButton
                variant="default"
                onClick={handleDepositConfirm}
                className="w-full sm:w-auto"
                size="small"
                iconLeft={<Coins className="h-5 w-5" />}
                disabled={!depositAmount || parseFloat(depositAmount) < 6000 || parseFloat(depositAmount) % 6000 !== 0 || !depositScreenshotFile || isDepositLoading}
              >
                {isDepositLoading ? "Confirmando..." : "Confirmar Depósito"}
              </CartoonButton>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <Card className="w-full max-w-md shadow-xl border-2 border-accent">
            <CardHeader>
              <CardTitle className="text-3xl font-headline text-accent text-center">Retirar Saldo</CardTitle>
              <CardDescription className="text-center text-muted-foreground mt-2">
                Ingresa el monto que deseas retirar. El dinero se enviará a tu cuenta Nequi registrada: <strong className="text-primary">{user.nequiAccount || 'No configurada'}</strong>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div>
                <Label htmlFor="withdrawAmount" className="text-lg text-foreground mb-2 block">
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
                <p className="text-xs text-muted-foreground mt-1">Saldo disponible para retirar: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(user.balance)}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-6 pt-0 mt-6">
              <CartoonButton variant="secondary" onClick={handleCloseWithdrawModal} className="w-full sm:w-auto" size="small" disabled={isWithdrawLoading}>Cancelar</CartoonButton>
              <CartoonButton
                variant="default"
                onClick={handleWithdrawConfirm}
                className="w-full sm:w-auto"
                size="small"
                iconLeft={<Banknote className="h-5 w-5" />}
                disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > user.balance || isWithdrawLoading}
              >
                {isWithdrawLoading ? "Confirmando..." : "Confirmar Retiro"}
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

