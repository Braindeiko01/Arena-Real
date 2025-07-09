import Layout from '@/components/Layout';
import MatchTable from '@/components/MatchTable';

export default function Partidas() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Partidas 1vs1</h1>
      <MatchTable />
    </Layout>
  );
}
