import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

const Home: NextPage = () => {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const baseUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    fetch(`${baseUrl}/api/admin/images`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setImages(data.map((i: any) => i.base64)));
  }, [router]);

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Panel</h1>
      <div className="grid grid-cols-2 gap-4">
        {images.map((img, idx) => (
          <img
            key={idx}
            src={`data:image/jpeg;base64,${img}`}
            alt={`img-${idx}`}
            className="w-full h-auto rounded"
          />
        ))}
      </div>
    </Layout>
  );
};

export default Home;
