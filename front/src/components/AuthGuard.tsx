"use client";

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    // Show a loading state, perhaps a full-page spinner or skeleton
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Skeleton className="h-12 w-12 rounded-full bg-primary/20 mb-4" />
        <Skeleton className="h-8 w-64 bg-primary/20 mb-2" />
        <Skeleton className="h-6 w-48 bg-primary/20" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // This will be briefly shown before redirect effect kicks in
    // Or, if redirect fails for some reason, prevents rendering children
    return null; 
  }

  return <>{children}</>;
};

export default AuthGuard;
