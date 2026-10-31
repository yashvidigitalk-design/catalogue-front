'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  ChevronDown,
  Trash2,
  Pencil,
  Eye,
  X,
  Check,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import LowStockAlert from '@/components/LowStockAlert';
import StockAdjustDrawer from '@/components/StockAdjustDrawer';
import ConfirmationModal from '@/components/ConfirmationModal';
import Pagination from '@/components/Pagination';
import { StockItem } from '@/types';
import { INITIAL_STOCK } from '@/lib/stockData';
import { INITIAL_PRODUCTS } from '@/lib/productsData';
import { INITIAL_CATALOGUES } from '@/lib/catalogueData';

export interface InventoryItem {
  id: string;
  name: string;
  image: string;
  catalogs: string[];
  price: number;
  stock: number;
  unit: string; // 'piece' | 'm'
  moq: number;
  weight: number;
  weightUnit: string; // 'g' | 'GSM'
  status: 'Enabled' | 'Active' | 'Draft' | 'Disabled';
  designNumber?: string;
  fabric?: string;
  reservedStock?: number;
}

// Transform INITIAL_STOCK into InventoryItem using actual repository data
const ALL_CATALOGS = [
  ...INITIAL_CATALOGUES.map((c) => c.name),
  'Wholesale Master Lookbook',
];

const INITIAL_INVENTORY: InventoryItem[] = INITIAL_STOCK.map((item) => {
  const matchingProduct = INITIAL_PRODUCTS.find(
    (p) =>
      p.designNumber === item.designNumber ||
      p.name.toLowerCase() === item.productName.toLowerCase()
  );

  const matchingCatalogues = INITIAL_CATALOGUES.filter(
    (c) =>
      (matchingProduct && c.productIds?.includes(matchingProduct.id)) ||
      c.name.toLowerCase().includes((item.fabric || '').toLowerCase())
  ).map((c) => c.name);

  const price = matchingProduct ? matchingProduct.wholesalePrice : 850;
  const moq = matchingProduct ? matchingProduct.moq : 50;
  const rawWeight = matchingProduct?.weight || '120 GSM';
  const weightNum = parseInt(rawWeight.replace(/\D/g, ''), 10) || 120;

  const status: InventoryItem['status'] =
    item.availableStock === 0
      ? 'Disabled'
      : item.availableStock <= 10
      ? 'Draft'
      : 'Enabled';

  return {
    id: item.id,
    name: item.productName,
    image: item.productImage,
    catalogs:
      matchingCatalogues.length > 0
        ? matchingCatalogues
        : [ALL_CATALOGS[0] || 'Wholesale Master Lookbook'],
    price,
    stock: item.availableStock,
    unit: item.unit || 'm',
    moq,
    weight: weightNum,
    weightUnit: 'GSM',
    status,
    designNumber: item.designNumber,
    fabric: item.fabric,
    reservedStock: item.reservedStock,
  };
});

/**
 * Custom Multiselect Catalogs Cell Component
 * Matches the reference image with tag pills, text cursor input,
 * active purple border, and dropdown popover showing selected items with checkmarks.
 */
