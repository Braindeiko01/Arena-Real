"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ActiveLinkProps {
  href: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  badge?: boolean;
  className?: string;
}

const ActiveLink = ({ href, label, icon: Icon, badge, className }: ActiveLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-1 transition-colors",
        isActive
          ? "bg-gold-1/20 text-gold-1"
          : "text-text-3 hover:text-gold-1 hover:bg-gold-1/10",
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
