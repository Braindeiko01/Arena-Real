"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CreditCard, Shield } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Panel', icon: LayoutDashboard },
  { href: '/admin/transacciones', label: 'Transacciones', icon: CreditCard },
  { href: '/admin/partidas', label: 'Partidas', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="bg-neutral-950 text-gray-300 w-64 p-6 space-y-6 hidden sm:block">
      <h1 className="text-xl font-bold text-yellow-400">Panel de Admin</h1>
      <nav className="space-y-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 ${active ? 'bg-neutral-800 text-yellow-400' : 'hover:bg-neutral-800'}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
