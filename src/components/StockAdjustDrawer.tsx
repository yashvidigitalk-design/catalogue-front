'use client';

import { useState } from 'react';
import { ArrowRight, Layers, Package, Plus, Minus } from 'lucide-react';
import CommonDrawer from '@/components/CommonDrawer';
import StatusBadge from '@/components/StatusBadge';
import { StockItem } from '@/types';
import { useToast } from '@/hooks/useToast';
import { InputField, TextareaField } from '@/components/FormControls';

interface StockAdjustDrawerProps {
  open: boolean;
  onClose: () => void;
  item: StockItem | null;
  mode: 'in' | 'out';
  threshold: number;
  onSave: (itemId: string, mode: 'in' | 'out', quantity: number, remark?: string) => void;
}

const STATUS_BADGE_MAP = {
  out_of_stock: { label: 'Out of Stock', variant: 'red' as const },
  low_stock: { label: 'Low Stock', variant: 'amber' as const },
  in_stock: { label: 'In Stock', variant: 'green' as const },
};

export default function StockAdjustDrawer({
  open,
  onClose,
  item,
  mode,
  threshold,
  onSave,
}: StockAdjustDrawerProps) {
  const { showToast } = useToast();
  const isStockIn = mode === 'in';

  const [quantity, setQuantity] = useState<string>('');
  const [remark, setRemark] = useState<string>('');
  const [error, setError] = useState<string>('');

  const [prevOpen, setPrevOpen] = useState(false);
  const [prevItem, setPrevItem] = useState<StockItem | null>(null);
  const [prevMode, setPrevMode] = useState<'in' | 'out'>('in');

  // Synchronize state when open, item or mode changes without cascading effect renders
  if (open !== prevOpen || item !== prevItem || mode !== prevMode) {
    setPrevOpen(open);
    setPrevItem(item);
    setPrevMode(mode);
    setQuantity('');
    setRemark('');
    setError('');
  }

  if (!item) return null;

  const currentAvailable = item.availableStock;
  const numQty = parseInt(quantity, 10);
  const hasValidQty = !isNaN(numQty) && numQty > 0;

  let calculatedAvailable = currentAvailable;
  if (hasValidQty) {
    calculatedAvailable =
      isStockIn ? currentAvailable + numQty : Math.max(0, currentAvailable - numQty);
  }

  // Determine resulting stock status
  const resultingStatus =
    calculatedAvailable === 0
      ? 'out_of_stock'
      : calculatedAvailable <= threshold
      ? 'low_stock'
      : 'in_stock';

  const badgeConfig = STATUS_BADGE_MAP[resultingStatus];

  const validateQuantity = (val: number): string | null => {
    if (isNaN(val) || val <= 0) return 'Please enter a positive whole number';
    if (!isStockIn && val > currentAvailable) {
      return `Quantity cannot exceed available stock (${currentAvailable} meters)`;
    }
    return null;
  };

  const handleQuantityChange = (val: string) => {
    setQuantity(val);
    if (val === '') {
      setError('');
      return;
    }
    setError(validateQuantity(parseInt(val, 10)) || '');
  };

  const handleSave = () => {
    const err = validateQuantity(numQty);
    if (err) {
      setError(err);
      return;
    }

    onSave(item.id, mode, numQty, remark.trim() || undefined);
    showToast('success', isStockIn ? 'Stock added' : 'Stock removed');
    onClose();
  };

  const footerActions = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleSave}
        className={`h-10 px-5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-xs text-white ${
          isStockIn
            ? 'bg-[#059669] hover:bg-[#047857]'
            : 'bg-[#E11D48] hover:bg-[#BE123C]'
        }`}
      >
        {isStockIn ? <Plus className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}
        <span>{isStockIn ? 'Save Stock In' : 'Save Stock Out'}</span>
      </button>
    </div>
  );

  return (
    <CommonDrawer
      isOpen={open}
      onClose={onClose}
      title={isStockIn ? 'Stock In Inventory' : 'Stock Out Inventory'}
      description={`Record incoming mill batches or outgoing roll dispatches for ${item.designNumber}.`}
      cancelText="Cancel"
      width="lg"
      footerActions={footerActions}
    >
      <div className="space-y-5">
        {/* Current Stock Info Card */}
        <div className="p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#4E45D5]" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                Product Overview
              </h4>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold border font-tabular ${
                isStockIn
                  ? 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]'
                  : 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]'
              }`}
            >
              {isStockIn ? '+ Stock In' : '- Stock Out'}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#FFFFFF] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-sm text-[#100E26] truncate">
                {item.productName}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
                  {item.designNumber}
                </span>
                <span className="text-xs text-[#5A586E] truncate">
                  {item.fabric}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#E2E1EC] text-xs">
            {[
              {
                label: 'Current Available Stock',
                value: `${item.availableStock.toLocaleString('en-IN')} meters`,
                color: 'text-[#100E26]',
              },
              {
                label: 'Reserved Stock (Orders)',
                value: `${item.reservedStock.toLocaleString('en-IN')} meters`,
                color: 'text-[#5A586E]',
              },
            ].map((stat) => (
              <div key={stat.label} className="p-2.5 bg-white border border-[#E2E1EC] rounded-lg">
                <span className="text-[#9493A8] text-[10px] uppercase font-semibold block">
                  {stat.label}
                </span>
                <span className={`font-bold text-base ${stat.color} font-tabular mt-0.5 block`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quantity Input */}
        <InputField
          label={`Quantity ${isStockIn ? 'to Add' : 'to Deduct'} (meters)`}
          required
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          placeholder="e.g. 100"
          className="font-tabular"
          error={error}
          autoFocus
        />

        {/* Remark Textarea (optional) */}
        <TextareaField
          label="Remark / Reason (Optional)"
          rows={3}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          placeholder={
            isStockIn
              ? 'e.g. Received fresh thaan rolls from loom unit #4, batch QC passed...'
              : 'e.g. Dispatched against order #ORD-8921, sample cutting, damaged selvage...'
          }
        />

        {/* Updated Stock Preview Card (Live Update) */}
        <div className="p-4 rounded-xl bg-[#F7F7FB] border border-[#E2E1EC] space-y-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-[#4E45D5]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
              Live Stock Projection Preview
            </h4>
          </div>

          <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E2E1EC]">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-semibold text-[#9493A8] block">
                Current Available
              </span>
              <span className="font-bold text-sm text-[#100E26] font-tabular">
                {currentAvailable.toLocaleString('en-IN')} m
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-[#9493A8]">
              <ArrowRight className="w-4 h-4" />
            </div>

            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase font-semibold text-[#9493A8] block">
                Projected Available
              </span>
              <span
                className={`font-bold text-base font-tabular ${
                  isStockIn ? 'text-[#059669]' : 'text-[#E11D48]'
                }`}
              >
                {calculatedAvailable.toLocaleString('en-IN')} m
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-semibold text-[#9493A8] block mb-1">
                New Status
              </span>
              <StatusBadge
                label={badgeConfig.label}
                variant={badgeConfig.variant}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    </CommonDrawer>
  );
}