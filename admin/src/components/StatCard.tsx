// src/components/StatCard.tsx
import { ReactNode } from 'react';

export default function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="bg-zinc-900 rounded-xl p-5 flex items-center justify-between shadow-md w-full h-28">
      <div>
        <h2 className="text-3xl font-bold">{value}</h2>
        <p className="text-sm text-zinc-300">{title}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <div className="text-yellow-400">{icon}</div>
    </div>
  );
}
