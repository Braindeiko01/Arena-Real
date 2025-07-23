"use client";

import useTransactionWs from '@/hooks/useTransactionWs';

export default function TransactionUpdatesListener() {
  useTransactionWs();
  return null;
}
