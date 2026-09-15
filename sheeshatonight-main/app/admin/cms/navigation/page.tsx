'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Compass, Plus, Save, RefreshCw } from 'lucide-react';
import { Toast } from '@/components/Toast';

interface NavItem {
  id: string;
  label: string;
  url: string;
  order: number;
}

export default function AdminCmsNavigationPage() {
  const [navItems, setNavItems] = useState<NavItem[]>([
    { id: '1', label: 'Browse', url: '/browse', order: 1 },
    { id: '2', label: 'Stores', url: '/stores', order: 2 },
    { id: '3', label: 'Shop', url: '/shop', order: 3 },
    { id: '4', label: 'Vendors', url: '/vendor-profile', order: 4 },
    { id: '5', label: 'How It Works', url: '/how-it-works', order: 5 },
    { id: '6', label: 'About Us', url: '/about', order: 6 },
    { id: '7', label: 'Contact', url: '/contact', order: 7 },
  ]);
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    let token = localStorage.getItem('auth_token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match && match[1]) token = decodeURIComponent(match[1]);
    }
    return token || '';
  };

  useEffect(() => {
    fetchNavigation();
  }, []);

  const fetchNavigation = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const res = await fetch('/api/admin/cms/content/navigation_menu', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setNavItems(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch navigation CMS:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch('/api/admin/cms/content/navigation_menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(navItems),
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage('Navigation menu updated successfully!');
        setToastOpen(true);
      }
    } catch (err) {
      console.error('Failed to save navigation menu:', err);
    }
  };

  const handleItemChange = (index: number, field: keyof NavItem, value: any) => {
    const updated = [...navItems];
    const current = updated[index];
    if (current) {
      updated[index] = { ...current, [field]: value };
      setNavItems(updated);
    }
  };

  const handleAddItem = () => {
    setNavItems([
      ...navItems,
      { id: Date.now().toString(), label: 'New Link', url: '/', order: navItems.length + 1 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setNavItems(navItems.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Compass className="w-7 h-7 text-[#D4AF37]" />
            Header Navigation CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure header menu items, external links, and navigation order across the marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchNavigation}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 bg-[#D4AF37] hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition"
          >
            <Save size={16} /> Save Navigation
          </button>
        </div>
      </div>

      <GlassCard className="p-6 border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Active Navigation Links</h3>
          <button
            onClick={handleAddItem}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1"
          >
            <Plus size={14} /> Add Menu Item
          </button>
        </div>

        <div className="space-y-3">
          {navItems.map((item, idx) => (
            <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleItemChange(idx, 'label', e.target.value)}
                placeholder="Link Label"
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-[#D4AF37]"
              />
              <input
                type="text"
                value={item.url}
                onChange={(e) => handleItemChange(idx, 'url', e.target.value)}
                placeholder="/url-path"
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                onClick={() => handleRemoveItem(idx)}
                className="px-2.5 py-1.5 bg-rose-50 text-rose-600 font-bold rounded-lg text-xs hover:bg-rose-100"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      <Toast open={toastOpen} message={toastMessage} variant="success" onClose={() => setToastOpen(false)} />
    </div>
  );
}
