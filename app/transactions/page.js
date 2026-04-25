'use client';
import { useRouter } from 'next/navigation';
import { useTransactions, useToast } from '@/lib/useData';
import TransactionsView from '@/components/TransactionsView';
import Toast from '@/components/Toast';

export default function TransactionsPage() {
  const { transactions } = useTransactions();
  const { toast, showToast } = useToast();
  const router = useRouter();

  const handleEdit = (transaction) => {
    router.push(`/transactions/${transaction.id}/edit`);
  };

  return (
    <>
      <TransactionsView transactions={transactions} onEdit={handleEdit} />
      <Toast {...toast} />
    </>
  );
}
