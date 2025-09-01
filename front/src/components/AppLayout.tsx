
"use client";

import React from 'react';
import Navbar from './Navbar';
import TopNavbar from './TopNavbar';
import BottomNav from './BottomNav';
import AuthGuard from './AuthGuard';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="theme-arena bg-bg-0 text-text-1 flex flex-col min-h-screen font-body">
        <TopNavbar />
        <Navbar />
        <main className="flex-grow max-w-[1200px] mx-auto px-4 md:px-6 pb-20 md:pb-0">
          {children}
        </main>
        <footer className="bg-bg-1 text-center py-4 text-sm text-text-2 font-headline z-0">
          Arena Real &copy; {new Date().getFullYear()}
        </footer>
        <BottomNav />
      </div>
    </AuthGuard>
  );
};

export default AppLayout;
