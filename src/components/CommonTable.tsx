'use client';

import React, { useState, useMemo } from 'react';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import { TableColumn } from '@/types';

interface CommonTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  filters?: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  searchValue?: string;
  showSearch?: boolean;
  onRowClick?: (item: T) => void;
  pageSize?: number;
  totalRecords?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  keyExtractor?: (item: T, index: number) => string | number;
}

export default function CommonTable<T>({
  columns,
  data,
  filters,
  searchPlaceholder = 'Search records...',
  onSearch,
  searchValue: controlledSearch,
  showSearch = true,
  onRowClick,
  pageSize = 10,
  totalRecords: externalTotal,
  currentPage: externalPage,
  onPageChange: externalPageChange,
  isLoading = false,
  keyExtractor,
}: CommonTableProps<T>) {
  // Local state if not controlled externally
  const [internalSearch, setInternalSearch] = useState('');
  const [internalPage, setInternalPage] = useState(1);

  const isControlledSearch = controlledSearch !== undefined;
  const searchTerm = isControlledSearch ? controlledSearch : internalSearch;

  const handleSearchChange = (query: string) => {
    if (!isControlledSearch) {
      setInternalSearch(query);
      setInternalPage(1);
    }
    if (onSearch) {
      onSearch(query);
    }
  };

  const isControlledPagination = externalPage !== undefined;
  const totalCount = externalTotal !== undefined ? externalTotal : data.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  // Automatically clamp activePage to valid range
  const rawActivePage = isControlledPagination ? externalPage : internalPage;
  const activePage = Math.min(Math.max(1, rawActivePage), totalPages);

  const handlePageChange = (page: number) => {
    if (isControlledPagination) {
      if (externalPageChange) externalPageChange(page);
    } else {
      setInternalPage(page);
    }
  };

  // Local pagination if external totalRecords is not provided
  const processedData = useMemo(() => {
    if (externalTotal !== undefined) {
      // Server / parent-controlled data
      return data;
    }
    const startIndex = (activePage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, activePage, pageSize, externalTotal]);

  return (
    <div className="bg-white border border-[#E2E1EC] rounded-xl shadow-xs overflow-hidden flex flex-col w-full">
      {/* TOP: Search on left, Filters on right */}
      {(showSearch || filters) && (
        <div className="p-4 border-b border-[#E2E1EC] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {showSearch ? (
            <div className="w-full sm:w-72 md:w-80">
              <SearchInput
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={searchPlaceholder}
              />
            </div>
          ) : (
            <div />
          )}

          {filters && (
            <div className="flex flex-wrap items-center gap-2.5 justify-start sm:justify-end">
              {filters}
            </div>
          )}
        </div>
      )}

      {/* MIDDLE: Columns, compact row height, horizontal scroll on small screens, sticky Actions column */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E1EC] bg-[#F7F7FB] text-xs font-semibold text-[#5A586E] uppercase tracking-wider">
              {columns.map((col) => {
                const alignClass =
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left';

                const isStickyRight = col.sticky === 'right' || col.key === 'actions';
                const stickyClass = isStickyRight
                  ? 'sticky right-0 z-20 bg-[#F7F7FB] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]'
                  : '';

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`h-11 px-3.5 py-2.5 font-semibold whitespace-nowrap ${alignClass} ${stickyClass} ${col.className || ''}`}
                  >
                    {col.header}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E1EC] text-sm text-[#100E26]">
            {isLoading ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-48 text-center text-[#5A586E]"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#4E45D5]/20 border-t-[#4E45D5] rounded-full animate-spin" />
                    <span className="text-xs font-medium">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              /* EMPTY: exactly the text "No data found" */
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-48 text-center text-[#5A586E] font-medium"
                >
                  No data found
                </td>
              </tr>
            ) : (
              processedData.map((row, rowIndex) => {
                const rowKey = keyExtractor
                  ? keyExtractor(row, rowIndex)
                  : (row as { id?: string | number }).id ?? rowIndex;

                return (
                  <tr
                    key={String(rowKey)}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`h-13 group hover:bg-[#F7F7FB] transition-colors ${
                      onRowClick ? 'cursor-pointer' : ''
                    }`}
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      const isStickyRight = col.sticky === 'right' || col.key === 'actions';
                      const stickyClass = isStickyRight
                        ? 'sticky right-0 z-10 bg-white group-hover:bg-[#F7F7FB] shadow-[-6px_0_10px_-4px_rgba(0,0,0,0.06)]'
                        : '';

                      const cellContent = col.render
                        ? col.render(row, rowIndex)
                        : (row as Record<string, unknown>)[col.key] != null
                        ? String((row as Record<string, unknown>)[col.key])
                        : '—';

                      return (
                        <td
                          key={col.key}
                          className={`px-3.5 py-2.5 align-middle ${alignClass} ${stickyClass} ${col.className || ''}`}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* BOTTOM: Pagination with records count, buttons, and page info */}
      <Pagination
        currentPage={activePage}
        totalPages={totalPages}
        totalRecords={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
