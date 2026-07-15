'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { LayoutDashboard, Image, BookOpen, Layers } from 'lucide-react';

const pages = [
  { id: 'CMS-01', page: 'Homepage hero', type: 'Banner', author: 'Marketing', status: 'Published' },
  { id: 'CMS-02', page: 'Vendor landing', type: 'Copy', author: 'Operations', status: 'Draft' },
  { id: 'CMS-03', page: 'Support FAQ', type: 'Content', author: 'Support', status: 'Published' },
];

export default function AdminCMS() {
  const [contentList] = useState(pages);

  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">CMS</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Content Management</h1>
            <p className="text-slate-600 mt-2">Operate marketing pages, change hero content, and publish promotional campaigns.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Image className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Featured Assets</p>
              </div>
              <p className="text-slate-600">Manage hero graphics, banners, and dynamic campaign blocks.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Content Edits</p>
              </div>
              <p className="text-slate-600">Review draft pages and publish new messaging with one click.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Layers className="text-amber-500" size={20} />
                <p className="text-sm font-semibold text-slate-900">Version Control</p>
              </div>
              <p className="text-slate-600">Track changes across content workflows and rollback updates when needed.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={[
                { header: 'Entry ID', accessor: 'id' },
                { header: 'Page Section', accessor: 'page' },
                { header: 'Type', accessor: 'type' },
                { header: 'Author', accessor: 'author' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span> },
                { header: 'Action', render: () => <button className="rounded-2xl bg-amber-500 px-4 py-2 text-white text-sm font-semibold hover:bg-amber-600 transition">Edit</button> },
              ]}
              data={contentList}
            />
          </div>
        </div>
    </div>
  );
}
