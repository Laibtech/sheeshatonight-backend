'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Heart,
  Loader2,
  RefreshCw,
  Trash2,
  ShoppingBag,
  Store,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

interface WishlistItem {
  id: string;
  productId: string;
  product?: {
    id: string;
    title?: string;
    price?: number;
    currency?: string;
    images?: string | string[];
    type?: string;
    vendor?: {
      id: string;
      name: string;
      slug?: string;
    };
  };
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth_token');
  if (token) return token;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

function formatAmount(value: unknown, currency = 'AED') {
  const amount = Number(value);
  return Number.isFinite(amount) ? `${currency} ${amount.toFixed(2)}` : 'AED 0.00';
}

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await fetch('/api/wishlist', { headers, cache: 'no-store' });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to load wishlist.');
      }
      setItems(Array.isArray(result.data?.items) ? result.data.items : []);
    } catch (fetchError) {
      console.error('Failed to fetch wishlist:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load wishlist.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId: string) => {
    try {
      setRemovingId(productId);
      const token = getAuthToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/wishlist?productId=${productId}`, {
        method: 'DELETE',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      }
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    } finally {
      setRemovingId(null);
    }
  };

  const getProductImage = (images: unknown) => {
    if (typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        if (images.startsWith('http') || images.startsWith('/')) return images;
      }
    } else if (Array.isArray(images) && images.length > 0) {
      return images[0];
    }
    return '/logo.png';
  };

  return (
    <div className="p-6 md:p-10 min-h-full space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#251541] flex items-center gap-2.5 tracking-tight">
            <Heart className="w-7 h-7 text-[#7b2377] fill-[#7b2377]" />
            My Wishlist
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Your saved sheeshas, premium accessories, and favourite packages
          </p>
        </div>

        <button
          onClick={fetchWishlist}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 font-medium text-xs transition shadow-2xs self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-semibold">Loading your wishlist...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl p-12 border border-red-200 text-center">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Wishlist unavailable</h2>
          <p className="text-slate-500 text-xs mb-5">{error}</p>
          <button
            onClick={fetchWishlist}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white rounded-xl font-bold text-xs shadow-md hover:bg-[#b8902a] transition"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
          <Heart className="w-14 h-14 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">Your wishlist is empty</h3>
          <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
            Save your favorite sheeshas, custom fruit bowls, and coals so you can quickly reorder anytime.
          </p>
          <Link
            href="/dashboard/browse"
            className="inline-flex px-5 py-2.5 bg-[#D4AF37] text-slate-950 font-bold rounded-xl text-xs hover:bg-[#b8902a] transition shadow-md"
          >
            Browse Sheesha & Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const product = item.product;
            const imgSrc = getProductImage(product?.images);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="relative w-full h-44 bg-slate-100 rounded-xl overflow-hidden mb-4 flex items-center justify-center">
                    <img
                      src={imgSrc}
                      alt={product?.title || 'Sheesha Product'}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={removingId === item.productId}
                      className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-full shadow-md transition"
                      title="Remove from wishlist"
                    >
                      {removingId === item.productId ? (
                        <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1 mb-1">
                    {product?.title || 'Exclusive Sheesha Package'}
                  </h3>

                  {product?.vendor?.name && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
                      {product.vendor.name}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Price</span>
                    <p className="text-lg font-black text-slate-900 font-mono">
                      {formatAmount(product?.price || 0, product?.currency || 'AED')}
                    </p>
                  </div>

                  <Link
                    href={`/products/${product?.id || item.productId}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#D4AF37] text-slate-950 rounded-xl font-bold text-xs hover:bg-[#b8902a] transition shadow-2xs"
                  >
                    <span>View Product</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
