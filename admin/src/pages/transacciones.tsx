import Layout from '@/components/Layout';

export default function Transacciones() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Transacciones</h1>
      <table className="min-w-full bg-[#1e1e1e] text-white border border-gray-700">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Monto</th>
            <th className="border px-2 py-1">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-2 py-1">1</td>
            <td className="border px-2 py-1">$100</td>
            <td className="border px-2 py-1">2024-01-01</td>
          </tr>
        </tbody>
      </table>
    </Layout>
  );
}
