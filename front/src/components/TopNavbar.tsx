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
  const { logout } = useAuth();
  const notifications = 0; // replace with real count when available

  return (
    <header className="md:hidden fixed top-0 w-full z-50 flex h-14 items-center justify-between bg-[#3973FF] px-4 py-2 shadow-sm">
      <div className="flex items-center gap-1 text-white font-bold text-lg">
        <Crown className="h-5 w-5" />
        Arena Real
      </div>

      <div className="flex items-center justify-center">
        <div className="relative">
          <Bell className="h-5 w-5 text-white" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </div>
        <span className="ml-2 text-white text-sm font-medium">braindeiko</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="rounded-full bg-white text-blue-600 w-8 h-8 flex items-center justify-center focus-visible:outline-none">
            B
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem asChild>
            <Link href="/profile">Perfil</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default TopNavbar;
