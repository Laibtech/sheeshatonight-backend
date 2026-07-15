'use client';

import { Heart, ShoppingBag, Star, MapPin, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const wishlistItems = [
    {
      id: 1,
      name: 'Premium Gold Sheesha Set',
      lounge: 'Cloud Nine Lounge',
      price: 'AED 450',
      rating: 4.9,
      reviews: 120,
      distance: '1.2 km',
      image: '/placeholder.jpg',
    },
    {
      id: 2,
      name: 'Luxury Tobacco Mix Collection',
      lounge: 'Sultan Sheesha Palace',
      price: 'AED 280',
      rating: 4.8,
      reviews: 89,
      distance: '2.5 km',
      image: '/placeholder.jpg',
    },
    {
      id: 3,
      name: 'VIP Lounge Experience',
      lounge: 'Royal Palace Sheesha',
      price: 'AED 800',
      rating: 5.0,
      reviews: 201,
      distance: '5.8 km',
      image: '/placeholder.jpg',
    },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Heart className="w-6 h-6 text-[#D4AF37]" />
          My Wishlist
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          {wishlistItems.length} items saved for later
        </p>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow"
          >
            {/* Image Placeholder */}
            <div className="relative h-48 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-[#D4AF37] opacity-40" />
              <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition-transform">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{item.lounge}</p>

              <div className="flex items-center gap-4 mb-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span className="font-semibold text-slate-700">{item.rating}</span>
                  <span className="text-slate-500">({item.reviews})</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span>{item.distance}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <span className="text-lg font-bold text-[#D4AF37]">{item.price}</span>
                <div className="flex gap-2">
                  <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#B8902A] transition-all text-sm">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {wishlistItems.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No items in wishlist</h3>
          <p className="text-slate-500 mb-6">Start adding your favorite items</p>
          <button className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B8902A] hover:shadow-lg transition-all">
            Browse Sheesha
          </button>
        </div>
      )}
    </div>
  );
}
