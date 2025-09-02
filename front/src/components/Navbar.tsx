"use client";

import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Trophy,
  Bell,
  ScrollText,
  MessageCircle,
  Users,
} from '@/components/icons/lazy';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import ActiveLink from './ActiveLink';

// Simple auth hook to access user data
import { useAuth } from '@/hooks/useAuth';
import useActiveChat from '@/hooks/useActiveChat';
import useNotifications from '@/hooks/useNotifications';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { activeChatId } = useActiveChat(user?.id);
  const hasActiveChat = Boolean(activeChatId);

  const navItems = [
    { href: '/home', label: 'Home', icon: Home },
    { href: '/history', label: 'Historial', icon: ScrollText },
    { href: '/chat', label: 'Chats', icon: MessageCircle },
    { href: '/torneos', label: 'Torneos', icon: Trophy },
    { href: '/referrals', label: 'Referidos', icon: Users },
  ];

  const { notifications, unreadCount, markAsRead, markAllRead } = useNotifications();

  return (
    <header className="navbar sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between py-3">
        {/* Logo */}
        <Link
          href="/home"
          className="flex items-center gap-2 font-bold text-lg text-[color:var(--gold)] fantasy-text"
        >
          <Image src="/logo.png" alt="Arena Real logo" width={32} height={32} className="h-8 w-8" />
          Arena Real
        </Link>

        {/* Navigation links */}
        <nav className="hidden gap-4 md:flex">
          {navItems.map(({ href, label, icon }) => (
            <ActiveLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              badge={href === '/chat' && hasActiveChat}
              className="fantasy-text"
            />
          ))}
        </nav>

        {/* Right side icons */}
        {isAuthenticated && user && (
          <div className="hidden items-center gap-4 md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label="Notificaciones"
                  className="relative p-2 h-10 w-10 rounded-full border-0 gap-0 hover:bg-gold/10 hover:scale-105"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs">
                      {unreadCount}
                    </span>
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
                    <div className="p-2 text-sm text-center text-muted-foreground">
                      Sin notificaciones
                    </div>
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
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

    </header>
  );
};

export default Navbar;
