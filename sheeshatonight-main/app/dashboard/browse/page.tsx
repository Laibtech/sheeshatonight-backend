'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Loader2,
  RefreshCw,
  Search,
  Store,
  Package,
  MapPin,
  ArrowUpRight,
  Sparkles,
  Tag,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  tags?: string[];
}

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  image: string;
  type: string;
  vendor: string;
  vendorLocation?: string;
}

function formatAmount(value: number, currency = 'AED') {
  return `${currency} ${Number(value || 0).toFixed(2)}`;
}

export default function BrowseSheesha() {
  const [activeTab, setActiveTab] = useState<'products' | 'vendors'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [vendorsRes, productsRes] = await Promise.all([
        fetch('/api/vendors?limit=50', { cache: 'no-store' }),
        fetch('/api/products?limit=50', { cache: 'no-store' }),
      ]);

      if (vendorsRes.ok) {
        const vData = await vendorsRes.json();
        if (vData.success && Array.isArray(vData.data)) {
          setVendors(vData.data);
        }
      }

      if (productsRes.ok) {
        const pData = await productsRes.json();
        if (pData.success && Array.isArray(pData.data)) {
          setProducts(pData.data);
        }
      }
    } catch (fetchError) {
      console.error('Failed to fetch browse data:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load browse data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.vendor.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedType !== 'ALL' && p.type.toUpperCase() !== selectedType) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedType]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) =>
      `${vendor.name} ${vendor.description || ''} ${(vendor.tags || []).join(' ')} ${
        vendor.location || ''
      }`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [vendors, searchQuery]);

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-full space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1c1328] to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UAE Marketplace & Lounges</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Browse Sheesha & Lounges</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
            Discover luxury Russian and German sheeshas, premium fruit bowls, handcrafted heads, and top Dubai lounges.
          </p>
        </div>
      </div>

      {/* Control Bar: Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Toggle Tabs */}
        <div className="flex gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>Sheeshas & Packages ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'vendors'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-4 h-4 text-[#D4AF37]" />
            <span>Lounges & Vendors ({vendors.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'products' ? 'Search flavours, sheeshas...' : 'Search lounges, areas...'
            }
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />
        </div>
      </div>

      {/* Product Type Filter Pills (only when products tab active) */}
      {activeTab === 'products' && (
        <div className="flex flex-wrap gap-2 pt-1">
          {[
            { id: 'ALL', label: 'All Products' },
            { id: 'RENTAL_PACKAGE', label: 'Rental Packages' },
            { id: 'EQUIPMENT', label: 'Hookahs & Sets' },
            { id: 'FLAVOR', label: 'Flavours & Bowls' },
            { id: 'ACCESSORY', label: 'Coals & Accessories' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedType === type.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      )}

      {/* Content Rendering */}
      {loading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-semibold">Loading marketplace...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-red-200">
          <p className="text-slate-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#b8902a] transition"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : activeTab === 'products' ? (
        filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No sheesha products match your search</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting the category filter or searching a different term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full h-44 bg-slate-50 rounded-xl overflow-hidden mb-4 flex items-center justify-center p-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {p.type.replace(/_/g, ' ')}
                  </span>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-1">
                    {p.title}
                  </h3>

                  {p.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                  )}

                  <p className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                    <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {p.vendor}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Price</span>
                    <p className="text-xl font-black text-slate-900 font-mono">
                      {formatAmount(p.price)}
                    </p>
                  </div>

                  <Link
                    href={`/products/${p.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#D4AF37] text-slate-950 rounded-xl font-bold text-xs hover:bg-[#b8902a] transition shadow-2xs"
                  >
                    <span>Rent / Order</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredVendors.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No lounges found</h3>
          <p className="text-xs text-slate-500 mt-1">Try another search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.id}`}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 text-[#D4AF37]">
                  <Store className="w-6 h-6" />
                </div>

                <h3 className="font-bold text-slate-900 text-lg group-hover:text-[#D4AF37] transition mb-2">
                  {vendor.name}
                </h3>

                {vendor.description && (
                  <p className="text-xs text-slate-600 line-clamp-3 mb-3">{vendor.description}</p>
                )}

                {vendor.location && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    {vendor.location}
                  </p>
                )}

                {vendor.tags && vendor.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {vendor.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 mt-5 flex items-center justify-between text-xs font-bold text-[#D4AF37]">
                <span>Visit Lounge Store</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
