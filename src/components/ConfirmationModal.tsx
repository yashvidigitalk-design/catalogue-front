'use client';

import React, { useState } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, X, HelpCircle } from 'lucide-react';

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

  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          iconBg: 'bg-[#ECFDF5]',
          iconColor: 'text-[#059669]',
          confirmBtn: 'bg-[#059669] hover:bg-[#047857] text-white',
          icon: <CheckCircle className="w-6 h-6 text-[#059669]" />,
        };
      case 'danger':
        return {
          iconBg: 'bg-[#FFF1F2]',
          iconColor: 'text-[#E11D48]',
          confirmBtn: 'bg-[#E11D48] hover:bg-[#BE123C] text-white',
          icon: <AlertCircle className="w-6 h-6 text-[#E11D48]" />,
        };
      case 'warning':
        return {
          iconBg: 'bg-[#FFFBEB]',
          iconColor: 'text-[#D97706]',
          confirmBtn: 'bg-[#D97706] hover:bg-[#B45309] text-white',
          icon: <AlertTriangle className="w-6 h-6 text-[#D97706]" />,
        };
      case 'primary':
      default:
        return {
          iconBg: 'bg-[#EEF2FF]',
          iconColor: 'text-[#4E45D5]',
          confirmBtn: 'bg-[#4E45D5] hover:bg-[#6860EF] text-white',
          icon: <HelpCircle className="w-6 h-6 text-[#4E45D5]" />,
        };
    }
  };

  const currentVariant = getVariantStyles();

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E2E1EC] p-6 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${currentVariant.iconBg}`}
          >
            {currentVariant.icon}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#100E26] leading-tight">
                  {title}
                </h3>
                {tag && <div>{tag}</div>}
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
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
                  {remarkLabel} {remarkRequired && <span className="text-[#E11D48]">*</span>}
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => {
                    setRemark(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder={remarkPlaceholder}
                  rows={3}
                  className={`w-full p-2.5 text-sm bg-white border ${
                    error ? 'border-[#E11D48]' : 'border-[#E2E1EC]'
                  } rounded-lg text-[#100E26] placeholder-[#9493A8] focus:outline-none focus:border-[#4E45D5] focus:ring-2 focus:ring-[#4E45D5]/15 transition-all resize-none`}
                />
                {error && <p className="text-xs text-[#E11D48] mt-1">{error}</p>}
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
