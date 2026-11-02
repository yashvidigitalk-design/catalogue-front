'use client';

import { useState } from 'react';
import { Plus, Eye, Edit2, Trash2, Calendar, Clock, Package } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CommonTable from '@/components/CommonTable';
import CommonDrawer from '@/components/CommonDrawer';
import ConfirmationModal from '@/components/ConfirmationModal';
import StatusBadge from '@/components/StatusBadge';
import CatalogueFormDrawer from '@/components/CatalogueFormDrawer';
import { Catalogue, Product, TableColumn } from '@/types';
import { INITIAL_CATALOGUES } from '@/lib/catalogueData';
import { INITIAL_PRODUCTS } from '@/lib/productsData';
import { useToast } from '@/hooks/useToast';

const ACTION_BTN_CLASS =
  'p-1 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors';

const renderStatusBadge = (status: 'active' | 'inactive') => (
  <StatusBadge
    label={status === 'active' ? 'Active' : 'Inactive'}
    variant={status === 'active' ? 'green' : 'slate'}
    size="sm"
  />
);

const formatProductsCount = (count: number) =>
  `${count} ${count === 1 ? 'Product' : 'Products'}`;

const renderDateCell = (date: string) => (
  <span className="text-xs text-[#5A586E] font-tabular whitespace-nowrap">
    {date}
  </span>
);

