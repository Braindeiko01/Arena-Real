"use client";

import Link from "next/link";
import { Bell, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const TopNavbar = () => {
  const { user } = useAuth();
  // TODO: replace with real notification count when available
  const notifications = 0;

  return (
    <header className="md:hidden fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between bg-[#3973FF] px-4 py-2 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-1 text-lg font-bold text-white">
        <Crown className="h-5 w-5" />
        Arena Real
      </div>

      {/* Username and notifications */}
      <div className="flex flex-1 items-center justify-center">
        <div className="relative mr-1 flex items-center">
          <Bell className="h-5 w-5 text-white" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
          )}
        </div>
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
