'use client';

import { useState } from 'react';
import { Eye, Edit2, Pencil, Check, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CommonTable from '@/components/CommonTable';
import BuyerDetailsDrawer from '@/components/BuyerDetailsDrawer';
import { Buyer, TableColumn } from '@/types';
import { INITIAL_BUYERS } from '@/lib/buyersData';
import { useToast } from '@/hooks/useToast';

export default function BuyersPage() {
  const { showToast } = useToast();

  const [buyersList, setBuyersList] = useState<Buyer[]>(INITIAL_BUYERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Inline editing state for Buyer-Specific Rate
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineRateValue, setInlineRateValue] = useState('');

  // Drawer state
  const [drawerBuyer, setDrawerBuyer] = useState<Buyer | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');

  // Buyers table data (search and filter will be handled by backend; frontend does not filter)
  const filteredBuyers = buyersList;

  const handleCancelInlineEdit = () => {
    setInlineEditingId(null);
    setInlineRateValue('');
  };

  // Handle page change: auto-cancels any in-progress inline edit
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleCancelInlineEdit();
  };

  // Handle search change: auto-cancels any in-progress inline edit
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    handleCancelInlineEdit();
  };

  // Common rate updater for inline & drawer
  const updateBuyerRate = (buyerId: string, newRate: number | undefined, message = 'Buyer rate saved') => {
    setBuyersList((prev) =>
      prev.map((b) => (b.id === buyerId ? { ...b, customRate: newRate } : b))
    );
    showToast('success', message);
    handleCancelInlineEdit();
  };

  // Inline edit handlers
  const handleStartInlineEdit = (b: Buyer) => {
    setInlineEditingId(b.id);
    setInlineRateValue(b.customRate != null ? String(b.customRate) : '');
  };

  const handleSaveInlineRate = (buyerId: string) => {
    const rateNum = inlineRateValue.trim() !== '' ? Number(inlineRateValue) : null;
    updateBuyerRate(buyerId, rateNum && rateNum > 0 ? rateNum : undefined);
  };

  const handleResetInlineRate = (buyerId: string) => {
    updateBuyerRate(buyerId, undefined, 'Buyer rate reset to default wholesale price');
  };

  // Open drawer in View or Edit mode
  const handleOpenDrawer = (b: Buyer, mode: 'view' | 'edit') => {
    handleCancelInlineEdit();
    setDrawerBuyer(b);
    setDrawerMode(mode);
  };

  // CommonTable Columns
  const columns: TableColumn<Buyer>[] = [
    {
      key: 'name',
      header: 'Buyer Name',
      width: '160px',
      render: (b) => (
        <div className="font-semibold text-xs text-[#100E26] truncate" title={b.name}>
          {b.name}
        </div>
      ),
    },
    {
      key: 'businessName',
      header: 'Company / Business Name',
      width: '190px',
      render: (b) => (
        <div className="font-medium text-xs text-[#100E26] truncate max-w-[190px]" title={b.businessName}>
          {b.businessName}
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      width: '180px',
      render: (b) => (
        <span className="text-xs text-[#5A586E] truncate max-w-[180px] block" title={b.email}>
          {b.email}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone Number',
      width: '135px',
      render: (b) => (
        <span className="text-xs text-[#100E26] font-tabular whitespace-nowrap">
          {b.phone}
        </span>
      ),
    },
    {
      key: 'city',
      header: 'City',
      width: '120px',
      render: (b) => (
        <div className="text-xs text-[#5A586E]">
          <span className="text-[#100E26] font-medium">{b.city}</span>
          {b.state && <span className="text-[#9493A8] text-[11px] block">{b.state}</span>}
        </div>
      ),
    },
    {
      key: 'registrationDate',
      header: 'Registration Date',
      width: '130px',
      render: (b) => (
        <span className="text-xs text-[#5A586E] font-tabular whitespace-nowrap">
          {b.registrationDate}
        </span>
      ),
    },
    {
      key: 'customRate',
      header: 'Buyer-Specific Rate',
      width: '220px',
      render: (b) => {
        const isEditing = inlineEditingId === b.id;

        if (isEditing) {
          return (
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5A586E]">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  value={inlineRateValue}
                  onChange={(e) => setInlineRateValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveInlineRate(b.id);
                    } else if (e.key === 'Escape') {
                      e.preventDefault();
                      handleCancelInlineEdit();
                    }
                  }}
                  placeholder="Rate"
                  className="w-20 h-7 pl-5 pr-1.5 text-xs font-tabular bg-white border border-[#4E45D5] rounded focus:outline-none ring-1 ring-[#4E45D5]/20"
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={() => handleSaveInlineRate(b.id)}
                className="w-7 h-7 rounded bg-[#059669] hover:bg-[#047857] text-white flex items-center justify-center transition-colors shadow-xs"
                title="Save Rate (Enter)"
                aria-label="Save Rate"
              >
                <Check className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleCancelInlineEdit}
                className="w-7 h-7 rounded border border-[#E2E1EC] hover:bg-[#F7F7FB] text-[#5A586E] flex items-center justify-center transition-colors"
                title="Cancel (Esc)"
                aria-label="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => handleResetInlineRate(b.id)}
                className="text-[10px] text-[#E11D48] hover:underline font-medium ml-0.5 whitespace-nowrap"
                title="Reset to default wholesale price"
              >
                Clear
              </button>
            </div>
          );
        }

        const hasCustomRate = b.customRate != null && b.customRate > 0;

        return (
          <div className="flex items-center gap-2 flex-wrap">
            {hasCustomRate ? (
              <>
                <span className="font-bold text-xs text-[#100E26] font-tabular whitespace-nowrap">
                  ₹{b.customRate!.toLocaleString('en-IN')} / m
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] whitespace-nowrap">
                  Custom Rate
                </span>
              </>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">
                Default Wholesale Price
              </span>
            )}
            <button
              type="button"
              onClick={() => handleStartInlineEdit(b)}
              className="p-1 text-[#9493A8] hover:text-[#4E45D5] hover:bg-[#EEF2FF] rounded transition-colors"
              title={hasCustomRate ? 'Edit rate' : 'Set custom buyer rate'}
              aria-label={`${hasCustomRate ? 'Edit' : 'Set custom'} rate for ${b.name}`}
            >
              <Pencil className="w-3 h-3" />
            </button>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '85px',
      align: 'right',
      sticky: 'right',
      render: (b) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleOpenDrawer(b, 'view')}
            className="p-1 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
            title="View Buyer Details"
            aria-label="View Buyer Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenDrawer(b, 'edit')}
            className="p-1 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
            title="Edit Buyer Rate"
            aria-label="Edit Buyer Rate"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* PageHeader: Title and description (no action button) */}
      <PageHeader
        title="Buyers"
        description="Manage verified wholesale buyers, garment export houses, and regional trade distributor rate agreements."
      />

      {/* Main Buyers Table via CommonTable (Search by name, business, phone. No other filters) */}
      <CommonTable
        columns={columns}
        data={filteredBuyers}
        searchPlaceholder="Search by buyer name, business, or phone..."
        onSearch={handleSearchChange}
        searchValue={searchTerm}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={10}
      />

      {/* Buyer Details Drawer (View / Edit mode) */}
      <BuyerDetailsDrawer
        open={Boolean(drawerBuyer)}
        onClose={() => setDrawerBuyer(null)}
        buyer={drawerBuyer}
        mode={drawerMode}
        onSaveRate={updateBuyerRate}
      />
    </div>
  );
}
