'use client';

import { useState } from 'react';
import { Store, Search, Star, MapPin, Filter, ArrowUpRight } from 'lucide-react';

export default function BrowseSheesha() {
  const [searchQuery, setSearchQuery] = useState('');

  const lounges = [
    { id: 1, name: 'Cloud Nine Lounge', rating: 4.8, reviews: 120, distance: '1.2 km', price: 'AED 200-400', badge: 'Premium' },
    { id: 2, name: 'Sultan Sheesha Palace', rating: 4.9, reviews: 89, distance: '2.5 km', price: 'AED 300-600', badge: 'VIP' },
    { id: 3, name: 'Dubai Nights', rating: 4.7, reviews: 156, distance: '3.1 km', price: 'AED 150-350', badge: null },
    { id: 4, name: 'Marina Sheesha Lounge', rating: 4.6, reviews: 93, distance: '4.2 km', price: 'AED 180-320', badge: null },
    { id: 5, name: 'Royal Palace Sheesha', rating: 4.9, reviews: 201, distance: '5.8 km', price: 'AED 400-800', badge: 'Luxury' },
    { id: 6, name: 'Downtown Smoke Hub', rating: 4.5, reviews: 67, distance: '2.3 km', price: 'AED 120-250', badge: null },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header - CONSISTENT */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Store className="w-6 h-6 text-[#D4AF37]" />
          Browse Sheesha Lounges
        </h1>
        <p className="text-slate-600 text-sm mt-1">Discover premium sheesha experiences near you</p>
      </div>

      {/* Search & Filter - CONSISTENT */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lounges, locations..."
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Lounges Grid - CONSISTENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lounges.map((lounge) => (
          <div
            key={lounge.id}
            className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group"
          >
            {/* Image Placeholder */}
            <div className="relative h-40 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
              <Store className="w-12 h-12 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              {lounge.badge && (
                <span className="absolute top-3 right-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                  {lounge.badge}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-slate-900 mb-2">{lounge.name}</h3>
              
              <div className="flex items-center gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-semibold text-slate-700">{lounge.rating}</span>
                  <span className="text-slate-500">({lounge.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{lounge.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#D4AF37]">{lounge.price}</span>
                <button className="px-4 py-2 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#B8902A] hover:shadow-lg transition-all text-sm flex items-center gap-1">
                  Book
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
