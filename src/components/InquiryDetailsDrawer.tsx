'use client';

import { CheckCircle2, Building2, Phone, MapPin, Calendar, Tag, Layers, Check } from 'lucide-react';
import CommonDrawer from '@/components/CommonDrawer';
import StatusBadge from '@/components/StatusBadge';
import { Inquiry } from '@/types';
import { useToast } from '@/hooks/useToast';

interface InquiryDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  inquiry: Inquiry | null;
  onMarkSolved?: (inquiryId: string) => void;
}

export default function InquiryDetailsDrawer({
  open,
  onClose,
  inquiry,
  onMarkSolved,
}: InquiryDetailsDrawerProps) {
  const { showToast } = useToast();

  if (!inquiry) return null;

  const isSolved = inquiry.status === 'solved';

  const handleMarkAsSolved = () => {
    onMarkSolved?.(inquiry.id);
    showToast('success', 'Inquiry marked as solved');
    onClose();
  };

  const footerActions = isSolved ? (
    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-[#A7F3D0]">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>Inquiry Solved</span>
    </div>
  ) : (
    <button
      type="button"
      onClick={handleMarkAsSolved}
      className="btn-primary h-10 px-4 text-xs gap-1.5 bg-[#059669] hover:bg-[#047857]"
    >
      <Check className="w-3.5 h-3.5" />
      <span>Mark as Solved</span>
    </button>
  );

  return (
    <CommonDrawer
      isOpen={open}
      onClose={onClose}
      title="Inquiry Details"
      description={`Review bulk buyer request and fabric specifications for ${inquiry.id}.`}
      cancelText="Close"
      width="lg"
      footerActions={footerActions}
    >
      <div className="space-y-5">
        {/* Buyer Details Card */}
        <div className="p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#4E45D5]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
              Buyer Details
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                Buyer Name
              </span>
              <span className="font-bold text-[#100E26] text-sm mt-0.5 block">
                {inquiry.buyerName}
              </span>
            </div>

            <div>
              <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                Company / Firm
              </span>
              <span className="font-semibold text-[#5A586E] mt-0.5 block">
                {inquiry.buyerCompany}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#5A586E]">
              <Phone className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />
              <span className="font-tabular font-medium text-[#100E26]">
                {inquiry.contactNumber}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#5A586E]">
              <MapPin className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />
              <span className="font-medium text-[#100E26]">{inquiry.city}</span>
            </div>
          </div>
        </div>

        {/* Product Details Card */}
        <div className="p-4 bg-white border border-[#E2E1EC] rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4E45D5]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
              Product Specifications
            </h4>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={inquiry.productImage}
                alt={inquiry.productName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-[#100E26] truncate">
                {inquiry.productName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
                  {inquiry.designNumber}
                </span>
                <span className="text-xs font-bold text-[#100E26] font-tabular">
                  ₹{inquiry.wholesalePrice.toLocaleString('en-IN')} / meter
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Information Card */}
        <div className="p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#4E45D5]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                Buyer Inquiry
              </h4>
            </div>

            <StatusBadge
              label={isSolved ? 'Solved' : 'New'}
              variant={isSolved ? 'green' : 'blue'}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-2.5 bg-white border border-[#E2E1EC] rounded-lg">
              <span className="text-[#9493A8] text-[10px] uppercase font-semibold block">
                Requested Quantity
              </span>
              <span className="font-bold text-sm text-[#100E26] font-tabular mt-0.5 block">
                {inquiry.requestedQuantity}
              </span>
            </div>

            <div className="p-2.5 bg-white border border-[#E2E1EC] rounded-lg">
              <span className="text-[#9493A8] text-[10px] uppercase font-semibold block">
                Inquiry Date
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#100E26] font-tabular mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-[#9493A8]" />
                <span>{inquiry.inquiryDate}</span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-[#5A586E] block mb-1">
              Inquiry Note / Request Details:
            </span>
            <p className="text-xs text-[#100E26] leading-relaxed bg-white p-3 rounded-lg border border-[#E2E1EC]">
              {inquiry.description}
            </p>
          </div>
        </div>
      </div>
    </CommonDrawer>
  );
}