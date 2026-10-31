'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CommonDrawer from '@/components/CommonDrawer';
import CommonTable from '@/components/CommonTable';
import FilterDropdown from '@/components/FilterDropdown';
import ProductFormDrawer from '@/components/ProductFormDrawer';
import { Product, TableColumn } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/productsData';
import { INITIAL_CATEGORIES } from '@/lib/categoriesData';

interface ProductSelectionDrawerProps {
  open: boolean;
  onClose: () => void;
  initialSelectedProductIds: string[];
  onAddSelected: (selectedProducts: Product[]) => void;
}

export default function ProductSelectionDrawer({
  open,
  onClose,
  initialSelectedProductIds,
  onAddSelected,
}: ProductSelectionDrawerProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedProductIds);
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  const [prevOpen, setPrevOpen] = useState(false);
  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setSelectedIds(initialSelectedProductIds);
      setSearchTerm('');
      setCategoryFilter('all');
    }
  }

  // Handle single toggle
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Category filter options (kept in UI, not filtered from frontend)
  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...INITIAL_CATEGORIES.map((cat) => ({
      label: cat.name,
      value: cat.name,
    })),
  ];

  // Filter products by search (Category filter is NOT filtered from frontend)
  const q = searchTerm.toLowerCase();
  const filteredProducts = productsList.filter((p) => {
    return (
      searchTerm === '' ||
      p.name.toLowerCase().includes(q) ||
      p.designNumber.toLowerCase().includes(q)
    );
  });

  // Callback when a new product is created in ProductFormDrawer
  const handleNewProductSaved = (newProdData: Partial<Product>) => {
    const newProduct: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newProdData.name || 'Untitled Fabric',
      subtitle: newProdData.subtitle || newProdData.fabric || 'Custom Loom Weave',
      image:
        newProdData.image ||
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&auto=format&fit=crop&q=80',
      images: newProdData.images || [],
      designNumber: newProdData.designNumber || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newProdData.category || 'Banarasi Brocade',
      fabric: newProdData.fabric || 'Textile Blend',
      wholesalePrice: newProdData.wholesalePrice || 450,
      mrp: newProdData.mrp || 700,
      stock: newProdData.stock || 100,
      moq: newProdData.moq || 50,
      weight: newProdData.weight || '120 GSM',
      status: newProdData.status || 'active',
      description: newProdData.description || '',
    };

    setProductsList((prev) => [newProduct, ...prev]);
    setSelectedIds((prev) => [...prev, newProduct.id]);
    setIsAddProductOpen(false);
  };

  // CommonTable Columns with Checkbox column
  const columns: TableColumn<Product>[] = [
    {
      key: 'checkbox',
      header: (
        <span className="text-xs text-[#5A586E] font-medium font-tabular">
          {selectedIds.length} Selected
        </span>
      ),
      width: '90px',
      render: (p) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedIds.includes(p.id)}
            onChange={() => toggleSelect(p.id)}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 rounded border-[#E2E1EC] text-[#4E45D5] focus:ring-[#4E45D5] cursor-pointer"
            aria-label={`Select ${p.name}`}
          />
        </div>
      ),
    },
    {
      key: 'image',
      header: 'Image',
      width: '60px',
      render: (p) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      width: '180px',
      render: (p) => (
        <div className="max-w-[180px]" title={p.name}>
          <div className="font-semibold text-xs text-[#100E26] truncate">{p.name}</div>
          <div className="text-[11px] text-[#5A586E] truncate">{p.fabric}</div>
        </div>
      ),
    },
    {
      key: 'designNumber',
      header: 'Design No.',
      width: '100px',
      render: (p) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
          {p.designNumber}
        </span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      width: '140px',
      render: (p) => (
        <span className="text-xs text-[#100E26] truncate max-w-[140px] block font-medium" title={p.category}>
          {p.category}
        </span>
      ),
    },
    {
      key: 'wholesalePrice',
      header: 'Wholesale Price',
      width: '110px',
      render: (p) => (
        <span className="font-bold text-xs text-[#100E26] font-tabular whitespace-nowrap">
          ₹{p.wholesalePrice.toLocaleString('en-IN')}/m
        </span>
      ),
    },
  ];

  const handleSaveSelected = () => {
    const selected = productsList.filter((p) => selectedIds.includes(p.id));
    onAddSelected(selected);
    onClose();
  };

  return (
    <>
      <CommonDrawer
        isOpen={open}
        onClose={onClose}
        title="Select Products for Catalogue"
        description="Choose fabric designs to include in this curated wholesale collection."
        onSave={handleSaveSelected}
        saveText={`Add Selected (${selectedIds.length})`}
        cancelText="Cancel"
        width="2xl"
        zIndex="z-[60]"
        footerActions={
          <div className="text-xs font-semibold text-[#4E45D5] font-tabular">
            {selectedIds.length} {selectedIds.length === 1 ? 'product' : 'products'} selected
          </div>
        }
      >
        <div className="space-y-4">
          {/* Top Banner Action: Add New Product Button */}
          <div className="flex items-center justify-between p-3.5 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl">
            <div>
              <span className="text-xs font-semibold text-[#100E26] block">
                Can&apos;t find a specific fabric design?
              </span>
              <span className="text-xs text-[#5A586E]">
                Add a new product directly. It will be auto-selected for this catalogue.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddProductOpen(true)}
              className="btn-secondary h-9 px-3 text-xs gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#4E45D5]" />
              <span>Add New Product</span>
            </button>
          </div>

          {/* CommonTable with Row Click selection & Category filter kept in UI (not filtered on front) */}
          <CommonTable
            columns={columns}
            data={filteredProducts}
            filters={
              <FilterDropdown
                label="Category"
                options={categoryOptions}
                selected={categoryFilter}
                onSelect={setCategoryFilter}
              />
            }
            onRowClick={(p) => toggleSelect(p.id)}
            searchPlaceholder="Search by name or design number..."
            onSearch={setSearchTerm}
            searchValue={searchTerm}
            pageSize={6}
          />
        </div>
      </CommonDrawer>

      {/* Add New Product Form Drawer on top */}
      <ProductFormDrawer
        open={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSaved={handleNewProductSaved}
        zIndex="z-[70]"
      />
    </>
  );
}
