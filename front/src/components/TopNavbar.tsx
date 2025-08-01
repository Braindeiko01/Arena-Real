"use client";

import Link from "next/link";
import { Bell, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const avatarSrc = (user as any)?.image || user?.avatarUrl;
  const notifications = 0;

  return (
    <header className="md:hidden fixed top-0 w-full z-50 shadow-sm bg-[#3973FF] h-16 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-1 text-white font-bold text-lg">
        <Crown className="h-5 w-5" />
        Arena Real
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="h-5 w-5 text-white" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus-visible:outline-none transition-transform hover:scale-105">
              <span className="text-white text-sm font-medium">
                {user?.username || 'Invitado'}
              </span>
              {avatarSrc ? (
                <img src={avatarSrc} alt={user?.username} className="w-8 h-8 rounded-full" />
              ) : (
                <span className="rounded-full bg-white text-blue-600 w-8 h-8 flex items-center justify-center">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href="/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavbar;
