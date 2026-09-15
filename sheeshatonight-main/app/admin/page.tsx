'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Store,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Filter,
  Plus,
  Eye,
  FileText,
} from 'lucide-react';
import { StatCard } from '@/components/admin/StatCard';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { CardSkeleton, TableSkeleton } from '@/components/admin/LoadingSkeleton';
import { EmptyState } from '@/components/admin/EmptyState';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  activeProducts?: number;
  activeVendors: number;
  totalVendors: number;
  totalUsers: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingVendors: number;
  lowStockProducts: number;
  pendingReviews: number;
  averageOrderValue: number;
}


interface RecentOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  vendor?: { name: string };
  _count?: { items: number };
}

interface ChartPoint {
  date: string;
  sales: number;
  count: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState<'7Days' | '30Days' | '3Months' | '6Months' | '1Year'>('30Days');
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);

  // Fetch primary stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch('/api/admin/stats', { headers });
        if (res.ok) {
          const json = await res.json();
          const data = json.data || json.stats;
          setStats(data);
          if (json.recentOrders) {
            setRecentOrders(json.recentOrders);
          }
        }
      } catch (err) {
        console.error('Error fetching admin dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Fetch report analytics for selected timeframe
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setChartLoading(true);
        const token = localStorage.getItem('auth_token');
        const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(`/api/admin/reports?timeframe=${chartPeriod}`, { headers });
        if (res.ok) {
          const json = await res.json();
          if (json.data?.salesChartData) {
            setChartData(json.data.salesChartData);
          }
        }
      } catch (err) {
        console.error('Error fetching analytics chart:', err);
      } finally {

        setChartLoading(false);
      }
    };

    fetchAnalytics();
  }, [chartPeriod]);

  // Format currency
  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // SVG Chart Calculations
  const chartHeight = 220;
  const chartWidth = 700;
  const paddingX = 40;
  const paddingY = 30;

  const maxSales = Math.max(...chartData.map((d) => d.sales), 100);
  const minSales = 0;

  const getCoordinates = (point: ChartPoint, index: number) => {
    const totalPoints = chartData.length;
    const x =
      totalPoints <= 1
        ? chartWidth / 2
        : paddingX + (index / (totalPoints - 1)) * (chartWidth - paddingX * 2);
    const y =
      chartHeight -
      paddingY -
      ((point.sales - minSales) / (maxSales - minSales || 1)) *
        (chartHeight - paddingY * 2);
    return { x, y };
  };

  // Build SVG path
  const pathD =
    chartData.length > 0
      ? chartData.reduce((acc, point, index) => {
          const { x, y } = getCoordinates(point, index);
          return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
        }, '')
      : '';

  const lastPoint = chartData[chartData.length - 1];
  const firstPoint = chartData[0];
  const areaD =
    chartData.length > 0 && lastPoint && firstPoint
      ? `${pathD} L ${getCoordinates(lastPoint, chartData.length - 1).x} ${
          chartHeight - paddingY
        } L ${getCoordinates(firstPoint, 0).x} ${chartHeight - paddingY} Z`
      : '';


  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#29252B] tracking-tight">
              Dashboard Overview
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#74189B]/10 text-[#74189B] text-xs font-bold border border-[#74189B]/20">
              Live DB
            </span>
          </div>
          <p className="text-xs text-[#716975] mt-1">
            Real-time analytics and platform operational metrics across the UAE marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#74189B] hover:bg-[#571275] text-white text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-[#74189B] border border-[#E9E3EB] text-xs font-bold transition shadow-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Manage Orders</span>
          </Link>
        </div>
      </div>

      {/* Primary 5 Metrics Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Revenue"
            value={formatAED(stats?.totalRevenue)}
            icon={DollarSign}
            highlight={true}
            subtitle="Gross marketplace orders"
          />

          <StatCard
            title="Total Orders"
            value={stats?.totalOrders || 0}
            icon={ShoppingBag}
            subtitle={`${stats?.completedOrders || 0} completed`}
          />

          <StatCard
            title="Total Customers"
            value={stats?.totalCustomers || 0}
            icon={Users}
            subtitle={`${stats?.totalUsers || 0} total registered users`}
          />

          <StatCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            icon={Package}
            subtitle={`${stats?.activeProducts || 0} active in catalogue`}
          />

          <StatCard
            title="Active Vendors"
            value={stats?.activeVendors || 0}
            icon={Store}
            subtitle={`${stats?.totalVendors || 0} registered vendors`}
          />
        </div>
      )}

      {/* Operational Alert Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/admin/orders?status=PREPARING"
          className="p-3.5 bg-white rounded-xl border border-[#E9E3EB] hover:border-[#74189B] transition flex items-center justify-between group shadow-xs"
        >
          <div>
            <span className="text-[10px] font-bold text-[#716975] uppercase tracking-wider block">
              Pending Orders
            </span>
            <span className="text-lg font-black text-amber-600">
              {stats?.pendingOrders || 0}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
            <Clock className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/vendors?status=pending"
          className="p-3.5 bg-white rounded-xl border border-[#E9E3EB] hover:border-[#74189B] transition flex items-center justify-between group shadow-xs"
        >
          <div>
            <span className="text-[10px] font-bold text-[#716975] uppercase tracking-wider block">
              Pending Vendors
            </span>
            <span className="text-lg font-black text-purple-600">
              {stats?.pendingVendors || 0}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
            <Store className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/products?stock=low"
          className="p-3.5 bg-white rounded-xl border border-[#E9E3EB] hover:border-[#74189B] transition flex items-center justify-between group shadow-xs"
        >
          <div>
            <span className="text-[10px] font-bold text-[#716975] uppercase tracking-wider block">
              Low Stock Items
            </span>
            <span className="text-lg font-black text-rose-600">
              {stats?.lowStockProducts || 0}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition">
            <AlertCircle className="w-4 h-4" />
          </div>
        </Link>

        <Link
          href="/admin/reviews"
          className="p-3.5 bg-white rounded-xl border border-[#E9E3EB] hover:border-[#74189B] transition flex items-center justify-between group shadow-xs"
        >
          <div>
            <span className="text-[10px] font-bold text-[#716975] uppercase tracking-wider block">
              Pending Reviews
            </span>
            <span className="text-lg font-black text-blue-600">
              {stats?.pendingReviews || 0}
            </span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Revenue Analytics Chart Section */}
      <div className="bg-white rounded-2xl border border-[#E9E3EB] p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E9E3EB]">
          <div>
            <span className="text-[11px] font-bold text-[#74189B] uppercase tracking-wider">
              Revenue Analytics
            </span>
            <h2 className="text-lg font-black text-[#29252B] tracking-tight mt-0.5">
              Marketplace Performance
            </h2>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF8FB] rounded-xl border border-[#E9E3EB]">
            {(['7Days', '30Days', '3Months', '6Months', '1Year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  chartPeriod === period
                    ? 'bg-white text-[#74189B] shadow-xs'
                    : 'text-[#716975] hover:text-[#29252B]'
                }`}
              >
                {period === '7Days'
                  ? '7D'
                  : period === '30Days'
                  ? '30D'
                  : period === '3Months'
                  ? '3M'
                  : period === '6Months'
                  ? '6M'
                  : '1Y'}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Highlights summary bar */}
        <div className="grid grid-cols-3 gap-4 py-4 border-b border-[#E9E3EB]/60 bg-[#FAF8FB]/40 rounded-xl my-4 px-4">
          <div>
            <span className="text-[10px] font-bold text-[#716975] uppercase">Period Revenue</span>
            <p className="text-base font-black text-[#74189B]">
              {formatAED(chartData.reduce((s, p) => s + p.sales, 0))}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#716975] uppercase">Period Orders</span>
            <p className="text-base font-black text-[#29252B]">
              {chartData.reduce((s, p) => s + p.count, 0)}
            </p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-[#716975] uppercase">Average Order Value</span>
            <p className="text-base font-black text-[#F1A51D]">
              {formatAED(stats?.averageOrderValue || 0)}
            </p>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="relative pt-2">
          {chartLoading ? (
            <div className="h-[220px] flex items-center justify-center">
              <CardSkeleton />
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-[220px] flex flex-col items-center justify-center text-center p-6 text-xs text-[#716975]">
              <AlertCircle className="w-8 h-8 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-600">No sales recorded for this period</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Orders created in this timeframe will generate real curves automatically.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-[220px] overflow-visible"
              >
                <defs>
                  <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#74189B" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#74189B" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
                  const val = Math.round(minSales + ratio * (maxSales - minSales));
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={chartWidth - paddingX}
                        y2={y}
                        stroke="#EDE8EF"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 8}
                        y={y + 3}
                        fontSize="10"
                        fill="#8B838E"
                        textAnchor="end"
                        fontWeight="600"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Area and Line Path */}
                {areaD && <path d={areaD} fill="url(#purpleGradient)" />}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#74189B"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {chartData.map((point, idx) => {
                  const { x, y } = getCoordinates(point, idx);
                  const isHovered = hoveredPoint?.date === point.date;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(point)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 6 : 4}
                        fill="#FFFFFF"
                        stroke="#74189B"
                        strokeWidth={isHovered ? 3 : 2}
                        className="transition-all"
                      />
                      {/* Date label at bottom */}
                      <text
                        x={x}
                        y={chartHeight - 10}
                        fontSize="10"
                        fill="#8B838E"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {point.date.slice(5)}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div className="absolute top-2 right-4 bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs z-10 animate-in fade-in duration-150">
                  <p className="font-bold text-amber-400">{hoveredPoint.date}</p>
                  <p className="mt-0.5">
                    Sales: <strong>{formatAED(hoveredPoint.sales)}</strong>
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Orders: <strong>{hoveredPoint.count}</strong>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-[#E9E3EB] overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#E9E3EB] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#74189B] uppercase tracking-wider">
              Recent Transactions
            </span>
            <h2 className="text-lg font-black text-[#29252B] tracking-tight mt-0.5">
              Latest Customer Orders
            </h2>
          </div>

          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#74189B] hover:text-[#571275] transition"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No orders found"
              description="New orders will appear here as soon as customers checkout."
              actionText="Create Test Order"
              actionHref="/shop"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E9E3EB] bg-[#FAF8FB]/70 text-[11px] font-bold text-[#716975] uppercase tracking-wider">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9E3EB]/70 text-xs">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF8FB]/60 transition">
                    <td className="py-3.5 px-4 font-bold text-[#74189B]">
                      <Link href={`/admin/orders/${order.id}`}>
                        #{order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#29252B]">
                        {order.user?.name || 'Guest User'}
                      </div>
                      <div className="text-[11px] text-[#716975]">
                        {order.user?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#716975]">
                      {order.vendor?.name || 'Direct'}
                    </td>
                    <td className="py-3.5 px-4 text-[#716975]">
                      {new Date(order.createdAt).toLocaleDateString('en-AE', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-black text-[#29252B]">
                      {formatAED(order.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8FB] hover:bg-[#74189B] text-[#74189B] hover:text-white border border-[#E9E3EB] text-xs font-bold transition shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
