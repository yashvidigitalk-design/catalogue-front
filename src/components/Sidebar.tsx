'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  Package,
  BookOpen,
  Users,
  MessageSquareText,
  ShoppingBag,
  Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LayoutTemplate,
  Share2,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItemConfig {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const PRIMARY_NAV_ITEMS: NavItemConfig[] = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Categories', path: '/categories', icon: FolderTree },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Catalogue', path: '/catalogue', icon: BookOpen },
  { label: 'Buyers', path: '/buyers', icon: Users },
  { label: 'Inquiries', path: '/inquiries', icon: MessageSquareText },
  { label: 'Orders', path: '/orders', icon: ShoppingBag },
  { label: 'Stock', path: '/stock', icon: Boxes },
];

const SETTINGS_SUB_ITEMS: NavItemConfig[] = [
  { label: 'Catalogue Templates', path: '/settings/catalogue-templates', icon: LayoutTemplate },
  { label: 'WhatsApp Sharing', path: '/settings/whatsapp-sharing', icon: Share2 },
];

export default function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname();
  const isSettingsActive = pathname.startsWith('/settings');
  const [settingsOpen, setSettingsOpen] = React.useState(isSettingsActive);

  React.useEffect(() => {
    if (isSettingsActive) {
      setSettingsOpen(true);
    }
  }, [isSettingsActive]);

  const isLinkActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#100E26] text-white select-none border-r border-[#17142F]">
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#17142F] shrink-0">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden group"
          title="TexLoom Wholesale Textile"
        >
          <div className="w-10 h-10 rounded-xl bg-[#4E45D5] flex items-center justify-center shrink-0 shadow-md shadow-[#4E45D5]/30 group-hover:bg-[#6860EF] transition-colors">
            <Layers className="w-5 h-5 text-white" />
          </div>

          {!collapsed && (
            <div className="flex flex-col overflow-hidden transition-opacity duration-150">
              <span
                className="text-lg font-bold text-white tracking-tight leading-none"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                TexLoom
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#A9A7C0] mt-1 font-semibold">
                Wholesale Seller
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-[#A9A7C0] hover:text-white hover:bg-[#17142F] transition-colors"
          aria-label="Close sidebar drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const active = isLinkActive(item.path);
          const Icon = item.icon;

          return (
            <div key={item.path} className="relative group">
              <Link
                href={item.path}
                onClick={onCloseMobile}
                className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-[#4E45D5] text-white shadow-sm font-semibold'
                    : 'text-[#CBC9D9] hover:text-white hover:bg-[#17142F]'
                } ${collapsed ? 'justify-center px-0 h-11 w-11 mx-auto' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    active ? 'text-white' : 'text-[#A9A7C0] group-hover:text-white'
                  }`}
                />

                {!collapsed && (
                  <span className="truncate">{item.label}</span>
                )}
              </Link>

              {/* Tooltip on collapsed state */}
              {collapsed && (
                <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[#0B091C] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl border border-[#2B2848] whitespace-nowrap">
                    {item.label}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Expandable Settings Item */}
        <div className="relative group pt-1">
          {collapsed ? (
            /* Collapsed icon rail: Settings shows only icon with tooltip, clicks to /settings/catalogue-templates */
            <div className="relative group">
              <Link
                href="/settings/catalogue-templates"
                onClick={onCloseMobile}
                className={`flex items-center justify-center h-11 w-11 mx-auto rounded-xl text-sm font-medium transition-all ${
                  isSettingsActive
                    ? 'bg-[#4E45D5] text-white shadow-sm font-semibold'
                    : 'text-[#CBC9D9] hover:text-white hover:bg-[#17142F]'
                }`}
              >
                <Settings
                  className={`w-5 h-5 shrink-0 ${
                    isSettingsActive ? 'text-white' : 'text-[#A9A7C0] group-hover:text-white'
                  }`}
                />
              </Link>

              <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-[#0B091C] text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-xl border border-[#2B2848] whitespace-nowrap">
                  Settings
                </div>
              </div>
            </div>
          ) : (
            /* Expanded & Mobile: Settings row toggles submenu */
            <div>
              <button
                type="button"
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isSettingsActive
                    ? 'bg-[#17142F] text-white font-semibold'
                    : 'text-[#CBC9D9] hover:text-white hover:bg-[#17142F]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Settings
                    className={`w-5 h-5 shrink-0 ${
                      isSettingsActive ? 'text-[#6860EF]' : 'text-[#A9A7C0]'
                    }`}
                  />
                  <span>Settings</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#A9A7C0] transition-transform duration-200 ${
                    settingsOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenu with 2 items */}
              {settingsOpen && (
                <div className="mt-1 space-y-1 pl-3">
                  {SETTINGS_SUB_ITEMS.map((sub) => {
                    const isSubActive = pathname === sub.path || pathname.startsWith(sub.path + '/');
                    const SubIcon = sub.icon;

                    return (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        onClick={onCloseMobile}
                        className={`flex items-center gap-2.5 pl-6 pr-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isSubActive
                            ? 'bg-[#4E45D5] text-white shadow-xs font-semibold'
                            : 'text-[#CBC9D9] hover:text-white hover:bg-[#17142F]'
                        }`}
                      >
                        <SubIcon
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSubActive ? 'text-white' : 'text-[#A9A7C0]'
                          }`}
                        />
                        <span className="truncate">{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </nav>


      {/* Collapse Rail Toggle Footer (Desktop only) */}
      <div className="hidden md:flex p-3 border-t border-[#17142F] shrink-0 items-center justify-end">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`h-9 rounded-lg text-[#A9A7C0] hover:text-white hover:bg-[#17142F] transition-all flex items-center justify-center ${
            collapsed ? 'w-full' : 'w-full gap-2 px-3 justify-between'
          }`}
          title={collapsed ? 'Expand sidebar (260px)' : 'Collapse sidebar (72px)'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!collapsed && (
            <span className="text-xs font-medium text-[#A9A7C0]">Collapse Menu</span>
          )}
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-200 z-30 ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        <div
          className={`fixed top-0 bottom-0 left-0 transition-all duration-200 z-30 ${
            collapsed ? 'w-[72px]' : 'w-[260px]'
          }`}
        >
          {navContent}
        </div>
      </aside>

      {/* Mobile Drawer Backdrop and Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-[270px] max-w-[85vw] h-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
