'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useToast } from '@/components/admin/Toast';

interface ProductRecord {
  id: string;
  title: string;
  type: string;
  price: number;
  currency: string;
  stock: number;
  sku?: string;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  images?: any;
  vendor?: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminProductsPage() {
  const searchParams = useSearchParams();
  const stockParam = searchParams.get('stock') || 'ALL';
  const { addToast } = useToast();

  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState(stockParam);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Deletion modal
  const [deleteTarget, setDeleteTarget] = useState<ProductRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};


      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', '10');
      if (search) params.set('search', search);
      if (typeFilter !== 'ALL') params.set('type', typeFilter);
      if (stockFilter !== 'ALL') params.set('stock', stockFilter);
      if (activeFilter !== 'ALL') params.set('isActive', activeFilter);

      const res = await fetch(`/api/admin/products?${params.toString()}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
          setTotalProducts(data.pagination.total || 0);
        }
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter, stockFilter, activeFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Product Deleted',
          message: `Product "${deleteTarget.title}" was removed successfully.`,
        });
        setDeleteTarget(null);
        fetchProducts();
      } else {
        addToast({
          type: 'error',
          title: 'Delete Failed',
          message: 'Failed to delete product.',
        });
      }
    } catch (err) {
      console.error('Failed to delete product:', err);
    } finally {
      setDeleting(false);
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

  const columns: Column<ProductRecord>[] = [
    {
      header: 'Product',
      cell: (row) => {
        let firstImg = '';
        if (Array.isArray(row.images) && row.images.length > 0) {
          firstImg = row.images[0];
        }

        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8FB] border border-[#E9E3EB] flex items-center justify-center flex-shrink-0 overflow-hidden text-[#74189B]">
              {firstImg ? (
                <img
                  src={firstImg}
                  alt={row.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Package className="w-5 h-5 opacity-70" />
              )}
            </div>
            <div>
              <Link
                href={`/admin/products/${row.id}`}
                className="font-bold text-[#29252B] hover:text-[#74189B] transition block"
              >
                {row.title}
              </Link>
              <p className="text-[11px] text-[#716975]">
                SKU: {row.sku || 'N/A'} • {row.vendor?.name || 'In-House'}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      header: 'Category / Type',
      cell: (row) => (
        <span className="text-xs font-semibold text-[#716975]">
          {row.type.replace(/_/g, ' ')}
        </span>
      ),
    },
    {
      header: 'Price',
      cell: (row) => (
        <span className="font-black text-[#29252B]">
          {formatAED(row.price)}
        </span>
      ),
    },
    {
      header: 'Stock',
      cell: (row) => {
        if (row.stock <= 0) {
          return (
            <span className="inline-flex items-center gap-1 text-rose-600 font-bold text-xs">
              <XCircle className="w-3.5 h-3.5" /> Out of stock
            </span>
          );
        }
        if (row.stock <= 5) {
          return (
            <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
              <AlertCircle className="w-3.5 h-3.5" /> Low ({row.stock})
            </span>
          );
        }
        return <span className="font-bold text-[#29252B]">{row.stock} in stock</span>;
      },
    },
    {
      header: 'Status',
      cell: (row) => (
        <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />
      ),
    },
    {
      header: 'Created',
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
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin/products/${row.id}`}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#74189B] hover:bg-[#FAF8FB] transition"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" />
          </Link>

          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#29252B] tracking-tight">
              Products Catalogue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#74189B]/10 text-[#74189B] text-xs font-bold border border-[#74189B]/20">
              {totalProducts} Products
            </span>
          </div>
          <p className="text-xs text-[#716975] mt-1">
            Manage your sheesha setups, tobacco blends, accessories, and rental packages.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#74189B] hover:bg-[#571275] text-white text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 bg-white border border-[#E9E3EB] rounded-xl text-xs font-semibold text-[#29252B] focus:outline-none focus:border-[#74189B]"
        >
          <option value="ALL">All Product Types</option>
          <option value="SHEESHA_PIPE">Sheesha Pipe</option>
          <option value="TOBACCO_BLEND">Tobacco Blend</option>
          <option value="ACCESSORY">Accessory</option>
          <option value="RENTAL_PACKAGE">Rental Package</option>
          <option value="EQUIPMENT">Equipment</option>
        </select>

        <select
          value={stockFilter}
          onChange={(e) => {
            setStockFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 bg-white border border-[#E9E3EB] rounded-xl text-xs font-semibold text-[#29252B] focus:outline-none focus:border-[#74189B]"
        >
          <option value="ALL">All Stock Levels</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock (&le; 5)</option>
          <option value="out">Out of Stock</option>
        </select>

        <select
          value={activeFilter}
          onChange={(e) => {
            setActiveFilter(e.target.value);
            setPage(1);
          }}
          className="px-3 py-1.5 bg-white border border-[#E9E3EB] rounded-xl text-xs font-semibold text-[#29252B] focus:outline-none focus:border-[#74189B]"
        >
          <option value="ALL">All Statuses</option>
          <option value="true">Active Only</option>
          <option value="false">Inactive Only</option>
        </select>
      </div>

      {/* Products Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        emptyTitle="No products found"
        emptyDescription="Create your first product to display items in the marketplace."
        searchPlaceholder="Search product name, SKU, vendor..."
        searchValue={search}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        currentPage={page}
        totalPages={totalPages}
        totalItems={totalProducts}
        onPageChange={setPage}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete Product"
        isDangerous={true}
        loading={deleting}
      />
    </div>
  );
}
