import { Mitr } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const mitr = Mitr({ subsets: ['thai', 'latin'], weight: ['300', '400', '500', '600', '700'], variable: '--font-mitr' });

export const metadata = {
  title: 'Finance Tracker',
  description: 'บันทึกรายรับ-รายจ่ายส่วนตัว | Full-stack Next.js + TiDB',
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" className={mitr.variable}>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
