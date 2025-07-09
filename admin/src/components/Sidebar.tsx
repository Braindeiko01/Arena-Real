import Link from 'next/link';

import { useRouter } from 'next/router';

const links = [
  { href: '/', label: 'Panel' },
  { href: '/transacciones', label: 'Transacciones' },
  { href: '/partidas', label: 'Partidas' }
];

export default function Sidebar() {
  const { pathname } = useRouter();
  return (
    <aside className="w-48 bg-[#1e1e1e] text-white min-h-screen p-4">
      <nav className="space-y-2">
        {links.map(link => (
          <Link key={link.href} href={link.href} className={`block px-2 py-1 rounded hover:bg-gray-700 ${pathname === link.href ? 'bg-gray-700' : ''}`}>{link.label}</Link>
        ))}
      </nav>
    </aside>
  );
}
