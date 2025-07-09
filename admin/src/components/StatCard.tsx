import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number;
  description: string;
}

export default function StatCard({ icon, title, value, description }: StatCardProps) {
  return (
    <div className="flex items-center justify-between bg-zinc-900 text-white rounded-xl p-6 shadow-lg w-full">
      <div className="flex-1 text-center space-y-1">
        <h3 className="text-sm font-medium">{title}</h3>
        <div className="text-4xl font-bold">{value}</div>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div className="ml-4 text-yellow-400">{icon}</div>
    </div>
  );
}
