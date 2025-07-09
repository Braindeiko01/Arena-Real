import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number;
}

export default function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="flex items-center justify-between bg-[#1e1e1e] text-white rounded-lg p-6 w-full shadow-lg">
      <div className="text-center flex-1">
        <div className="text-4xl font-bold">{value}</div>
        <div className="text-sm uppercase tracking-wider mt-1">{label}</div>
      </div>
      <div className="ml-4 text-yellow-400">{icon}</div>
    </div>
  );
}
