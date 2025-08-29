import * as React from "react";

import { cn } from "@/lib/utils";

interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label: React.ReactNode;
  align?: "start" | "end";
}

export const StatTile = React.forwardRef<HTMLDivElement, StatTileProps>(
  ({ icon, value, label, align = "start", className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {icon && <div className="text-gold flex-none w-5 h-5">{icon}</div>}
      <div className={cn("flex flex-col", align === "end" ? "items-end text-right" : "items-start") }>
        <span className="text-2xl font-bold leading-none">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  )
);
StatTile.displayName = "StatTile";

