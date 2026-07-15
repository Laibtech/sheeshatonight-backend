'use client';

import React from 'react';
import { DataTable } from '@/components/DataTable';
import { Shield, Archive, Package } from 'lucide-react';

const inventoryItems = [
  { id: 'I-001', item: 'Premium Coals', category: 'Accessories', stock: 76, reorder: 'Low' },
  { id: 'I-002', item: 'Spare Hoses', category: 'Equipment', stock: 42, reorder: 'Medium' },
  { id: 'I-003', item: 'Flavor Bottles', category: 'Consumables', stock: 168, reorder: 'Normal' },
];

export default function VendorInventory() {
  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Inventory</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Stock & Supply</h1>
              <p className="text-slate-600 mt-2">Monitor stock levels, categorize goods, and plan reorders for your vendor inventory.</p>
            </div>
            <button className="rounded-3xl bg-slate-900 px-5 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition">Update Stock</button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={[
                { header: 'SKU', accessor: 'id' },
                { header: 'Item', accessor: 'item' },
                { header: 'Category', accessor: 'category' },
                { header: 'Stock', accessor: 'stock' },
                { header: 'Reorder Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.reorder === 'Low' ? 'bg-rose-100 text-rose-700' : row.reorder === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.reorder}</span> },
              ]}
              data={inventoryItems}
            />
          </div>
        </div>
    </div>
  );
}
