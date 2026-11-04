'use client';
import { useState, useEffect } from 'react';
import { Building2, Mail, Phone, MapPin, Calendar, Tag, Edit2 } from 'lucide-react';
import CommonDrawer from '@/components/CommonDrawer';
import { InputField } from '@/components/FormControls';
import { Buyer } from '@/types';
interface BuyerDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  buyer: Buyer | null;
  mode?: 'view' | 'edit';
  onSaveRate?: (buyerId: string, rate: number | undefined) => void;
}

export default function BuyerDetailsDrawer({
  open,
  onClose,
  buyer,
  mode: initialMode = 'view',
  onSaveRate,
}: BuyerDetailsDrawerProps) {
  const [drawerMode, setDrawerMode] = useState<'view' | 'edit'>(initialMode);
  const [drawerCustomRate, setDrawerCustomRate] = useState('');
  const [useDefaultRate, setUseDefaultRate] = useState(false);

  useEffect(() => {
    if (buyer) {
      setDrawerMode(initialMode);
      setDrawerCustomRate(buyer.customRate != null ? String(buyer.customRate) : '');
      setUseDefaultRate(buyer.customRate == null);
    }
  }, [buyer, initialMode]);

  if (!buyer) return null;

  const handleSaveDrawerRate = () => {
    const val = Number(drawerCustomRate);
    onSaveRate?.(buyer.id, !useDefaultRate && val > 0 ? val : undefined);
    onClose();
  };

  const hasCustomRate = Boolean(buyer.customRate && buyer.customRate > 0);

  const contactDetails = [
    { label: 'Email Address', value: buyer.email, icon: Mail, isTabular: false },
    { label: 'Phone Number', value: buyer.phone, icon: Phone, isTabular: true },
    { label: 'City & State', value: `${buyer.city}${buyer.state ? `, ${buyer.state}` : ''}`, icon: MapPin, isTabular: false },
    { label: 'Registration Date', value: buyer.registrationDate, icon: Calendar, isTabular: true },
  ];

  return (
    <CommonDrawer
      isOpen={open}
      onClose={onClose}
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
      <div className="space-y-6">
        {/* Buyer Profile Header */}
        <div className="flex items-start gap-4 p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              buyer.avatarColor || 'bg-[#EEF2FF] text-[#4E45D5]'
            }`}
          >
            {buyer.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#100E26] truncate">
              {buyer.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-[#5A586E] font-medium mt-0.5">
              <Building2 className="w-3.5 h-3.5 text-[#9493A8]" />
              <span className="truncate">{buyer.businessName}</span>
            </div>
          </div>
        </div>

        {/* Contact & Registration Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {contactDetails.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="p-3 bg-white border border-[#E2E1EC] rounded-lg space-y-1"
              >
                <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                  {item.label}
                </span>
                <div
                  className={`flex items-center gap-1.5 text-[#100E26] font-medium truncate ${
                    item.isTabular ? 'font-tabular' : ''
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#4E45D5] shrink-0" />
                  <span className="truncate">{item.value}</span>
                </div>
              </div>
            );
          })}
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
                onClick={() => setDrawerMode('edit')}
                className="text-xs font-semibold text-[#4E45D5] hover:underline inline-flex items-center gap-1 cursor-pointer"
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
                {hasCustomRate ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE]">
                    Custom Rate: ₹{buyer.customRate?.toLocaleString('en-IN')} / m
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                    Default Wholesale Price
                  </span>
                )}
              </div>

              <div className="text-xs text-[#5A586E] leading-relaxed pt-2 border-t border-[#E2E1EC]/60">
                {hasCustomRate ? (
                  <>
                    This buyer enjoys a negotiated flat wholesale rate of{' '}
                    <span className="font-bold text-[#100E26]">
                      ₹{buyer.customRate} / m
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
                      if (e.target.checked) setDrawerCustomRate('');
                    }}
                    className="w-4 h-4 rounded text-[#4E45D5] focus:ring-[#4E45D5]"
                  />
                  <span>Use Default Wholesale Price (No Custom Discount)</span>
                </label>

                {!useDefaultRate && (
                  <div className="pt-1">
                    <InputField
                      label="Buyer-Specific Custom Rate (₹ / meter)"
                      type="number"
                      min="0"
                      prefixIcon={<span className="text-sm font-semibold text-[#5A586E]">₹</span>}
                      value={drawerCustomRate}
                      onChange={(e) => setDrawerCustomRate(e.target.value)}
                      placeholder="e.g. 850"
                      className="!pl-7 font-tabular"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </CommonDrawer>
  );
}