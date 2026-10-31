'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalRecords,
  pageSize = 10,
  onPageChange,
  className = '',
}: PaginationProps) {
  const safeTotalPages = Math.max(1, totalPages);
  const startItem = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalRecords);

  const canPrev = currentPage > 1;
  const canNext = currentPage < safeTotalPages;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-4 bg-white border-t border-[#E2E1EC] ${className}`}
    >
      <div className="text-sm text-[#5A586E] font-medium font-tabular">
        {totalRecords > 0 ? (
          <>
            Showing <span className="font-semibold text-[#100E26]">{startItem}</span> to{' '}
            <span className="font-semibold text-[#100E26]">{endItem}</span> of{' '}
            <span className="font-semibold text-[#100E26]">{totalRecords}</span> records
          </>
        ) : (
          <span>Total records: 0</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-[#5A586E] font-medium font-tabular mr-1">
          Page <span className="font-semibold text-[#100E26]">{currentPage}</span> of{' '}
          <span className="font-semibold text-[#100E26]">{safeTotalPages}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPrev}
            className={`h-10 px-3.5 rounded-lg border text-sm font-medium inline-flex items-center gap-1.5 transition-all ${
              canPrev
                ? 'border-[#E2E1EC] bg-white text-[#100E26] hover:bg-[#F7F7FB] active:bg-[#ECEBF5]'
                : 'border-[#E2E1EC]/60 bg-[#F7F7FB] text-[#9493A8] cursor-not-allowed opacity-60'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNext}
            className={`h-10 px-3.5 rounded-lg border text-sm font-medium inline-flex items-center gap-1.5 transition-all ${
              canNext
                ? 'border-[#E2E1EC] bg-white text-[#100E26] hover:bg-[#F7F7FB] active:bg-[#ECEBF5]'
                : 'border-[#E2E1EC]/60 bg-[#F7F7FB] text-[#9493A8] cursor-not-allowed opacity-60'
            }`}
            aria-label="Next page"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
