'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart,
  CheckCircle2,
  XCircle,
  Clock,
  Package,
  Search,
  Truck,
  Eye,
  DollarSign,
  Percent,
  RefreshCw,
  X,
  User,
  MapPin,
  FileText,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    title: string;
    price: number;
    images?: string[];
    type?: string;
  };
}

interface VendorOrder {
  id: string;
  orderNumber: string;
  status: string;
  payoutStatus: string;
  totalAmount: number;
  subtotal: number;
  platformFee: number;
  vendorNet: number;
  commissionRate: number;
  currency: string;
  createdAt: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  invoiceNumber?: string;
  items?: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    addresses?: Array<{
      street: string;
      building?: string;
      city: string;
      country: string;
    }>;
  };
}

interface SummaryStats {
  grossSales: number;
  platformFees: number;
  netEarnings: number;
  eligiblePayout: number;
  pendingPayout: number;
  paidPayout: number;
  totalOrders: number;
}

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [summary, setSummary] = useState<SummaryStats>({
    grossSales: 0,
    platformFees: 0,
    netEarnings: 0,
    eligiblePayout: 0,
    pendingPayout: 0,
    paidPayout: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [payoutFilter, setPayoutFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<VendorOrder | null>(null);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    let token = localStorage.getItem('auth_token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match && match[1]) token = decodeURIComponent(match[1]);
    }
    return token || '';
  };

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (payoutFilter !== 'ALL') params.set('payoutStatus', payoutFilter);
      params.set('pageSize', '50');

      const res = await fetch(`/api/vendor/orders?${params.toString()}`, { headers });
      const data = await res.json();

      if (data.success && data.data) {
        const orderList = Array.isArray(data.data.data)
          ? data.data.data
          : Array.isArray(data.data)
          ? data.data
          : [];
        setOrders(orderList);
        if (data.data.summary) {
          setSummary(data.data.summary);
        }
      }
    } catch (err) {
      console.error('Failed to fetch vendor orders:', err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, payoutFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOrders();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch('/api/vendor/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({ orderId, status: newStatus.toUpperCase() }),
      });
      const data = await res.json();
      if (data.success) {
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder((prev) =>
            prev ? { ...prev, status: newStatus.toUpperCase() } : null
          );
        }
        await fetchOrders();
      } else {
        alert(data.error || 'Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getOrderStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case 'PREPARING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Package className="w-3 h-3" /> Preparing
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck className="w-3 h-3" /> Out for Delivery
          </span>
        );
      case 'DELIVERED':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> {s === 'DELIVERED' ? 'Delivered' : 'Completed'}
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  const getPayoutStatusBadge = (payoutStatus: string) => {
    const p = (payoutStatus || 'PENDING').toUpperCase();
    switch (p) {
      case 'ELIGIBLE':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100/70 text-emerald-800 border border-emerald-300">
            <ShieldCheck className="w-3 h-3" /> Eligible for Payout
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <CheckCircle2 className="w-3 h-3" /> Disbursed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> Clearance Pending
          </span>
        );
      case 'FAILED':
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> {p}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
            {p}
          </span>
        );
    }
  };

  const statusOptions = [
    { label: 'All Orders', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Out for Delivery', value: 'OUT_FOR_DELIVERY' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  const payoutOptions = [
    { label: 'All Payouts', value: 'ALL' },
    { label: 'Eligible', value: 'ELIGIBLE' },
    { label: 'Pending Clearance', value: 'PENDING' },
    { label: 'Paid', value: 'PAID' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShoppingCart className="w-6 h-6 text-[#8A277E]" />
              Order Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8A277E]/10 text-[#8A277E] text-xs font-bold border border-[#8A277E]/20">
              {orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Fulfill store orders, track platform commission, and inspect net earnings & payout readiness.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#8A277E]' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Sales</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8A277E] flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {formatAED(summary.grossSales)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Total revenue across {summary.totalOrders} vendor orders</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Platform Commission</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Percent size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 font-mono">
            -{formatAED(summary.platformFees)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Platform fee retained by marketplace</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Net Earnings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            {formatAED(summary.netEarnings)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Your total earned share (Gross - Fees)</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ready for Payout</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#8A277E] flex items-center justify-center font-bold">
              <ShieldCheck size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-[#8A277E] font-mono">
            {formatAED(summary.eligiblePayout)}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">From completed & delivered orders</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order #, customer name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#8A277E] focus:bg-white transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Payout Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Payout:</span>
            <select
              value={payoutFilter}
              onChange={(e) => setPayoutFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#8A277E]"
            >
              {payoutOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                statusFilter === opt.value
                  ? 'bg-[#8A277E] text-white border-[#8A277E] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Order ID</th>
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-5">Items</th>
                <th className="py-3.5 px-5">Financial Breakdown</th>
                <th className="py-3.5 px-5">Order Status</th>
                <th className="py-3.5 px-5">Payout Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <RefreshCw className="w-6 h-6 text-[#8A277E] animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Loading vendor orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No orders found</p>
                    <p className="text-xs text-slate-400 mt-1">No orders match the selected filters or search terms.</p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const itemCount = order.items?.reduce((acc, it) => acc + it.quantity, 0) || 0;
                  const firstProduct = order.items?.[0]?.product;
                  const isUpdating = updatingId === order.id;

                  return (
                    <tr key={order.id} className="hover:bg-purple-50/30 transition">
                      {/* Order ID & Date */}
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 block">
                          #{order.orderNumber || order.id.slice(0, 8)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString('en-AE', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        {order.invoiceNumber && (
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Inv: {order.invoiceNumber}
                          </span>
                        )}
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-5">
                        <p className="font-bold text-slate-800">{order.customerName}</p>
                        {order.customerEmail && (
                          <p className="text-[11px] text-slate-500 truncate max-w-[140px]">
                            {order.customerEmail}
                          </p>
                        )}
                        {order.customerPhone && (
                          <p className="text-[11px] text-slate-400 font-mono">{order.customerPhone}</p>
                        )}
                      </td>

                      {/* Items */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          {firstProduct?.images?.[0] ? (
                            <img
                              src={firstProduct.images[0]}
                              alt={firstProduct.title}
                              className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                          <div className="max-w-[160px]">
                            <p className="font-semibold text-slate-800 truncate" title={firstProduct?.title || 'Product'}>
                              {firstProduct?.title || 'Order Product'}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {itemCount} {itemCount === 1 ? 'item' : 'items'}
                              {order.items && order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Financial Breakdown */}
                      <td className="py-4 px-5 font-mono">
                        <div className="space-y-0.5">
                          <div className="text-[11px] text-slate-500 flex items-center justify-between gap-2">
                            <span>Gross:</span>
                            <span className="font-medium text-slate-700">{formatAED(order.totalAmount)}</span>
                          </div>
                          <div className="text-[10px] text-rose-500 flex items-center justify-between gap-2">
                            <span>Fee ({order.commissionRate}%):</span>
                            <span>-{formatAED(order.platformFee)}</span>
                          </div>
                          <div className="text-xs font-bold text-emerald-700 flex items-center justify-between gap-2 pt-0.5 border-t border-slate-200">
                            <span>Net:</span>
                            <span className="bg-emerald-50 px-1 rounded">{formatAED(order.vendorNet)}</span>
                          </div>
                        </div>
                      </td>

                      {/* Order Status */}
                      <td className="py-4 px-5">
                        <div className="space-y-2">
                          {getOrderStatusBadge(order.status)}

                          {/* Quick Action Button based on status */}
                          {order.status === 'PENDING' && (
                            <div className="flex items-center gap-1.5 pt-1">
                              <button
                                disabled={isUpdating}
                                onClick={() => handleStatusUpdate(order.id, 'PREPARING')}
                                className="px-2.5 py-1 bg-[#8A277E] hover:bg-[#721e67] text-white rounded-lg text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                              >
                                <Package className="w-3 h-3" />
                                Accept
                              </button>
                              <button
                                disabled={isUpdating}
                                onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[11px] font-bold transition"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {order.status === 'PREPARING' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusUpdate(order.id, 'OUT_FOR_DELIVERY')}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                            >
                              <Truck className="w-3 h-3" />
                              Dispatch
                            </button>
                          )}

                          {order.status === 'OUT_FOR_DELIVERY' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition shadow-xs flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Mark Delivered
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Payout Status */}
                      <td className="py-4 px-5">
                        {getPayoutStatusBadge(order.payoutStatus)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#8A277E]" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8A277E]">Order Details</span>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  #{selectedOrder.orderNumber || selectedOrder.id}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-AE')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Payout Summary */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Order Status</span>
                {getOrderStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Payout Status</span>
                {getPayoutStatusBadge(selectedOrder.payoutStatus)}
              </div>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-2xl border border-slate-200/80 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#8A277E]" />
                Customer Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                <div>
                  <span className="text-slate-400 block text-[10px]">Name:</span>
                  <span className="font-semibold">{selectedOrder.customerName}</span>
                </div>
                {selectedOrder.customerEmail && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Email:</span>
                    <a href={`mailto:${selectedOrder.customerEmail}`} className="text-[#8A277E] hover:underline">
                      {selectedOrder.customerEmail}
                    </a>
                  </div>
                )}
                {selectedOrder.customerPhone && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">Phone:</span>
                    <a href={`tel:${selectedOrder.customerPhone}`} className="font-mono text-slate-800">
                      {selectedOrder.customerPhone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Items Ordered */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-[#8A277E]" />
                Items Breakdown
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden">
                {selectedOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      {item.product?.images?.[0] ? (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-12 h-12 object-cover rounded-xl border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <Package className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900">{item.product?.title || 'Product'}</p>
                        <p className="text-slate-500 text-[11px]">
                          Qty: {item.quantity} × {formatAED(item.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-slate-900">
                      {formatAED(item.quantity * item.price)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Ledger Calculation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/30 border border-purple-100 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5 mb-2">
                <DollarSign className="w-3.5 h-3.5 text-[#8A277E]" />
                Settlement Formula
              </h4>
              <div className="flex justify-between text-slate-600">
                <span>Order Total (Gross Paid by Customer):</span>
                <span className="font-mono font-bold">{formatAED(selectedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-rose-600">
                <span>Platform Commission ({selectedOrder.commissionRate}%):</span>
                <span className="font-mono font-bold">-{formatAED(selectedOrder.platformFee)}</span>
              </div>
              <div className="flex justify-between text-emerald-800 text-sm font-black pt-2 border-t border-purple-200/80">
                <span>Your Net Payout:</span>
                <span className="font-mono">{formatAED(selectedOrder.vendorNet)}</span>
              </div>
              <p className="text-[10px] text-slate-500 pt-1">
                * Net earnings will become eligible for withdrawal once the order status is set to Delivered or Completed.
              </p>
            </div>

            {/* Status Update Quick Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">Update Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#8A277E]"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PREPARING">Preparing</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
