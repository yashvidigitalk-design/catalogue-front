'use client';

import React, { useState } from 'react';
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Minus,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import CommonTable from '@/components/CommonTable';
import FilterDropdown from '@/components/FilterDropdown';
import StatusBadge from '@/components/StatusBadge';
import LowStockAlert from '@/components/LowStockAlert';
import StockAdjustDrawer from '@/components/StockAdjustDrawer';
import { StockItem, TableColumn, FilterOption } from '@/types';
import { INITIAL_STOCK } from '@/lib/stockData';

export default function StockPage() {
  const [stockList, setStockList] = useState<StockItem[]>(INITIAL_STOCK);
  const [threshold, setThreshold] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<'in' | 'out'>('in');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Handlers for Stock In / Out
  const handleOpenStockIn = (item: StockItem) => {
    setSelectedItem(item);
    setDrawerMode('in');
    setDrawerOpen(true);
  };

  const handleOpenStockOut = (item: StockItem) => {
    setSelectedItem(item);
    setDrawerMode('out');
    setDrawerOpen(true);
  };

  const handleSaveStock = (
    itemId: string,
    mode: 'in' | 'out',
    quantity: number
  ) => {
    setStockList((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        if (mode === 'in') {
          return {
            ...item,
            availableStock: item.availableStock + quantity,
            stockIn: item.stockIn + quantity,
          };
        } else {
          return {
            ...item,
            availableStock: Math.max(0, item.availableStock - quantity),
            stockOut: item.stockOut + quantity,
          };
        }
      })
    );
  };

  // Stat Card calculations
  const totalAvailableStock = stockList.reduce(
    (acc, item) => acc + item.availableStock,
    0
  );
  const totalReservedStock = stockList.reduce(
    (acc, item) => acc + item.reservedStock,
    0
  );
  const totalStock = totalAvailableStock + totalReservedStock;
  const lowStockItems = stockList.filter(
    (item) => item.availableStock > 0 && item.availableStock <= threshold
  );
  const lowStockCount = lowStockItems.length;

  // Filter Dropdown Options
  const statusOptions: FilterOption[] = [
    { label: 'All Stock', value: 'all' },
    { label: 'In Stock', value: 'in_stock' },
    { label: 'Low Stock', value: 'low_stock' },
    { label: 'Out of Stock', value: 'out_of_stock' },
  ];

  const tableFilters = (
    <FilterDropdown
      label="Stock Status"
      options={statusOptions}
      selected={statusFilter}
      onSelect={setStatusFilter}
    />
  );

  // Filtered Stock Table Data
  const filteredStock = stockList.filter((item) => {
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      item.productName.toLowerCase().includes(q) ||
      item.designNumber.toLowerCase().includes(q) ||
      item.fabric.toLowerCase().includes(q);

    let matchesStatus = true;
    if (statusFilter === 'in_stock') {
      matchesStatus = item.availableStock > threshold;
    } else if (statusFilter === 'low_stock') {
      matchesStatus = item.availableStock > 0 && item.availableStock <= threshold;
    } else if (statusFilter === 'out_of_stock') {
      matchesStatus = item.availableStock === 0;
    }

    return matchesSearch && matchesStatus;
  });

  // Table Columns
  const columns: TableColumn<StockItem>[] = [
    {
      key: 'image',
      header: 'Product',
      width: '60px',
      render: (item) => (
        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.productImage}
            alt={item.productName}
            className="w-full h-full object-cover"
          />
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Product Name',
      render: (item) => (
        <div className="min-w-0">
          <div className="font-semibold text-sm text-[#100E26] truncate max-w-[220px]">
            {item.productName}
          </div>
          <div className="text-xs text-[#5A586E] truncate max-w-[220px]">
            {item.fabric}
          </div>
        </div>
      ),
    },
    {
      key: 'design',
      header: 'Design No.',
      width: '110px',
      render: (item) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
          {item.designNumber}
        </span>
      ),
    },
    {
      key: 'availableStock',
      header: 'Available',
      width: '110px',
      render: (item) => (
        <span className="font-bold text-sm text-[#100E26] font-tabular">
          {item.availableStock.toLocaleString('en-IN')} m
        </span>
      ),
    },
    {
      key: 'stockIn',
      header: 'Stock In',
      width: '100px',
      render: (item) => (
        <span className="text-xs font-semibold text-[#059669] font-tabular">
          +{item.stockIn.toLocaleString('en-IN')} m
        </span>
      ),
    },
    {
      key: 'stockOut',
      header: 'Stock Out',
      width: '100px',
      render: (item) => (
        <span className="text-xs font-medium text-[#5A586E] font-tabular">
          -{item.stockOut.toLocaleString('en-IN')} m
        </span>
      ),
    },
    {
      key: 'reservedStock',
      header: 'Reserved',
      width: '100px',
      render: (item) => (
        <span className="text-xs font-medium text-[#5A586E] font-tabular">
          {item.reservedStock.toLocaleString('en-IN')} m
        </span>
      ),
    },
    {
      key: 'soldStock',
      header: 'Sold Stock',
      width: '100px',
      render: (item) => (
        <span className="text-xs font-medium text-[#5A586E] font-tabular">
          {item.soldStock.toLocaleString('en-IN')} m
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '140px',
      render: (item) => {
        if (item.availableStock === 0) {
          return <StatusBadge label="Out of Stock" variant="red" size="sm" />;
        }
        if (item.availableStock <= threshold) {
          return (
            <StatusBadge
              label={`Low Stock (${item.availableStock} left)`}
              variant="amber"
              size="sm"
            />
          );
        }
        return <StatusBadge label="In Stock" variant="green" size="sm" />;
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '100px',
      align: 'right',
      sticky: 'right',
      render: (item) => {
        const isOutOfStock = item.availableStock === 0;
        return (
          <div className="flex items-center justify-end gap-1.5">
            <button
              type="button"
              onClick={() => handleOpenStockIn(item)}
              className="p-1.5 rounded-lg text-[#059669] hover:bg-[#ECFDF5] transition-colors"
              title="Stock In"
              aria-label="Stock In"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleOpenStockOut(item)}
              disabled={isOutOfStock}
              className={`p-1.5 rounded-lg transition-colors ${
                isOutOfStock
                  ? 'text-[#9493A8] opacity-40 cursor-not-allowed'
                  : 'text-[#E11D48] hover:bg-[#FFF1F2]'
              }`}
              title={isOutOfStock ? 'Out of Stock' : 'Stock Out'}
              aria-label="Stock Out"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* PageHeader: Title "Stock Management", short description, no action button */}
      <PageHeader
        title="Stock Management"
        description="Real-time fabric rolls inventory, stock-in batches, and warehouse dispatch reserves."
      />

      {/* 4 StatCards calculated dynamically from data */}
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

      {/* Low Stock Alert Settings Card */}
      <LowStockAlert
        threshold={threshold}
        onSaveThreshold={setThreshold}
        lowStockItems={lowStockItems}
      />

      {/* Stock Table rendered strictly via CommonTable */}
      <CommonTable
        columns={columns}
        data={filteredStock}
        filters={tableFilters}
        searchPlaceholder="Search by product, design no., or fabric..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        pageSize={10}
      />

      {/* Stock Adjust Drawer (used for both Stock In and Stock Out) */}
      <StockAdjustDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={selectedItem}
        mode={drawerMode}
        threshold={threshold}
        onSave={handleSaveStock}
      />
    </div>
  );
}
