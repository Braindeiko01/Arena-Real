import Layout from '@/components/Layout';

export default function Partidas() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Partidas</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white p-4 border rounded shadow">
            Partida #{i + 1}
          </div>
        ))}
      </div>
    </Layout>
  );
}
