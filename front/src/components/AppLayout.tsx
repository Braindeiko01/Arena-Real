
"use client";

import React from 'react';
import Navbar from './Navbar';
import TopNavbar from './TopNavbar';
import BottomNav from './BottomNav';
import AuthGuard from './AuthGuard';
import { cn } from '@/lib/utils';
interface AppLayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
}

const AppLayout = ({ children, mainClassName }: AppLayoutProps) => {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-bg-0 text-text-1 font-body">
        <div className="md:hidden">
          <TopNavbar />
        </div>
        <div className="hidden md:block">
          <Navbar />
        </div>
        <main
          className={cn(
            'flex-grow container mx-auto px-4 pt-16 pb-24 md:pt-8 md:pb-8 md:px-6 lg:px-8 lg:py-10 animate-fade-in-up',
            mainClassName
          )}
        >
          {children}
        </main>
        <footer className="bg-bg-1 text-center py-4 text-sm text-text-2 font-headline">
          Arena Real &copy; {new Date().getFullYear()}
        </footer>
        <BottomNav />
      </div>
    </AuthGuard>
  );
};

export default AppLayout;
