"use client";

import React from "react";
import AuthGuard from "./AuthGuard";
import TopNavbar from "./TopNavbar";
import BottomNav from "./BottomNav";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
        <TopNavbar />
        <main className="flex-grow pt-14 pb-24 px-4">{children}</main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
};

export default MainLayout;
