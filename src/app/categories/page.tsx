'use client';

import React, { useState } from 'react';
import {
  FolderTree,
  Eye,
  Package,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  MinusCircle,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import CommonTable from '@/components/CommonTable';
import CommonDrawer from '@/components/CommonDrawer';
import ConfirmationModal from '@/components/ConfirmationModal';
import StatusBadge from '@/components/StatusBadge';
import FilterDropdown from '@/components/FilterDropdown';
import ImageUpload from '@/components/ImageUpload';
import { Category, Product, TableColumn } from '@/types';
import { INITIAL_CATEGORIES } from '@/lib/categoriesData';
import { INITIAL_PRODUCTS } from '@/lib/productsData';
import { useToast } from '@/hooks/useToast';

export default function CategoriesPage() {
  const { showToast } = useToast();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');

  // Drawer & Modal States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [productToRemove, setProductToRemove] = useState<Product | null>(null);

  // Category Add/Edit Form State
  const [formName, setFormName] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formVisible, setFormVisible] = useState(true);
  const [formStatus, setFormStatus] = useState<'active' | 'inactive'>('active');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Open Drawer for Add
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormName('');
    setFormImage('');
    setFormVisible(true);
    setFormStatus('active');
    setFormErrors({});
    setIsAddEditOpen(true);
  };

  // Open Drawer for Edit
  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormImage(cat.image);
    setFormVisible(cat.visibleOnStorefront);
    setFormStatus(cat.status);
    setFormErrors({});
    setIsAddEditOpen(true);
  };

  // Save Category Handler
  const handleSaveCategory = () => {
    if (!formName.trim()) {
      setFormErrors({ name: 'Category name is required' });
      showToast('error', 'Category name is required');
      return;
    }

    showToast(
      'success',
      editingCategory ? 'Category updated successfully' : 'Category created successfully'
    );
    setIsAddEditOpen(false);
  };

  // Confirm Delete Category
  const handleConfirmDelete = () => {
    showToast('success', 'Category deleted successfully');
    setCategoryToDelete(null);
  };

  // Confirm Remove Product from Category
  const handleConfirmRemoveProduct = () => {
    showToast('success', 'Product removed from category');
    setProductToRemove(null);
  };

  // Stat Card Calculations
  const totalCategories = INITIAL_CATEGORIES.length;
  const visibleCategories = INITIAL_CATEGORIES.filter((c) => c.visibleOnStorefront).length;
  const totalProductsSum = INITIAL_CATEGORIES.reduce((acc, c) => acc + c.totalProducts, 0);
  const inactiveCategories = INITIAL_CATEGORIES.filter((c) => c.status === 'inactive').length;

  // Filter Categories Table Data
  const filteredCategories = INITIAL_CATEGORIES.filter((cat) => {
    const matchesSearch =
      searchTerm === '' ||
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || cat.status === statusFilter;

    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && cat.visibleOnStorefront) ||
      (visibilityFilter === 'hidden' && !cat.visibleOnStorefront);

    return matchesSearch && matchesStatus && matchesVisibility;
  });

  // Main Categories Table Columns
  const categoryColumns: TableColumn<Category>[] = [
    {
      key: 'image',
      header: 'Category Image',
      width: '90px',
      render: (cat) => (
        <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cat.image}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Category Name',
      render: (cat) => (
        <div>
          <div className="font-semibold text-[#100E26] text-sm">{cat.name}</div>
          <div className="text-xs text-[#5A586E] truncate max-w-sm mt-0.5">
            {cat.subtitle}
          </div>
        </div>
      ),
    },
    {
      key: 'visibleOnStorefront',
      header: 'Visible on Storefront',
      width: '180px',
      render: (cat) => (
        <StatusBadge
          label={cat.visibleOnStorefront ? 'Visible' : 'Hidden'}
          variant={cat.visibleOnStorefront ? 'green' : 'slate'}
          showDot={false}
          size="sm"
        />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '130px',
      render: (cat) => (
        <StatusBadge
          label={cat.status === 'active' ? 'Active' : 'Inactive'}
          variant={cat.status === 'active' ? 'green' : 'slate'}
          size="sm"
        />
      ),
    },
    {
      key: 'totalProducts',
      header: 'Total Products',
      width: '150px',
      render: (cat) => (
        <span className="font-semibold text-sm text-[#100E26] font-tabular">
          {cat.totalProducts} Products
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '120px',
      align: 'right',
      sticky: 'right',
      render: (cat) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setViewingCategory(cat)}
            className="p-1.5 rounded-lg text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
            title="View Category"
            aria-label="View Category"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(cat)}
            className="p-1.5 rounded-lg text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
            title="Edit Category"
            aria-label="Edit Category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCategoryToDelete(cat)}
            className="p-1.5 rounded-lg text-[#5A586E] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
            title="Delete Category"
            aria-label="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Products belonging to the viewed category
  const directMatches = viewingCategory
    ? INITIAL_PRODUCTS.filter((p) => p.category === viewingCategory.name)
    : [];
  const baseCategoryList =
    directMatches.length > 0 ? directMatches : INITIAL_PRODUCTS.slice(0, 4);

  // Drawer Table Columns for Products inside Category View
  const drawerProductColumns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: 'Product Image',
      width: '56px',
      render: (p) => (
        <div className="w-9 h-9 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      render: (p) => (
        <div className="max-w-[220px]">
          <div className="font-semibold text-xs text-[#100E26] truncate">{p.name}</div>
          <div className="text-[11px] text-[#5A586E] truncate">{p.fabric}</div>
        </div>
      ),
    },
    {
      key: 'designNumber',
      header: 'Design Number',
      width: '110px',
      render: (p) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
          {p.designNumber}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: '90px',
      render: (p) => (
        <span className="font-bold text-xs text-[#100E26] font-tabular">
          ₹{p.wholesalePrice.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'stock',
      header: 'Stock',
      width: '160px',
      render: (p) => (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium font-tabular text-[#100E26]">
            {p.stock}
          </span>
          <StatusBadge
            label={p.stock === 0 ? 'Out of Stock' : p.stock <= 10 ? 'Low Stock' : 'In Stock'}
            variant={p.stock === 0 ? 'red' : p.stock <= 10 ? 'amber' : 'green'}
            size="sm"
          />
        </div>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '70px',
      align: 'right',
      render: (p) => (
        <button
          type="button"
          onClick={() => setProductToRemove(p)}
          className="p-1.5 rounded-md text-[#5A586E] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
          title="Remove from category"
          aria-label="Remove from category"
        >
          <MinusCircle className="w-4 h-4" />
        </button>
      ),
    },
  ];

  // Filters component passed to CommonTable
  const tableFilters = (
    <>
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

      <div className="inline-flex p-1 bg-[#F1F0F7] rounded-lg border border-[#E2E1EC]">
        {(['all', 'visible', 'hidden'] as const).map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setVisibilityFilter(val)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all capitalize ${
              visibilityFilter === val
                ? 'bg-white text-[#100E26] shadow-xs'
                : 'text-[#5A586E] hover:text-[#100E26]'
            }`}
          >
            {val === 'all' ? 'All' : val === 'visible' ? 'Visible' : 'Hidden'}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* PageHeader with Action Button */}
      <PageHeader
        title="Categories"
        description="Organize textile varieties by weave type, yarn count, blend ratio, and seasonal collections."
        actions={
          <button
            type="button"
            onClick={handleOpenAdd}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        }
      />

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={<FolderTree className="w-5 h-5 text-[#4E45D5]" />}
          iconBg="bg-[#EEF2FF]"
        />
        <StatCard
          title="Visible on Storefront"
          value={visibleCategories}
          icon={<Eye className="w-5 h-5 text-[#059669]" />}
          iconBg="bg-[#ECFDF5]"
        />
        <StatCard
          title="Total Products"
          value={totalProductsSum}
          icon={<Package className="w-5 h-5 text-[#4338CA]" />}
          iconBg="bg-[#EEF2FF]"
        />
        <StatCard
          title="Inactive Categories"
          value={inactiveCategories}
          icon={<EyeOff className="w-5 h-5 text-[#E11D48]" />}
          iconBg="bg-[#FFF1F2]"
        />
      </div>

      {/* Categories Table rendered strictly via CommonTable */}
      <CommonTable
        columns={categoryColumns}
        data={filteredCategories}
        filters={tableFilters}
        searchPlaceholder="Search categories..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        pageSize={10}
      />

      {/* Add / Edit Category Drawer */}
      <CommonDrawer
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        description={
          editingCategory
            ? 'Update category settings and digital storefront visibility.'
            : 'Create a new fabric classification for your wholesale inventory.'
        }
        onSave={handleSaveCategory}
        saveText="Save"
        cancelText="Cancel"
        width="lg"
      >
        <div className="space-y-5">
          {/* Category Name (required) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Category Name <span className="text-[#E11D48]">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => {
                setFormName(e.target.value);
                if (formErrors.name) setFormErrors({});
              }}
              placeholder="e.g. Banarasi Brocade"
              className={`input-base ${formErrors.name ? 'border-[#E11D48]' : ''}`}
            />
            {formErrors.name && (
              <p className="text-xs text-[#E11D48] mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Category Image (ImageUpload single, with preview) */}
          <div>
            <ImageUpload
              initialImages={formImage ? [formImage] : []}
              maxImages={1}
              label="Category Image"
              helperText="Upload a high-resolution weave texture thumbnail (PNG, JPG)."
              onChange={(imgs) => setFormImage(imgs[0] || '')}
            />
          </div>

          {/* Visible on Storefront (toggle) */}
          <div className="flex items-center justify-between p-3.5 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl">
            <div>
              <span className="text-sm font-semibold text-[#100E26] block">
                Visible on Storefront
              </span>
              <span className="text-xs text-[#5A586E]">
                Display this fabric category on your digital customer-facing portal
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFormVisible(!formVisible)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                formVisible ? 'bg-[#4E45D5]' : 'bg-[#D5D4E2]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  formVisible ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Status (Active / Inactive) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#100E26] mb-1.5">
              Status
            </label>
            <div className="flex items-center gap-4 h-10">
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#100E26]">
                <input
                  type="radio"
                  name="cat-form-status"
                  value="active"
                  checked={formStatus === 'active'}
                  onChange={() => setFormStatus('active')}
                  className="w-4 h-4 text-[#4E45D5] focus:ring-[#4E45D5]"
                />
                Active
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#5A586E]">
                <input
                  type="radio"
                  name="cat-form-status"
                  value="inactive"
                  checked={formStatus === 'inactive'}
                  onChange={() => setFormStatus('inactive')}
                  className="w-4 h-4 text-[#4E45D5] focus:ring-[#4E45D5]"
                />
                Inactive
              </label>
            </div>
          </div>
        </div>
      </CommonDrawer>

      {/* View Category Drawer (wider) */}
      <CommonDrawer
        isOpen={Boolean(viewingCategory)}
        onClose={() => setViewingCategory(null)}
        title="Category View"
        description="Review attached fabric designs, stock availability, and storefront status."
        cancelText="Close"
        width="2xl"
      >
        {viewingCategory && (
          <div className="space-y-6">
            {/* Top: Category image, name, status badge, Total Products: N */}
            <div className="flex items-center gap-4 p-4 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewingCategory.image}
                alt={viewingCategory.name}
                className="w-16 h-16 rounded-xl object-cover border border-[#E2E1EC] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-lg font-bold text-[#100E26] truncate">
                    {viewingCategory.name}
                  </h3>
                  <StatusBadge
                    label={viewingCategory.status === 'active' ? 'Active' : 'Inactive'}
                    variant={viewingCategory.status === 'active' ? 'green' : 'slate'}
                    size="sm"
                  />
                  <StatusBadge
                    label={viewingCategory.visibleOnStorefront ? 'Visible' : 'Hidden'}
                    variant={viewingCategory.visibleOnStorefront ? 'green' : 'slate'}
                    showDot={false}
                    size="sm"
                  />
                </div>
                <p className="text-xs text-[#5A586E] mt-1 line-clamp-2">
                  {viewingCategory.description || viewingCategory.subtitle}
                </p>
                <div className="mt-2 text-xs font-semibold text-[#4E45D5] font-tabular">
                  Total Products: {viewingCategory.totalProducts}
                </div>
              </div>
            </div>

            {/* Below it: CommonTable with columns Product Image, Product Name, Design Number, Price, Stock, Actions (Remove) */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-[#5A586E] mb-2.5">
                Attached Products in this Category
              </div>
              <CommonTable
                columns={drawerProductColumns}
                data={baseCategoryList}
                showSearch={false}
                pageSize={5}
              />
            </div>
          </div>
        )}
      </CommonDrawer>

      {/* ConfirmationModal: Delete Category */}
      <ConfirmationModal
        isOpen={Boolean(categoryToDelete)}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete category?"
        description="Are you sure you want to delete this category? Products within this category will remain in the master catalogue."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />

      {/* ConfirmationModal: Remove Product from Category */}
      <ConfirmationModal
        isOpen={Boolean(productToRemove)}
        onClose={() => setProductToRemove(null)}
        onConfirm={handleConfirmRemoveProduct}
        title="Remove product from category?"
        description="This will remove the product from this category only. The product will not be deleted."
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
