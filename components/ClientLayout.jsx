'use client';
import Navbar from '@/components/Navbar';
import DbStatusProvider, { useDbStatus } from '@/components/DbStatusProvider';

function LayoutInner({ children }) {
  const dbStatus = useDbStatus();
  return (
    <div className="app-container">
      <Navbar dbStatus={dbStatus} />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function ClientLayout({ children }) {
  return (
    <DbStatusProvider>
      <LayoutInner>{children}</LayoutInner>
    </DbStatusProvider>
  );
}
