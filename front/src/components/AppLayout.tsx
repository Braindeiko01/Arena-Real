
"use client";

import React from 'react';
import TopNavbar from './TopNavbar';
import Navbar from './Navbar';
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
        <TopNavbar />
        <Navbar />
        <main
          className={cn(
            'flex-grow container mx-auto px-4 pt-24 pb-24 md:px-6 md:pb-8 lg:px-8 lg:pb-10 animate-fade-in-up',
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
