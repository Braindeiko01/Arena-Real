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

// Simple auth hook to access user data
import { useAuth } from '@/hooks/useAuth';
import useFirestoreChats from '@/hooks/useFirestoreChats';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { chats } = useFirestoreChats(user?.id);
  const hasActiveChat = chats.some(c => c.activo);

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/history', label: 'Historial', icon: ScrollText },
    { href: '/chat', label: 'Chats', icon: MessageCircle },
    { href: '/torneos', label: 'Torneos', icon: Trophy },
  ];

  // TODO: replace with real notification count
  const notifications = 0;

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
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white active:bg-white/30"
            >
              <span className="relative">
                <Icon className="h-4 w-4" />
                {href === '/chat' && hasActiveChat && (
                  <span className="absolute -top-1 -right-1 block w-3 h-3 bg-red-500 rounded-full" />
                )}
              </span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        {isAuthenticated && user && (
          <div className="hidden items-center gap-4 md:flex">
            <button className="relative rounded-full p-2 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105">
              <Bell className="h-6 w-6" />
              {notifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs">
                  {notifications}
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
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span className="relative">
                  <Icon className="h-5 w-5" />
                  {href === '/chat' && hasActiveChat && (
                    <span className="absolute -top-1 -right-1 block w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </span>
                {label}
              </Link>
            ))}
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 pt-2">
                <button className="relative rounded-full p-2 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-transform hover:scale-105">
                  <Bell className="h-6 w-6" />
                  {notifications > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs">
                      {notifications}
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
