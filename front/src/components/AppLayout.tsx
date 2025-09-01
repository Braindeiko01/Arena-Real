
"use client";

import React from 'react';
import Navbar from './Navbar';
import TopNavbar from './TopNavbar';
import BottomNav from './BottomNav';
import AuthGuard from './AuthGuard';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen text-text-primary font-ui">
        <div className="md:hidden">
          <TopNavbar />
        </div>
        <div className="hidden md:block">
          <Navbar />
        </div>
        <main className="flex-grow container mx-auto px-4 pt-16 pb-24 md:pt-8 md:pb-8 md:px-6 lg:px-8 lg:py-10 animate-fade-in-up">
          {children}
        </main>
        <footer className="text-center py-4 text-sm text-primary-light/70 font-headline">
          Arena Real &copy; {new Date().getFullYear()}
        </footer>
        <BottomNav />
      </div>
    </AuthGuard>
  );
};

export default AppLayout;
