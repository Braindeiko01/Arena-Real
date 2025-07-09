"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import useFirestoreChats from "@/hooks/useFirestoreChats";
import {
  Home,
  Bell,
  Gamepad2,
  User,
  MessageCircle,
  Menu as MenuIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "inicio", label: "Inicio", href: "/", icon: Home },
  { id: "notificaciones", label: "Notificaciones", href: "/notifications", icon: Bell },
  { id: "jugar", label: "Jugar", href: "/play", icon: Gamepad2 },
  { id: "usuario", label: "Usuario", href: "/profile", icon: User },
  { id: "chat", label: "Chat", href: "/chat", icon: MessageCircle },
  { id: "menu", label: "Menú", href: "/menu", icon: MenuIcon },
];

const BottomNav = () => {
  const [active, setActive] = useState("jugar");
  const { user } = useAuth();
  const { chats } = useFirestoreChats(user?.id);
  const hasActiveChat = chats.some(c => c.activo);

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-t border-blue-800 h-16 animate-gradient-x">
      <ul className="flex h-full items-center justify-around">
        {navItems.map(({ id, label, href, icon: Icon }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <Link
                href={href}
                onClick={() => setActive(id)}
                className={cn(
                  "flex flex-col items-center text-xs transition-all ease-in-out",
                  isActive
                    ? "text-[#FFD600] scale-110 font-bold"
                    : "text-white opacity-70"
                )}
              >
                <span className="relative">
                  <Icon className="w-6 h-6 mb-1" />
                  {id === "chat" && hasActiveChat && (
                    <span className="absolute -top-1 -right-1 block w-3 h-3 bg-red-500 rounded-full" />
                  )}
                </span>
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
