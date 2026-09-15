'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users, Eye, ShoppingBag, Heart } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';

interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  verified: boolean;
  kycStatus: string;
  createdAt: string;
  ordersCount: number;
  wishlistCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};


      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', '10');
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/customers?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalCustomers(data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns: Column<CustomerRecord>[] = [
    {
      header: 'Customer',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#74189B] to-[#571275] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-xs">
            {row.name ? row.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <Link
              href={`/admin/customers/${row.id}`}
              className="font-bold text-[#29252B] hover:text-[#74189B] transition block"
            >
              {row.name}
            </Link>
            <p className="text-[11px] text-[#716975]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Phone',
      cell: (row) => (
        <span className="text-[#716975] font-mono">{row.phone || '—'}</span>
      ),
    },
    {
      header: 'Orders',
      cell: (row) => (
        <span className="font-bold text-[#29252B] inline-flex items-center gap-1">
          <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
          {row.ordersCount}
        </span>
      ),
    },
    {
      header: 'Total Spent',
      cell: (row) => (
        <span className="font-black text-[#29252B]">
          {formatAED(row.totalSpent)}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Joined Date',
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
        <div className="flex items-center justify-end">
          <Link
            href={`/admin/customers/${row.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8FB] hover:bg-[#74189B] text-[#74189B] hover:text-white border border-[#E9E3EB] text-xs font-bold transition shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Profile</span>
          </Link>
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
              Customer Accounts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#74189B]/10 text-[#74189B] text-xs font-bold border border-[#74189B]/20">
              {totalCustomers} Customers
            </span>
          </div>
          <p className="text-xs text-[#716975] mt-1">
            Registered customer database with order histories and total spending.
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        emptyTitle="No customers found"
        emptyDescription="Customer accounts will appear as users register on the marketplace."
        searchPlaceholder="Search customer name, email, phone..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalCustomers}
        onPageChange={setPage}
      />
    </div>
  );
}
