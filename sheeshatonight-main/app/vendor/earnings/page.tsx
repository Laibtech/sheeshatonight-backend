'use client';

import React from 'react';
import { TrendingUp, Clock3, ShieldCheck } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

export default function VendorEarnings() {
  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Earnings</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Business Earnings</h1>
            <p className="text-slate-600 mt-2">Track settlements, take-home revenue, and payout cycles for your vendor profile.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <StatCard title="Total Revenue" value="AED 312K" trend="+14%" icon={<TrendingUp />} />
            <StatCard title="Pending Payouts" value="AED 14.8K" trend="-5%" icon={<Clock3 />} />
            <StatCard title="Net Margin" value="27.5%" trend="+2.1%" icon={<ShieldCheck />} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Payout Schedule</h2>
            <div className="space-y-4">
              {[
                { label: 'May 23 • Settled', amount: 'AED 52,900' },
                { label: 'May 16 • Settled', amount: 'AED 48,400' },
                { label: 'May 9 • Pending', amount: 'AED 14,800' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-3xl border border-slate-200 px-4 py-4">
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="font-bold text-amber-600">{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
