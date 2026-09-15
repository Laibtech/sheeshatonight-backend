'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Loader2, Filter, Package, Calendar } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: { name: string; email: string } | null;
  product?: { title: string } | null;
}

export default function VendorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [ratingFilter]);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    let token = localStorage.getItem('auth_token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match && match[1]) token = decodeURIComponent(match[1]);
    }
    return token || '';
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const url = ratingFilter ? `/api/vendor/reviews?rating=${ratingFilter}` : '/api/vendor/reviews';
      const res = await fetch(url, { headers });
      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Customer Feedback & Reviews</h2>
          <p className="text-xs text-slate-500 mt-1">
            Read verified customer ratings and experience feedback on your listed products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2">
            <Filter size={14} className="text-slate-400" />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rating Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center font-black text-2xl">
            {avgRating}
          </div>
          <div>
            <div className="flex items-center gap-1 text-amber-400 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="fill-current" />
              ))}
            </div>
            <p className="text-sm font-bold text-slate-900">Overall Store Satisfaction</p>
            <p className="text-xs text-slate-500 mt-0.5">Based on {reviews.length} verified customer reviews</p>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#8A277E] border border-purple-100">
            Top Rated Vendor
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#8A277E] animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading customer reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No customer reviews yet</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Reviews left by buyers on your rentals and sheeshas will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <div key={r.id} className="p-5 hover:bg-slate-50/50 transition flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-[#8A277E] font-bold text-xs flex items-center justify-center">
                      {r.user?.name ? r.user.name.charAt(0).toUpperCase() : 'C'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{r.user?.name || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{r.user?.email || 'Verified Buyer'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        className={star <= r.rating ? 'fill-current' : 'text-slate-200'}
                      />
                    ))}
                  </div>
                </div>

                {r.product && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-1">
                    <Package size={13} className="text-[#8A277E]" />
                    <span>Product: {r.product.title}</span>
                  </div>
                )}

                <p className="text-xs text-slate-700 leading-relaxed mt-1">
                  {r.comment || 'Customer provided a star rating with no written text.'}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                  <Calendar size={11} />
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
