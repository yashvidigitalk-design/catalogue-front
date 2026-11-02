'use client';

import { useState } from 'react';
import { Eye, Check, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CommonTable from '@/components/CommonTable';
import StatusBadge from '@/components/StatusBadge';
import ConfirmationModal from '@/components/ConfirmationModal';
import OrderDetailsDrawer from '@/components/OrderDetailsDrawer';
import { Order, TableColumn } from '@/types';
import { INITIAL_ORDERS } from '@/lib/ordersData';
import { useToast } from '@/hooks/useToast';

export default function OrdersPage() {
  const { showToast } = useToast();

  const [ordersList, setOrdersList] = useState<Order[]>(INITIAL_ORDERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Accept / Reject Modal State
  const [targetOrder, setTargetOrder] = useState<Order | null>(null);
  const [actionType, setActionType] = useState<'accept' | 'reject'>('accept');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Orders Table Data (backend handles search & filter; frontend does not filter)
  const filteredOrders = ordersList;

  const handleOpenAccept = (ord: Order) => {
    setTargetOrder(ord);
    setActionType('accept');
    setIsModalOpen(true);
  };

  const handleOpenReject = (ord: Order) => {
    setTargetOrder(ord);
    setActionType('reject');
    setIsModalOpen(true);
  };

  const handleConfirmAction = (remark?: string) => {
    if (!targetOrder) return;

    const newStatus = actionType === 'accept' ? 'accepted' : 'rejected';
    const updatedRemark = remark?.trim() || undefined;

    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === targetOrder.id
          ? { ...o, status: newStatus, remark: updatedRemark }
          : o
      )
    );

    // If drawer is viewing the same order, update viewingOrder state
    if (viewingOrder && viewingOrder.id === targetOrder.id) {
      setViewingOrder({
        ...viewingOrder,
        status: newStatus,
        remark: updatedRemark,
      });
    }

    if (actionType === 'accept') {
      showToast('success', 'Order accepted');
    } else {
      showToast('error', 'Order rejected');
    }

    setIsModalOpen(false);
    setTargetOrder(null);
  };

  // CommonTable Columns (fits 1366px screen, Actions sticky right)
  const columns: TableColumn<Order>[] = [
    {
      key: 'id',
      header: 'Order ID',
      width: '100px',
      render: (ord) => (
        <span className="font-bold text-xs text-[#100E26] font-tabular">
          {ord.id}
        </span>
      ),
    },
    {
      key: 'buyerName',
      header: 'Buyer Name',
      width: '160px',
      render: (ord) => (
        <div className="max-w-[155px]">
          <div className="font-semibold text-xs text-[#100E26] truncate" title={ord.buyerName}>
            {ord.buyerName}
          </div>
          <div className="text-[11px] text-[#5A586E] truncate" title={ord.buyerCompany}>
            {ord.buyerCompany}
          </div>
        </div>
      ),
    },
    {
      key: 'contactNumber',
      header: 'Contact No.',
      width: '130px',
      render: (ord) => (
        <span className="text-xs text-[#100E26] font-tabular whitespace-nowrap">
          {ord.contactNumber}
        </span>
      ),
    },
    {
      key: 'productName',
      header: 'Product Name',
      width: '190px',
      render: (ord) => (
        <div className="flex items-center gap-2.5 max-w-[190px]">
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-[#E2E1EC] bg-[#F7F7FB] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ord.productImage}
              alt={ord.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="font-semibold text-xs text-[#100E26] truncate" title={ord.productName}>
            {ord.productName}
          </div>
        </div>
      ),
    },
    {
      key: 'designNumber',
      header: 'Design No.',
      width: '95px',
      render: (ord) => (
        <span className="inline-block px-2 py-0.5 rounded bg-[#EEF2FF] text-[#4E45D5] border border-[#C7D2FE] text-xs font-semibold font-tabular">
          {ord.designNumber}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      width: '95px',
      render: (ord) => (
        <span className="font-semibold text-xs text-[#100E26] font-tabular whitespace-nowrap">
          {ord.quantity.toLocaleString('en-IN')} m
        </span>
      ),
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      width: '95px',
      render: (ord) => (
        <span className="text-xs text-[#5A586E] font-tabular whitespace-nowrap">
          ₹{ord.unitPrice.toLocaleString('en-IN')}/m
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total Amount',
      width: '115px',
      render: (ord) => (
        <span className="font-bold text-xs text-[#100E26] font-tabular whitespace-nowrap">
          ₹{ord.totalAmount.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      width: '105px',
      render: (ord) => (
        <span className="text-xs text-[#5A586E] font-tabular whitespace-nowrap">
          {ord.orderDate}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (ord) => {
        const variant =
          ord.status === 'accepted'
            ? 'green'
            : ord.status === 'rejected'
            ? 'red'
            : 'amber';
        return (
          <StatusBadge
            label={ord.status.charAt(0).toUpperCase() + ord.status.slice(1)}
            variant={variant}
            size="sm"
          />
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '105px',
      align: 'right',
      sticky: 'right',
      render: (ord) => {
        const isPending = ord.status === 'pending';

        return (
          <div className="flex items-center justify-end gap-1">
            <button
              type="button"
              onClick={() => setViewingOrder(ord)}
              className="p-1 rounded-md text-[#5A586E] hover:text-[#4E45D5] hover:bg-[#EEF2FF] transition-colors"
              title="View Order Details"
              aria-label="View Order Details"
            >
              <Eye className="w-4 h-4" />
            </button>

            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => handleOpenAccept(ord)}
                  className="p-1 rounded-md text-[#059669] hover:bg-[#ECFDF5] transition-colors"
                  title="Accept Order"
                  aria-label="Accept Order"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenReject(ord)}
                  className="p-1 rounded-md text-[#E11D48] hover:bg-[#FFF1F2] transition-colors"
                  title="Reject Order"
                  aria-label="Reject Order"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* PageHeader: Title, short description, no action button */}
      <PageHeader
        title="Orders"
        description="Process bulk wholesale fabric dispatches, verify buyer orders, and record logistics challans."
      />

      {/* Main Table via CommonTable (Search by Order ID, Buyer, or Product Name. No other filters) */}
      <CommonTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Search by order ID, buyer, or product name..."
        onSearch={setSearchTerm}
        searchValue={searchTerm}
        pageSize={10}
      />

      {/* Order Details Drawer */}
      <OrderDetailsDrawer
        open={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
        onAccept={handleOpenAccept}
        onReject={handleOpenReject}
      />

      {/* Accept / Reject ConfirmationModal */}
      {targetOrder && (
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTargetOrder(null);
          }}
          onConfirm={handleConfirmAction}
          title={actionType === 'accept' ? 'Accept Order' : 'Reject Order'}
          description={
            actionType === 'accept'
              ? `Do you want to accept order ${targetOrder.id} placed by ${targetOrder.buyerName} (${targetOrder.buyerCompany}) for ₹${targetOrder.totalAmount.toLocaleString('en-IN')}?`
              : `Are you sure you want to reject order ${targetOrder.id} from ${targetOrder.buyerName} (${targetOrder.buyerCompany})?`
          }
          variant={actionType === 'accept' ? 'success' : 'danger'}
          confirmText={actionType === 'accept' ? 'Accept Order' : 'Reject Order'}
          cancelText="Cancel"
          tag={
            actionType === 'accept' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]">
                Accept
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3]">
                Reject
              </span>
            )
          }
          showRemark={true}
          remarkRequired={actionType === 'reject'}
          remarkLabel={
            actionType === 'accept'
              ? 'Dispatch Remark / Notes'
              : 'Reason for Rejection'
          }
          remarkPlaceholder={
            actionType === 'accept'
              ? 'Add a remark for the buyer (optional)'
              : 'Specify rejection reason (e.g. out of stock on loom runs, unable to meet delivery deadline)...'
          }
        />
      )}
    </div>
  );
}
