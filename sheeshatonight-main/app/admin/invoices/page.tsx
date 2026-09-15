'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Eye, Printer, Download, X } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { TaxInvoiceModal, TaxInvoiceData } from '@/components/TaxInvoiceModal';

interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  customerName: string;
  customerEmail: string;
  subtotal: number;
  tax: number;
  total: number;
  issuedAt: string;
  pdfUrl?: string | null;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);

  // Invoice preview modal
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};


      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', '10');
      if (search) params.set('search', search);

      const res = await fetch(`/api/admin/invoices?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setInvoices(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalInvoices(data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const columns: Column<InvoiceRecord>[] = [
    {
      header: 'Invoice Number',
      cell: (row) => (
        <Link
          href={`/admin/invoices/${row.id}`}
          className="font-mono font-bold text-xs text-[#74189B] hover:underline"
        >
          #{row.invoiceNumber}
        </Link>
      ),
    },
    {
      header: 'Order Reference',
      cell: (row) => (
        <Link
          href={`/admin/orders/${row.orderId}`}
          className="font-bold text-[#29252B] hover:text-[#74189B] hover:underline"
        >
          #{row.orderNumber}
        </Link>
      ),
    },
    {
      header: 'Customer',
      cell: (row) => (
        <div>
          <p className="font-bold text-[#29252B]">{row.customerName}</p>
          <p className="text-[11px] text-[#716975]">{row.customerEmail}</p>
        </div>
      ),
    },
    {
      header: 'Total Amount',
      cell: (row) => (
        <div>
          <p className="font-black text-[#29252B]">{formatAED(row.total)}</p>
          <p className="text-[10px] text-[#716975]">Includes 5% UAE VAT</p>
        </div>
      ),
    },
    {
      header: 'Issued Date',
      cell: (row) => (
        <span className="text-[#716975]">
          {new Date(row.issuedAt).toLocaleDateString('en-AE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setSelectedInvoice(row)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8FB] hover:bg-[#74189B] text-[#74189B] hover:text-white border border-[#E9E3EB] text-xs font-bold transition shadow-xs"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <Link
            href={`/admin/invoices/${row.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#74189B] hover:bg-[#571275] text-white text-xs font-bold transition shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Invoice Page</span>
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
              Invoices & VAT Receipts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#74189B]/10 text-[#74189B] text-xs font-bold border border-[#74189B]/20">
              {totalInvoices} Invoices
            </span>
          </div>
          <p className="text-xs text-[#716975] mt-1">
            Official UAE tax invoices, order receipts, and payment reconciliations.
          </p>
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={invoices}
        loading={loading}
        emptyTitle="No invoices generated yet"
        emptyDescription="Invoices will automatically generate when customer orders are placed."
        searchPlaceholder="Search invoice #, order #, customer..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalInvoices}
        onPageChange={setPage}
      />

      {/* Professional Tax Invoice Modal */}
      <TaxInvoiceModal
        isOpen={Boolean(selectedInvoice)}
        onClose={() => setSelectedInvoice(null)}
        data={
          selectedInvoice
            ? {
                id: selectedInvoice.id,
                invoiceNumber: selectedInvoice.invoiceNumber,
                orderNumber: selectedInvoice.orderNumber,
                orderId: selectedInvoice.orderId,
                issuedAt: selectedInvoice.issuedAt,
                status: selectedInvoice.orderStatus,
                customer: {
                  name: selectedInvoice.customerName,
                  email: selectedInvoice.customerEmail,
                },
                subtotal: selectedInvoice.subtotal,
                tax: selectedInvoice.tax,
                total: selectedInvoice.total,
              }
            : null
        }
      />
    </div>
  );
}
