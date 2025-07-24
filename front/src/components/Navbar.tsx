"use client";

import { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  Trophy,
  Bell,
  Menu,
  Crown,
  ScrollText,
  MessageCircle,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ActiveLink from './ActiveLink';

// Simple auth hook to access user data
import { useAuth } from '@/hooks/useAuth';
import useActiveChat from '@/hooks/useActiveChat';
import useNotifications from '@/hooks/useNotifications';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { activeChatId } = useActiveChat(user?.id);
  const hasActiveChat = Boolean(activeChatId);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'Historial', icon: ScrollText },
    { href: '/chat', label: 'Chats', icon: MessageCircle },
    { href: '/torneos', label: 'Torneos', icon: Trophy },
    { href: '/referrals', label: 'Referidos', icon: Users },
  ];

  const { unreadCount } = useNotifications();

  return (
    <header className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-900 text-white shadow-md animate-gradient-x">
      <div className="container mx-auto flex items-center justify-between py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Crown className="h-6 w-6" />
          Arena Real
        </Link>

        {/* Mobile hamburger */}
        <button
          className="rounded-md p-2 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden transition-transform hover:scale-105"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Navigation links */}
        <nav className="hidden gap-4 md:flex">
          {navItems.map(({ href, label, icon }) => (
            <ActiveLink
              key={href}
              href={href}
              label={label}
              icon={icon}
              badge={href === '/chat' && hasActiveChat}
            />
          ))}
        </nav>

        {/* Right side icons */}
        {isAuthenticated && user && (
          <div className="hidden items-center gap-4 md:flex">
            <button className="relative rounded-full p-2 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs">
                  {unreadCount}
                </span>
              )}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                    <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </button>
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/20 pb-4 md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 pt-4">
            {navItems.map(({ href, label, icon }) => (
              <ActiveLink
                key={href}
                href={href}
                label={label}
                icon={icon}
                badge={href === '/chat' && hasActiveChat}
                className="gap-2 px-3 py-2"
              />
            ))}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 pt-2">
                <button className="relative rounded-full p-2 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105">
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} alt={user.username} />
                        <AvatarFallback>{user.username?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    </button>
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
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
