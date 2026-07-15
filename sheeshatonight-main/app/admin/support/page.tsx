'use client';

import React, { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { ShieldCheck, MessageCircle } from 'lucide-react';

const initialTickets = [
  { id: 'TCK-101', customer: 'Amina Khalid', subject: 'Order delay', priority: 'High', status: 'Open' },
  { id: 'TCK-102', customer: 'Faris Al-Harbi', subject: 'Invoice issue', priority: 'Medium', status: 'In Progress' },
  { id: 'TCK-103', customer: 'Sara Al-Mansoori', subject: 'Vendor request', priority: 'Low', status: 'Resolved' },
];

export default function AdminSupport() {
  const [tickets, setTickets] = useState(initialTickets);

  const updateStatus = (id: string, status: string) => {
    setTickets(tickets.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket)));
  };

  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Support Tickets</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Customer Support Desk</h1>
            <p className="text-slate-600 mt-2">Manage support requests, escalate high-priority issues, and resolve tickets quickly.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Priority volume</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-3">High priority tickets</h2>
                </div>
                <ShieldCheck className="text-amber-500" size={24} />
              </div>
              <p className="text-slate-600">Resolve critical customer incidents before they impact marketplace performance.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Response time</p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-3">28 min average</h2>
                </div>
                <MessageCircle className="text-amber-500" size={24} />
              </div>
              <p className="text-slate-600">Keep the team responsive while reducing ticket backlog.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              columns={[
                { header: 'Ticket ID', accessor: 'id' },
                { header: 'Customer', accessor: 'customer' },
                { header: 'Subject', accessor: 'subject' },
                { header: 'Priority', accessor: 'priority' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold ${row.status === 'Open' ? 'bg-rose-100 text-rose-700' : row.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.status}</span> },
                {
                  header: 'Action',
                  render: (row) => (
                    <div className="flex flex-wrap gap-2">
                      {row.status !== 'Resolved' && (
                        <button
                          onClick={() => updateStatus(row.id, 'Resolved')}
                          className="rounded-2xl bg-emerald-500 px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-600 transition"
                        >
                          Resolve
                        </button>
                      )}
                      {row.status !== 'In Progress' && (
                        <button
                          onClick={() => updateStatus(row.id, 'In Progress')}
                          className="rounded-2xl bg-amber-500 px-4 py-2 text-white text-sm font-semibold hover:bg-amber-600 transition"
                        >
                          Escalate
                        </button>
                      )}
                    </div>
                  ),
                },
              ]}
              data={tickets}
            />
          </div>
        </div>
    </div>
  );
}
