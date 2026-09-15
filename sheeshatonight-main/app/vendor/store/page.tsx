'use client';

import { useEffect, useState } from 'react';
import { MapPin, Package, Pencil, Phone, Store, UserRound } from 'lucide-react';

interface VendorProfile {
  name: string;
  description?: string | null;
  location?: string | null;
  phone?: string | null;
  isActive: boolean;
  user?: {
    name?: string | null;
    email?: string | null;
  };
}

function formatLocation(location?: string | null) {
  if (!location) return 'Location not added yet';

  try {
    const parsed = JSON.parse(location);
    if (typeof parsed === 'string') return parsed;

    return [parsed.address, parsed.city, parsed.emirate, parsed.country]
      .filter(Boolean)
      .filter((part: string, index: number, values: string[]) =>
        !values.some((other, otherIndex) =>
          otherIndex < index && other.toLowerCase().includes(part.toLowerCase())
        )
      )
      .join(', ') || 'Location not added yet';
  } catch {
    return location;
  }
}

export default function VendorStorePage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/vendor/profile')
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Unable to load store profile');
        }
        return result.data;
      })
      .then(setProfile)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-slate-500">Loading your store...</div>;
  }

  if (error || !profile) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
          <Store className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-900">Store profile unavailable</h1>
          <p className="text-sm text-slate-500 mt-2">{error || 'No vendor profile is connected to this account yet.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-bold">My Store</p>
          <h1 className="text-3xl font-black text-slate-900 mt-2">{profile.name}</h1>
          <p className="text-slate-500 mt-2">Your live vendor profile from the marketplace database.</p>
        </div>
        <a href="/vendor/settings" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#D4AF37] text-slate-950 rounded-xl font-bold text-sm">
          <Pencil className="w-4 h-4" /> Edit Store
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
              <Store className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Store information</h2>
              <p className="text-xs text-slate-500">Shown to customers on your vendor profile.</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div><p className="text-xs text-slate-500">Location</p><p className="font-semibold text-slate-900">{formatLocation(profile.location)}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div><p className="text-xs text-slate-500">Phone</p><p className="font-semibold text-slate-900">{profile.phone || 'Phone not added yet'}</p></div>
            </div>
            <div className="flex items-start gap-3">
              <UserRound className="w-5 h-5 text-[#D4AF37] mt-0.5" />
              <div><p className="text-xs text-slate-500">Account contact</p><p className="font-semibold text-slate-900">{profile.user?.email || 'Email not available'}</p></div>
            </div>
          </div>

          <div className="border-t border-slate-100 mt-6 pt-6">
            <p className="text-xs text-slate-500 mb-2">Description</p>
            <p className="text-sm text-slate-700 leading-6">{profile.description || 'Add a description so customers understand your store.'}</p>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="bg-[#111111] text-white rounded-2xl p-6">
            <p className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Store status</p>
            <p className="text-2xl font-black mt-3">{profile.isActive ? 'Active' : 'Inactive'}</p>
            <p className="text-sm text-slate-400 mt-2">This status is controlled by marketplace approval.</p>
          </div>
          <a href="/vendor/products" className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#D4AF37] transition-colors">
            <Package className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-bold text-slate-900">Manage Products</span>
          </a>
        </aside>
      </div>
    </div>
  );
}
