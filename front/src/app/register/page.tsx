
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { CrownIcon, PhoneIcon, RegisterIcon, UserIcon as AppUserIcon, GoogleIcon } from '@/components/icons/ClashRoyaleIcons';
import { LinkIcon as LucideLinkIcon } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { CompleteProfileFormValues, GoogleAuthValues, RegisterWithGoogleData, User } from '@/types';
import { registerUserAction, loginWithGoogleAction } from '@/lib/actions';

// Schema para el segundo paso: completar perfil
const completeProfileSchema = z.object({
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").max(20, "El nombre de usuario no puede exceder los 20 caracteres"),
  phone: z.string().min(7, "El número de teléfono debe tener al menos 7 dígitos").regex(/^\d+$/, "El número de teléfono solo debe contener dígitos"),
  friendLink: z.string()
    .min(1, "El link de amigo es requerido.")
    .url({ message: "Por favor, introduce una URL válida." })
    .refine(link => link.startsWith("https://link.clashroyale.com/"), {
        message: "El link debe ser de Clash Royale (link.clashroyale.com)"
    }),
  referralCode: z.string().optional(),
});

export default function RegisterPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [googleAuthData, setGoogleAuthData] = useState<GoogleAuthValues | null>(null);
  const [step, setStep] = useState(1);

  const form = useForm<CompleteProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      username: '',
      phone: '',
      friendLink: '',
      referralCode: '',
    },
  });

  useEffect(() => {
    if (auth.isAuthenticated) {
      router.push('/');
    }
  }, [auth.isAuthenticated, router]);

  useEffect(() => {
    // Si llegamos a esta página por una redirección desde el login
    if (step === 1) {
      try {
        const pendingData = sessionStorage.getItem('pendingGoogleAuthData');
        if (pendingData) {
          const parsedData = JSON.parse(pendingData) as GoogleAuthValues;
          setGoogleAuthData(parsedData);
          setStep(2);
        }
      } catch (e) {
        console.error("Could not parse pending Google auth data from sessionStorage", e);
        sessionStorage.removeItem('pendingGoogleAuthData');
      }
    }
  }, [step]);
  
  useEffect(() => {
    if (step === 2 && googleAuthData) {
      form.reset({
        username: googleAuthData.username || '',
        phone: '',
        friendLink: '',
        referralCode: '',
      });
    }
  }, [step, googleAuthData, form]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const googleUser = result.user;

      if (!googleUser.email) {
        toast({ title: "Error de autenticación", description: "No se pudo obtener el email de la cuenta de Google.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      
      const realGoogleData: GoogleAuthValues = {
        googleId: googleUser.uid,
        email: googleUser.email,
        username: googleUser.displayName || `User${googleUser.uid.substring(0, 5)}`,
        avatarUrl: googleUser.photoURL || `https://placehold.co/100x100.png?text=${googleUser.displayName?.[0] || 'U'}`,
      };

      const response = await loginWithGoogleAction(realGoogleData);
      
      if (response.needsProfileCompletion) {
          setGoogleAuthData(realGoogleData);
          setStep(2);
          toast({ title: "Conectado con Google", description: `Hola ${realGoogleData.username}, por favor completa tu perfil.`});
      } else if (response.user){
          auth.login(response.user as User);
          router.push('/');
      } else {
          toast({ title: "Error", description: response.error || "No se pudo iniciar sesión.", variant: "destructive" });
      }

    } catch (error: any) {
       if (error.code !== 'auth/popup-closed-by-user') {
        toast({ title: "Error de autenticación", description: error.message || "Ocurrió un error inesperado.", variant: "destructive" });
      }
    }
    
    setIsLoading(false);
  };


  const onSubmitProfile: SubmitHandler<CompleteProfileFormValues> = async (profileData) => {
    if (!googleAuthData) {
      toast({ title: "Error", description: "No se encontraron datos de Google. Por favor, intenta de nuevo.", variant: "destructive"});
      setStep(1);
      return;
    }
    setIsLoading(true);

      const fullRegistrationData: RegisterWithGoogleData = {
        googleId: googleAuthData.googleId,
        email: googleAuthData.email || '',
        username: profileData.username,
        avatarUrl: googleAuthData.avatarUrl,
        phone: profileData.phone,
        friendLink: profileData.friendLink,
      referralCode: profileData.referralCode || undefined,
    };

    console.log(fullRegistrationData)
    const result = await registerUserAction(fullRegistrationData);

    if (result.user) {
      sessionStorage.removeItem('pendingGoogleAuthData');
      auth.login(result.user as User);
      toast({
        title: "¡Registro Exitoso!",
        description: `¡Bienvenido a Arena Real, ${result.user.username}!`,
        variant: "default",
      });
      router.push('/');
    } else if (result.error) {
      toast({
        title: "Error de Registro",
        description: result.error,
        variant: "destructive",
      });
      if (result.error.includes("ya está registrado") || result.error.includes("ya está en uso")) {
        setStep(1); 
      }
    }
    setIsLoading(false);
  };
  
  const handleCancelAndGoBack = () => {
    setStep(1);
    setGoogleAuthData(null);
    sessionStorage.removeItem('pendingGoogleAuthData');
    form.reset({ username: '', phone: '', friendLink: '', referralCode: '' });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-body animate-fade-in-up">
      <Card className="w-full max-w-lg shadow-card-medieval border-2 border-accent">
        <CardHeader className="text-center">
          <CrownIcon className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="text-4xl font-headline text-accent">
            {step === 1 ? "Crea Tu Cuenta" : `Completa tu Perfil, ${googleAuthData?.username || ''}`}
          </CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            {step === 1 ? "¡Únete a Arena Real y empieza a apostar!" : "Necesitamos unos detalles más para empezar."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <CartoonButton 
              onClick={handleGoogleSignIn} 
              className="w-full" 
              variant="default" 
              disabled={isLoading}
              iconLeft={<GoogleIcon className="h-6 w-6"/>}
            >
              {isLoading ? 'Conectando...' : 'Continuar con Google'}
            </CartoonButton>
          )}

          {step === 2 && googleAuthData && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-foreground flex items-center"><AppUserIcon className="mr-2 h-5 w-5 text-primary" />Nombre de Usuario</FormLabel>
                      <FormControl>
                        <Input placeholder="Elige tu nombre de usuario" {...field} className="text-base py-5 border-2 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-foreground flex items-center"><PhoneIcon className="mr-2 h-5 w-5 text-primary" />Número de teléfono - Nequi</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="ej. 3001234567" {...field} className="text-base py-5 border-2 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">Este número se usará para tu cuenta y para transacciones Nequi.</p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="friendLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-foreground flex items-center"><LucideLinkIcon className="mr-2 h-5 w-5 text-primary" />Link de Amigo de Clash Royale</FormLabel>
                      <FormControl>
                        <Input placeholder="https://link.clashroyale.com/..." {...field} className="text-base py-5 border-2 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground mt-1">Tu Tag de jugador (ej. #P01Y2G3R) se extraerá automáticamente de este link.</p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg text-foreground">Código de referido (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="ABCD1234" {...field} className="text-base py-5 border-2 focus:border-primary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <CartoonButton type="submit" variant="accent" className="w-full mt-8" disabled={isLoading} iconLeft={<RegisterIcon />}>
                  {isLoading ? 'Registrando...' : 'Completar Registro y Jugar'}
                </CartoonButton>
                 <Button variant="outline" onClick={handleCancelAndGoBack} className="w-full mt-3">
                    Cancelar y Volver
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-1 mt-4">
          <p className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?
          </p>
          <Button variant="link" asChild className="text-primary hover:text-accent font-semibold text-base">
            <Link href="/login">Inicia Sesión Aquí</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
