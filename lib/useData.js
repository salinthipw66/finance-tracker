'use client';
import { useState, useEffect, useCallback } from 'react';

export function useTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState({ รายรับ: [], รายจ่าย: [] });
  const [dbStatus, setDbStatus] = useState('connecting');

  const fetchData = useCallback(async () => {
    setDbStatus('connecting');
    try {
      const res = await fetch('/api/transactions');
      const result = await res.json();
      if (result.status === 'success') {
        setTransactions(result.data);
        localStorage.setItem('transactionsCache', JSON.stringify(result.data));
        if (result.categories) setCategories(result.categories);
        setDbStatus('online');
      } else {
        setDbStatus('offline');
      }
    } catch (err) {
      console.error(err);
      setDbStatus('offline');
    }
  }, []);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('transactionsCache');
      if (cached) setTransactions(JSON.parse(cached));
    } catch (err) {
      console.error('Failed to load cache:', err);
    }
    fetchData();
  }, [fetchData]);

  return { transactions, categories, dbStatus, fetchData, setTransactions };
}

export function useToast() {
  const [toast, setToast] = useState({ visible: false, message: '', isError: false });
  const showToast = useCallback((message, isError = false) => {
    setToast({ visible: true, message, isError });
    setTimeout(() => setToast({ visible: false, message: '', isError: false }), 3000);
  }, []);
  return { toast, showToast };
}

export async function addCategory(type, name, color) {
  await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, category: name, color }),
  });
}
