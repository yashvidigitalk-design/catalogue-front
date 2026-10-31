'use client';

import React from 'react';
import { StatusVariant } from '@/types';

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  showDot?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<
  StatusVariant,
  { bg: string; text: string; border: string; dot: string }
> = {
  green: {
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#059669]',
    border: 'border-[#A7F3D0]',
    dot: 'bg-[#059669]',
  },
  amber: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#D97706]',
    border: 'border-[#FDE68A]',
    dot: 'bg-[#D97706]',
  },
  red: {
    bg: 'bg-[#FFF1F2]',
    text: 'text-[#E11D48]',
    border: 'border-[#FECDD3]',
    dot: 'bg-[#E11D48]',
  },
  blue: {
    bg: 'bg-[#EEF2FF]',
    text: 'text-[#4338CA]',
    border: 'border-[#C7D2FE]',
    dot: 'bg-[#4338CA]',
  },
  slate: {
    bg: 'bg-[#F1F5F9]',
    text: 'text-[#475569]',
    border: 'border-[#E2E8F0]',
    dot: 'bg-[#64748B]',
  },
};

export default function StatusBadge({
  label,
  variant = 'blue',
  showDot = true,
  size = 'md',
  className = '',
  icon,
}: StatusBadgeProps) {
  const styles = variantStyles[variant] || variantStyles.blue;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles.bg} ${styles.text} ${styles.border} ${sizeClasses} ${className}`}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${styles.dot}`}
          aria-hidden="true"
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="capitalize">{label}</span>
    </span>
  );
}
