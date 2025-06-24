
"use client";

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { CartoonButton } from '@/components/ui/CartoonButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CrownIcon, SwordsIcon, AvatarIcon, LogOutIcon, ScrollTextIcon } from '@/components/icons/ClashRoyaleIcons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, usePathname } from 'next/navigation';

const AppHeader = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: <SwordsIcon className="h-5 w-5" /> },
    { href: "/history", label: "History", icon: <ScrollTextIcon className="h-5 w-5" /> },
    { href: "/profile", label: "Profile", icon: <AvatarIcon className="h-5 w-5" /> },
  ];

  return (
    <header className="bg-primary/80 backdrop-blur-md shadow-lg sticky top-0 z-50 font-headline">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary-foreground hover:text-accent transition-colors">
          <CrownIcon className="h-8 w-8 text-accent" />
          <h1 className="text-2xl md:text-3xl font-bold">CR Duels</h1>
        </Link>
        
        {isAuthenticated && user && (
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-1 px-4 py-2 rounded-md text-primary-foreground hover:bg-primary-dark hover:text-accent transition-colors ${pathname === item.href ? 'bg-primary-dark text-accent font-semibold' : ''}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1 rounded-full hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-accent">
                <Avatar className="h-10 w-10 border-2 border-accent">
                  <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png?text=${user.clashTag?.[0] || 'U'}`} alt={user.clashTag || "User"} data-ai-hint="gaming avatar" />
                  <AvatarFallback>{user.clashTag?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <span className="hidden lg:inline text-primary-foreground font-semibold">{user.clashTag}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border shadow-xl w-56">
              <DropdownMenuLabel className="font-headline text-card-foreground">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer hover:bg-accent/10">
                <AvatarIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/history')} className="cursor-pointer hover:bg-accent/10">
                 <ScrollTextIcon className="mr-2 h-4 w-4" />
                <span>Match History</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer">
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="space-x-2">
            <CartoonButton size="small" variant="accent" onClick={() => router.push('/login')}>Login</CartoonButton>
            <CartoonButton size="small" onClick={() => router.push('/register')}>Register</CartoonButton>
          </div>
        )}
      </div>
       {isAuthenticated && user && (
        <div className="md:hidden bg-primary/90 py-2">
          <nav className="container mx-auto flex justify-around items-center">
            {navItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex flex-col items-center p-2 rounded-md text-primary-foreground hover:bg-primary-dark hover:text-accent transition-colors ${pathname === item.href ? 'bg-primary-dark text-accent' : ''}`}
              >
                {item.icon}
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
