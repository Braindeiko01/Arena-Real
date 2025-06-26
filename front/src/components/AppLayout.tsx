
"use client";

import React from 'react';
import Navbar from './Navbar';
import AuthGuard from './AuthGuard';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10 animate-fade-in-up">
          {children}
        </main>
        <footer className="bg-primary/10 text-center py-4 text-sm text-foreground/70 font-headline">
          Arena Real &copy; {new Date().getFullYear()}
        </footer>
      </div>
    </AuthGuard>
  );
};

export default AppLayout;
