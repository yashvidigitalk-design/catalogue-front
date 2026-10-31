'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  caption?: string;
  icon?: React.ReactNode;
  iconBg?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  change,
  changeType = 'positive',
  caption = 'vs last month',
  icon,
  iconBg = 'bg-[#EEF2FF] text-[#4E45D5]',
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`bg-white border border-[#E2E1EC] rounded-xl p-5 shadow-[0_1px_3px_rgba(16,14,38,0.05)] transition-shadow hover:shadow-md ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#5A586E]">
            {title}
          </p>
          <div className="mt-2 text-2xl lg:text-[28px] font-bold text-[#100E26] font-tabular tracking-tight leading-none">
            {value}
          </div>
        </div>

        {icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
        )}
      </div>

      {(change || caption) && (
        <div className="mt-4 pt-3 border-t border-[#F1F0F7] flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-1 font-semibold font-tabular rounded-md px-1.5 py-0.5 ${
                changeType === 'positive'
                  ? 'text-[#059669] bg-[#ECFDF5]'
                  : changeType === 'negative'
                  ? 'text-[#E11D48] bg-[#FFF1F2]'
                  : 'text-[#5A586E] bg-[#F1F5F9]'
              }`}
            >
              {changeType === 'positive' && <TrendingUp className="w-3.5 h-3.5" />}
              {changeType === 'negative' && <TrendingDown className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {caption && <span className="text-[#9493A8] font-medium">{caption}</span>}
        </div>
      )}
    </div>
  );
}
