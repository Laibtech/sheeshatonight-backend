'use client';

import React, { useState } from 'react';

const notifications = [
  { id: 'VN-01', title: 'Order received from Noor Cloud', status: 'New', time: '5m ago' },
  { id: 'VN-02', title: 'Inventory low on Gold Hookah Set', status: 'Alert', time: '45m ago' },
  { id: 'VN-03', title: 'Promotion performance report ready', status: 'Info', time: '2h ago' },
];

export default function VendorNotifications() {
  const [items, setItems] = useState(notifications);

  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Notifications</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Vendor Alerts</h1>
              <p className="text-slate-600 mt-2">Keep track of order milestones and inventory warnings instantly.</p>
            </div>
            <button className="rounded-3xl bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-slate-800 transition">Clear All</button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.title}</p>
                    <p className="text-sm text-slate-500 mt-2">{item.time}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'New' ? 'bg-amber-100 text-amber-700' : item.status === 'Alert' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
