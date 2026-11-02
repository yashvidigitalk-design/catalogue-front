'use client';

import { TOP_SELLING_PRODUCTS } from '@/lib/dashboardData';

const BAR_SHADES = [
  'bg-[#4E45D5]', // Deep accent
  'bg-[#635BDB]', // Medium accent
  'bg-[#7B74E2]', // Soft accent
  'bg-[#938CE9]', // Light indigo
  'bg-[#AEA8F0]', // Pale brand tint
];

export default function TopSellingProductsChart() {
  return (
    <div className="bg-white border border-[#E2E1EC] rounded-xl p-5 shadow-[0_1px_3px_rgba(16,14,38,0.05)] flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3
          className="text-lg font-bold text-[#100E26]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Top Selling Products
        </h3>
        <p className="text-xs text-[#5A586E] mt-1 leading-normal">
          By total wholesale piece dispatch count.
        </p>
      </div>

      {/* Product List with Horizontal Progress Bars */}
      <div className="mt-5 space-y-4">
        {TOP_SELLING_PRODUCTS.map((prod, idx) => {
          const barBg = BAR_SHADES[idx % BAR_SHADES.length];

          return (
            <div key={prod.id} className="group">
              {/* Top row: Name & Quantity */}
              <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-[#100E26] truncate max-w-[200px] sm:max-w-[240px]">
                  {prod.name}
                </span>
                <span className="text-[#100E26] font-bold font-tabular shrink-0 ml-2">
                  {prod.quantityFormatted}
                </span>
              </div>

              {/* Sub-line: Specs & Revenue */}
              <div className="flex items-center justify-between text-[11px] text-[#5A586E] mt-0.5">
                <span className="truncate max-w-[180px]">{prod.specs}</span>
                <span className="font-tabular shrink-0 ml-2 font-medium">
                  {prod.revenue}
                </span>
              </div>

              {/* Horizontal Progress Bar */}
              <div className="mt-2 w-full bg-[#F1F0F7] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${barBg}`}
                  style={{ width: `${prod.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
