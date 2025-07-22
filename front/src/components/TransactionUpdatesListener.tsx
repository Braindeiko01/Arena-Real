"use client";

import useTransactionUpdatesWs from '@/hooks/useTransactionUpdatesWs';

export default function TransactionUpdatesListener() {
  useTransactionUpdatesWs();
  return null;
}
