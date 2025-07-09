import DashboardCard from '@/components/admin/DashboardCard';
import { Clock, Shield, Users } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <DashboardCard
        icon={<Clock className="h-6 w-6" />}
        title="Transacciones Pendientes"
        subtitle="Transacciones esperando aprobación"
        count={3}
      />
      <DashboardCard
        icon={<Shield className="h-6 w-6" />}
        title="Partidas Pendientes"
        subtitle="Partidas esperando validación"
        count={2}
      />
      <DashboardCard
        icon={<Users className="h-6 w-6" />}
        title="Usuarios Totales"
        subtitle="Total de usuarios activos en la plataforma"
        count={6}
      />
    </div>
  );
}
