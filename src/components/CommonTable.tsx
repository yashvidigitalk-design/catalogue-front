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
  const activePage = isControlledPagination ? externalPage : internalPage;

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

  const totalCount = externalTotal !== undefined ? externalTotal : data.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-white border border-[#E2E1EC] rounded-xl shadow-xs overflow-hidden flex flex-col">
      {/* Top Bar: SearchInput on left, filters on right */}
      <div className="p-4 border-b border-[#E2E1EC] bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="w-full sm:w-72 md:w-80">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={searchPlaceholder}
          />
        </div>

        {filters && (
          <div className="flex flex-wrap items-center gap-2.5 justify-start sm:justify-end">
            {filters}
          </div>
        )}
      </div>

      {/* Middle: Dynamic columns, consistent row height, horizontal scroll */}
      <div className="overflow-x-auto min-h-[320px]">
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
                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`h-11 px-4 py-3 font-semibold ${alignClass} ${col.className || ''}`}
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
                  className="h-64 text-center text-[#5A586E]"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#4E45D5]/20 border-t-[#4E45D5] rounded-full animate-spin" />
                    <span className="text-xs font-medium">Loading data...</span>
                  </div>
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              /* If data is empty it must show exactly: "No data found" */
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-64 text-center text-[#5A586E] font-medium"
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
                    className="h-14 hover:bg-[#F7F7FB]/70 transition-colors"
                  >
                    {columns.map((col) => {
                      const alignClass =
                        col.align === 'right'
                          ? 'text-right'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left';

                      const cellContent = col.render
                        ? col.render(row, rowIndex)
                        : (row as Record<string, unknown>)[col.key] != null
                        ? String((row as Record<string, unknown>)[col.key])
                        : '—';

                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3 align-middle ${alignClass} ${col.className || ''}`}
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

      {/* Bottom: Pagination */}
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
