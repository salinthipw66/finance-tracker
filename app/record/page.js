'use client';
import { useTransactions, useToast, addCategory } from '@/lib/useData';
import RecordView from '@/components/RecordView';
import Toast from '@/components/Toast';

export default function RecordPage() {
  const { transactions, categories, fetchData, setTransactions } = useTransactions();
  const { toast, showToast } = useToast();

  return (
    <>
      <RecordView
        transactions={transactions}
        categories={categories}
        fetchData={fetchData}
        showToast={showToast}
        addCategory={addCategory}
        setTransactions={setTransactions}
      />
      <Toast {...toast} />
    </>
  );
}
