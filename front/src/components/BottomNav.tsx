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
} from "@/components/icons/lazy";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { activeChatId } = useActiveChat(user?.id);
  const hasActiveChat = Boolean(activeChatId);
  const navItems = [
    { id: "inicio", label: "Inicio", href: "/home", icon: Home },
    { id: "chat", label: "Chat", href: "/chat", icon: MessageCircle },
    { id: "historial", label: "Historial", href: "/history", icon: ScrollText },
    { id: "torneo", label: "Torneo", href: "/torneos", icon: Trophy },
    { id: "menu", label: "Menú", href: "/menu", icon: MenuIcon },
  ];

  return (
    <nav className="bottom-nav md:hidden">
      <ul className="contents">
        {navItems.map(({ id, label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <li key={id}>
              <Link
                href={href}
                className={cn("tab", isActive && "tab--active")}
              >
                <span className="relative">
                  <Icon />
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