export default function CataloguePage() {
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewingCatalogue, setViewingCatalogue] = useState<Catalogue | null>(null);
  const [viewDrawerSearch, setViewDrawerSearch] = useState('');
  const [editingCatalogue, setEditingCatalogue] = useState<Catalogue | null>(null);
  const [isCreateEditOpen, setIsCreateEditOpen] = useState(false);
  const [catalogueToDelete, setCatalogueToDelete] = useState<Catalogue | null>(null);

  // Catalogue table data (search and filter will be handled by backend; frontend does not filter)
  const filteredCatalogues = INITIAL_CATALOGUES;

  const handleOpenCreate = () => {
    setEditingCatalogue(null);
    setIsCreateEditOpen(true);
  };

  const handleOpenEdit = (cat: Catalogue) => {
    setEditingCatalogue(cat);
    setIsCreateEditOpen(true);
  };

  const handleConfirmDelete = () => {
    showToast('success', 'Catalogue deleted');
    setCatalogueToDelete(null);
  };

  // Catalogue Main Table Columns
  const catalogueColumns: TableColumn<Catalogue>[] = [
    {
      key: 'name',
      header: 'Catalogue Name',
      width: '240px',
      render: (c) => (
        <div className="font-semibold text-xs text-[#100E26] hover:text-[#4E45D5] transition-colors cursor-pointer" onClick={() => setViewingCatalogue(c)}>
          {c.name}
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (c) => (
        <div className="text-xs text-[#5A586E] truncate max-w-md" title={c.description}>
          {c.description}
        </div>
      ),
    },
    {
      key: 'totalProducts',
      header: 'Total Products',
      width: '130px',
      render: (c) => (
        <span className="font-semibold text-xs text-[#100E26] font-tabular">
          {formatProductsCount(c.totalProducts)}
        </span>
      ),
    },
    {
      key: 'createdDate',
      header: 'Created Date',
      width: '120px',
      render: (c) => renderDateCell(c.createdDate),
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      width: '120px',
      render: (c) => renderDateCell(c.lastUpdated),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (c) => renderStatusBadge(c.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '110px',
      align: 'right',
      sticky: 'right',
      render: (c) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => setViewingCatalogue(c)}
            className={ACTION_BTN_CLASS}
            title="View Catalogue"
            aria-label="View Catalogue"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleOpenEdit(c)}
            className={ACTION_BTN_CLASS}
            title="Edit Catalogue"
            aria-label="Edit Catalogue"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setCatalogueToDelete(c)}
            className="p-1 rounded-md text-[#5A586E] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
            title="Delete Catalogue"
            aria-label="Delete Catalogue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Products belonging to the viewed catalogue (search will be handled by backend; frontend does not filter)
  const viewedProducts = viewingCatalogue
    ? INITIAL_PRODUCTS.filter((p) => viewingCatalogue.productIds.includes(p.id))
    : [];

  // Products Table Columns in View Catalogue Drawer
  const viewProductColumns: TableColumn<Product>[] = [
    {
      key: 'image',
      header: 'Product Image',
      width: '70px',
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
      width: '200px',
      render: (p) => (
        <div className="max-w-[200px]">
          <div className="font-semibold text-xs text-[#100E26] truncate">{p.name}</div>
          <div className="text-[11px] text-[#5A586E] truncate">{p.subtitle}</div>
        </div>
      ),
    },
    {
      key: 'designNumber',
      header: 'Design Number',
      width: '120px',
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
        <span className="text-xs text-[#100E26] truncate max-w-[140px] block font-medium">
          {p.category}
        </span>
      ),
    },
    {
      key: 'wholesalePrice',
      header: 'Wholesale Price',
      width: '120px',
      render: (p) => (
        <span className="font-bold text-xs text-[#100E26] font-tabular whitespace-nowrap">
          ₹{p.wholesalePrice.toLocaleString('en-IN')}/m
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* PageHeader: Title, short description, "Create Catalogue" button */}
      <PageHeader
        title="Catalogue"
        description="Curate dynamic digital swatch-books and shareable lookbooks for garment manufacturers and retail chains."
        actions={
          <button
            type="button"
            onClick={handleOpenCreate}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Create Catalogue</span>
          </button>
        }
      />

      {/* Main Catalogues Table via CommonTable (Search by name only, no filters) */}
      <CommonTable
        columns={catalogueColumns}
        data={filteredCatalogues}
        searchPlaceholder="Search catalogues by name..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        pageSize={10}
      />

      {/* Create / Edit Catalogue Drawer */}
      <CatalogueFormDrawer
        open={isCreateEditOpen}
        onClose={() => {
          setIsCreateEditOpen(false);
          setEditingCatalogue(null);
        }}
        catalogue={editingCatalogue}
      />

      {/* View Catalogue Drawer (wider) */}
      <CommonDrawer
        isOpen={Boolean(viewingCatalogue)}
        onClose={() => {
          setViewingCatalogue(null);
          setViewDrawerSearch('');
        }}
        title="Catalogue Details"
        description="Curated digital fabric lookbook and attached wholesale designs."
        cancelText="Close"
        width="2xl"
      >
        {viewingCatalogue && (
          <div className="space-y-6">
            {/* Top Info Card */}
            <div className="p-5 bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-[#100E26]">
                    {viewingCatalogue.name}
                  </h3>
                  {renderStatusBadge(viewingCatalogue.status)}
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#4E45D5] bg-[#EEF2FF] px-2.5 py-1 rounded-md border border-[#C7D2FE] font-tabular">
                  <Package className="w-3.5 h-3.5" />
                  <span>{formatProductsCount(viewingCatalogue.totalProducts)}</span>
                </div>
              </div>

              <p className="text-sm text-[#5A586E] leading-relaxed">
                {viewingCatalogue.description}
              </p>

              <div className="pt-3 border-t border-[#E2E1EC] flex items-center gap-6 text-xs text-[#5A586E]">
                <div className="flex items-center gap-1.5 font-tabular">
                  <Calendar className="w-3.5 h-3.5 text-[#9493A8]" />
                  <span>Created: {viewingCatalogue.createdDate}</span>
                </div>
                <div className="flex items-center gap-1.5 font-tabular">
                  <Clock className="w-3.5 h-3.5 text-[#9493A8]" />
                  <span>Last Updated: {viewingCatalogue.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Attached Products Table rendered ONLY via CommonTable */}
            <div className="space-y-2.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-[#5A586E]">
                Products in this Catalogue ({viewingCatalogue.totalProducts})
              </div>

              <CommonTable
                columns={viewProductColumns}
                data={viewedProducts}
                searchPlaceholder="Search catalogue products..."
                onSearch={setViewDrawerSearch}
                searchValue={viewDrawerSearch}
                pageSize={5}
              />
            </div>
          </div>
        )}
      </CommonDrawer>

      {/* ConfirmationModal: Delete Catalogue */}
      <ConfirmationModal
        isOpen={Boolean(catalogueToDelete)}
        onClose={() => setCatalogueToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete catalogue?"
        description="Are you sure you want to delete this catalogue? Products in this collection will remain available in your master catalogue."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
