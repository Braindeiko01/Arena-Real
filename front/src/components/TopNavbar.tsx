"use client";

import Link from "next/link";
import { Bell, Crown } from "lucide-react";
<<<<<<< codex/reemplazar-encabezado-para-móviles
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
=======
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const TopNavbar = () => {
  const { user } = useAuth();
  const notifications = [
    { id: 1, title: "Tienes un nuevo duelo pendiente" },
    { id: 2, title: "Saldo depositado correctamente" },
  ];
>>>>>>> devloper

  return (
    <header className="md:hidden fixed top-0 w-full z-50 flex h-14 items-center justify-between bg-[#3973FF] px-4 py-2 shadow-sm">
      <div className="flex items-center gap-1 text-white font-bold text-lg">
        <Crown className="h-5 w-5" />
        Arena Real
      </div>

<<<<<<< codex/reemplazar-encabezado-para-móviles
      <div className="flex items-center justify-center">
        <div className="relative">
          <Bell className="h-5 w-5 text-white" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </div>
        <span className="ml-2 text-white text-sm font-medium">braindeiko</span>
=======
      {/* Username and notifications */}
      <div className="flex flex-1 items-center justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative mr-1 flex items-center" aria-label="Notificaciones">
              <Bell className="h-5 w-5 text-white" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="center"
              side="bottom"
              sideOffset={4}
              className="bg-white text-sm text-gray-800 rounded shadow-md"
            >
              {notifications.length === 0 ? (
                <div className="px-3 py-2">No tienes notificaciones</div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenu.Item
                    key={n.id}
                    className="hover:bg-gray-100 rounded px-3 py-2 cursor-pointer outline-none"
                  >
                    {n.title}
                  </DropdownMenu.Item>
                ))
              )}
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <span className="text-sm font-medium text-white">
          {user?.username || "braindeiko"}
        </span>
>>>>>>> devloper
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
