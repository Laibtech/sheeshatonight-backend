'use client';

import React from 'react';
import { StatCard } from '@/components/StatCard';
import { TrendingUp, BarChart3, DollarSign } from 'lucide-react';

export default function VendorAnalytics() {
  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Vendor Analytics</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Sales & Performance</h1>
            <p className="text-slate-600 mt-2">Deep dive into product performance, conversion rates, and earnings patterns.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <StatCard title="Weekly Revenue" value="AED 36,800" trend="+18%" icon={<DollarSign />} />
            <StatCard title="Conversion Rate" value="12.4%" trend="+2.1%" icon={<TrendingUp />} />
            <StatCard title="Orders Fulfilled" value="124" trend="+10%" icon={<BarChart3 />} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Revenue Distribution</h2>
              <div className="h-72 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200" />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Top Selling Products</h2>
              <div className="space-y-4">
                {[
                  { name: 'Premium Sheesha Setup', sales: '42 orders' },
                  { name: 'Luxury Hookah Kit', sales: '28 orders' },
                  { name: 'Signature Tobacco Pack', sales: '21 orders' },
                ].map((item, idx) => (
                  <div key={idx} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.sales}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
