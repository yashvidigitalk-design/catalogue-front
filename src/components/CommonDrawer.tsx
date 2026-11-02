'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface CommonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveText?: string;
  cancelText?: string;
  isSaving?: boolean;
  footerActions?: React.ReactNode;
  width?: 'md' | 'lg' | 'xl' | '2xl';
  zIndex?: string;
}

// Global LIFO stack of open drawers (attached to window to survive HMR/Fast Refresh)
interface DrawerStackEntry {
  id: string;
}

const getDrawerStack = (): DrawerStackEntry[] => {
  if (typeof window === 'undefined') return [];
  const win = window as unknown as { __COMMON_DRAWER_STACK__?: DrawerStackEntry[] };
  if (!win.__COMMON_DRAWER_STACK__) {
    win.__COMMON_DRAWER_STACK__ = [];
  }
  return win.__COMMON_DRAWER_STACK__;
};

export default function CommonDrawer({
  isOpen,
  onClose,
  title,
  description,
  children,
  onSave,
  saveText = 'Save Changes',
  cancelText = 'Cancel',
  isSaving = false,
  footerActions,
  width = 'lg',
  zIndex = 'z-50',
}: CommonDrawerProps) {
  const drawerId = React.useId();
  const onCloseRef = React.useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const stack = getDrawerStack();
    const existingIdx = stack.findIndex((d) => d.id === drawerId);
    if (existingIdx === -1) {
      stack.push({ id: drawerId });
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const currentStack = getDrawerStack();
        const topDrawer = currentStack[currentStack.length - 1];
        if (topDrawer && topDrawer.id === drawerId) {
          e.preventDefault();
          e.stopPropagation();
          onCloseRef.current();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      const currentStack = getDrawerStack();
      const idx = currentStack.findIndex((d) => d.id === drawerId);
      if (idx !== -1) {
        currentStack.splice(idx, 1);
      }
      if (currentStack.length === 0) {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isOpen, drawerId]);

  if (!isOpen) return null;

  const widthClasses = {
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  }[width] || 'max-w-xl';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`fixed inset-0 ${zIndex} overflow-hidden`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
        <div
          className={`w-screen ${widthClasses} bg-white shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-200`}
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E1EC] bg-[#FFFFFF] flex items-start justify-between gap-4 shrink-0">
            <div>
              <h2
                className="text-xl font-bold text-[#100E26] leading-tight"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {title}
              </h2>
              {description && (
                <p className="text-xs text-[#5A586E] mt-1 leading-normal">
                  {description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9493A8] hover:text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>

          {/* Fixed Footer */}
          <div className="px-6 py-4 border-t border-[#E2E1EC] bg-[#FFFFFF] shrink-0 flex items-center justify-between gap-3">
            <div>
              {footerActions}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="h-10 px-4 rounded-lg border border-[#E2E1EC] bg-white text-sm font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>

              {onSave && (
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="h-10 px-5 rounded-lg bg-[#4E45D5] hover:bg-[#6860EF] text-white text-sm font-medium shadow-sm transition-colors inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    saveText
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
