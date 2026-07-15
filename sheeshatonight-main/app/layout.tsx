import type { Metadata } from 'next';
import './globals.css';
import { AuthHydration } from '@/components/AuthHydration';
import { LayoutWrapper } from '@/components/LayoutWrapper';
import { AuthProvider } from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'SheeshaTonight - Premium Sheesha Rental',
  description: 'Luxury sheesha rental and tobacco marketplace for UAE and UK',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen">
        <AuthProvider>
          <AuthHydration />
          <LayoutWrapper>{children}</LayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
