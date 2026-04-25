'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DbStatusContext = createContext('connecting');

export function useDbStatus() {
  return useContext(DbStatusContext);
}

export default function DbStatusProvider({ children }) {
  const [dbStatus, setDbStatus] = useState('connecting');

  useEffect(() => {
    async function check() {
      try {
        const res = await fetch('/api/transactions');
        const result = await res.json();
        setDbStatus(result.status === 'success' ? 'online' : 'offline');
      } catch {
        setDbStatus('offline');
      }
    }
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <DbStatusContext.Provider value={dbStatus}>
      {children}
    </DbStatusContext.Provider>
  );
}
