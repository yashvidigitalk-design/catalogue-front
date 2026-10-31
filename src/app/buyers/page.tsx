'use client';

import React, { useState } from 'react';
import { Eye, Edit2, Pencil, Check, X, Building2, Mail, Phone, MapPin, Calendar, Tag } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CommonTable from '@/components/CommonTable';
import CommonDrawer from '@/components/CommonDrawer';
import { Buyer, TableColumn } from '@/types';
import { INITIAL_BUYERS } from '@/lib/buyersData';
import { useToast } from '@/hooks/useToast';

export default function BuyersPage() {
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');

  // Inline editing state for Buyer-Specific Rate
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [inlineRateValue, setInlineRateValue] = useState('');

  // Drawer state
  const [drawerBuyer, setDrawerBuyer] = useState<Buyer | null>(null);
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>('view');
  const [drawerCustomRate, setDrawerCustomRate] = useState<string>('');
  const [useDefaultRate, setUseDefaultRate] = useState(false);

  // Search by Buyer Name, Business Name or Phone Number
  const q = searchTerm.toLowerCase();
  const filteredBuyers = INITIAL_BUYERS.filter((b) => {
    if (!searchTerm) return true;
    return (
      b.name.toLowerCase().includes(q) ||
      b.businessName.toLowerCase().includes(q) ||
      b.phone.toLowerCase().includes(q) ||
      b.city.toLowerCase().includes(q)
    );
  });

  // Inline edit handlers
  const handleStartInlineEdit = (b: Buyer) => {
    setInlineEditingId(b.id);
    setInlineRateValue(b.customRate != null ? String(b.customRate) : '');
  };

  const handleSaveInlineRate = () => {
    showToast('success', 'Buyer rate saved');
    setInlineEditingId(null);
  };

  const handleResetInlineRate = () => {
    showToast('success', 'Buyer rate reset to default wholesale price');
    setInlineEditingId(null);
  };

  const handleCancelInlineEdit = () => {
    setInlineEditingId(null);
  };

  // Open drawer in View mode
  const handleOpenView = (b: Buyer) => {
    setDrawerBuyer(b);
    setDrawerMode('view');
  };

  // Open drawer in Edit mode
  const handleOpenEdit = (b: Buyer) => {
    setDrawerBuyer(b);
    setDrawerMode('edit');
    setDrawerCustomRate(b.customRate != null ? String(b.customRate) : '');
    setUseDefaultRate(b.customRate == null);
  };

  // Save rate from drawer
  const handleSaveDrawerRate = () => {
    showToast('success', 'Buyer rate saved');
    setDrawerBuyer(null);
  };

  // CommonTable Columns
  const columns: TableColumn<Buyer>[] = [
    {
      key: 'name',
      header: 'Buyer Name',
      width: '160px',
      render: (b) => {
        const initials = b.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .substring(0, 2)
          .toUpperCase();
        return (
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                b.avatarColor || 'bg-[#EEF2FF] text-[#4E45D5]'
              }`}
            >
              {initials}
            </div>
            <div className="font-semibold text-xs text-[#100E26] truncate max-w-[110px]" title={b.name}>
              {b.name}
            </div>
          </div>
        );
      },
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
                  placeholder="Rate"
                  className="w-20 h-7 pl-5 pr-1.5 text-xs font-tabular bg-white border border-[#4E45D5] rounded focus:outline-none ring-1 ring-[#4E45D5]/20"
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={handleSaveInlineRate}
                className="w-7 h-7 rounded bg-[#059669] hover:bg-[#047857] text-white flex items-center justify-center transition-colors shadow-xs"
                title="Save Rate"
                aria-label="Save Rate"
              >
                <Check className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleCancelInlineEdit}
                className="w-7 h-7 rounded border border-[#E2E1EC] hover:bg-[#F7F7FB] text-[#5A586E] flex items-center justify-center transition-colors"
                title="Cancel"
                aria-label="Cancel"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleResetInlineRate}
                className="text-[10px] text-[#E11D48] hover:underline font-medium ml-0.5 whitespace-nowrap"
                title="Reset to default wholesale price"
              >
                Clear
              </button>
            </div>
          );
        }

        if (b.customRate != null && b.customRate > 0) {
          return (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-xs text-[#100E26] font-tabular whitespace-nowrap">
                ₹{b.customRate.toLocaleString('en-IN')} / m
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] whitespace-nowrap">
                Custom Rate
              </span>
              <button
                type="button"
                onClick={() => handleStartInlineEdit(b)}
                className="p-1 text-[#9493A8] hover:text-[#4E45D5] hover:bg-[#EEF2FF] rounded transition-colors"
                title="Edit rate"
                aria-label={`Edit rate for ${b.name}`}
              >
                <Pencil className="w-3 h-3" />
              </button>
            </div>
          );
        }

        return (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] whitespace-nowrap">
              Default Wholesale Price
            </span>
            <button
              type="button"
              onClick={() => handleStartInlineEdit(b)}
              className="p-1 text-[#9493A8] hover:text-[#4E45D5] hover:bg-[#EEF2FF] rounded transition-colors"
              title="Set custom buyer rate"
              aria-label={`Set custom rate for ${b.name}`}
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
            onClick={() => handleOpenView(b)}
            className="p-1 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
            title="View Buyer Details"
            aria-label="View Buyer Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(b)}
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
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        pageSize={10}
      />

      {/* Buyer Details Drawer (View / Edit mode) */}
      <CommonDrawer
        isOpen={Boolean(drawerBuyer)}
        onClose={() => setDrawerBuyer(null)}
        title={drawerMode === 'edit' ? 'Edit Buyer Rate' : 'Buyer Profile Details'}
        description={
          drawerMode === 'edit'
            ? 'Adjust wholesale pricing agreements for this verified buyer.'
            : 'Buyer credentials, registration profile, and customized fabric rates.'
        }
        onSave={drawerMode === 'edit' ? handleSaveDrawerRate : undefined}
        saveText="Save Rate"
        cancelText={drawerMode === 'edit' ? 'Cancel' : 'Close'}
        width="lg"
      >
        {drawerBuyer && (
          <div className="space-y-6">
            {/* Buyer Profile Header */}
            <div className="flex items-start gap-4 p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  drawerBuyer.avatarColor || 'bg-[#EEF2FF] text-[#4E45D5]'
                }`}
              >
                {drawerBuyer.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-[#100E26] truncate">
                  {drawerBuyer.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#5A586E] font-medium mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#9493A8]" />
                  <span className="truncate">{drawerBuyer.businessName}</span>
                </div>
              </div>
            </div>

            {/* Contact & Registration Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg space-y-1">
                <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                  Email Address
                </span>
                <div className="flex items-center gap-1.5 text-[#100E26] font-medium truncate">
                  <Mail className="w-3.5 h-3.5 text-[#4E45D5] shrink-0" />
                  <span className="truncate">{drawerBuyer.email}</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg space-y-1">
                <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                  Phone Number
                </span>
                <div className="flex items-center gap-1.5 text-[#100E26] font-medium font-tabular">
                  <Phone className="w-3.5 h-3.5 text-[#4E45D5] shrink-0" />
                  <span>{drawerBuyer.phone}</span>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg space-y-1">
                <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                  City & State
                </span>
                <div className="flex items-center gap-1.5 text-[#100E26] font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#4E45D5] shrink-0" />
                  <span>
                    {drawerBuyer.city}
                    {drawerBuyer.state ? `, ${drawerBuyer.state}` : ''}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg space-y-1">
                <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                  Registration Date
                </span>
                <div className="flex items-center gap-1.5 text-[#100E26] font-medium font-tabular">
                  <Calendar className="w-3.5 h-3.5 text-[#4E45D5] shrink-0" />
                  <span>{drawerBuyer.registrationDate}</span>
                </div>
              </div>
            </div>

            {/* Rate Details Section */}
            <div className="pt-2 border-t border-[#E2E1EC] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#4E45D5]" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                    Wholesale Rate Agreement
                  </h4>
                </div>

                {drawerMode === 'view' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDrawerMode('edit');
                      setDrawerCustomRate(
                        drawerBuyer.customRate != null ? String(drawerBuyer.customRate) : ''
                      );
                      setUseDefaultRate(drawerBuyer.customRate == null);
                    }}
                    className="text-xs font-semibold text-[#4E45D5] hover:underline inline-flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" /> Edit Rate
                  </button>
                )}
              </div>

              {drawerMode === 'view' ? (
                /* Read-Only Rate Details Card */
                <div className="p-4 rounded-xl bg-[#F7F7FB] border border-[#E2E1EC] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#5A586E]">Current Rate Plan:</span>
                    {drawerBuyer.customRate != null && drawerBuyer.customRate > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE]">
                        Custom Rate: ₹{drawerBuyer.customRate.toLocaleString('en-IN')} / m
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                        Default Wholesale Price
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[#5A586E] leading-relaxed pt-2 border-t border-[#E2E1EC]/60">
                    {drawerBuyer.customRate != null && drawerBuyer.customRate > 0 ? (
                      <>
                        This buyer enjoys a negotiated flat wholesale rate of{' '}
                        <span className="font-bold text-[#100E26]">
                          ₹{drawerBuyer.customRate} / meter
                        </span>{' '}
                        across eligible fabric weaves in your shared catalogue.
                      </>
                    ) : (
                      <>
                        This buyer orders at standard wholesale catalogue list prices without
                        any exclusive custom volume discounting.
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Editable Rate Section */
                <div className="p-4 rounded-xl bg-[#F7F7FB] border border-[#E2E1EC] space-y-4">
                  <p className="text-xs text-[#5A586E]">
                    Buyer registration profile is managed by the buyer. You can set or remove
                    a custom wholesale rate per meter below.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#100E26]">
                      <input
                        type="checkbox"
                        checked={useDefaultRate}
                        onChange={(e) => {
                          setUseDefaultRate(e.target.checked);
                          if (e.target.checked) {
                            setDrawerCustomRate('');
                          }
                        }}
                        className="w-4 h-4 rounded text-[#4E45D5] focus:ring-[#4E45D5]"
                      />
                      <span>Use Default Wholesale Price (No Custom Discount)</span>
                    </label>

                    {!useDefaultRate && (
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                          Buyer-Specific Custom Rate (₹ / meter)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#5A586E]">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={drawerCustomRate}
                            onChange={(e) => setDrawerCustomRate(e.target.value)}
                            placeholder="e.g. 850"
                            className="input-base pl-8 font-tabular"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CommonDrawer>
    </div>
  );
}
