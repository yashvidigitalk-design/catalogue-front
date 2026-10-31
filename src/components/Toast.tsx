'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage, ToastType } from '@/types';
import { useToast } from '@/hooks/useToast';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

const toastConfigs: Record<
  ToastType,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  success: {
    bg: 'bg-[#ECFDF5]',
    border: 'border-[#A7F3D0]',
    text: 'text-[#059669]',
    icon: <CheckCircle2 className="w-5 h-5 text-[#059669] shrink-0" />,
  },
  error: {
    bg: 'bg-[#FFF1F2]',
    border: 'border-[#FECDD3]',
    text: 'text-[#E11D48]',
    icon: <AlertCircle className="w-5 h-5 text-[#E11D48] shrink-0" />,
  },
  warning: {
    bg: 'bg-[#FFFBEB]',
    border: 'border-[#FDE68A]',
    text: 'text-[#D97706]',
    icon: <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />,
  },
  info: {
    bg: 'bg-[#EEF2FF]',
    border: 'border-[#C7D2FE]',
    text: 'text-[#4338CA]',
    icon: <Info className="w-5 h-5 text-[#4338CA] shrink-0" />,
  },
};

export function ToastItem({ toast, onDismiss }: ToastProps) {
  const config = toastConfigs[toast.type] || toastConfigs.info;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 bg-white border ${config.border} rounded-xl shadow-lg shadow-black/5 min-w-[320px] max-w-md pointer-events-auto transition-all animate-in slide-in-from-top-4 fade-in duration-200`}
    >
      <div className={`p-1 rounded-lg ${config.bg}`}>{config.icon}</div>
      <div className="flex-1 pt-0.5">
        <h4 className="text-sm font-semibold text-[#100E26]">{toast.title}</h4>
        {toast.description && (
          <p className="text-xs text-[#5A586E] mt-0.5 leading-relaxed">
            {toast.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-[#9493A8] hover:text-[#100E26] p-1 rounded-md hover:bg-[#F7F7FB] transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-md w-full"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
      ))}
    </div>
  );
}
