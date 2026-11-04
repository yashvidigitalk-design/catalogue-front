'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronRight, Sparkles, Building2 } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import SubscriptionModal from '@/components/SubscriptionModal';
import { CURRENT_SELLER } from '@/lib/sampleData';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

const ROUTE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  categories: 'Categories',
  products: 'Products Master',
  catalogue: 'Digital Catalogue',
  buyers: 'Buyers Directory',
  inquiries: 'Inquiries & RFQs',
  orders: 'Wholesale Orders',
  stock: 'Warehouse & Loom Stock',
  settings: 'Seller Settings',
};

const SETTINGS_SUB_TITLES: Record<string, string> = {
  'whatsapp-sharing': 'WhatsApp Sharing',
  'catalogue-templates': 'Catalogue Templates',
};

export default function Header({
  onToggleMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // Derive breadcrumb path
  const [section = 'dashboard', subSection] = pathname.split('/').filter(Boolean);
  const pageTitle = ROUTE_LABELS[section] || 'Overview';

  // Nested breadcrumb parent and child derivation
  let parentCrumb: { href: string; label: string } | null = null;
  let currentLabel = pageTitle;

  if (section === 'products' && subSection === 'create') {
    parentCrumb = { href: '/products', label: 'Products' };
    currentLabel = 'Add Product';
  } else if (section === 'settings' && subSection) {
    parentCrumb = { href: '/settings/catalogue-templates', label: 'Settings' };
    currentLabel = SETTINGS_SUB_TITLES[subSection] || 'Settings';
  }

  return (
    <>
      <header className="h-16 px-4 sm:px-6 bg-white border-b border-[#E2E1EC] flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(16,14,38,0.03)]">
        {/* Left: Sidebar toggle + Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden h-10 w-10 rounded-lg border border-[#E2E1EC] flex items-center justify-center text-[#5A586E] hover:text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium">
            <Link
              href="/dashboard"
              className="text-[#5A586E] hover:text-[#4E45D5] transition-colors flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4E45D5]" />
              <span className="hidden sm:inline">TexLoom Seller</span>
            </Link>

            <ChevronRight className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />

            {parentCrumb && (
              <>
                <Link
                  href={parentCrumb.href}
                  className="text-[#5A586E] hover:text-[#4E45D5] transition-colors"
                >
                  {parentCrumb.label}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />
              </>
            )}

            <span className="text-[#100E26] font-bold truncate">
              {currentLabel}
            </span>
          </nav>
        </div>

        {/* Right: LanguageSelector + Subscription + Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Language Selector */}
          <LanguageSelector />

          {/* Subscription Button (40px height) */}
          <button
            type="button"
            onClick={() => setIsSubscriptionOpen(true)}
            className="h-10 px-3 sm:px-3.5 rounded-lg border border-[#4E45D5]/30 bg-[#EEF2FF] hover:bg-[#4E45D5] text-[#4E45D5] hover:text-white transition-all text-xs font-semibold inline-flex items-center gap-1.5 group shadow-xs"
            title="Manage mill subscription and tier limits"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4E45D5] group-hover:text-white transition-colors" />
            <span className="hidden sm:inline">Plan:</span>
            <span className="font-bold">{CURRENT_SELLER.planName}</span>
          </button>

          {/* User Profile Info (Static - No Dropdown) */}
          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-[#E2E1EC]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={CURRENT_SELLER.avatarUrl}
              alt={CURRENT_SELLER.name}
              className="w-8 h-8 rounded-full object-cover border border-[#E2E1EC] shrink-0"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-[#100E26] leading-tight truncate max-w-[140px] sm:max-w-[180px]">
                {CURRENT_SELLER.name}
              </span>
              <span className="text-[11px] text-[#5A586E] leading-tight truncate max-w-[140px] sm:max-w-[180px]">
                {CURRENT_SELLER.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isSubscriptionOpen}
        onClose={() => setIsSubscriptionOpen(false)}
        currentPlanId="growth_pro"
      />
    </>
  );
}
