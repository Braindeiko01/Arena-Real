"use client";

import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { getReferralEarningsAction } from '@/lib/actions';

export default function ReferralsPage() {
  const { user } = useAuth();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const result = await getReferralEarningsAction(user.id);
      if (result.total !== null) setTotal(result.total);
    };
    load();
  }, [user]);

  if (!user) return <p>Cargando...</p>;

  return (
    <AppLayout>
      <Card>
        <CardHeader>
          <CardTitle>Mis Referidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="break-all">Tu código: {user.referralCode}</p>
          <p>Total ganado: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(total ?? 0)}</p>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
