"use client";

import React from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import useApprovedTransactionsSse, { ApprovedTransaction } from '@/hooks/useApprovedTransactionsSse';

export default function TransactionsPage() {
  const approved = useApprovedTransactionsSse();

  return (
    <AppLayout>
      <Card className="space-y-4">
        <CardHeader>
          <CardTitle className="text-2xl">Transacciones Aprobadas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-6">
            {approved.length === 0 && (
              <li className="text-muted-foreground">Aún no hay transacciones aprobadas.</li>
            )}
            {approved.map((t: ApprovedTransaction) => (
              <li key={t.id} className="border p-2 rounded">
                <span className="font-semibold">{t.id}</span> - {t.tipo} por {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(t.monto)}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
