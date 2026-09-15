'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Image as ImageIcon, 
  Sliders, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  ArrowUpRight, 
  Megaphone,
  Globe,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

export default function AdminCmsPage() {
  const { showToast } = useToast();
  
  // Hero section state
  const [heroHeading, setHeroHeading] = useState('');
  const [heroSubheading, setHeroSubheading] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  
  // Top announcement bar state
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementLink, setAnnouncementLink] = useState('');
  const [announcementEnabled, setAnnouncementEnabled] = useState(true);

  // Statistics
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [bannerCount, setBannerCount] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [savingHero, setSavingHero] = useState(false);
  const [savingAnnouncement, setSavingAnnouncement] = useState(false);

  useEffect(() => {
    fetchCmsOverview();
  }, []);

  const fetchCmsOverview = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      // Fetch Hero Content
      const [heroRes, announceRes, pagesRes, bannersRes] = await Promise.all([
        fetch('/api/admin/cms/content/homepage_hero', { headers }).catch(() => null),
        fetch('/api/admin/cms/content/announcement_bar', { headers }).catch(() => null),
        fetch('/api/admin/cms/pages', { headers }).catch(() => null),
        fetch('/api/admin/cms/banners', { headers }).catch(() => null),
      ]);

      if (heroRes && heroRes.ok) {
        const data = await heroRes.json();
        if (data.success && data.data) {
          setHeroHeading(data.data.heading || '');
          setHeroSubheading(data.data.subheading || '');
          setCtaText(data.data.ctaText || '');
          setCtaUrl(data.data.ctaUrl || '');
        }
      }

      if (announceRes && announceRes.ok) {
        const data = await announceRes.json();
        if (data.success && data.data) {
          setAnnouncementText(data.data.text || '');
          setAnnouncementLink(data.data.link || '');
          setAnnouncementEnabled(data.data.enabled ?? true);
        }
      }

      if (pagesRes && pagesRes.ok) {
        const data = await pagesRes.json();
        if (data.success && Array.isArray(data.data)) {
          setPageCount(data.data.length);
        }
      }

      if (bannersRes && bannersRes.ok) {
        const data = await bannersRes.json();
        if (data.success && Array.isArray(data.data)) {
          setBannerCount(data.data.length);
        }
      }
    } catch (err) {
      console.error('Error fetching CMS overview:', err);
      showToast('Failed to load some CMS resources', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingHero(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/cms/content/homepage_hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          heading: heroHeading,
          subheading: heroSubheading,
          ctaText,
          ctaUrl,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Homepage Hero content saved successfully in MySQL!', 'success');
      } else {
        showToast(data.message || 'Failed to update hero content', 'error');
      }
    } catch (err) {
      showToast('Failed to save hero content', 'error');
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingAnnouncement(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/cms/content/announcement_bar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: announcementText,
          link: announcementLink,
          enabled: announcementEnabled,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Top Announcement bar updated successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to update announcement bar', 'error');
      }
    } catch (err) {
      showToast('Failed to save announcement bar', 'error');
    } finally {
      setSavingAnnouncement(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Content Management (CMS)</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#74189B]/10 text-[#74189B]">
              Real-time MySQL
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage static legal pages, homepage hero text, promotional banners, and announcement bars dynamically.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCmsOverview}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
            title="Refresh CMS data"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            href="/admin/cms/pages"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 transition shadow-xs"
          >
            <FileText size={15} className="text-[#74189B]" />
            Manage Pages
          </Link>
          <Link
            href="/admin/cms/banners"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10"
          >
            <ImageIcon size={15} className="text-[#F1A51D]" />
            Manage Banners
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          href="/admin/cms/pages"
          className="group block p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-[#74189B]/30 transition-all relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-purple-50 text-[#74189B] flex items-center justify-center font-bold">
              <FileText size={22} />
            </div>
            <ArrowUpRight size={18} className="text-slate-400 group-hover:text-[#74189B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Content Pages</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {pageCount !== null ? `${pageCount} Pages` : '...'}
            </p>
            <p className="text-xs text-slate-500 mt-1">About Us, Contact, Privacy Policy, Terms & FAQ</p>
          </div>
        </Link>

        <Link
          href="/admin/cms/banners"
          className="group block p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:shadow-md hover:border-[#74189B]/30 transition-all relative overflow-hidden"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#F1A51D] flex items-center justify-center font-bold">
              <ImageIcon size={22} />
            </div>
            <ArrowUpRight size={18} className="text-slate-400 group-hover:text-[#74189B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Promotional Banners</p>
            <p className="text-2xl font-black text-slate-900 mt-1">
              {bannerCount !== null ? `${bannerCount} Banners` : '...'}
            </p>
            <p className="text-xs text-slate-500 mt-1">Homepage hero carousel, sidebar deals & sale ribbons</p>
          </div>
        </Link>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#74189B] to-[#571275] text-white shadow-md relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-white/10 text-[#F1A51D] flex items-center justify-center font-bold">
              <Sparkles size={22} />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white">Live Store</span>
          </div>
          <div className="mt-4">
            <p className="text-xs font-bold uppercase tracking-wider text-purple-200">Customer Frontend</p>
            <p className="text-lg font-black text-white mt-1">Direct MySQL Synchronization</p>
            <p className="text-xs text-purple-200 mt-1">Changes reflect instantly without frontend rebuild</p>
          </div>
        </div>
      </div>

      {/* Content Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Homepage Hero Section Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#74189B] flex items-center justify-center">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Homepage Hero Text & CTA</h2>
              <p className="text-xs text-slate-500">Key: <code className="font-mono text-[#74189B] font-semibold">homepage_hero</code></p>
            </div>
          </div>

          <form onSubmit={handleSaveHero} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Hero Headline / Title</label>
              <input
                type="text"
                placeholder="e.g. Premium Sheesha Delivered to Your Doorstep"
                value={heroHeading}
                onChange={(e) => setHeroHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Hero Subheading / Tagline</label>
              <textarea
                placeholder="e.g. Experience Dubai's finest artisanal sheeshas and rental packages tailored for your private gatherings."
                value={heroSubheading}
                onChange={(e) => setHeroSubheading(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Button Text</label>
                <input
                  type="text"
                  placeholder="e.g. Book Now"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Primary Button URL</label>
                <input
                  type="text"
                  placeholder="e.g. /shop or /rentals"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingHero}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10 disabled:opacity-50"
              >
                {savingHero ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save Hero Content
              </button>
            </div>
          </form>
        </div>

        {/* Global Announcement Bar Form */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F1A51D] flex items-center justify-center">
              <Megaphone size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Announcement Ribbon</h2>
              <p className="text-xs text-slate-500">Key: <code className="font-mono text-[#74189B] font-semibold">announcement_bar</code></p>
            </div>
          </div>

          <form onSubmit={handleSaveAnnouncement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Announcement Message</label>
              <input
                type="text"
                placeholder="e.g. Free UAE Delivery for orders above AED 250! Use code LUXE25"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Clickable Destination URL (Optional)</label>
              <input
                type="text"
                placeholder="e.g. /shop?promo=luxe25"
                value={announcementLink}
                onChange={(e) => setAnnouncementLink(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementEnabled}
                  onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#74189B] focus:ring-[#74189B] border-slate-300"
                />
                <span className="text-xs font-bold text-slate-700">Display this announcement bar on customer site</span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingAnnouncement}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10 disabled:opacity-50"
              >
                {savingAnnouncement ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save Announcement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
