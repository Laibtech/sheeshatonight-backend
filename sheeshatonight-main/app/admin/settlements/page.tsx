'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { DollarSign, Plus, CheckCircle2, AlertCircle, XCircle, Clock } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { useToast } from '@/components/admin/Toast';

interface SettlementRecord {
  id: string;
  vendorId: string;
  period: string;
  amount: number;
  commission: number;
  netAmount: number;
  status: string;
  paidAt?: string;
  createdAt: string;
  vendor: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminSettlementsPage() {
  const { addToast } = useToast();

  const [settlements, setSettlements] = useState<SettlementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSettlements, setTotalSettlements] = useState(0);

  const fetchSettlements = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};


      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', '10');
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/settlements?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setSettlements(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalSettlements(data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching settlements:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/settlements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Settlement Updated',
          message: `Settlement marked as ${newStatus}.`,
        });
        fetchSettlements();
      }
    } catch (err) {
      console.error('Failed to update settlement:', err);
    }
  };

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns: Column<SettlementRecord>[] = [
    {
      header: 'Vendor',
      cell: (row) => (
        <Link
          href={`/admin/vendors/${row.vendor?.id}`}
          className="font-bold text-[#74189B] hover:underline"
        >
          {row.vendor?.name || 'Unknown Vendor'}
        </Link>
      ),
    },
    {
      header: 'Billing Period',
      cell: (row) => <span className="font-mono font-bold text-xs">{row.period}</span>,
    },
    {
      header: 'Gross Amount',
      cell: (row) => <span className="font-bold">{formatAED(row.amount)}</span>,
    },
    {
      header: 'Commission',
      cell: (row) => <span className="text-[#716975]">{formatAED(row.commission)}</span>,
    },
    {
      header: 'Vendor Payout (Net)',
      cell: (row) => (
        <span className="font-black text-emerald-600">
          {formatAED(row.netAmount)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Created Date',
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
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status !== 'PAID' && (
            <button
              onClick={() => handleUpdateStatus(row.id, 'PAID')}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition"
            >
              Mark Paid
            </button>
          )}
          {row.status === 'PENDING' && (
            <button
              onClick={() => handleUpdateStatus(row.id, 'PROCESSED')}
              className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
            >
              Process
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#29252B] tracking-tight">
              Vendor Settlements
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#74189B]/10 text-[#74189B] text-xs font-bold border border-[#74189B]/20">
              {totalSettlements} Records
            </span>
          </div>
          <p className="text-xs text-[#716975] mt-1">
            Vendor commission settlements, payouts, and marketplace financial reconciliations.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {['ALL', 'PENDING', 'PROCESSED', 'PAID', 'FAILED'].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
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
        data={settlements}
        loading={loading}
        emptyTitle="No settlements recorded"
        emptyDescription="Vendor commission settlements generated for billing periods will be listed here."
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalSettlements}
        onPageChange={setPage}
      />
    </div>
  );
}
