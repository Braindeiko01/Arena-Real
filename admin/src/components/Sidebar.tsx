import Link from 'next/link';
import { LayoutDashboard, CreditCard, Gamepad2 } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { label: 'Panel', icon: <LayoutDashboard size={20} />, href: '/' },
    { label: 'Transacciones', icon: <CreditCard size={20} />, href: '/transacciones' },
    { label: 'Partidas', icon: <Gamepad2 size={20} />, href: '/partidas' },
  ];

  return (
    <aside className="bg-[#121212] h-screen w-64 p-6">
      <h2 className="text-white text-xl font-bold mb-8">Panel de Admin</h2>
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="flex items-center gap-2 text-white hover:bg-neutral-800 p-2 rounded-md"
          >
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
