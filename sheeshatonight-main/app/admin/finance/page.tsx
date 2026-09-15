'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Wallet,
  PieChart,
  Receipt,
  CreditCard,
  DollarSign,
  Percent,
  Settings,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Loader2,
  RefreshCw,
  Building,
  TrendingUp,
  ArrowUpRight,
} from 'lucide-react';

interface FinanceSummary {
  totalGmv: number;
  totalPlatformRevenue: number;
  totalVendorPayable: number;
  eligiblePayouts: number;
  pendingClearance: number;
  paidPayouts: number;
  totalOrders: number;
}

interface PlatformSettingData {
  id: string;
  key: string;
  commissionType: string;
  commissionValue: number;
  fixedFee: number;
  description?: string;
  updatedAt: string;
}

interface VendorPerformance {
  id: string;
  name: string;
  slug: string;
  orderCount: number;
  grossSales: number;
  platformCommission: number;
  netEarnings: number;
  eligiblePayout: number;
  customRate: number | null;
}

interface RecentTransaction {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail?: string;
  vendor: string;
  vendorSlug?: string;
  totalAmount: number;
  platformFee: number;
  vendorNet: number;
  commissionRate: number;
  status: string;
  payoutStatus: string;
  createdAt: string;
}

export default function AdminFinancePage() {
  const [summary, setSummary] = useState<FinanceSummary>({
    totalGmv: 0,
    totalPlatformRevenue: 0,
    totalVendorPayable: 0,
    eligiblePayouts: 0,
    pendingClearance: 0,
    paidPayouts: 0,
    totalOrders: 0,
  });

  const [platformSetting, setPlatformSetting] = useState<PlatformSettingData>({
    id: '',
    key: 'platform_commission',
    commissionType: 'PERCENTAGE',
    commissionValue: 10,
    fixedFee: 0,
    description: '',
    updatedAt: '',
  });

  const [vendorList, setVendorList] = useState<VendorPerformance[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Settings Edit State
  const [settingType, setSettingType] = useState('PERCENTAGE');
  const [settingValue, setSettingValue] = useState('10');
  const [settingFixedFee, setSettingFixedFee] = useState('0');
  const [savingSetting, setSavingSetting] = useState(false);
  const [settingSuccess, setSettingSuccess] = useState(false);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    let token = localStorage.getItem('auth_token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match && match[1]) token = decodeURIComponent(match[1]);
    }
    return token || '';
  };

  const fetchFinanceData = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('/api/admin/finance', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setSummary(data.data.summary);
          if (data.data.platformSetting) {
            setPlatformSetting(data.data.platformSetting);
            setSettingType(data.data.platformSetting.commissionType || 'PERCENTAGE');
            setSettingValue(String(data.data.platformSetting.commissionValue || 10));
            setSettingFixedFee(String(data.data.platformSetting.fixedFee || 0));
          }
          setVendorList(data.data.vendorPerformance || []);
          setRecentOrders(data.data.recentOrders || []);
        }
      }
    } catch (err) {
      console.error('Failed to load finance stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const handleSaveCommission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSetting(true);
      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch('/api/admin/finance', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          commissionType: settingType,
          commissionValue: parseFloat(settingValue) || 0,
          fixedFee: parseFloat(settingFixedFee) || 0,
          description: `Platform global commission rate updated to ${settingValue}${settingType === 'PERCENTAGE' ? '%' : ' AED'}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSettingSuccess(true);
        if (data.data?.platformSetting) {
          setPlatformSetting(data.data.platformSetting);
        }
        setTimeout(() => setSettingSuccess(false), 4000);
      } else {
        alert(data.error || 'Failed to update commission settings');
      }
    } catch (err) {
      console.error('Failed to update commission:', err);
    } finally {
      setSavingSetting(false);
    }
  };

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getPayoutBadge = (payoutStatus: string) => {
    const p = (payoutStatus || 'PENDING').toUpperCase();
    switch (p) {
      case 'ELIGIBLE':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Eligible</span>;
      case 'PAID':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Disbursed</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{p}</span>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.25em] text-[#74189B] font-black">Finance & Revenue</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-[#74189B]" />
            Marketplace Finance & Reconciliation
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time gross merchandise volume, server-calculated commission earnings, and vendor settlement control.
          </p>
        </div>

        <button
          onClick={fetchFinanceData}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#74189B]' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Marketplace GMV</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#74189B] flex items-center justify-center font-bold">
              <DollarSign size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono">
            {formatAED(summary.totalGmv)}
          </p>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <TrendingUp size={13} className="text-emerald-500" />
            <span>Across {summary.totalOrders} total marketplace orders</span>
          </p>
        </div>

        <div className="rounded-3xl border border-purple-200 bg-gradient-to-br from-white to-purple-50/50 p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#74189B] uppercase tracking-wider">Platform Net Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-[#74189B] text-white flex items-center justify-center font-bold shadow-md shadow-purple-900/10">
              <Receipt size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-[#74189B] font-mono">
            {formatAED(summary.totalPlatformRevenue)}
          </p>
          <p className="text-xs text-purple-700 mt-1">
            Platform fees earned ({platformSetting.commissionValue}% standard rate)
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vendor Net Payable</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CreditCard size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 font-mono">
            {formatAED(summary.totalVendorPayable)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Total vendor earnings (GMV - Platform Fees)
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Eligible for Payout</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#F1A51D] flex items-center justify-center font-bold">
              <ShieldCheck size={20} />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 font-mono">
            {formatAED(summary.eligiblePayouts)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            AED {summary.pendingClearance.toFixed(2)} in pending clearance
          </p>
        </div>
      </div>

      {/* Global Commission Setting Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-[#74189B]" />
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Global Platform Commission Settings
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Configure default marketplace transaction fees automatically applied to all vendor orders during checkout.
            </p>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-bold text-slate-400 block">Current Active Rate</span>
            <span className="text-sm font-black text-[#74189B] font-mono">
              {platformSetting.commissionValue}% {platformSetting.commissionType === 'FIXED' ? '+ Fixed Fee' : 'Gross'}
            </span>
          </div>
        </div>

        {settingSuccess && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} />
            <span>Platform commission configuration updated and saved to database successfully!</span>
          </div>
        )}

        <form onSubmit={handleSaveCommission} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
              Fee Structure Type
            </label>
            <select
              value={settingType}
              onChange={(e) => setSettingType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#74189B]"
            >
              <option value="PERCENTAGE">Percentage Commission (%)</option>
              <option value="FIXED">Fixed Fee per Order (AED)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
              Commission Rate ({settingType === 'PERCENTAGE' ? '%' : 'AED'})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={settingValue}
                onChange={(e) => setSettingValue(e.target.value)}
                className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#74189B]"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                {settingType === 'PERCENTAGE' ? '%' : 'AED'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1.5">
              Fixed Transaction Fee (Optional AED)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0"
                value={settingFixedFee}
                onChange={(e) => setSettingFixedFee(e.target.value)}
                className="w-full pl-3.5 pr-12 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#74189B]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                AED
              </span>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={savingSetting}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10 disabled:opacity-50"
            >
              {savingSetting ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
              Save Platform Rate
            </button>
          </div>
        </form>
      </div>

      {/* Two-Column Section: Vendor Share & Recent Reconciliation Feed */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vendor Breakdown Table */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#74189B] font-bold">Merchant Performance</p>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">Vendor Volume & Fees</h2>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#74189B] flex items-center justify-center">
              <PieChart size={18} />
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Vendor</th>
                  <th className="py-2.5 px-3">Orders</th>
                  <th className="py-2.5 px-3">Gross Sales</th>
                  <th className="py-2.5 px-3">Platform Fee</th>
                  <th className="py-2.5 px-3">Net Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vendorList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      No active vendor accounts found.
                    </td>
                  </tr>
                ) : (
                  vendorList.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-3">
                        <span className="font-bold text-slate-900 block">{v.name}</span>
                        {v.customRate !== null && (
                          <span className="text-[10px] text-[#74189B] font-semibold">
                            Custom: {v.customRate}%
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-600">{v.orderCount}</td>
                      <td className="py-3 px-3 font-mono font-medium">{formatAED(v.grossSales)}</td>
                      <td className="py-3 px-3 font-mono text-rose-500">
                        {formatAED(v.platformCommission)}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                        {formatAED(v.netEarnings)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Financial Transactions Feed */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#74189B] font-bold">Ledger Feed</p>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">Recent Order Transactions</h2>
            </div>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#74189B] flex items-center justify-center">
              <Receipt size={18} />
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {recentOrders.length === 0 ? (
              <p className="py-8 text-center text-slate-400 text-xs">No orders recorded in database yet.</p>
            ) : (
              recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-2xl border border-slate-100 p-3.5 hover:border-purple-200 hover:bg-purple-50/20 transition text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="font-bold text-[#74189B] hover:underline"
                      >
                        #{ord.orderNumber || ord.id.slice(0, 8)}
                      </Link>
                      <span className="text-slate-400">·</span>
                      <span className="font-semibold text-slate-800">{ord.vendor}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">
                      {formatAED(ord.totalAmount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-50 text-[11px] text-slate-500">
                    <div className="flex items-center gap-3 font-mono">
                      <span>Customer: <strong className="text-slate-700">{ord.customer}</strong></span>
                      <span>Fee: <strong className="text-rose-500">-{formatAED(ord.platformFee)}</strong></span>
                      <span>Net: <strong className="text-emerald-600">{formatAED(ord.vendorNet)}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {getPayoutBadge(ord.payoutStatus)}
                      <span className="text-[10px] text-slate-400">
                        {new Date(ord.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
