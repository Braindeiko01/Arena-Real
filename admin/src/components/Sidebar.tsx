import Link from 'next/link'

import { useRouter } from 'next/router'
import { LayoutDashboard, Banknote, Shield } from 'lucide-react'

const links = [
  { href: '/', label: 'Panel', icon: <LayoutDashboard size={20} /> },
  { href: '/transacciones', label: 'Transacciones', icon: <Banknote size={20} /> },
  { href: '/partidas', label: 'Partidas', icon: <Shield size={20} /> }
];

export default function Sidebar() {
  const { pathname } = useRouter()
  return (
    <aside className="w-56 bg-gradient-to-b from-[#121212] via-[#181818] to-[#1e1e1e] text-white min-h-screen p-4 space-y-4 shadow-lg">
      <h1 className="text-xl font-bold text-yellow-400">Panel de Admin</h1>
      <nav className="space-y-2">
        {links.map(link => {
          const active = pathname === link.href
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2 px-2 py-1 rounded border-l-4 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${active ? 'bg-gray-800 text-yellow-400 font-semibold border-yellow-400' : 'border-transparent'}`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
