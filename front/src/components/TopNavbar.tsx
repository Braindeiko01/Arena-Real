"use client";

import Link from "next/link";
import { Bell, Crown } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

const TopNavbar = () => {
  const { user } = useAuth();
  const notifications = [
    { id: 1, title: "Tienes un nuevo duelo pendiente" },
    { id: 2, title: "Saldo depositado correctamente" },
  ];

  return (
    <header className="md:hidden fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between bg-[#3973FF] px-4 py-2 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-1 text-lg font-bold text-white">
        <Crown className="h-5 w-5" />
        Arena Real
      </div>

      {/* Username and notifications */}
      <div className="flex flex-1 items-center justify-center">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="relative mr-1 flex items-center" aria-label="Notificaciones">
              <Bell className="h-5 w-5 text-white" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
              )}
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="center"
              side="bottom"
              sideOffset={4}
              className="bg-white text-sm text-gray-800 rounded shadow-md"
            >
              {notifications.length === 0 ? (
                <div className="px-3 py-2">No tienes notificaciones</div>
              ) : (
                notifications.map((n) => (
                  <DropdownMenu.Item
                    key={n.id}
                    className="hover:bg-gray-100 rounded px-3 py-2 cursor-pointer outline-none"
                  >
                    {n.title}
                  </DropdownMenu.Item>
                ))
              )}
              <DropdownMenu.Arrow className="fill-white" />
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
        <span className="text-sm font-medium text-white">
          {user?.username || "braindeiko"}
        </span>
      </div>

      {/* Avatar */}
      <Link href="/profile" className="ml-2 flex items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#3973FF] font-bold">
          {user?.username?.[0]?.toUpperCase() ?? "B"}
        </div>
      </Link>
    </header>
  );
};

export default TopNavbar;
