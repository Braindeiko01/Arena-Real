'use client';

import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Copy as CopyIcon } from 'lucide-react';
import {
  getReferralDetailsAction,
  getReferralEarningsAction,
} from '@/lib/actions';
import type { ReferralDetail } from '@/types';

export default function ReferralsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [total, setTotal] = useState<number | null>(null);
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState<ReferralDetail[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const result = await getReferralEarningsAction(user.id);
      if (result.total !== null) setTotal(result.total);
      const details = await getReferralDetailsAction(user.id);
      if (details.referrals) setReferrals(details.referrals);
      if (typeof window !== 'undefined') {
        setReferralLink(
          `${window.location.origin}/register?ref=${user.referralCode}`
        );
      }
    };
    load();
  }, [user]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copiado',
        description: 'Texto copiado al portapapeles',
        variant: 'success',
      });
    } catch (e) {
      toast({
        title: 'Error',
        description: 'No se pudo copiar',
        variant: 'error',
      });
    }
  };

  if (!user) return <p>Cargando...</p>;

  return (
    <AppLayout mainClassName="pt-0">
      <Card>
        <CardHeader>
          <CardTitle>Mis Referidos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="break-all flex-1">Tu código: {user.referralCode}</p>
            <Button
              size="sm"
              onClick={() => handleCopy(user.referralCode || '')}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p className="break-all flex-1">Link: {referralLink}</p>
            <Button
              size="sm"
              onClick={() => handleCopy(referralLink)}
              disabled={!referralLink}
            >
              <CopyIcon className="h-4 w-4" />
            </Button>
          </div>
          <p>
            Total ganado:{' '}
            {new Intl.NumberFormat('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            }).format(total ?? 0)}
          </p>
          {referrals.length > 0 && (
            <div className="mt-4">
              <p className="font-semibold">Usuarios referidos</p>
              <ul className="space-y-1">
                {referrals.map((r) => (
                  <li key={r.name} className="flex justify-between">
                    <span>{r.name}</span>
                    <span>
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                      }).format(r.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </AppLayout>
  );
}
