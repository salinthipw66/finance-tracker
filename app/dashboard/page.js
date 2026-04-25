'use client';
import { useTransactions, useToast } from '@/lib/useData';
import DashboardView from '@/components/DashboardView';
import Toast from '@/components/Toast';

export default function DashboardPage() {
  const { transactions, dbStatus } = useTransactions();
  const { toast, showToast } = useToast();

  return (
    <>
      <DashboardView transactions={transactions} />
      <Toast {...toast} />
    </>
  );
}
