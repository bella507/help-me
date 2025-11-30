import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { SessionProvider } from './components/SessionProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'ศูนย์ช่วยเหลือผู้ประสบภัย',
  description: 'ระบบช่วยเหลือผู้ประสบภัยพิบัติ พร้อมให้บริการ 24/7',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased">
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
