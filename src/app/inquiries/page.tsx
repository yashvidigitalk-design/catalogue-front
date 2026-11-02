'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CommonTable from '@/components/CommonTable';
import StatusBadge from '@/components/StatusBadge';
import FilterDropdown from '@/components/FilterDropdown';
import InquiryDetailsDrawer from '@/components/InquiryDetailsDrawer';
import { Inquiry, TableColumn } from '@/types';
import { INITIAL_INQUIRIES } from '@/lib/inquiriesData';

export default function InquiriesPage() {
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>(INITIAL_INQUIRIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewingInquiry, setViewingInquiry] = useState<Inquiry | null>(null);

  // Inquiries Table Data (backend handles search & filter; frontend does not filter)
  const filteredInquiries = inquiriesList;

  const handleOpenView = (inq: Inquiry) => {
    setViewingInquiry(inq);
  };

  const handleMarkSolved = (inquiryId: string) => {
    setInquiriesList((prev) =>
      prev.map((item) =>
        item.id === inquiryId ? { ...item, status: 'solved' } : item
      )
    );
  };

  // Status Filter options
  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'New', value: 'new' },
    { label: 'Solved', value: 'solved' },
  ];

  const tableFilters = (
    <FilterDropdown
      label="Status"
      options={statusOptions}
      selected={statusFilter}
      onSelect={setStatusFilter}
    />
  );

  // CommonTable Columns (fits 1366px screen, Actions sticky right)
  const columns: TableColumn<Inquiry>[] = [
    {
      key: 'id',
      header: 'Inquiry ID',
      width: '105px',
      render: (inq) => (
        <span className="font-semibold text-xs text-[#4E45D5] font-tabular">
          {inq.id}
        </span>
      ),
    },
    {
      key: 'buyerName',
      header: 'Buyer Name',
      width: '160px',
      render: (inq) => (
        <div className="max-w-[155px]">
          <div className="font-semibold text-xs text-[#100E26] truncate" title={inq.buyerName}>
            {inq.buyerName}
          </div>
          <div className="text-[11px] text-[#5A586E] truncate" title={inq.buyerCompany}>
            {inq.buyerCompany}
          </div>
        </div>
      ),
    },
    {
      key: 'contactNumber',
      header: 'Contact Number',
      width: '135px',
      render: (inq) => (
        <span className="text-xs text-[#100E26] font-tabular whitespace-nowrap">
          {inq.contactNumber}
        </span>
      ),
    },
    {
      key: 'productName',
      header: 'Product Name',
      width: '200px',
      render: (inq) => (
        <div className="flex items-center gap-2.5 max-w-[200px]">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={inq.productImage}
              alt={inq.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="overflow-hidden">
            <div className="font-semibold text-xs text-[#100E26] truncate" title={inq.productName}>
              {inq.productName}
            </div>
            <div className="text-[10px] text-[#4E45D5] font-semibold font-tabular">
              {inq.designNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (inq) => (
        <div className="text-xs text-[#5A586E] truncate max-w-sm" title={inq.description}>
          {inq.description}
        </div>
      ),
    },
    {
      key: 'requestedQuantity',
      header: 'Requested Qty',
      width: '125px',
      render: (inq) => (
        <span className="font-semibold text-xs text-[#100E26] font-tabular whitespace-nowrap">
          {inq.requestedQuantity}
        </span>
      ),
    },
    {
      key: 'inquiryDate',
      header: 'Inquiry Date',
      width: '115px',
      render: (inq) => (
        <span className="text-xs text-[#5A586E] font-tabular whitespace-nowrap">
          {inq.inquiryDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (inq) => (
        <StatusBadge
          label={inq.status === 'solved' ? 'Solved' : 'New'}
          variant={inq.status === 'solved' ? 'green' : 'blue'}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '75px',
      align: 'right',
      sticky: 'right',
      render: (inq) => (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => handleOpenView(inq)}
            className="p-1.5 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
            title="View Inquiry Details"
            aria-label="View Inquiry Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* PageHeader: Title, short description, no action button */}
      <PageHeader
        title="Inquiries"
        description="Buyer inquiries submitted through your shared digital wholesale catalogue and storefront."
      />

      {/* Main Table via CommonTable (Search left, filter right, pagination bottom) */}
      <CommonTable
        columns={columns}
        data={filteredInquiries}
        filters={tableFilters}
        searchPlaceholder="Search by buyer, product, or inquiry ID..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        pageSize={10}
      />

      {/* Inquiry Details Drawer */}
      <InquiryDetailsDrawer
        open={Boolean(viewingInquiry)}
        onClose={() => setViewingInquiry(null)}
        inquiry={viewingInquiry}
        onMarkSolved={handleMarkSolved}
      />
    </div>
  );
}
