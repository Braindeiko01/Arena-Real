import Layout from '@/components/Layout';
import TransactionTable from '@/components/TransactionTable';

export default function Transacciones() {
  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Transacciones</h1>
      <TransactionTable />
    </Layout>
  );
}
