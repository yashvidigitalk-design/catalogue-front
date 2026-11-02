'use client';

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

  const getPageNumbers = (): (number | string)[] => {
    if (safeTotalPages <= 4) {
      const pages: number[] = [];
      for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    if (currentPage <= 2) {
      return [1, 2, '...', safeTotalPages];
    }
    if (currentPage >= safeTotalPages - 1) {
      return [1, '...', safeTotalPages - 1, safeTotalPages];
    }
    return [1, '...', currentPage, '...', safeTotalPages];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-4 bg-white border-t border-[#E2E1EC] ${className}`}
    >
      {/* Left: Showing X to Y of N records */}
      <div className="text-sm text-[#5A586E] font-medium font-tabular">
        Showing <span className="font-semibold text-[#100E26]">{startItem}</span> to{' '}
        <span className="font-semibold text-[#100E26]">{endItem}</span> of{' '}
        <span className="font-semibold text-[#100E26]">{totalRecords}</span> records
      </div>

      {/* Right: Previous button, page number buttons, Next button, "Page X of Y" */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Previous button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPrev}
          className={`h-9 px-3 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-all ${
            canPrev
              ? 'border-[#E2E1EC] bg-white text-[#100E26] hover:bg-[#F7F7FB] active:bg-[#ECEBF5]'
              : 'border-[#E2E1EC]/60 bg-[#F7F7FB] text-[#9493A8] cursor-not-allowed opacity-60'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Page number buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-9 flex items-center justify-center text-xs text-[#9493A8]"
                >
                  ...
                </span>
              );
            }
            const isCurrent = page === currentPage;
            return (
              <button
                key={`page-${page}`}
                type="button"
                onClick={() => onPageChange(Number(page))}
                className={`w-9 h-9 rounded-lg text-xs font-semibold font-tabular transition-all ${
                  isCurrent
                    ? 'bg-[#4E45D5] text-white shadow-xs'
                    : 'border border-[#E2E1EC] bg-white text-[#100E26] hover:bg-[#F7F7FB]'
                }`}
                aria-label={`Page ${page}`}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNext}
          className={`h-9 px-3 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 transition-all ${
            canNext
              ? 'border-[#E2E1EC] bg-white text-[#100E26] hover:bg-[#F7F7FB] active:bg-[#ECEBF5]'
              : 'border-[#E2E1EC]/60 bg-[#F7F7FB] text-[#9493A8] cursor-not-allowed opacity-60'
          }`}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* "Page X of Y" */}
        <div className="text-xs text-[#5A586E] font-medium font-tabular ml-2">
          Page <span className="font-semibold text-[#100E26]">{currentPage}</span> of{' '}
          <span className="font-semibold text-[#100E26]">{safeTotalPages}</span>
        </div>
      </div>
    </div>
  );
}
