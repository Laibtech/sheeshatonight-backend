'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { CreditCard, Search, DollarSign } from 'lucide-react';

interface OrderPayment {
  id: string;
  orderNumber: string;
  user?: { name: string };
  vendor?: { name: string };
  totalAmount: number | string;
  status: string;
  createdAt: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<OrderPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalVolume = payments.reduce((sum, p) => sum + Number(p.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-7 h-7 text-[#D4AF37]" />
            Payment & Transaction Records
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track order payments, revenue receipts, and financial transaction logs in MySQL.
          </p>
        </div>
        <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <DollarSign size={16} /> Total Volume: AED {totalVolume.toLocaleString()}
        </div>
      </div>

      <GlassCard className="p-6 border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Transaction / Order #</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Vendor</th>
                <th className="py-3 px-3">Gross Amount</th>
                <th className="py-3 px-3">Platform Fee (10%)</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Loading financial records...
                  </td>
                </tr>
              ) : payments.length > 0 ? (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      #{p.orderNumber || p.id.substring(0, 8)}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{p.user?.name || 'Customer'}</td>
                    <td className="py-3 px-3 text-slate-600">{p.vendor?.name || 'Vendor'}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">AED {p.totalAmount}</td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      AED {(Number(p.totalAmount) * 0.1).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        SUCCESSFUL
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No payment records in database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
