'use client';

import React from 'react';
import { DataTable } from '@/components/DataTable';

const clients = [
  { id: 'C-101', name: 'Leila Hassan', purchases: 14, lifetime: 'AED 9,400', favorite: 'Premium Setup' },
  { id: 'C-102', name: 'Sami Al-Khalili', purchases: 8, lifetime: 'AED 5,120', favorite: 'Gold Hookah Kit' },
  { id: 'C-103', name: 'Najla Al-Amiri', purchases: 21, lifetime: 'AED 13,760', favorite: 'Signature Tobacco Blend' },
];

export default function VendorCustomers() {
  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Customer List</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Your Top Customers</h1>
            <p className="text-slate-600 mt-2">Review purchase history and loyalty behavior for your store customers.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={[
                { header: 'Customer ID', accessor: 'id' },
                { header: 'Name', accessor: 'name' },
                { header: 'Purchases', accessor: 'purchases' },
                { header: 'Lifetime Value', accessor: 'lifetime' },
                { header: 'Favorite Item', accessor: 'favorite' },
                { header: 'Action', render: () => <button className="rounded-2xl bg-amber-500 px-4 py-2 text-white text-sm font-semibold hover:bg-amber-600 transition">View</button> },
              ]}
              data={clients}
            />
          </div>
        </div>
    </div>
  );
}
