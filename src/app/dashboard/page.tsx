'use client';

import { useState, useMemo } from 'react';
import {
  ShoppingBag,
  IndianRupee,
  Users,
  Package,
  Eye,
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import FilterDropdown from '@/components/FilterDropdown';
import CommonTable from '@/components/CommonTable';
import SalesOverviewChart from '@/components/SalesOverviewChart';
import TopSellingProductsChart from '@/components/TopSellingProductsChart';
import {
  STAT_CARDS_DATA,
  TODAY_ORDERS_DATA,
  ORDER_STATUS_FILTER_OPTIONS,
} from '@/lib/dashboardData';
import { TableColumn, DashboardOrder } from '@/types';
import { triggerToast } from '@/hooks/useToast';

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Orders table data (search and filter will be handled by backend; frontend does not filter)
  const filteredOrders = TODAY_ORDERS_DATA;

  // CommonTable columns definition
  const orderColumns: TableColumn<DashboardOrder>[] = useMemo(
    () => [
      {
        key: 'orderId',
        header: 'ORDER ID',
        width: '120px',
        render: (order) => (
          <span className="font-semibold text-[#4E45D5] font-tabular">
            {order.orderId}
          </span>
        ),
      },
      {
        key: 'buyerName',
        header: 'BUYER NAME',
        width: '260px',
        render: (order) => (
          <div>
            <div className="font-bold text-[#100E26] leading-tight">
              {order.buyerName}
            </div>
            <div className="text-[11px] text-[#5A586E] mt-0.5 font-tabular">
              {order.buyerGst}
            </div>
          </div>
        ),
      },
      {
        key: 'productName',
        header: 'FABRIC / SKU',
        render: (order) => (
          <div>
            <div className="font-semibold text-[#100E26] leading-tight">
              {order.productName}
            </div>
            <div className="text-[11px] text-[#5A586E] mt-0.5">
              {order.productSpecs}
            </div>
          </div>
        ),
      },
      {
        key: 'quantity',
        header: 'QUANTITY',
        width: '180px',
        render: (order) => (
          <span className="font-medium text-[#100E26] font-tabular">
            {order.quantity}
          </span>
        ),
      },
      {
        key: 'totalAmount',
        header: 'TOTAL AMOUNT',
        width: '140px',
        render: (order) => (
          <span className="font-bold text-[#100E26] font-tabular">
            {order.totalAmount}
          </span>
        ),
      },
      {
        key: 'status',
        header: 'ORDER STATUS',
        width: '140px',
        render: (order) => (
          <StatusBadge
            label={order.status}
            variant={order.statusVariant}
            size="sm"
          />
        ),
      },
      {
        key: 'actions',
        header: 'ACTION',
        width: '90px',
        align: 'center',
        render: (order) => (
          <button
            type="button"
            onClick={() =>
              triggerToast(
                'info',
                'Order Details',
                `Order details for ${order.orderId} (${order.buyerName}) are available on the Orders page.`
              )
            }
            className="h-8 w-8 rounded-lg border border-[#E2E1EC] hover:border-[#4E45D5] hover:bg-[#EEF2FF] text-[#5A586E] hover:text-[#4E45D5] inline-flex items-center justify-center transition-colors"
            title={`View details for ${order.orderId}`}
            aria-label={`View order ${order.orderId}`}
          >
            <Eye className="w-4 h-4" />
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* 1. Page Header (Strict title/description, no action buttons on right) */}
      <PageHeader
        title="Dashboard"
        description="Real-time performance, wholesale order volumes, and inventory overview."
      />

      {/* 2. Four StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title={STAT_CARDS_DATA[0].title}
          value={STAT_CARDS_DATA[0].value}
          change={STAT_CARDS_DATA[0].change}
          changeType={STAT_CARDS_DATA[0].changeType}
          caption={STAT_CARDS_DATA[0].caption}
          icon={<ShoppingBag className="w-5 h-5" />}
          iconBg="bg-[#EEF2FF] text-[#4E45D5]"
        />

        <StatCard
          title={STAT_CARDS_DATA[1].title}
          value={STAT_CARDS_DATA[1].value}
          change={STAT_CARDS_DATA[1].change}
          changeType={STAT_CARDS_DATA[1].changeType}
          caption={STAT_CARDS_DATA[1].caption}
          icon={<IndianRupee className="w-5 h-5" />}
          iconBg="bg-[#EEF2FF] text-[#4E45D5]"
        />

        <StatCard
          title={STAT_CARDS_DATA[2].title}
          value={STAT_CARDS_DATA[2].value}
          change={STAT_CARDS_DATA[2].change}
          changeType={STAT_CARDS_DATA[2].changeType}
          caption={STAT_CARDS_DATA[2].caption}
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-[#EEF2FF] text-[#4E45D5]"
        />

        <StatCard
          title={STAT_CARDS_DATA[3].title}
          value={STAT_CARDS_DATA[3].value}
          change={STAT_CARDS_DATA[3].change}
          changeType={STAT_CARDS_DATA[3].changeType}
          caption={STAT_CARDS_DATA[3].caption}
          icon={<Package className="w-5 h-5" />}
          iconBg="bg-[#EEF2FF] text-[#4E45D5]"
        />
      </div>

      {/* 3. Two Charts Side by Side (~2/3 and ~1/3 on desktop, stacked on mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesOverviewChart />
        </div>
        <div className="lg:col-span-1">
          <TopSellingProductsChart />
        </div>
      </div>

      {/* 4. Today's Orders Section with CommonTable */}
      <div className="space-y-3 pt-2">
        <div>
          <h3
            className="text-lg font-bold text-[#100E26]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Today&apos;s Orders
          </h3>
          <p className="text-xs text-[#5A586E] mt-0.5">
            Real-time purchase orders pending approval, dispatch, and billing verification.
          </p>
        </div>

        <CommonTable
          columns={orderColumns}
          data={filteredOrders}
          pageSize={5}
          searchPlaceholder="Search order ID, buyer name..."
          searchValue={searchQuery}
          onSearch={setSearchQuery}
          filters={
            <FilterDropdown
              label="Status"
              options={ORDER_STATUS_FILTER_OPTIONS}
              selected={statusFilter}
              onSelect={setStatusFilter}
              placeholder="All Statuses"
            />
          }
        />
      </div>
    </div>
  );
}
