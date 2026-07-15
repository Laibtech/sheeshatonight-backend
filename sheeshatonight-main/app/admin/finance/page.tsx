'use client';

import React from 'react';
import { StatCard } from '@/components/StatCard';
import { Wallet, PieChart, Receipt, CreditCard } from 'lucide-react';

export default function AdminFinance() {
  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Finance</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Payments & Settlements</h1>
            <p className="text-slate-600 mt-2">Review marketplace payout cycles, transaction fees, and reconciliation details.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <StatCard title="Total Payouts" value="AED 4.8M" trend="+16.2%" icon={<Wallet />} />
            <StatCard title="Pending Settlements" value="AED 312K" trend="-4.1%" icon={<CreditCard />} />
            <StatCard title="Transaction Fees" value="AED 312K" trend="+3.2%" icon={<Receipt />} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Merchant revenue</p>
                  <h2 className="text-xl font-bold text-slate-900 mt-3">Vendor Commission Share</h2>
                </div>
                <PieChart className="text-amber-500" size={24} />
              </div>
              <div className="h-72 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200" />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Recent Transactions</p>
                  <h2 className="text-xl font-bold text-slate-900 mt-3">Reconciliation Feed</h2>
                </div>
                <Receipt className="text-amber-500" size={24} />
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Vendor payout processed', amount: 'AED 184,500', time: '2 hours ago' },
                  { label: 'Commission remitted', amount: 'AED 45,000', time: 'Yesterday' },
                  { label: 'Refund settled', amount: 'AED 2,730', time: '3 days ago' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between gap-4 text-slate-900">
                      <p className="font-semibold">{item.label}</p>
                      <p className="font-bold">{item.amount}</p>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
