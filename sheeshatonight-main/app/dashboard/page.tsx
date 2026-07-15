'use client';

import { useAuthStore } from '@/lib/store';
import { ShoppingBag, Package, Clock, Star, TrendingUp, MapPin, ArrowUpRight } from 'lucide-react';

export default function CustomerDashboard() {
  const { userName } = useAuthStore();

  const stats = [
    { label: 'Active Bookings', value: '2', change: '+1 this week', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Orders', value: '12', change: '+3 this month', icon: Package, color: 'text-[#D4AF37]', bg: 'bg-amber-50' },
    { label: 'Spent This Month', value: 'AED 1,240', change: '+18% from last', icon: TrendingUp, color: 'text-[#B8902A]', bg: 'bg-amber-50' },
    { label: 'Loyalty Points', value: '450', change: '50 to next tier', icon: Star, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const recentOrders = [
    { id: '1', product: 'Premium Sheesha Set', vendor: 'Cloud Nine Lounge', date: '2 hours ago', status: 'Delivered', amount: 'AED 320' },
    { id: '2', product: 'Luxury Tobacco Mix', vendor: 'Sultan Sheesha', date: '1 day ago', status: 'In Transit', amount: 'AED 180' },
    { id: '3', product: 'VIP Sheesha Rental', vendor: 'Dubai Nights', date: '3 days ago', status: 'Completed', amount: 'AED 450' },
  ];

  const nearbyLounges = [
    { name: 'Cloud Nine Lounge', distance: '1.2 km', rating: 4.8, reviews: 120 },
    { name: 'Sultan Sheesha Palace', distance: '2.5 km', rating: 4.9, reviews: 89 },
    { name: 'Dubai Nights', distance: '3.1 km', rating: 4.7, reviews: 156 },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {userName || 'Valued Customer'}! 👋
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Here's what's happening with your account today
        </p>
      </div>

      {/* Stats Grid - CONSISTENT DESIGN */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - CONSISTENT CARD */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#D4AF37]" />
                Recent Orders
              </h2>
              <button className="text-sm text-[#D4AF37] hover:text-[#B8902A] font-medium flex items-center gap-1">
                View All
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{order.product}</h3>
                    <p className="text-xs text-slate-600 mt-1">{order.vendor}</p>
                    <p className="text-xs text-slate-500 mt-1">{order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-sm mb-2">{order.amount}</p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        order.status === 'Delivered'
                          ? 'bg-green-100 text-green-700'
                          : order.status === 'In Transit'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nearby Lounges - CONSISTENT CARD */}
        <div>
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#D4AF37]" />
              Nearby Lounges
            </h2>
            <div className="space-y-3">
              {nearbyLounges.map((lounge, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <h3 className="font-semibold text-slate-900 text-sm mb-2">{lounge.name}</h3>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{lounge.distance}</span>
                    <span className="text-amber-600 flex items-center gap-1 font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      {lounge.rating} ({lounge.reviews})
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#B8902A] hover:shadow-lg transition-all text-sm">
              Browse All Lounges
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
