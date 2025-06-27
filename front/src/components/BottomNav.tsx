"use client";

import { useState } from "react";
import Link from "next/link";
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

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#3973FF] border-t border-blue-800 h-16">
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
                <Icon className="w-6 h-6 mb-1" />
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
