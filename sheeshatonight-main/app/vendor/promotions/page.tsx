'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Sparkles, Tag, Gift } from 'lucide-react';

const promotions = [
  { id: 'PROMO-01', title: 'Weeknight Bundle', discount: '15%', active: true, expires: 'Jun 5' },
  { id: 'PROMO-02', title: 'VIP Loyalty Offer', discount: '20%', active: true, expires: 'Jun 14' },
  { id: 'PROMO-03', title: 'Late Night Drop', discount: '10%', active: false, expires: 'May 28' },
];

export default function VendorPromotions() {
  const [activePromotions, setActivePromotions] = useState(promotions);

  const toggleActive = (id: string) => {
    setActivePromotions(activePromotions.map((promo) => (promo.id === id ? { ...promo, active: !promo.active } : promo)));
  };

  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Promotions</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Discount Campaigns</h1>
              <p className="text-slate-600 mt-2">Create seasonal offers, manage coupons and tailor promotional bundles to customers.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold shadow-lg shadow-amber-500/20 transition hover:bg-amber-600">
              <Gift size={18} /> New Promotion
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Featured Campaign</p>
              </div>
              <p className="text-slate-600">Grab attention with time-limited offers that drive repeat bookings.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Tag className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Campaign Performance</p>
              </div>
              <p className="text-slate-600">Track which offers are converting best and optimize promo availability.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={[
                { header: 'Promo ID', accessor: 'id' },
                { header: 'Title', accessor: 'title' },
                { header: 'Discount', accessor: 'discount' },
                { header: 'Expires', accessor: 'expires' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.active ? 'Active' : 'Paused'}</span> },
                { header: 'Action', render: (row) => <button onClick={() => toggleActive(row.id)} className="rounded-2xl bg-amber-500 px-4 py-2 text-white text-sm font-semibold hover:bg-amber-600 transition">{row.active ? 'Pause' : 'Activate'}</button> },
              ]}
              data={activePromotions}
            />
          </div>
        </div>
    </div>
  );
}
