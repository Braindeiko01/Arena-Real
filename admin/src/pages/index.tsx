import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import StatCard from '@/components/StatCard';
import { Banknote, ListChecks, Users } from 'lucide-react';
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
    { label: 'Transacciones Pendientes', value: txCount, icon: <Banknote size={32} /> },
    { label: 'Partidas Pendientes', value: gameCount, icon: <ListChecks size={32} /> },
    { label: 'Usuarios Totales', value: 0, icon: <Users size={32} /> }
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-6">Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map(stat => (
          <StatCard key={stat.label} icon={stat.icon} label={stat.label} value={stat.value} />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
