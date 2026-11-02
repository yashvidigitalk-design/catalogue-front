'use client';

import { useState } from 'react';
import { AlertTriangle, Sliders, Check } from 'lucide-react';
import { StockItem } from '@/types';
import { useToast } from '@/hooks/useToast';
import { InputField } from '@/components/FormControls';

interface LowStockAlertProps {
  threshold: number;
  onSaveThreshold: (newThreshold: number) => void;
  lowStockItems: StockItem[];
}

export default function LowStockAlert({
  threshold,
  onSaveThreshold,
  lowStockItems,
}: LowStockAlertProps) {
  const { showToast } = useToast();
  const [inputValue, setInputValue] = useState<number | string>(threshold);

  const handleSave = () => {
    const num = Number(inputValue);
    if (isNaN(num) || num < 0) {
      showToast('error', 'Please enter a valid threshold number');
      return;
    }
    onSaveThreshold(num);
    showToast('success', 'Threshold updated');
  };

  const displayedItems = lowStockItems.slice(0, 4);
  const remainingCount = lowStockItems.length - displayedItems.length;

  return (
    <div className="bg-white border border-[#E2E1EC] rounded-xl p-5 shadow-[0_1px_3px_rgba(16,14,38,0.05)] space-y-4">
      {/* Settings Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#4E45D5]" />
            <label
              htmlFor="threshold-input"
              className="text-xs font-semibold uppercase tracking-wider text-[#100E26]"
            >
              Low Stock Threshold
            </label>
          </div>
          <p className="text-xs text-[#5A586E] mt-1 leading-normal">
            Products with stock at or below this quantity are marked as Low Stock.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <InputField
            id="threshold-input"
            type="number"
            min="1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            containerClassName="!w-20 shrink-0"
            className="!w-20 text-center font-tabular"
          />
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary h-10 px-4 text-xs font-semibold gap-1.5 shrink-0"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Amber Alert Banner (Shown only when at least one product is low) */}
      {lowStockItems.length > 0 && (
        <div className="p-4 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] space-y-2.5 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#D97706]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>
              {lowStockItems.length} {lowStockItems.length === 1 ? 'product is' : 'products are'} running low on stock (at or below {threshold}).
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {displayedItems.map((item) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#FDE68A] text-xs font-medium text-[#100E26] shadow-2xs"
              >
                <span className="font-semibold text-[#100E26] truncate max-w-[200px]">
                  {item.productName}
                </span>
                <span className="text-[#D97706] font-bold font-tabular">
                  : {item.availableStock} left
                </span>
              </span>
            ))}

            {remainingCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-xs font-bold text-[#D97706]">
                +{remainingCount} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

