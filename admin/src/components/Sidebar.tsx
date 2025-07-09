import Link from 'next/link';
import { LayoutDashboard, CreditCard, Gamepad2 } from 'lucide-react';

const navItems = [
  { label: 'Panel', href: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Transacciones', href: '/transacciones', icon: <CreditCard className="w-5 h-5" /> },
  { label: 'Partidas', href: '/partidas', icon: <Gamepad2 className="w-5 h-5" /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black text-white p-4 flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Panel de Admin</h1>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 transition text-zinc-300 hover:text-white"
        >
          {item.icon}
          <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
