'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Toast from '@/components/Toast';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === '/login') {
    return (
      <div className="min-h-screen bg-[#F7F7FB]">
        {children}
        <Toast />
      </div>
    );
  }

  return (
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
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Toast Notifications */}
      <Toast />
    </div>
  );
}
