'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, LogOut, ChevronDown, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { CURRENT_SELLER } from '@/lib/sampleData';
import ConfirmationModal from '@/components/ConfirmationModal';
import { triggerToast } from '@/hooks/useToast';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    triggerToast(
      'info',
      'Logged Out',
      'You have been logged out of your session. (Prototype session stays intact)'
    );
  };

  return (
    <>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-10 pl-2 pr-2.5 inline-flex items-center gap-2.5 rounded-lg border border-[#E2E1EC] bg-white hover:bg-[#F7F7FB] transition-colors focus:outline-none focus:border-[#4E45D5]"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CURRENT_SELLER.avatarUrl}
            alt={CURRENT_SELLER.name}
            className="w-7 h-7 rounded-full object-cover border border-[#E2E1EC] shrink-0"
          />

          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-[#100E26] leading-tight truncate max-w-[150px]">
              {CURRENT_SELLER.businessName}
            </span>
            <span className="text-[10px] text-[#5A586E] leading-tight">
              {CURRENT_SELLER.city}, Gujarat
            </span>
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-[#9493A8] transition-transform duration-150 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 z-50 mt-1.5 w-64 rounded-xl bg-white p-2 shadow-xl border border-[#E2E1EC] focus:outline-none animate-in fade-in-50 zoom-in-95 duration-100">
            {/* User Info Card */}
            <div className="p-3 bg-[#F7F7FB] rounded-lg border border-[#E2E1EC]/60 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#100E26]">
                  {CURRENT_SELLER.name}
                </span>
                <span title="Verified Wholesale Seller">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                </span>
              </div>
              <p className="text-xs font-semibold text-[#4E45D5]">
                {CURRENT_SELLER.businessName}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#5A586E] pt-2 border-t border-[#E2E1EC]/60">
                <span>Tier: {CURRENT_SELLER.planName}</span>
                <span className="text-[#059669] font-medium">Verified Mill</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-0.5">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
              >
                <Building className="w-4 h-4 text-[#64748B]" />
                <span>Mill Profile & Settings</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setShowLogoutConfirm(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#E11D48] hover:bg-[#FFF1F2] transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-[#E11D48]" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reusable ConfirmationModal for Logout */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Session Logout"
        description="Are you sure you want to end your current session for Rajesh Varma Textiles? Unsaved form drafts will not be retained."
        confirmText="Log Out"
        cancelText="Stay Logged In"
        variant="danger"
      />
    </>
  );
}
