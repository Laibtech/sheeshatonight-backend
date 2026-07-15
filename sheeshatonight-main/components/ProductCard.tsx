'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Heart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    vendor: string;
    price: string;
    rating: number;
    reviews: number;
    status?: string;
    badge?: string;
  };
  actionLabel?: string;
  onAction?: () => void;
  onFavorite?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, actionLabel = 'View', onAction, onFavorite }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-amber-500 font-semibold">{product.vendor}</p>
          <h3 className="text-xl font-bold text-slate-900 mt-3">{product.name}</h3>
          <p className="text-sm text-slate-600 mt-2">{product.badge ?? 'Luxury sheesha experience'}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
            <Star size={16} className="text-amber-500" />
            <span>{product.rating.toFixed(1)}</span>
            <span>•</span>
            <span>{product.reviews} reviews</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onFavorite}
          className="rounded-2xl border border-slate-200 p-3 text-slate-500 hover:bg-slate-100 transition"
        >
          <Heart size={20} />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">From</p>
          <p className="text-2xl font-black text-slate-900">{product.price}</p>
        </div>
        <div className="flex gap-2">
          {onAction ? (
            <button
              onClick={onAction}
              className="px-5 py-3 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
            >
              {actionLabel}
            </button>
          ) : (
            <Link
              href={`/customer/product/${product.id}`}
              className="px-5 py-3 rounded-2xl bg-amber-500 text-white font-semibold hover:bg-amber-600 transition"
            >
              {actionLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
