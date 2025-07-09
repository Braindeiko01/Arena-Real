import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { Clock, ShieldCheck, Users } from 'lucide-react';
import { get } from '@/lib/api';

const Home: NextPage = () => {
  const [txCount, setTxCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);

  useEffect(() => {
    get<any[]>('/api/admin/transactions')
      .then(res => setTxCount(res.filter((t: any) => t.status === 'PENDIENTE').length))
      .catch(() => {});
    get<any[]>('/api/admin/games/results')
      .then(res => setGameCount(res.length))
      .catch(() => {});
  }, []);

  const stats = [
    {
      title: 'Transacciones Pendientes',
      description: 'Transacciones esperando aprobación',
      value: txCount,
      icon: <Clock size={32} />
    },
    {
      title: 'Partidas Pendientes',
      description: 'Partidas esperando validación',
      value: gameCount,
      icon: <ShieldCheck size={32} />
    },
    {
      title: 'Usuarios Totales',
      description: 'Total de usuarios activos en la plataforma',
      value: 0,
      icon: <Users size={32} />
    }
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Panel</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => (
          <StatCard
            key={stat.title}
            icon={stat.icon}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
