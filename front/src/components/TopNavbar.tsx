"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell } from "@/components/icons/lazy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import useNotifications from "@/hooks/useNotifications";

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotifications();
  const avatarSrc =
    user?.avatarUrl && !user.avatarUrl.includes('googleusercontent')
      ? user.avatarUrl
      : undefined;

  return (
    <header className="md:hidden navbar fixed top-0 left-0 right-0 z-50 h-16 px-4 py-3 flex justify-between items-center">
      <div className="flex items-center gap-1 font-bold text-lg text-[color:var(--gold)] fantasy-text">
        <Image src="/logo.png" alt="Arena Real logo" width={32} height={32} className="h-8 w-8" />
        Arena Real
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Notificaciones"
              className="relative p-2 h-10 w-10 rounded-full border-0 gap-0"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              )}
            </Button>
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
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto w-auto rounded-full gap-0 hover:scale-105"
            >
              <Avatar className="h-8 w-8">
                {avatarSrc && (
                  <AvatarImage
                    src={avatarSrc}
                    alt={user?.username || 'avatar'}
                    data-ai-hint="gaming avatar"
                  />
                )}
                <AvatarFallback>
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
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
