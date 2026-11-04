'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, X, HelpCircle, LucideIcon } from 'lucide-react';
import { TextareaField } from '@/components/FormControls';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (remark?: string) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary' | 'warning' | 'success';
  tag?: React.ReactNode;
  showRemark?: boolean;
  remarkRequired?: boolean;
  remarkLabel?: string;
  remarkPlaceholder?: string;
}

const VARIANT_CONFIG: Record<
  'danger' | 'primary' | 'warning' | 'success',
  {
    iconBg: string;
    confirmBtn: string;
    icon: LucideIcon;
    iconColor: string;
  }
> = {
  success: {
    iconBg: 'bg-[#ECFDF5]',
    confirmBtn: 'bg-[#059669] hover:bg-[#047857] text-white',
    icon: CheckCircle,
    iconColor: 'text-[#059669]',
  },
  danger: {
    iconBg: 'bg-[#FFF1F2]',
    confirmBtn: 'bg-[#E11D48] hover:bg-[#BE123C] text-white',
    icon: AlertCircle,
    iconColor: 'text-[#E11D48]',
  },
  warning: {
    iconBg: 'bg-[#FFFBEB]',
    confirmBtn: 'bg-[#D97706] hover:bg-[#B45309] text-white',
    icon: AlertTriangle,
    iconColor: 'text-[#D97706]',
  },
  primary: {
    iconBg: 'bg-[#EEF2FF]',
    confirmBtn: 'bg-[#4E45D5] hover:bg-[#6860EF] text-white',
    icon: HelpCircle,
    iconColor: 'text-[#4E45D5]',
  },
};

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  tag,
  showRemark = false,
  remarkRequired = false,
  remarkLabel = 'Remarks / Reason (Optional)',
  remarkPlaceholder = 'Add any notes, batch instructions or dispatch reasons...',
}: ConfirmationModalProps) {
  const [remark, setRemark] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (remarkRequired && !remark.trim()) {
      setError('A remark is required to proceed.');
      return;
    }
    setError('');
    onConfirm(remark);
    setRemark('');
  };

  const handleCancel = () => {
    setRemark('');
    setError('');
    onClose();
  };

  const currentVariant = VARIANT_CONFIG[variant] || VARIANT_CONFIG.danger;
  const IconComponent = currentVariant.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in" >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E2E1EC] p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}
          >
            <IconComponent className={`w-6 h-6 ${currentVariant.iconColor}`} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#100E26] leading-tight">
                  {title}
                </h3>
                {tag}
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="text-[#9493A8] hover:text-[#100E26] p-1 rounded-md hover:bg-[#F7F7FB]"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-[#5A586E] mt-2 leading-relaxed">
              {description}
            </p>

            {showRemark && (
              <div className="mt-4">
                <TextareaField
                  label={remarkLabel}
                  required={remarkRequired}
                  value={remark}
                  onChange={(e) => {
                    setRemark(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={remarkPlaceholder}
                  rows={3}
                  error={error}
                  className="resize-none text-sm"
                />
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="h-10 px-4 rounded-lg border border-[#E2E1EC] bg-white text-sm font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`h-10 px-5 rounded-lg text-sm font-medium shadow-sm transition-colors ${currentVariant.confirmBtn}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
