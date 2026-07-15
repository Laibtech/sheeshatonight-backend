'use client';

import React from 'react';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { FileText, BarChart3, Globe } from 'lucide-react';

const reportEntries = [
  { id: 'R-101', title: 'Weekly Sales Overview', audience: 'Finance', status: 'Published' },
  { id: 'R-102', title: 'Vendor Growth Report', audience: 'Executive', status: 'Draft' },
  { id: 'R-103', title: 'Customer Behavior Study', audience: 'Product', status: 'Published' },
];

export default function AdminReports() {
  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Reports</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Performance Reports</h1>
            <p className="text-slate-600 mt-2">Generate, review, and publish executive reports for the marketplace.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <StatCard title="Monthly Reports" value="18" trend="+20%" icon={<FileText />} />
            <StatCard title="Active Subscribers" value="862" trend="+7%" icon={<Globe />} />
            <StatCard title="Report Views" value="14.2K" trend="+13%" icon={<BarChart3 />} />
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Published Reports</h2>
                <p className="text-slate-500 mt-1">Select a insights package for stakeholders.</p>
              </div>
              <button className="rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold shadow-lg shadow-amber-500/20 hover:bg-amber-600 transition">
                New Report
              </button>
            </div>

            <DataTable
              columns={[
                { header: 'Report ID', accessor: 'id' },
                { header: 'Title', accessor: 'title' },
                { header: 'Audience', accessor: 'audience' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span> },
                { header: 'Action', render: () => <button className="rounded-2xl bg-slate-900 px-4 py-2 text-white text-sm font-semibold hover:bg-slate-800 transition">View</button> },
              ]}
              data={reportEntries}
            />
          </div>
        </div>
    </div>
  );
}
