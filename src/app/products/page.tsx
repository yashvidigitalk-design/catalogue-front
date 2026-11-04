'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, CheckCircle2, AlertTriangle, Coins, Plus, Eye, Edit2, Trash2, } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import CommonTable from '@/components/CommonTable';
import ConfirmationModal from '@/components/ConfirmationModal';
import StatusBadge from '@/components/StatusBadge';
import FilterDropdown from '@/components/FilterDropdown';
import { ProductFormDrawer } from '@/components/ProductForm';
import ProductDetailsDrawer from '@/components/ProductDetailsDrawer';
import { Product, TableColumn } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/productsData';
import { INITIAL_CATEGORIES } from '@/lib/categoriesData';
import { formatCurrencyINR } from '@/lib/sampleData';
import { useToast } from '@/hooks/useToast';

const ACTION_BTN_CLASS = 'p-1 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors';

export default function ProductsPage() {
  const { showToast } = useToast();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  // Drawer & Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);


  // Open Drawer for Edit
  const handleOpenEdit = (prod: Product) => {
    setEditingProduct(prod);
    setIsAddEditOpen(true);
  };

  // Confirm Delete Product
  const handleConfirmDelete = () => {
    showToast('success', 'Product deleted successfully');
    setProductToDelete(null);
  };

  // Stat Card Calculations
  const totalProducts = INITIAL_PRODUCTS.length;
  const activeProducts = INITIAL_PRODUCTS.filter((p) => p.status === 'active').length;
  const lowStockProducts = INITIAL_PRODUCTS.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const avgWholesalePrice = Math.round(
    INITIAL_PRODUCTS.reduce((acc, p) => acc + p.wholesalePrice, 0) / (INITIAL_PRODUCTS.length || 1)
  );

  // Category filter options (kept in UI, not filtered from frontend)
  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    ...INITIAL_CATEGORIES.map((cat) => ({
      label: cat.name,
      value: cat.name,
    })),
  ];

  // Products Table Data (backend handles search & filter; frontend does not filter)
  const filteredProducts = INITIAL_PRODUCTS;

  // CommonTable Columns (11 Columns, compact, fits 1366px screen, Actions sticky right)
  const productColumns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: 'Image',
      width: '60px',
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
      width: '180px',
      render: (p) => (
        <div className="max-w-[180px]" title={p.name}>
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
      key: 'category',
      header: 'Category',
      width: '125px',
      render: (p) => (
        <span className="text-xs text-[#100E26] truncate max-w-[125px] block font-medium" title={p.category}>
          {p.category}
        </span>
      ),
    },
    {
      key: 'fabric',
      header: 'Fabric',
      width: '115px',
      render: (p) => (
        <span className="text-xs text-[#5A586E] truncate max-w-[115px] block" title={p.fabric}>
          {p.fabric}
        </span>
      ),
    },
    {
      key: 'wholesalePrice',
      header: 'Wholesale',
      width: '90px',
      render: (p) => (
        <span className="font-bold text-xs text-[#100E26] font-tabular whitespace-nowrap">
          ₹{p.wholesalePrice.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'mrp',
      header: 'MRP',
      width: '80px',
      render: (p) => (
        <span className="text-xs text-[#9493A8] line-through font-tabular whitespace-nowrap">
          ₹{p.mrp.toLocaleString('en-IN')}
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
    {
      key: 'moq',
      header: 'MOQ',
      width: '75px',
      render: (p) => (
        <span className="text-xs text-[#5A586E] font-medium font-tabular whitespace-nowrap">
          {p.moq} m
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '95px',
      render: (p) => (
        <StatusBadge
          label={p.status === 'active' ? 'Active' : 'Inactive'}
          variant={p.status === 'active' ? 'green' : 'slate'}
          size="sm"
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '105px',
      align: 'right',
      sticky: 'right',
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setViewingProduct(p)}
            className={ACTION_BTN_CLASS}
            title="View Product"
            aria-label="View Product"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(p)}
            className={ACTION_BTN_CLASS}
            title="Edit Product"
            aria-label="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setProductToDelete(p)}
            className="p-1 rounded-md text-[#5A586E] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
            title="Delete Product"
            aria-label="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Filters component passed to CommonTable (Category & Stock kept in UI, but not filtered from frontend)
  const tableFilters = (
    <>
      <FilterDropdown
        label="Category"
        options={categoryOptions}
        selected={categoryFilter}
        onSelect={setCategoryFilter}
      />

      <FilterDropdown
        label="Stock"
        options={[
          { label: 'All Stock', value: 'all' },
          { label: 'In Stock', value: 'in_stock' },
          { label: 'Low Stock', value: 'low_stock' },
          { label: 'Out of Stock', value: 'out_of_stock' },
        ]}
        selected={stockFilter}
        onSelect={setStockFilter}
      />

      <FilterDropdown
        label="Status"
        options={[
          { label: 'All Status', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]}
        selected={statusFilter}
        onSelect={setStatusFilter}
      />
    </>
  );

  return (
    <div className="space-y-6">
      {/* PageHeader with Action Button */}
      <PageHeader
        title="Products"
        description="Manage fabric designs, GSM specifications, reed-pick construction, and bulk roll pricing."
        actions={
          <Link
            href="/products/create"
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
        }
      />

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-5 h-5 text-[#4E45D5]" />}
          iconBg="bg-[#EEF2FF]"
        />
        <StatCard
          title="Active Products"
          value={activeProducts}
          icon={<CheckCircle2 className="w-5 h-5 text-[#059669]" />}
          iconBg="bg-[#ECFDF5]"
        />
        <StatCard
          title="Low Stock Products"
          value={lowStockProducts}
          icon={<AlertTriangle className="w-5 h-5 text-[#D97706]" />}
          iconBg="bg-[#FFFBEB]"
        />
        <StatCard
          title="Avg Wholesale Price"
          value={formatCurrencyINR(avgWholesalePrice)}
          icon={<Coins className="w-5 h-5 text-[#4338CA]" />}
          iconBg="bg-[#EEF2FF]"
        />
      </div>

      {/* Products Table rendered strictly via CommonTable */}
      <CommonTable
        columns={productColumns}
        data={filteredProducts}
        filters={tableFilters}
        searchPlaceholder="Search by name or design number..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        pageSize={10}
      />

      {/* Add / Edit Product Drawer (reusable ProductFormDrawer) */}
      <ProductFormDrawer
        open={isAddEditOpen}
        onClose={() => {
          setIsAddEditOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      {/* View Product Details Drawer */}
      <ProductDetailsDrawer
        open={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        product={viewingProduct}
        onEdit={handleOpenEdit}
      />

      {/* ConfirmationModal: Delete Product */}
      <ConfirmationModal
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete product?"
        description="Are you sure you want to delete this product? This will permanently remove it from your wholesale inventory."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
