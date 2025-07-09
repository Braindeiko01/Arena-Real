import type { NextPage } from 'next';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { Banknote, ListChecks, Users } from 'lucide-react';

const stats = [
  { label: 'Transacciones Pendientes', value: 5, icon: <Banknote size={32} /> },
  { label: 'Partidas Pendientes', value: 2, icon: <ListChecks size={32} /> },
  { label: 'Usuarios Totales', value: 37, icon: <Users size={32} /> }
];

const Home: NextPage = () => {
  // In a real application, values should come from the backend
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(stat => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
    </Layout>
  );
};
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
