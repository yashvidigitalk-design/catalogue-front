'use client';

import React, { useState } from 'react';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Toast from '@/components/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <html lang="en">
      <head>
        <title>TexLoom - Wholesale Textile Seller Panel</title>
        <meta
          name="description"
          content="Wholesale Textile Mill & Fabric Manufacturer Seller Operations Portal."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-[#F7F7FB] text-[#100E26] antialiased">
        <div className="min-h-screen flex">
          {/* Sidebar (Desktop 260px expanded / 72px icon rail + Mobile Drawer) */}
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 transition-all duration-200">
            <Header
              onToggleMobileSidebar={() => setMobileOpen(true)}
              onToggleCollapseDesktop={() => setCollapsed(!collapsed)}
            />

            <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>

        {/* Global Toast Notifications */}
        <Toast />
      </body>
    </html>
  );
}
