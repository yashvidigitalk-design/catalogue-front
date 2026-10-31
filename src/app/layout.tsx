import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/AppShell';

export const metadata: Metadata = {
  title: 'TexLoom - Wholesale Textile Seller Panel',
  description: 'Wholesale Textile Mill & Fabric Manufacturer Seller Operations Portal.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F7F7FB] text-[#100E26] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}