'use client';

import CommonDrawer from '@/components/CommonDrawer';
import StatusBadge from '@/components/StatusBadge';
import { Product } from '@/types';

interface ProductDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
}

export default function ProductDetailsDrawer({
  open,
  onClose,
  product,
}: ProductDetailsDrawerProps) {
  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const stockStatusLabel = isOutOfStock
    ? 'Out of Stock'
    : isLowStock
    ? 'Low Stock'
    : 'In Stock';
  const stockStatusVariant = isOutOfStock
    ? 'red'
    : isLowStock
    ? 'amber'
    : 'green';

  const marginPercentage =
    product.mrp > 0
      ? Math.round(((product.mrp - product.wholesalePrice) / product.mrp) * 100)
      : 0;

  return (
    <CommonDrawer
      isOpen={open}
      onClose={onClose}
      title="Product Details"
      description="Wholesale fabric specifications, pricing slabs, and loom inventory."
      cancelText="Close"
      width="xl"
    >
      <div className="space-y-6">
        {/* Image Gallery */}
        <div>
          <div className="h-64 rounded-xl overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images && product.images.length > 1 && (
            <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 rounded-lg overflow-hidden border border-[#E2E1EC] shrink-0"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Swatch ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Header info */}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-bold font-tabular">
              {product.designNumber}
            </span>
            <StatusBadge
              label={product.status === 'active' ? 'Active' : 'Inactive'}
              variant={product.status === 'active' ? 'green' : 'slate'}
              size="sm"
            />
            <StatusBadge
              label={stockStatusLabel}
              variant={stockStatusVariant}
              size="sm"
            />
          </div>

          <h3 className="text-xl font-bold text-[#100E26] mt-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm text-[#5A586E] mt-1">
            {product.subtitle}
          </p>
        </div>

        {/* Wholesale Price & MRP card */}
        <div className="p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-xs text-[#5A586E] block">Wholesale Price</span>
            <span className="text-lg font-bold text-[#100E26] font-tabular">
              ₹{product.wholesalePrice.toLocaleString('en-IN')}/m
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5A586E] block">MRP</span>
            <span className="text-lg font-semibold text-[#9493A8] line-through font-tabular">
              ₹{product.mrp.toLocaleString('en-IN')}/m
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5A586E] block">Stock Available</span>
            <span className="text-lg font-bold text-[#100E26] font-tabular">
              {product.stock} m
            </span>
          </div>
          <div>
            <span className="text-xs text-[#5A586E] block">Minimum Order (MOQ)</span>
            <span className="text-lg font-bold text-[#100E26] font-tabular">
              {product.moq} m
            </span>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg">
            <span className="text-xs text-[#5A586E] block">Category</span>
            <span className="font-semibold text-[#100E26] mt-0.5 block">
              {product.category}
            </span>
          </div>
          <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg">
            <span className="text-xs text-[#5A586E] block">Fabric Construction</span>
            <span className="font-semibold text-[#100E26] mt-0.5 block">
              {product.fabric}
            </span>
          </div>
          <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg">
            <span className="text-xs text-[#5A586E] block">Weight / GSM</span>
            <span className="font-semibold text-[#100E26] mt-0.5 block">
              {product.weight || '120 GSM'}
            </span>
          </div>
          <div className="p-3 bg-white border border-[#E2E1EC] rounded-lg">
            <span className="text-xs text-[#5A586E] block">Retail Margin Advantage</span>
            <span className="font-semibold text-[#059669] mt-0.5 block">
              {marginPercentage}% Margins
            </span>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Fabric Description & Recommended Garments
            </h4>
            <p className="text-sm text-[#5A586E] leading-relaxed bg-[#F7F7FB] p-3.5 rounded-xl border border-[#E2E1EC]">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </CommonDrawer>
  );
}
