'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Bell,
  Gamepad2,
  User,
  Menu as MenuIcon,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Inicio', Icon: Home },
  { href: '/notifications', label: 'Notificaciones', Icon: Bell },
  { href: '/play', label: 'Jugar', Icon: Gamepad2 },
  { href: '/profile', label: 'Usuario', Icon: User },
  { href: '/menu', label: 'Menú', Icon: MenuIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-[#122A70] md:hidden">
      <ul className="flex justify-around">
        {navItems.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center py-2 text-xs transition-all ease-in-out ${
                  active
                    ? 'text-[#FFD600] font-bold scale-110'
                    : 'text-white opacity-70'
                }`}
              >
                <Icon className="h-6 w-6 mb-1" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
