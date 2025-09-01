'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import useActiveChat from '@/hooks/useActiveChat';
import {
  Shield,
  MessageCircle,
  ScrollText,
  Trophy,
  Award,
} from '@/components/icons/lazy';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { activeChatId } = useActiveChat(user?.id);
  const hasActiveChat = Boolean(activeChatId);
  const navItems = [
    { id: 'inicio', label: 'Inicio', href: '/home', icon: Shield },
    { id: 'chat', label: 'Chat', href: '/chat', icon: MessageCircle },
    { id: 'historial', label: 'Historial', href: '/history', icon: ScrollText },
    { id: 'torneo', label: 'Torneo', href: '/torneos', icon: Trophy },
    { id: 'referidos', label: 'Referidos', href: '/referrals', icon: Award },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden h-16 bg-bg-0/90 backdrop-blur border-t border-line [padding-bottom:env(safe-area-inset-bottom)] z-40">
      <ul className="max-w-[1200px] mx-auto px-4 md:px-6 h-full flex items-center justify-between gap-3">
        {navItems.map(({ id, label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={id}>
              <Link
                href={href}
                className={cn('tab', isActive && 'tab--active')}
              >
                <span className="relative">
                  <Icon />
                  {id === 'chat' && hasActiveChat && (
                    <span className="absolute -top-1 -right-1 block w-3 h-3 bg-error rounded-full" />
                  )}
                </span>
                <span className="fantasy-text">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
