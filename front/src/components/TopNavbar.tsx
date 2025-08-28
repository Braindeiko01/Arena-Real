"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/useAuth";
import useNotifications from "@/hooks/useNotifications";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotifications();
  const avatarSrc = (user as any)?.image || user?.avatarUrl;

  return (
    <header className="md:hidden navbar h-16 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-1 font-bold text-lg text-[color:var(--gold)] fantasy-text">
        <Image src="/logo.png" alt="Arena Real logo" width={20} height={20} className="h-5 w-5" />
        Arena Real
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Notificaciones" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuItem
              onSelect={markAllRead}
              className="text-xs justify-center text-[color:var(--gold)]"
            >
              Marcar todas como leídas
            </DropdownMenuItem>
            <ScrollArea className="h-40">
              {notifications.length === 0 ? (
                <div className="p-2 text-sm text-center text-muted-foreground">Sin notificaciones</div>
              ) : (
                notifications.map(n => (
                  <DropdownMenuItem
                    key={n.id}
                    onSelect={() => markAsRead(n.id)}
                    className={n.read ? '' : 'font-bold'}
                  >
                    {n.message}
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 focus-visible:outline-none transition-transform hover:scale-105">
              <span className="text-sm font-medium">
                {user?.username || 'Invitado'}
              </span>
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarSrc} alt={user?.username} className="w-8 h-8 rounded-full" />
              ) : (
                <span className="rounded-full bg-[var(--gold)] text-[#141414] w-8 h-8 flex items-center justify-center">
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
