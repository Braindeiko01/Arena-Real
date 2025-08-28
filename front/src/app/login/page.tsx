
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CrownIcon, GoogleIcon } from '@/components/icons/ClashRoyaleIcons';
import { useToast } from "@/hooks/use-toast";
import { loginWithGoogleAction } from '@/lib/actions';
import type { User, GoogleAuthValues } from '@/types';
import { Button } from '@/components/ui/button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const authContext = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authContext.isAuthenticated) {
      router.push('/home');
    }
  }, [authContext.isAuthenticated, router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Usar Firebase Authentication para el popup de Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const googleUser = result.user;

      if (!googleUser.email) {
        toast({ title: "Error de autenticación", description: "No se pudo obtener el email de la cuenta de Google.", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      
      const googleAuthData: GoogleAuthValues = {
        googleId: googleUser.uid,
        email: googleUser.email,
        username: googleUser.displayName || `User${googleUser.uid.substring(0, 5)}`,
        avatarUrl: googleUser.photoURL || `https://placehold.co/100x100.png?text=${googleUser.displayName?.[0] || 'U'}`,
      };

      const response = await loginWithGoogleAction(googleAuthData);
      console.log("response")
      console.log(response)
      if (response.needsProfileCompletion) {
          try {
            // Almacenar los datos de Google para pre-rellenar el formulario de registro
            sessionStorage.setItem('pendingGoogleAuthData', JSON.stringify(googleAuthData));
            router.push('/register'); 
          } catch (e) {
            console.error("Error setting sessionStorage:", e);
            toast({ title: "Error de Sesión", description: "No se pudo guardar la información temporal. Intenta de nuevo.", variant: "destructive"});
          }
      } else if (response.user) {
         authContext.login(response.user as User);
         toast({ title: "¡Bienvenido de nuevo!", description: `Hola ${response.user.username}`, variant: "default" });
         router.push('/home');
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

  if (authContext.isLoading) {
    return <p>Verificando autenticación...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 font-body animate-fade-in-up">
      <Card className="w-full max-w-md shadow-card-medieval border-2 border-accent">
        <CardHeader className="text-center">
          <CrownIcon className="mx-auto h-16 w-16 text-accent mb-4" />
          <CardTitle className="text-4xl font-headline text-accent">Iniciar Sesión</CardTitle>
          <CardDescription className="text-muted-foreground text-base">
            Accede a tu cuenta de Arena Real para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 text-center space-y-4">
          <CartoonButton 
            onClick={handleGoogleLogin} 
            className="w-full" 
            variant="default" 
            disabled={isLoading}
            iconLeft={<GoogleIcon className="h-6 w-6"/>}
          >
            {isLoading ? 'Conectando...' : 'Iniciar Sesión con Google'}
          </CartoonButton>
          <p className="text-sm text-muted-foreground">
            El inicio de sesión tradicional con teléfono y contraseña no está disponible. Por favor, usa Google.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-1 mt-4">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?
          </p>
          <Button variant="link" asChild className="text-primary hover:text-accent font-semibold text-base">
            <Link href="/register">Regístrate Aquí</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
