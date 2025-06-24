
"use client";

import React from 'react';
import AppHeader from './AppHeader';
import AuthGuard from './AuthGuard';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <AppHeader />
        <main className="flex-grow container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 animate-fade-in-up">
          {children}
        </main>
        <footer className="bg-primary/10 text-center py-4 text-sm text-foreground/70 font-headline">
          CR Duels &copy; {new Date().getFullYear()} - Bet Responsibly
        </footer>
      </div>
    </AuthGuard>
  );
};

export default AppLayout;
