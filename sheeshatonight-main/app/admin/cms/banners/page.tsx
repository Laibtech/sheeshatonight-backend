'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Loader2, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { EmptyState } from '@/components/admin/EmptyState';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import { useToast } from '@/components/admin/Toast';

interface BannerItem {
  id: string;
  heading: string;
  subtitle?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  desktopImg?: string | null;
  mobileImg?: string | null;
  position: string;
  sortOrder: number;
  isActive: boolean;
  startDate?: string | null;
  endDate?: string | null;
}

export default function AdminBannersCmsPage() {
  const { showToast } = useToast();
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [heading, setHeading] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [desktopImg, setDesktopImg] = useState('');
  const [mobileImg, setMobileImg] = useState('');
  const [position, setPosition] = useState('HOMEPAGE_HERO');
  const [sortOrder, setSortOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/cms/banners', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setBanners(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch banners:', err);
      showToast('Failed to load banners', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setHeading('');
    setSubtitle('');
    setCtaText('');
    setCtaUrl('');
    setDesktopImg('');
    setMobileImg('');
    setPosition('HOMEPAGE_HERO');
    setSortOrder('0');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BannerItem) => {
    setEditingBanner(b);
    setHeading(b.heading);
    setSubtitle(b.subtitle || '');
    setCtaText(b.ctaText || '');
    setCtaUrl(b.ctaUrl || '');
    setDesktopImg(b.desktopImg || '');
    setMobileImg(b.mobileImg || '');
    setPosition(b.position || 'HOMEPAGE_HERO');
    setSortOrder(b.sortOrder?.toString() || '0');
    setIsActive(b.isActive);
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading.trim()) {
      showToast('Heading is required', 'error');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const payload = {
        heading,
        subtitle: subtitle || null,
        ctaText: ctaText || null,
        ctaUrl: ctaUrl || null,
        desktopImg: desktopImg || null,
        mobileImg: mobileImg || null,
        position,
        sortOrder: parseInt(sortOrder, 10) || 0,
        isActive,
      };

      if (editingBanner) {
        const res = await fetch(`/api/admin/cms/banners/${editingBanner.id}`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Banner updated successfully', 'success');
          setIsModalOpen(false);
          fetchBanners();
        } else {
          showToast(data.message || 'Failed to update banner', 'error');
        }
      } else {
        const res = await fetch('/api/admin/cms/banners', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          showToast('Banner created successfully in MySQL', 'success');
          setIsModalOpen(false);
          fetchBanners();
        } else {
          showToast(data.message || 'Failed to create banner', 'error');
        }
      }
    } catch (err) {
      showToast('Failed to save banner', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/cms/banners/${deletingId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        showToast('Banner deleted successfully', 'success');
        setDeleteConfirmOpen(false);
        setDeletingId(null);
        fetchBanners();
      } else {
        showToast(data.message || 'Failed to delete banner', 'error');
      }
    } catch (err) {
      showToast('Failed to delete banner', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/cms"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#74189B] hover:text-[#571275] mb-1.5 transition"
          >
            <ArrowLeft size={14} /> Back to CMS Overview
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Promotional Banners</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#74189B]/10 text-[#74189B]">
              {banners.length} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage carousel slides, hero background visuals, deals ribbons, and sidebar banners.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBanners}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
            title="Refresh list"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10"
          >
            <Plus size={16} />
            Create Banner
          </button>
        </div>
      </div>

      {/* Banners List / Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <TableSkeleton rows={4} cols={5} />
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
          <EmptyState
            title="No promotional banners found"
            description="You haven't configured any promotional banners yet. Create your first banner for the homepage carousel."
            actionLabel="Create First Banner"
            onAction={handleOpenCreate}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden flex flex-col hover:shadow-md transition-all group"
            >
              {/* Banner Visual Preview */}
              <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {banner.desktopImg ? (
                  <img
                    src={banner.desktopImg}
                    alt={banner.heading}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <ImageIcon size={36} className="mx-auto mb-1 text-slate-300" />
                    <span className="text-[11px] font-bold">No Image Specified</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs font-mono">
                    {banner.position}
                  </span>
                  {banner.isActive ? (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white backdrop-blur-xs">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-600 text-white backdrop-blur-xs">
                      Inactive
                    </span>
                  )}
                </div>
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-slate-700 shadow-xs">
                  Order: #{banner.sortOrder}
                </span>
              </div>

              {/* Banner Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{banner.heading}</h3>
                  {banner.subtitle && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{banner.subtitle}</p>
                  )}
                </div>

                {banner.ctaText && (
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between text-slate-700">
                    <span className="font-bold text-[#74189B]">{banner.ctaText}</span>
                    <span className="font-mono text-[11px] text-slate-400 truncate max-w-[150px]">
                      {banner.ctaUrl || '/'}
                    </span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">ID: {banner.id.substring(0, 8)}...</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="p-2 rounded-lg text-slate-500 hover:text-[#74189B] hover:bg-purple-50 transition"
                      title="Edit Banner"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => {
                        setDeletingId(banner.id);
                        setDeleteConfirmOpen(true);
                      }}
                      className="p-2 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                      title="Delete Banner"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <ImageIcon size={18} className="text-[#74189B]" />
                <h3 className="font-bold text-slate-900">
                  {editingBanner ? 'Edit Banner' : 'Create Promotional Banner'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Banner Heading</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Yacht Packages 20% Off This Weekend"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Subtitle / Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Includes premium double apple heads, coal service, and delivery."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">CTA Button Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Claim Offer"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">CTA Target Link</label>
                  <input
                    type="text"
                    placeholder="e.g. /rentals?promo=yacht"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Desktop Image URL</label>
                <input
                  type="text"
                  placeholder="e.g. /images/hero-banner.jpg or https://images.unsplash.com/..."
                  value={desktopImg}
                  onChange={(e) => setDesktopImg(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  >
                    <option value="HOMEPAGE_HERO">Homepage Hero Carousel</option>
                    <option value="PROMO_BANNER">Promotional Banner</option>
                    <option value="SIDEBAR">Sidebar Deal</option>
                    <option value="POPUP">Site Modal Popup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Display Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#74189B] focus:ring-[#74189B] border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">Set as Active (Visible immediately on frontend)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10 disabled:opacity-50"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  {editingBanner ? 'Save Banner Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Promotional Banner"
        message="Are you sure you want to remove this banner from the database? This action cannot be undone."
        confirmLabel="Yes, Delete Banner"
        isDanger={true}
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setDeletingId(null);
        }}
      />
    </div>
  );
}
