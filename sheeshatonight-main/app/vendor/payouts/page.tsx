'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  DollarSign,
  Percent,
  Receipt,
  Building,
  RefreshCw,
  ShieldCheck,
  Package,
} from 'lucide-react';

interface Settlement {
  id: string;
  amount: number;
  commission: number;
  netAmount: number;
  period: string;
  status: 'PENDING' | 'PROCESSED' | 'PAID' | 'FAILED';
  paidAt?: string | null;
  createdAt: string;
}

interface SummaryData {
  grossRevenue: number;
  totalCommission: number;
  netEarnings: number;
  availableBalance: number;
  pendingSettlement: number;
  paidTotal: number;
  totalOrders: number;
}

export default function VendorPayoutsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryData>({
    grossRevenue: 0,
    totalCommission: 0,
    netEarnings: 0,
    availableBalance: 0,
    pendingSettlement: 0,
    paidTotal: 0,
    totalOrders: 0,
  });
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    let token = localStorage.getItem('auth_token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match && match[1]) token = decodeURIComponent(match[1]);
    }
    return token || '';
  };

  const fetchPayouts = useCallback(async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('/api/vendor/settlements', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          const list = data.data?.settlements || [];
          setSettlements(Array.isArray(list) ? list : []);
          if (data.data?.summary) {
            setSummary(data.data.summary);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load payouts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const handleRequestPayout = async () => {
    try {
      setRequesting(true);
      setRequestError(null);
      setRequestSuccess(null);

      const token = getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch('/api/vendor/settlements', {
        method: 'POST',
        headers,
      });
      const data = await res.json();

      if (data.success) {
        setRequestSuccess(
          `Settlement request for AED ${Number(data.data?.requestedAmount || summary.availableBalance).toFixed(2)} submitted successfully! Admin will disburse to your bank account.`
        );
        await fetchPayouts();
        setTimeout(() => setRequestSuccess(null), 7000);
      } else {
        setRequestError(data.error || 'Failed to submit settlement request');
      }
    } catch (err) {
      console.error('Error requesting payout:', err);
      setRequestError('Network error while requesting payout');
    } finally {
      setRequesting(false);
    }
  };

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PROCESSED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Wallet className="w-6 h-6 text-[#8A277E]" />
              Payouts & Settlements
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#8A277E]/10 text-[#8A277E] text-xs font-bold border border-[#8A277E]/20">
              AED {summary.availableBalance.toFixed(2)} Available
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track your net sales, commission deductions, and request bank disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchPayouts}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#8A277E]' : ''}`} />
          </button>

          <button
            onClick={handleRequestPayout}
            disabled={requesting || summary.availableBalance <= 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#8A277E] text-white hover:bg-[#721e67] transition shadow-md shadow-purple-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {requesting ? <Loader2 size={15} className="animate-spin" /> : <Wallet size={15} />}
            Request Settlement Payout
          </button>
        </div>
      </div>

      {requestSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{requestSuccess}</span>
        </div>
      )}

      {requestError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2.5 shadow-xs animate-in fade-in">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>{requestError}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-purple-200/80 shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-[#8A277E]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Available for Payout</span>
            <div className="w-9 h-9 bg-purple-50 text-[#8A277E] rounded-xl flex items-center justify-center font-bold">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#8A277E] font-mono">
            {formatAED(summary.availableBalance)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Eligible from delivered & completed orders</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Clearance</span>
            <div className="w-9 h-9 bg-amber-50 text-[#F1A51D] rounded-xl flex items-center justify-center font-bold">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {formatAED(summary.pendingSettlement)}
          </p>
          <p className="text-xs text-slate-500 mt-1">From in-progress and out-for-delivery orders</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Paid to Date</span>
            <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 font-mono">
            {formatAED(summary.paidTotal)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Disbursed lifetime to your bank account</p>
        </div>
      </div>

      {/* Lifetime Financial Summary Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-black tracking-wide text-amber-400 uppercase">
              Financial Reconciliation Overview
            </h3>
            <p className="text-xs text-slate-300">Total volume across {summary.totalOrders} marketplace orders</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 font-mono">
            Standard Commission: 10%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-mono">
          <div>
            <span className="text-[11px] text-slate-400 block">Gross Order Volume</span>
            <span className="text-xl font-black text-white">{formatAED(summary.grossRevenue)}</span>
          </div>
          <div>
            <span className="text-[11px] text-rose-300 block">Platform Commission Fee</span>
            <span className="text-xl font-black text-rose-400">-{formatAED(summary.totalCommission)}</span>
          </div>
          <div>
            <span className="text-[11px] text-emerald-300 block">Net Vendor Earnings</span>
            <span className="text-xl font-black text-emerald-400">{formatAED(summary.netEarnings)}</span>
          </div>
        </div>
      </div>

      {/* Settlements Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Settlement Ledger</h3>
            <p className="text-xs text-slate-500 mt-0.5">Historical payout statements and bank disbursements</p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#8A277E] animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading payout records...</p>
          </div>
        ) : settlements.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No settlement records yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              When you have delivered orders eligible for payout, click &quot;Request Settlement Payout&quot; above to submit for disbursement.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Period</th>
                  <th className="py-3 px-5">Gross Amount</th>
                  <th className="py-3 px-5">Platform Fee</th>
                  <th className="py-3 px-5">Net Payable</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Disbursed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {settlements.map((s) => (
                  <tr key={s.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{s.period}</td>
                    <td className="py-3.5 px-5 font-mono">{formatAED(s.amount)}</td>
                    <td className="py-3.5 px-5 font-mono text-rose-500">-{formatAED(s.commission)}</td>
                    <td className="py-3.5 px-5 font-mono font-bold text-[#8A277E]">
                      {formatAED(s.netAmount)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(s.status)}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {s.paidAt ? new Date(s.paidAt).toLocaleDateString('en-AE') : 'Pending'}
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
