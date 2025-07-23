"use client";

import useTransactionUpdates from '@/hooks/useTransactionUpdates';

export default function TransactionUpdatesListener() {
  useTransactionUpdates();
  return null;
}
