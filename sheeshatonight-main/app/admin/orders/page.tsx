'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Eye, Search, Filter, ShoppingBag, ShieldCheck, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { DataTable, Column } from '@/components/admin/DataTable';

interface OrderRecord {
  id: string;
  orderNumber: string;
  totalAmount: number;
  subtotal?: number;
  platformFee?: number;
  vendorNet?: number;
  commissionRate?: number;
  payoutStatus?: string;
  currency: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  vendor: {
    name: string;
    slug: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      title: string;
    };
  }>;
}

export default function AdminOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);
  const [selectedPayoutStatus, setSelectedPayoutStatus] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', '10');
      if (search.trim()) params.set('search', search.trim());
      if (selectedStatus && selectedStatus !== 'ALL') params.set('status', selectedStatus);
      if (selectedPayoutStatus && selectedPayoutStatus !== 'ALL') params.set('payoutStatus', selectedPayoutStatus);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalOrders(data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedStatus, selectedPayoutStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getPayoutBadge = (payoutStatus?: string) => {
    const p = (payoutStatus || 'PENDING').toUpperCase();
    switch (p) {
      case 'ELIGIBLE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Eligible
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <CheckCircle2 className="w-3 h-3" /> Disbursed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'FAILED':
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> {p}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
            {p}
          </span>
        );
    }
  };

  const columns: Column<OrderRecord>[] = [
    {
      header: 'Order ID',
      cell: (row) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="font-bold text-[#74189B] hover:underline"
        >
          #{row.orderNumber}
        </Link>
      ),
    },
    {
      header: 'Customer',
      cell: (row) => (
        <div>
          <p className="font-bold text-[#29252B]">{row.user?.name || 'Guest User'}</p>
          <p className="text-[11px] text-[#716975]">{row.user?.email || 'N/A'}</p>
        </div>
      ),
    },
    {
      header: 'Vendor',
      cell: (row) => (
        <span className="font-semibold text-slate-800">
          {row.vendor?.name || 'Direct'}
        </span>
      ),
    },
    {
      header: 'Date',
      cell: (row) => (
        <span className="text-[#716975]">
          {new Date(row.createdAt).toLocaleDateString('en-AE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Total (Gross)',
      cell: (row) => (
        <span className="font-black text-[#29252B] font-mono">
          {formatAED(row.totalAmount)}
        </span>
      ),
    },
    {
      header: 'Platform Fee',
      cell: (row) => (
        <span className="font-mono text-rose-500 font-medium">
          +{formatAED(row.platformFee || 0)}
        </span>
      ),
    },
    {
      header: 'Vendor Net',
      cell: (row) => (
        <span className="font-mono text-emerald-700 font-bold">
          {formatAED(row.vendorNet || (row.totalAmount - (row.platformFee || 0)))}
        </span>
      ),
    },
    {
      header: 'Order Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Payout',
      cell: (row) => getPayoutBadge(row.payoutStatus),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/orders/${row.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8FB] hover:bg-[#74189B] text-[#74189B] hover:text-white border border-[#E9E3EB] text-xs font-bold transition shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Pending', value: 'PREPARING' },
    { label: 'Ready for Pickup', value: 'READY_FOR_PICKUP' },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Active Rental', value: 'ACTIVE_RENTAL' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  const payoutOptions = [
    { label: 'All Payouts', value: 'ALL' },
    { label: 'Eligible', value: 'ELIGIBLE' },
    { label: 'Pending Clearance', value: 'PENDING' },
    { label: 'Disbursed (Paid)', value: 'PAID' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#29252B] tracking-tight">
              Orders Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#74189B]/10 text-[#74189B] text-xs font-bold border border-[#74189B]/20">
              {totalOrders} Orders
            </span>
          </div>
          <p className="text-xs text-[#716975] mt-1">
            Search, track, and reconcile all marketplace orders, platform fees, and vendor payout status in real time.
          </p>
        </div>

        {/* Payout Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Payout Filter:</span>
          <select
            value={selectedPayoutStatus}
            onChange={(e) => {
              setSelectedPayoutStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 bg-white border border-[#E9E3EB] rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#74189B]"
          >
            {payoutOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setSelectedStatus(opt.value);
              setPage(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedStatus === opt.value
                ? 'bg-[#74189B] text-white border-[#74189B] shadow-xs'
                : 'bg-white text-[#716975] border-[#E9E3EB] hover:bg-[#FAF8FB]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        emptyTitle="No orders found"
        emptyDescription="There are no orders matching your selected filters."
        searchPlaceholder="Search order #, customer name, email, vendor..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalOrders}
        onPageChange={setPage}
      />
    </div>
  );
}
