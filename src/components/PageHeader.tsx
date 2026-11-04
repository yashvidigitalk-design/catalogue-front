'use client';

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  actions,
  badge,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 mb-6 border-b border-[#E2E1EC]">
      <div>
        <div className="flex items-center gap-3">
          <h1
            className="text-[28px] font-bold text-[#100E26] tracking-tight leading-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {description && (
          <p className="text-[14px] font-normal text-[#5A586E] mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}