function CatalogSelectCell({
  item,
  allCatalogs,
  onToggleCatalog,
  onRemoveCatalog,
  initialOpen = false,
  openUpwards = false,
}: {
  item: InventoryItem;
  allCatalogs: string[];
  onToggleCatalog: (cat: string) => void;
  onRemoveCatalog: (cat: string) => void;
  initialOpen?: boolean;
  openUpwards?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredCatalogs = useMemo(() => {
    if (!search.trim()) return allCatalogs;
    return allCatalogs.filter((c) =>
      c.toLowerCase().includes(search.toLowerCase())
    );
  }, [allCatalogs, search]);

  const handleContainerClick = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={containerRef} className="relative min-w-[210px] max-w-[260px]">
      {/* Outer Input Box Container */}
      <div
        onClick={handleContainerClick}
        className={`w-full min-h-[34px] px-2.5 py-1 bg-white border rounded-lg flex items-center justify-between gap-1.5 cursor-pointer transition-all ${
          isOpen
            ? 'border-2 border-[#5B50D6] shadow-xs'
            : 'border-[#E2E1EC] hover:border-[#C7D2FE]'
        }`}
      >
        <div className="flex flex-wrap items-center gap-1 flex-1 min-w-0">
          {item.catalogs.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EAE9F2] text-[#2D2A4A] text-xs font-medium shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate max-w-[120px]">{cat}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCatalog(cat);
                }}
                className="text-[#64748B] hover:text-[#E11D48] transition-colors"
                title="Remove catalog"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Typing input / cursor */}
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            placeholder={item.catalogs.length === 0 ? 'Select catalogs...' : ''}
            className="flex-1 min-w-[30px] text-xs text-[#100E26] bg-transparent border-none outline-none focus:ring-0 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
          />
        </div>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#9493A8] shrink-0 transition-transform ${
            isOpen ? 'rotate-180 text-[#5B50D6]' : ''
          }`}
        />
      </div>

      {/* Dropdown Menu directly underneath or above */}
      {isOpen && (
        <div
          className={`absolute left-0 ${
            openUpwards ? 'bottom-[calc(100%+4px)]' : 'top-[calc(100%+4px)]'
          } w-full bg-white border border-[#E2E1EC] rounded-xl shadow-xl py-1 z-50 max-h-52 overflow-y-auto`}
        >
          {filteredCatalogs.map((cat) => {
            const isSelected = item.catalogs.includes(cat);
            return (
              <div
                key={cat}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCatalog(cat);
                }}
                className={`px-3 py-2 text-xs flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#D6CFF7] text-[#1E1B4B] font-semibold'
                    : 'text-[#100E26] hover:bg-[#F7F7FB]'
                }`}
              >
                <span className="truncate">{cat}</span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#4E45D5] stroke-[2.5] shrink-0 ml-2" />
                )}
              </div>
            );
          })}
          {filteredCatalogs.length === 0 && (
            <div className="px-3 py-2 text-xs text-[#9493A8]">No catalogs found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function StockPage() {
  const { showToast } = useToast();

  const [items, setItems] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [threshold, setThreshold] = useState<number>(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [catalogFilter, setCatalogFilter] = useState('All Catalogs');

  // Column Visibility
  const [visibleColumns] = useState({
    image: true,
    name: true,
    catalogs: true,
    price: true,
    stock: true,
    moq: true,
    weight: true,
    status: true,
    actions: true,
  });

  // Sorting
  const [sortField, setSortField] = useState<keyof InventoryItem | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Pagination (10 per page as in Image 1)
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Delete Confirmation Modal state
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null);

  // Drawer integration for Stock In / Out Adjustment
  const [adjustDrawerOpen, setAdjustDrawerOpen] = useState(false);
  const [adjustItem, setAdjustItem] = useState<StockItem | null>(null);

  // Stat Card calculations
  const totalAvailableStock = useMemo(
    () => items.reduce((acc, item) => acc + item.stock, 0),
    [items]
  );
  const totalReservedStock = useMemo(
    () => items.reduce((acc, item) => acc + (item.reservedStock || 0), 0),
    [items]
  );
  const totalStock = totalAvailableStock + totalReservedStock;

  const lowStockStockItems: StockItem[] = useMemo(() => {
    return items
      .filter((i) => i.stock > 0 && i.stock <= threshold)
      .map((i) => ({
        id: i.id,
        productName: i.name,
        designNumber: i.designNumber || 'DS-00',
        productImage: i.image,
        fabric: i.fabric || 'Textile Fabric',
        availableStock: i.stock,
        stockIn: i.stock * 2,
        stockOut: i.stock,
        reservedStock: i.reservedStock || 40,
        soldStock: i.stock,
        unit: i.unit,
      }));
  }, [items, threshold]);

  const lowStockCount = lowStockStockItems.length;

  // Filter & Search Logic (Catalog filtering in frontend removed per user request)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesign = item.designNumber?.toLowerCase().includes(q);
        const matchesCatalog = item.catalogs.some((c) => c.toLowerCase().includes(q));
        if (!matchesName && !matchesDesign && !matchesCatalog) return false;
      }

      // Catalog Dropdown: Frontend filter removed per request:
      // "second image mokli ema category ma filter thai che e front thi na thavu joie e remove kari de pn dropdown rakhvanu che"

      return true;
    });
  }, [items, searchTerm]);

  // Sorted Items
  const sortedItems = useMemo(() => {
    if (!sortField) return filteredItems;
    return [...filteredItems].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA || '').toLowerCase();
      const strB = String(valB || '').toLowerCase();
      return sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }, [filteredItems, sortField, sortOrder]);

  // Paginated Items
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, currentPage, pageSize]);

  // Handle row cell changes inline
  const handleCellChange = <K extends keyof InventoryItem>(
    id: string,
    field: K,
    value: InventoryItem[K]
  ) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  // Toggle catalog tag on item
  const handleToggleCatalog = (itemId: string, catName: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const exists = item.catalogs.includes(catName);
        return {
          ...item,
          catalogs: exists
            ? item.catalogs.filter((c) => c !== catName)
            : [...item.catalogs, catName],
        };
      })
    );
  };

  // Remove catalog tag from item
  const handleRemoveCatalog = (itemId: string, catName: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, catalogs: item.catalogs.filter((c) => c !== catName) }
          : item
      )
    );
  };

  // Select all checkbox
  const isAllSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.includes(item.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedItems.map((item) => item.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Confirm Delete Item
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
      setSelectedIds((prev) => prev.filter((id) => id !== itemToDelete.id));
      showToast('success', `${itemToDelete.name} removed from inventory`);
      setItemToDelete(null);
    }
  };

  // Open Stock Adjust Drawer
  const handleOpenStockAdjust = (item: InventoryItem) => {
    const stockItem: StockItem = {
      id: item.id,
      productName: item.name,
      designNumber: item.designNumber || 'DS-00',
      productImage: item.image,
      fabric: item.fabric || 'Textile Fabric',
      availableStock: item.stock,
      stockIn: item.stock * 2,
      stockOut: item.stock,
      reservedStock: item.reservedStock || 20,
      soldStock: item.stock,
      unit: item.unit,
    };
    setAdjustItem(stockItem);
    setAdjustDrawerOpen(true);
  };

  // Toggle Sorting
  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Common PageHeader */}
      <PageHeader
        title="Stock Management"
        description="Real-time fabric rolls inventory, stock-in batches, and warehouse dispatch reserves."
      />

      {/* 2. 4 StatCards calculated dynamically from data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Stock"
          value={`${totalStock.toLocaleString('en-IN')} m`}
          icon={<Package className="w-5 h-5 text-[#4E45D5]" />}
          iconBg="bg-[#EEF2FF]"
        />
        <StatCard
          title="Available Stock"
          value={`${totalAvailableStock.toLocaleString('en-IN')} m`}
          icon={<CheckCircle2 className="w-5 h-5 text-[#059669]" />}
          iconBg="bg-[#ECFDF5]"
        />
        <StatCard
          title="Reserved Stock"
          value={`${totalReservedStock.toLocaleString('en-IN')} m`}
          icon={<Clock className="w-5 h-5 text-[#2563EB]" />}
          iconBg="bg-[#EFF6FF]"
        />
        <StatCard
          title="Low Stock Products"
          value={lowStockCount}
          icon={<AlertTriangle className="w-5 h-5 text-[#D97706]" />}
          iconBg="bg-[#FEF3C7]"
        />
      </div>

      {/* 3. Low Stock Alert Settings Card */}
      <LowStockAlert
        threshold={threshold}
        onSaveThreshold={setThreshold}
        lowStockItems={lowStockStockItems}
      />

      {/* 4. Table Controls: Search & Catalogs Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search box with embedded purple search icon button */}
        <div className="relative flex items-center flex-1 sm:max-w-md">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product, design no., or fabric..."
            className="w-full h-10 pl-3.5 pr-10 bg-white border border-[#E2E1EC] rounded-lg text-xs text-[#100E26] placeholder-[#9493A8] focus:outline-none focus:border-[#4E45D5] transition-colors"
          />
          <button
            type="button"
            className="absolute right-0 top-0 bottom-0 px-3 bg-[#4E45D5] hover:bg-[#4338CA] text-white rounded-r-lg flex items-center justify-center transition-colors"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* All Catalogs Dropdown */}
        <div className="relative">
          <select
            value={catalogFilter}
            onChange={(e) => {
              setCatalogFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 pl-3 pr-8 bg-white border border-[#E2E1EC] rounded-lg text-xs font-medium text-[#100E26] appearance-none cursor-pointer focus:outline-none focus:border-[#4E45D5] shadow-xs"
          >
            <option value="All Catalogs">All Catalogs</option>
            {ALL_CATALOGS.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#9493A8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Main Inline Editable Table */}
      <div className="bg-white border border-[#E2E1EC] rounded-xl overflow-visible shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E2E1EC] bg-[#F7F7FB] text-xs font-semibold text-[#5A586E] uppercase tracking-wider">
                {/* Checkbox */}
                <th className="w-10 px-3.5 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-[#D5D4E2] text-[#4E45D5] focus:ring-[#4E45D5]"
                  />
                </th>

                {/* Image */}
                {visibleColumns.image && (
                  <th className="w-16 px-3 py-3">Image</th>
                )}

                {/* Name */}
                {visibleColumns.name && (
                  <th
                    className="min-w-[200px] px-3 py-3 cursor-pointer select-none hover:text-[#100E26]"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Name</span>
                    </div>
                  </th>
                )}

                {/* Catalogs */}
                {visibleColumns.catalogs && (
                  <th className="min-w-[240px] px-3 py-3 select-none">
                    <div className="flex items-center gap-1">
                      <span>Catalogs</span>
                      <span className="text-[#9493A8]">⇅</span>
                    </div>
                  </th>
                )}

                {/* Price */}
                {visibleColumns.price && (
                  <th
                    className="w-32 px-3 py-3 cursor-pointer select-none hover:text-[#100E26]"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Price</span>
                      <span className="text-[#9493A8]">⇅</span>
                    </div>
                  </th>
                )}

                {/* Stock */}
                {visibleColumns.stock && (
                  <th
                    className="w-32 px-3 py-3 cursor-pointer select-none hover:text-[#100E26]"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Stock</span>
                      <span className="text-[#9493A8]">⇅</span>
                    </div>
                  </th>
                )}

                {/* MOQ */}
                {visibleColumns.moq && (
                  <th
                    className="w-24 px-3 py-3 cursor-pointer select-none hover:text-[#100E26]"
                    onClick={() => handleSort('moq')}
                  >
                    <div className="flex items-center gap-1">
                      <span>MOQ</span>
                      <span className="text-[#9493A8]">⇅</span>
                    </div>
                  </th>
                )}

                {/* Weight */}
                {visibleColumns.weight && (
                  <th className="w-28 px-3 py-3">Weight</th>
                )}

                {/* Status */}
                {visibleColumns.status && (
                  <th
                    className="w-28 px-3 py-3 cursor-pointer select-none hover:text-[#100E26]"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <span className="text-[#9493A8]">⇅</span>
                    </div>
                  </th>
                )}

                {/* Actions */}
                {visibleColumns.actions && (
                  <th className="w-24 px-3 py-3 text-center">#</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E1EC] text-[#100E26]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="h-44 text-center text-[#5A586E]">
                    No inventory records match your selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, idx) => {
                  const isChecked = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-[#F7F7FB]/70 transition-colors ${
                        isChecked ? 'bg-[#EEF2FF]/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3.5 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleSelectRow(item.id)}
                          className="rounded border-[#D5D4E2] text-[#4E45D5] focus:ring-[#4E45D5]"
                        />
                      </td>

                      {/* Image */}
                      {visibleColumns.image && (
                        <td className="px-3 py-3">
                          <div className="w-11 h-11 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>
                      )}

                      {/* Name (Inline editable input) */}
                      {visibleColumns.name && (
                        <td className="px-3 py-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) =>
                              handleCellChange(item.id, 'name', e.target.value)
                            }
                            className="w-full max-w-[220px] px-2.5 py-1.5 border border-[#E2E1EC] rounded-lg text-xs font-semibold text-[#100E26] bg-white focus:outline-none focus:border-[#4E45D5] transition-colors"
                          />
                        </td>
                      )}

                      {/* Catalogs (Interactive Multiselect Tag Dropdown Input) */}
                      {visibleColumns.catalogs && (
                        <td className="px-3 py-3">
                          <CatalogSelectCell
                            item={item}
                            allCatalogs={ALL_CATALOGS}
                            onToggleCatalog={(cat) => handleToggleCatalog(item.id, cat)}
                            onRemoveCatalog={(cat) => handleRemoveCatalog(item.id, cat)}
                            initialOpen={false}
                            openUpwards={idx >= paginatedItems.length - 3 && paginatedItems.length > 3}
                          />
                        </td>
                      )}

                      {/* Price (Inline Currency Prefix + Number Input) */}
                      {visibleColumns.price && (
                        <td className="px-3 py-3">
                          <div className="inline-flex items-center shadow-2xs">
                            <span className="px-2 py-1.5 bg-[#F7F7FB] border border-r-0 border-[#E2E1EC] rounded-l-lg text-xs font-medium text-[#5A586E] select-none">
                              ₹
                            </span>
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handleCellChange(
                                  item.id,
                                  'price',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-20 px-2 py-1.5 border border-[#E2E1EC] rounded-r-lg text-xs font-bold font-tabular text-[#100E26] bg-white focus:outline-none focus:border-[#4E45D5]"
                            />
                          </div>
                        </td>
                      )}

                      {/* Stock (Inline Number Input + Unit dropdown) */}
                      {visibleColumns.stock && (
                        <td className="px-3 py-3">
                          <div className="inline-flex items-center shadow-2xs">
                            <input
                              type="number"
                              value={item.stock}
                              onChange={(e) =>
                                handleCellChange(
                                  item.id,
                                  'stock',
                                  parseInt(e.target.value, 10) || 0
                                )
                              }
                              className="w-16 px-2 py-1.5 border border-r-0 border-[#E2E1EC] rounded-l-lg text-xs font-bold font-tabular text-[#100E26] bg-white focus:outline-none focus:border-[#4E45D5]"
                            />
                            <select
                              value={item.unit}
                              onChange={(e) =>
                                handleCellChange(item.id, 'unit', e.target.value)
                              }
                              className="px-1.5 py-1.5 bg-[#F7F7FB] border border-[#E2E1EC] rounded-r-lg text-xs font-medium text-[#5A586E] cursor-pointer focus:outline-none"
                            >
                              <option value="piece">piece</option>
                              <option value="m">m</option>
                            </select>
                          </div>
                        </td>
                      )}

                      {/* MOQ (Inline Number Input) */}
                      {visibleColumns.moq && (
                        <td className="px-3 py-3">
                          <input
                            type="number"
                            value={item.moq}
                            onChange={(e) =>
                              handleCellChange(
                                item.id,
                                'moq',
                                parseInt(e.target.value, 10) || 1
                              )
                            }
                            className="w-14 px-2 py-1.5 border border-[#E2E1EC] rounded-lg text-xs font-semibold font-tabular text-[#100E26] bg-white focus:outline-none focus:border-[#4E45D5] shadow-2xs"
                          />
                        </td>
                      )}

                      {/* Weight (Inline Number Input + Unit dropdown) */}
                      {visibleColumns.weight && (
                        <td className="px-3 py-3">
                          <div className="inline-flex items-center shadow-2xs">
                            <input
                              type="number"
                              value={item.weight}
                              onChange={(e) =>
                                handleCellChange(
                                  item.id,
                                  'weight',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-12 px-2 py-1.5 border border-r-0 border-[#E2E1EC] rounded-l-lg text-xs font-tabular text-[#100E26] bg-white focus:outline-none focus:border-[#4E45D5]"
                            />
                            <select
                              value={item.weightUnit}
                              onChange={(e) =>
                                handleCellChange(item.id, 'weightUnit', e.target.value)
                              }
                              className="px-1.5 py-1.5 bg-[#F7F7FB] border border-[#E2E1EC] rounded-r-lg text-xs text-[#5A586E] cursor-pointer focus:outline-none"
                            >
                              <option value="g">g</option>
                              <option value="GSM">GSM</option>
                            </select>
                          </div>
                        </td>
                      )}

                      {/* Status (Dropdown) */}
                      {visibleColumns.status && (
                        <td className="px-3 py-3">
                          <select
                            value={item.status}
                            onChange={(e) =>
                              handleCellChange(
                                item.id,
                                'status',
                                e.target.value as InventoryItem['status']
                              )
                            }
                            className={`border rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer focus:outline-none ${
                              item.status === 'Disabled'
                                ? 'border-[#FCA5A5] bg-[#FEF2F2] text-[#B91C1C]'
                                : item.status === 'Draft'
                                ? 'border-[#FCD34D] bg-[#FFFBEB] text-[#B45309]'
                                : 'border-[#A7F3D0] bg-[#ECFDF5] text-[#047857]'
                            }`}
                          >
                            <option value="Enabled">Enabled</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Disabled">Disabled</option>
                          </select>
                        </td>
                      )}

                      {/* Action icons: Delete Button + Edit + View */}
                      {visibleColumns.actions && (
                        <td className="px-3 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              className="p-1.5 rounded-md text-[#5A586E] hover:text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
                              title="Delete from inventory"
                              aria-label="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Stock In / Out Adjustment */}
                            <button
                              type="button"
                              onClick={() => handleOpenStockAdjust(item)}
                              className="p-1.5 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
                              title="Adjust Stock In/Out"
                              aria-label="Adjust stock"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* View / Details */}
                            <button
                              type="button"
                              onClick={() => handleOpenStockAdjust(item)}
                              className="p-1.5 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
                              title="View details"
                              aria-label="View details"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination matching Image 1 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRecords={filteredItems.length}
          pageSize={pageSize}
          onPageChange={(page) => setCurrentPage(page)}
          className="rounded-b-xl"
        />
      </div>

      {/* Stock Adjust Drawer */}
      <StockAdjustDrawer
        open={adjustDrawerOpen}
        onClose={() => setAdjustDrawerOpen(false)}
        item={adjustItem}
        mode="in"
        threshold={threshold}
        onSave={(itemId, mode, qty) => {
          setItems((prev) =>
            prev.map((i) => {
              if (i.id !== itemId) return i;
              return {
                ...i,
                stock: mode === 'in' ? i.stock + qty : Math.max(0, i.stock - qty),
              };
            })
          );
        }}
      />

      {/* ConfirmationModal: Delete Stock Item */}
      <ConfirmationModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete inventory item?"
        description={`Are you sure you want to remove "${itemToDelete?.name}" (${itemToDelete?.designNumber || ''}) from your warehouse stock inventory?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
