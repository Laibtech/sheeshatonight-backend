'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, CheckCircle2, XCircle, ExternalLink, ArrowLeft, Loader2 } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useToast } from '@/components/admin/Toast';

interface VendorDocRecord {
  id: string;
  type: string;
  url: string;
  status: string;
  notes?: string;
  createdAt: string;
  vendor: {
    id: string;
    name: string;
    slug: string;
    user?: { name: string; email: string };
  };
}

export default function AdminVendorDocumentsPage() {
  const { addToast } = useToast();
  const [documents, setDocuments] = useState<VendorDocRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};


      const url = statusFilter !== 'ALL'
        ? `/api/admin/vendors/documents?status=${statusFilter}`
        : '/api/admin/vendors/documents';

      const res = await fetch(url, { headers });
      if (res.ok) {
        const json = await res.json();
        setDocuments(json.data?.documents || json.documents || []);
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter]);

  const handleAction = async (docId: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/vendors/documents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ documentId: docId, status }),
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Document Updated',
          message: `Document status changed to ${status}.`,
        });
        fetchDocuments();
      }
    } catch (err) {
      console.error('Error updating document status:', err);
    }
  };

  const columns: Column<VendorDocRecord>[] = [
    {
      header: 'Vendor',
      cell: (row) => (
        <div>
          <Link
            href={`/admin/vendors/${row.vendor.id}`}
            className="font-bold text-[#29252B] hover:text-[#74189B] transition"
          >
            {row.vendor.name}
          </Link>
          <p className="text-[11px] text-[#716975]">
            {row.vendor.user?.email || 'N/A'}
          </p>
        </div>
      ),
    },
    {
      header: 'Document Type',
      cell: (row) => (
        <span className="font-bold text-xs text-[#29252B]">
          {row.type.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Document URL',
      cell: (row) => (
        <a
          href={row.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs text-[#74189B] hover:underline font-medium"
        >
          <span>Open File</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      ),
    },
    {
      header: 'Submitted Date',
      cell: (row) => (
        <span className="text-[#716975]">
          {new Date(row.createdAt).toLocaleDateString('en-AE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleAction(row.id, 'APPROVED')}
            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition"
          >
            Approve
          </button>
          <button
            onClick={() => handleAction(row.id, 'REJECTED')}
            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition"
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/vendors"
          className="p-2 rounded-xl bg-white border border-[#E9E3EB] hover:bg-slate-50 text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#29252B] tracking-tight">
            Vendor Verification Documents
          </h1>
          <p className="text-xs text-[#716975] mt-0.5">
            Review and approve trade licenses, identity, and business registration certificates.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
              statusFilter === status
                ? 'bg-[#74189B] text-white border-[#74189B] shadow-xs'
                : 'bg-white text-[#716975] border-[#E9E3EB] hover:bg-[#FAF8FB]'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={documents}
        loading={loading}
        emptyTitle="No verification documents"
        emptyDescription="Uploaded trade licenses and business registrations will appear here for compliance review."
      />
    </div>
  );
}
