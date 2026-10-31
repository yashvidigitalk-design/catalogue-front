'use client';

import React, { useState, useMemo } from 'react';
import { Package, Globe, EyeOff, Edit2, Layers, CheckCircle2 } from 'lucide-react';
import CommonDrawer from '@/components/CommonDrawer';
import CommonTable from '@/components/CommonTable';
import StatusBadge from '@/components/StatusBadge';
import { Category, Product, TableColumn } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/productsData';

interface CategoryDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  category: Category | null;
  onEdit?: (category: Category) => void;
}

export default function CategoryDetailsDrawer({
  open,
  onClose,
  category,
  onEdit,
}: CategoryDetailsDrawerProps) {
  const [productSearch, setProductSearch] = useState('');

  // Get products belonging to this category
  const categoryProducts = useMemo(() => {
    if (!category) return [];
    const directMatches = INITIAL_PRODUCTS.filter(
      (p) => p.category?.toLowerCase() === category.name.toLowerCase()
    );
    // If no exact match, use products starting with same prefix or first 6 products as sample showcase
    if (directMatches.length > 0) return directMatches;
    return INITIAL_PRODUCTS.slice(0, 6);
  }, [category]);

  // Filtered by search inside the drawer
  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return categoryProducts;
    const q = productSearch.toLowerCase();
    return categoryProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.designNumber.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q)
    );
  }, [categoryProducts, productSearch]);

  if (!category) return null;

  // Attached Products Table Columns (matching Products Master design)
  const productColumns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: 'Image',
      width: '56px',
      render: (p) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.image}
            alt={p.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      render: (p) => (
        <div className="max-w-[200px]" title={p.name}>
          <div className="font-semibold text-xs text-[#100E26] truncate">{p.name}</div>
          <div className="text-[11px] text-[#5A586E] truncate">{p.subtitle}</div>
        </div>
      ),
    },
    {
      key: 'designNumber',
      header: 'Design No.',
      width: '95px',
      render: (p) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
          {p.designNumber}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Wholesale',
      width: '95px',
      render: (p) => (
        <span className="font-bold text-xs text-[#100E26] font-tabular whitespace-nowrap">
          ₹{p.wholesalePrice.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      width: '75px',
      render: (p) => (
        <span className="font-bold text-xs font-tabular text-[#100E26]">
          {p.stock.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'stockStatus',
      header: 'Stock Status',
      width: '115px',
      render: (p) => {
        const isOutOfStock = p.stock === 0;
        const isLowStock = p.stock > 0 && p.stock <= 10;
        const statusText = isOutOfStock
          ? 'Out of Stock'
          : isLowStock
          ? 'Low Stock'
          : 'In Stock';
        const colorClass = isOutOfStock
          ? 'text-[#E11D48]'
          : isLowStock
          ? 'text-[#D97706]'
          : 'text-[#059669]';
        const dotBgClass = isOutOfStock
          ? 'bg-[#E11D48]'
          : isLowStock
          ? 'bg-[#D97706]'
          : 'bg-[#059669]';

        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotBgClass}`} />
            <span>{statusText}</span>
          </span>
        );
      },
    },
  ];

  const handleEditClick = () => {
    if (onEdit) {
      onEdit(category);
    }
  };

  return (
    <CommonDrawer
      isOpen={open}
      onClose={() => {
        setProductSearch('');
        onClose();
      }}
      title="Category Details"
      description="Fabric classification overview, storefront visibility, and attached wholesale designs."
      cancelText="Close"
      width="2xl"
      footerActions={
        onEdit ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEditClick}
              className="h-10 px-4 rounded-lg bg-[#4E45D5] hover:bg-[#6860EF] text-white text-sm font-medium transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Category</span>
            </button>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {/* Top Info Card (matching Catalogue Details & Product Details layout) */}
        <div className="p-5 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl space-y-4">
          <div className="flex items-start gap-4">
            {/* Category Image */}
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#E2E1EC] bg-white shrink-0 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category Meta */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-bold text-[#100E26] truncate">
                  {category.name}
                </h3>
                <StatusBadge
                  label={category.status === 'active' ? 'Active' : 'Inactive'}
                  variant={category.status === 'active' ? 'green' : 'slate'}
                  size="sm"
                />
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    category.visibleOnStorefront
                      ? 'bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]'
                      : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                  }`}
                >
                  {category.visibleOnStorefront ? (
                    <>
                      <Globe className="w-3 h-3" />
                      <span>Storefront: Visible</span>
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Storefront: Hidden</span>
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs text-[#5A586E] mt-1.5 leading-relaxed">
                {category.subtitle}
              </p>

              {category.description && (
                <p className="text-xs text-[#9493A8] mt-1 line-clamp-2">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-3 border-t border-[#E2E1EC] grid grid-cols-3 gap-4 text-xs">
            <div className="p-2.5 bg-white rounded-lg border border-[#E2E1EC]">
              <span className="text-[#5A586E] block text-[11px]">Total Products</span>
              <div className="flex items-center gap-1.5 font-bold text-[#100E26] text-sm mt-0.5 font-tabular">
                <Package className="w-3.5 h-3.5 text-[#4E45D5]" />
                <span>{category.totalProducts} Weaves</span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-[#E2E1EC]">
              <span className="text-[#5A586E] block text-[11px]">Storefront Status</span>
              <div className="flex items-center gap-1.5 font-bold text-[#100E26] text-sm mt-0.5">
                <CheckCircle2
                  className={`w-3.5 h-3.5 ${
                    category.visibleOnStorefront ? 'text-[#059669]' : 'text-[#9493A8]'
                  }`}
                />
                <span>{category.visibleOnStorefront ? 'Publicly Listed' : 'Unlisted'}</span>
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-lg border border-[#E2E1EC]">
              <span className="text-[#5A586E] block text-[11px]">Design Catalog</span>
              <div className="flex items-center gap-1.5 font-bold text-[#100E26] text-sm mt-0.5 font-tabular">
                <Layers className="w-3.5 h-3.5 text-[#D97706]" />
                <span>{categoryProducts.length} Active SKUs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Attached Products Table with Search (matching Catalogue Details) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#5A586E]">
              Products in this Category ({categoryProducts.length})
            </div>
          </div>

          <CommonTable
            columns={productColumns}
            data={filteredProducts}
            searchPlaceholder="Search category products by name, design no..."
            onSearch={setProductSearch}
            searchValue={productSearch}
            pageSize={5}
          />
        </div>
      </div>
    </CommonDrawer>
  );
}
