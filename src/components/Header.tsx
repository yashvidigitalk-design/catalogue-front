'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronRight, Sparkles, Building2 } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import ProfileDropdown from '@/components/ProfileDropdown';
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

export default function Header({
  onToggleMobileSidebar,
}: HeaderProps) {
  const pathname = usePathname();
  const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);

  // Derive breadcrumb path
  const segments = pathname.split('/').filter(Boolean);
  const currentSegment = segments[0] || 'dashboard';
  const pageTitle = ROUTE_LABELS[currentSegment] || 'Overview';

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

            {segments[0] === 'products' && segments[1] === 'create' ? (
              <>
                <Link
                  href="/products"
                  className="text-[#5A586E] hover:text-[#4E45D5] transition-colors"
                >
                  Products
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />
                <span className="text-[#100E26] font-bold truncate">
                  Add Product
                </span>
              </>
            ) : segments[0] === 'settings' && segments[1] ? (
              <>
                <Link
                  href="/settings/catalogue-templates"
                  className="text-[#5A586E] hover:text-[#4E45D5] transition-colors"
                >
                  Settings
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />
                <span className="text-[#100E26] font-bold truncate">
                  {segments[1] === 'whatsapp-sharing'
                    ? 'WhatsApp Sharing'
                    : 'Catalogue Templates'}
                </span>
              </>
            ) : (
              <span className="text-[#100E26] font-bold truncate">
                {pageTitle}
              </span>
            )}
          </nav>
        </div>

        {/* Right: LanguageSelector + Subscription + ProfileDropdown */}
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

          {/* Profile Dropdown */}
          <ProfileDropdown />
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
