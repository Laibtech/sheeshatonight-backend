'use client';

import React, { useEffect, useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Calendar, Percent, DollarSign, X, Loader2 } from 'lucide-react';
import { DataTable, Column } from '@/components/admin/DataTable';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { useToast } from '@/components/admin/Toast';

interface CouponRecord {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount?: number | null;
  maxDiscount?: number | null;
  usageLimit?: number | null;
  usageCount: number;
  startDate?: string | null;
  expiryDate?: string | null;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { addToast } = useToast();

  const [coupons, setCoupons] = useState<CouponRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponRecord | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    expiryDate: '',
    isActive: true,
  });

  // Delete modal
  const [deleteTarget, setDeleteTarget] = useState<CouponRecord | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('/api/admin/coupons', { headers });
      if (res.ok) {
        const json = await res.json();
        setCoupons(json.data?.coupons || json.coupons || []);
      }
    } catch (err) {
      console.error('Error fetching coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '',
      maxDiscount: '',
      usageLimit: '',
      expiryDate: '',
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (c: CouponRecord) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue.toString(),
      minOrderAmount: c.minOrderAmount?.toString() || '',
      maxDiscount: c.maxDiscount?.toString() || '',
      usageLimit: c.usageLimit?.toString() || '',
      expiryDate: c.expiryDate ? (c.expiryDate.split('T')[0] || '') : '',
      isActive: c.isActive,
    });
    setModalOpen(true);
  };


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.discountValue) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : '/api/admin/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...formData,
          discountValue: parseFloat(formData.discountValue),
          minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : undefined,
          maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
          usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
          expiryDate: formData.expiryDate || undefined,
        }),
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: editingCoupon ? 'Coupon Updated' : 'Coupon Created',
          message: `Coupon code "${formData.code.toUpperCase()}" was saved.`,
        });
        setModalOpen(false);
        fetchCoupons();
      } else {
        const err = await res.json();
        addToast({
          type: 'error',
          title: 'Save Failed',
          message: err.error || 'Failed to save coupon.',
        });
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/coupons/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Coupon Deleted',
          message: `Coupon "${deleteTarget.code}" was deleted.`,
        });
        setDeleteTarget(null);
        fetchCoupons();
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
    } finally {
      setDeleting(false);
    }
  };

  const columns: Column<CouponRecord>[] = [
    {
      header: 'Code',
      cell: (row) => (
        <span className="font-mono font-black text-xs px-2.5 py-1 bg-[#74189B]/10 text-[#74189B] border border-[#74189B]/20 rounded-lg tracking-wider">
          {row.code}
        </span>
      ),
    },
    {
      header: 'Discount',
      cell: (row) => (
        <span className="font-bold text-[#29252B]">
          {row.discountType === 'PERCENTAGE'
            ? `${row.discountValue}% OFF`
            : `AED ${row.discountValue} OFF`}
        </span>
      ),
    },
    {
      header: 'Min Order',
      cell: (row) => (
        <span className="text-[#716975]">
          {row.minOrderAmount ? `AED ${row.minOrderAmount}` : 'None'}
        </span>
      ),
    },
    {
      header: 'Usage',
      cell: (row) => (
        <span className="text-xs font-semibold text-[#29252B]">
          {row.usageCount} / {row.usageLimit ? row.usageLimit : '∞'}
        </span>
      ),
    },
    {
      header: 'Expiry Date',
      cell: (row) => (
        <span className="text-[#716975]">
          {row.expiryDate
            ? new Date(row.expiryDate).toLocaleDateString('en-AE')
            : 'No expiration'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <StatusBadge status={row.isActive ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#74189B] hover:bg-[#FAF8FB] transition"
            title="Edit Coupon"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Delete Coupon"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
              Promotional Coupons
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#74189B]/10 text-[#74189B] text-xs font-bold border border-[#74189B]/20">
              {coupons.length} Active Coupons
            </span>
          </div>
          <p className="text-xs text-[#716975] mt-1">
            Manage percentage and fixed discounts, order thresholds, and coupon expiration dates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#74189B] hover:bg-[#571275] text-white text-xs font-bold transition shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={coupons}
        loading={loading}
        emptyTitle="No coupons found"
        emptyDescription="Create discount coupons to boost promotions across the platform."
      />

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E9E3EB] shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9E3EB]">
              <h3 className="text-base font-bold text-[#29252B]">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-bold text-[#29252B] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP20"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl font-mono uppercase focus:outline-none focus:border-[#74189B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#29252B] mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl focus:outline-none focus:border-[#74189B]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (AED)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#29252B] mb-1">Discount Value *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="20"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl focus:outline-none focus:border-[#74189B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#29252B] mb-1">Min Order Amount (AED)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Optional"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl focus:outline-none focus:border-[#74189B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#29252B] mb-1">Max Usage Limit</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3.5 py-2 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl focus:outline-none focus:border-[#74189B]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#29252B] mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3.5 py-2 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl focus:outline-none focus:border-[#74189B]"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 font-bold text-[#29252B] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-[#74189B] focus:ring-[#74189B] w-4 h-4"
                  />
                  <span>Enable Coupon</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E9E3EB]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-[#74189B] hover:bg-[#571275] text-white font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Coupon</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${deleteTarget?.code}"?`}
        confirmText="Delete Coupon"
        isDangerous={true}
        loading={deleting}
      />
    </div>
  );
}
