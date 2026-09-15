'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Package, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

export default function AdminNewProductPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(false);
  const [vendors, setVendors] = useState<Array<{ id: string; name: string }>>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'SHEESHA_PIPE',
    price: '',
    currency: 'AED',
    stock: '10',
    sku: '',
    vendorId: '',
    imageUrl: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    // Fetch vendors for dropdown
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const res = await fetch('/api/admin/vendors?pageSize=50', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const json = await res.json();
          const list = json.data || [];
          setVendors(list);
          if (list.length > 0) {
            setFormData((prev) => ({ ...prev, vendorId: list[0].id }));
          }
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
      }
    };
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Product title and price are required.',
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const payload = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        price: parseFloat(formData.price),
        currency: formData.currency,
        stock: parseInt(formData.stock) || 0,
        sku: formData.sku?.trim() || undefined,
        vendorId: formData.vendorId || undefined,
        images: formData.imageUrl?.trim() ? [formData.imageUrl.trim()] : ['https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600'],
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        addToast({
          type: 'success',
          title: 'Product Created',
          message: `Product "${formData.title}" added to the database.`,
        });
        router.push('/admin/products');
      } else {
        const errJson = await res.json();
        addToast({
          type: 'error',
          title: 'Error Creating Product',
          message: errJson.error || 'Failed to save product.',
        });
      }
    } catch (err) {
      console.error('Error submitting product:', err);
      addToast({
        type: 'error',
        title: 'Network Error',
        message: 'Unable to connect to server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 rounded-xl bg-white border border-[#E9E3EB] hover:bg-slate-50 text-slate-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-[#29252B] tracking-tight">
            Add New Product
          </h1>
          <p className="text-xs text-[#716975] mt-0.5">
            Create a new sheesha item or rental package in the real catalogue.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl border border-[#E9E3EB] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#29252B] border-b border-[#E9E3EB] pb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#74189B]" />
            <span>Product Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Khalil Mamoon Gold Edition"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs text-[#29252B] focus:outline-none focus:border-[#74189B] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                Product Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs font-semibold text-[#29252B] focus:outline-none focus:border-[#74189B]"
              >
                <option value="SHEESHA_PIPE">Sheesha Pipe</option>
                <option value="TOBACCO_BLEND">Tobacco Blend</option>
                <option value="ACCESSORY">Accessory</option>
                <option value="RENTAL_PACKAGE">Rental Package</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                Vendor
              </label>
              <select
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs font-semibold text-[#29252B] focus:outline-none focus:border-[#74189B]"
              >
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                Price (AED) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="250.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs text-[#29252B] focus:outline-none focus:border-[#74189B] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs text-[#29252B] focus:outline-none focus:border-[#74189B] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                SKU (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. SH-KM-001"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs text-[#29252B] focus:outline-none focus:border-[#74189B] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                Image URL
              </label>
              <input
                type="text"
                placeholder="https://... or /SHEESHA-SET.webp"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs text-[#29252B] focus:outline-none focus:border-[#74189B] focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#29252B] mb-1">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Detailed description of the product or rental package..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#FAF8FB] border border-[#E9E3EB] rounded-xl text-xs text-[#29252B] focus:outline-none focus:border-[#74189B] focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-6 sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[#29252B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded text-[#74189B] focus:ring-[#74189B] w-4 h-4"
                />
                <span>Active in Marketplace</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-[#29252B] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-[#74189B] focus:ring-[#74189B] w-4 h-4"
                />
                <span>Featured on Homepage</span>
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 text-xs font-bold text-[#716975] hover:bg-slate-100 rounded-xl transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#74189B] hover:bg-[#571275] text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Product</span>
          </button>
        </div>
      </form>
    </div>
  );
}
