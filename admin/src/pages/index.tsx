// src/pages/index.tsx
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { Clock, ShieldCheck, Users } from 'lucide-react';

export default function Panel() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Panel</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Transacciones Pendientes"
          value={5}
          description="Transacciones esperando aprobación"
          icon={<Clock className="w-6 h-6" />}
        />
        <StatCard
          title="Partidas Pendientes"
          value={2}
          description="Partidas esperando validación"
          icon={<ShieldCheck className="w-6 h-6" />}
        />
        <StatCard
          title="Usuarios Totales"
          value={37}
          description="Total de usuarios activos en la plataforma"
          icon={<Users className="w-6 h-6" />}
        />
      </div>
    </Layout>
  );
}
