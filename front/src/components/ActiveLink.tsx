"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveLinkProps {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: boolean;
  className?: string;
}

const ActiveLink = ({ href, label, icon: Icon, badge, className }: ActiveLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-1 border-b-2 transition-colors duration-200",
        isActive
          ? "text-[color:var(--gold)] border-[color:var(--gold)]"
          : "text-[color:var(--muted)] border-transparent hover:text-[color:var(--gold)] hover:border-[color:var(--gold)]",
        className
      )}
    >
      <span className="relative">
        <Icon className="h-4 w-4" />
        {badge && <span className="absolute -top-1 -right-1 block w-3 h-3 rounded-full bg-red-500" />}
      </span>
      {label}
    </Link>
  );
};

export default ActiveLink;
