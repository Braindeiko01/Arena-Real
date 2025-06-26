"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, Gamepad2, User, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNav = () => {
  const pathname = usePathname();
  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/notifications", label: "Notificaciones", icon: Bell },
    { href: "/play", label: "Jugar", icon: Gamepad2 },
    { href: "/profile", label: "Usuario", icon: User },
    { href: "/menu", label: "Menú", icon: Menu },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-[#122A70]">
      <ul className="flex justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center py-2 text-xs transition-all ease-in-out",
                  active
                    ? "text-[#FFD600] scale-110 font-bold"
                    : "text-white opacity-70"
                )}
              >
                <Icon className="h-6 w-6 mb-0.5" />
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
