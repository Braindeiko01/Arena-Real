import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ReactNode } from 'react';

interface DashboardCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  count: number;
}

export default function DashboardCard({ icon, title, subtitle, count }: DashboardCardProps) {
  return (
    <Card className="bg-neutral-900 text-white shadow-lg rounded-2xl flex-1">
      <CardHeader className="flex-row items-center gap-4">
        <div className="text-yellow-400">{icon}</div>
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription className="text-sm text-gray-400">{subtitle}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold text-center">{count}</p>
      </CardContent>
    </Card>
  );
}
