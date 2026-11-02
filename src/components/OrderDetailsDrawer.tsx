'use client';

import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  MessageSquare,
  Check,
  X,
} from 'lucide-react';
import CommonDrawer from '@/components/CommonDrawer';
import StatusBadge from '@/components/StatusBadge';
import { Order } from '@/types';

interface OrderDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onAccept?: (order: Order) => void;
  onReject?: (order: Order) => void;
}

export default function OrderDetailsDrawer({
  open,
  onClose,
  order,
  onAccept,
  onReject,
}: OrderDetailsDrawerProps) {
  if (!order) return null;

  const isPending = order.status === 'pending';

  const statusVariant =
    order.status === 'accepted'
      ? 'green'
      : order.status === 'rejected'
      ? 'red'
      : 'amber';

  const footerActions = isPending ? (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => {
          if (onReject) onReject(order);
        }}
        className="h-10 px-4 rounded-lg border border-[#E11D48] text-[#E11D48] hover:bg-[#FFF1F2] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
        <span>Reject Order</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (onAccept) onAccept(order);
        }}
        className="h-10 px-4 rounded-lg bg-[#059669] hover:bg-[#047857] text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs"
      >
        <Check className="w-3.5 h-3.5" />
        <span>Accept Order</span>
      </button>
    </div>
  ) : null;

  return (
    <CommonDrawer
      isOpen={open}
      onClose={onClose}
      title="Order Details"
      description={`Review wholesale booking and dispatch specifications for ${order.id}.`}
      cancelText="Close"
      width="lg"
      footerActions={footerActions}
    >
      <div className="space-y-5">
        {/* Order Information Card */}
        <div className="p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-[#9493A8] block">
              Order Identifier
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-bold text-base text-[#100E26] font-tabular">
                {order.id}
              </span>
              <div className="flex items-center gap-1 text-xs text-[#5A586E] font-tabular">
                <Calendar className="w-3.5 h-3.5 text-[#9493A8]" />
                <span>{order.orderDate}</span>
              </div>
            </div>
          </div>

          <StatusBadge
            label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            variant={statusVariant}
            size="md"
          />
        </div>

        {/* Buyer Information Card */}
        <div className="p-4 bg-white border border-[#E2E1EC] rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#4E45D5]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
              Buyer Information
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                Buyer Name
              </span>
              <span className="font-bold text-[#100E26] text-sm mt-0.5 block">
                {order.buyerName}
              </span>
            </div>

            <div>
              <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px]">
                Company / Business
              </span>
              <span className="font-semibold text-[#5A586E] mt-0.5 block">
                {order.buyerCompany}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#5A586E]">
              <Phone className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />
              <span className="font-tabular font-medium text-[#100E26]">
                {order.contactNumber}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#5A586E]">
              <Mail className="w-3.5 h-3.5 text-[#9493A8] shrink-0" />
              <span className="font-medium text-[#100E26] truncate">{order.email}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E1EC] text-xs">
            <span className="text-[#9493A8] uppercase tracking-wider font-semibold block text-[10px] mb-1">
              Delivery Address
            </span>
            <div className="flex items-start gap-1.5 text-[#5A586E] bg-[#F7F7FB] p-2.5 rounded-lg border border-[#E2E1EC]">
              <MapPin className="w-4 h-4 text-[#4E45D5] shrink-0 mt-0.5" />
              <span className="leading-relaxed text-[#100E26]">
                {order.deliveryAddress}
              </span>
            </div>
          </div>
        </div>

        {/* Product Information Card */}
        <div className="p-4 bg-white border border-[#E2E1EC] rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#4E45D5]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
              Product & Pricing Details
            </h4>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={order.productImage}
                alt={order.productName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-[#100E26] truncate">
                {order.productName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
                  {order.designNumber}
                </span>
                <span className="text-xs text-[#5A586E] font-medium font-tabular">
                  Unit Price: ₹{order.unitPrice.toLocaleString('en-IN')}/m
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E2E1EC] text-xs">
            <div className="p-3 bg-[#F7F7FB] rounded-lg border border-[#E2E1EC]">
              <span className="text-[#9493A8] text-[10px] uppercase font-semibold block">
                Total Ordered Quantity
              </span>
              <span className="font-bold text-base text-[#100E26] font-tabular mt-0.5 block">
                {order.quantity.toLocaleString('en-IN')} meters
              </span>
            </div>

            <div className="p-3 bg-[#EEF2FF] rounded-lg border border-[#C7D2FE]">
              <span className="text-[#4E45D5] text-[10px] uppercase font-bold block">
                Total Order Amount
              </span>
              <span className="font-bold text-lg text-[#100E26] font-tabular mt-0.5 block">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Remark Section (Shows seller's remark if order was accepted/rejected, otherwise hidden) */}
        {order.remark && (
          <div className="p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#4E45D5]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                Seller Remark / Dispatch Instructions
              </h4>
            </div>
            <p className="text-xs text-[#100E26] bg-white p-3 rounded-lg border border-[#E2E1EC] leading-relaxed">
              {order.remark}
            </p>
          </div>
        )}
      </div>
    </CommonDrawer>
  );
}

