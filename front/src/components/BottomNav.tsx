"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import useActiveChat from "@/hooks/useActiveChat";
import {
  Home,
  MessageCircle,
  ScrollText,
  Trophy,
  Menu as MenuIcon,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { activeChatId } = useActiveChat(user?.id);
  const hasActiveChat = Boolean(activeChatId);
  const navItems = [
    { id: "inicio", label: "Inicio", href: "/", icon: Home },
    { id: "chat", label: "Chat", href: "/chat", icon: MessageCircle },
    { id: "historial", label: "Historial", href: "/history", icon: ScrollText },
    { id: "torneo", label: "Torneo", href: "/torneos", icon: Trophy },
    { id: "referidos", label: "Referidos", href: "/referrals", icon: Users },
    { id: "menu", label: "Menú", href: "/menu", icon: MenuIcon },
  ];

  return (
    <nav className="md:hidden navbar-bottom h-16">
      <ul className="flex h-full items-center justify-around">
        {navItems.map(({ id, label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={id}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center text-xs transition-all ease-in-out",
                  isActive
                    ? "text-[color:var(--gold)] scale-110 font-bold"
                    : "text-[color:var(--muted)] opacity-70 hover:text-[color:var(--gold)]"
                )}
              >
                <span className="relative">
                  <Icon className="w-6 h-6 mb-1" />
                  {id === "chat" && hasActiveChat && (
                    <span className="absolute -top-1 -right-1 block w-3 h-3 bg-red-500 rounded-full" />
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
