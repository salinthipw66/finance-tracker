'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: 'ri-dashboard-fill', label: 'ภาพรวม' },
  { href: '/record', icon: 'ri-add-box-fill', label: 'เพิ่มรายการ' },
  { href: '/transactions', icon: 'ri-file-list-3-fill', label: 'ประวัติ' },
];

export default function Navbar({ dbStatus }) {
  const pathname = usePathname();
  const activeLabel = navItems.find((n) => pathname?.startsWith(n.href))?.label || '';

  return (
    <>
      <header className="top-dock">
        <div className="logo">
          <div className="logo-icon" style={{ background: '#111827', color: 'white' }}>
            <i className="ri-wallet-3-fill" />
          </div>
          <span>Finance <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>Tracker</span></span>
        </div>

        <nav className="dock-links">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`dock-btn ${pathname === item.href ? 'active' : ''}`}>
              <i className={item.icon} /> {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 className="mobile-only-title">{activeLabel}</h3>
          <button className="status-btn">
            <span className={`status-indicator ${dbStatus === 'online' ? 'online' : 'offline'}`} />
            {dbStatus === 'connecting' ? 'กำลังเชื่อมต่อ' : dbStatus === 'online' ? 'ออนไลน์' : 'ออฟไลน์'}
          </button>
        </div>
      </header>

      <div className="mobile-nav">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className={`m-nav-item ${pathname === item.href ? 'active' : ''}`}>
            <i className={item.icon} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
