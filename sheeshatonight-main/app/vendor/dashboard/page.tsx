'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { GlassCard } from '@/components/GlassCard';
import { TrendingUp, ShoppingCart, Package, AlertCircle, Star } from 'lucide-react';

export default function VendorDashboard() {
  const { isAllowed } = useRoleGuard(['VENDOR']);

  if (!isAllowed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <DashboardHeader title="Vendor Portal" />

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        {/* Header Title */}
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900">Dashboard Overview</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your boutique rentals, inventory performance, and orders</p>
        </div>

        {/* Today's Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Sales */}
          <GlassCard className="border-slate-205 bg-white/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Sales</h3>
              <div className="p-2.5 bg-green-50 text-green-700 rounded-xl border border-green-200">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">AED 3,240</p>
            <p className="text-xs text-green-700 font-bold mt-2">↑ 18% vs yesterday</p>
          </GlassCard>

          {/* Monthly Revenue */}
          <GlassCard className="border-slate-205 bg-white/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Revenue</h3>
              <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
                <ShoppingCart size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">AED 48,500</p>
            <p className="text-xs text-amber-750 font-bold mt-2">↑ 24% vs last month</p>
          </GlassCard>

          {/* Active Products */}
          <GlassCard className="border-slate-205 bg-white/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Products</h3>
              <div className="p-2.5 bg-purple-50 text-purple-700 rounded-xl border border-purple-200">
                <Package size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">24</p>
            <p className="text-xs text-purple-700 font-bold mt-2">2 pending approval</p>
          </GlassCard>

          {/* Pending Orders */}
          <GlassCard className="border-slate-205 bg-white/40 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Orders</h3>
              <div className="p-2.5 bg-red-50 text-red-700 rounded-xl border border-red-200">
                <AlertCircle size={18} />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-900">12</p>
            <p className="text-xs text-red-700 font-bold mt-2">Needs attention</p>
          </GlassCard>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Live Booking Requests</h3>
            <div className="space-y-3">
              {[
                { id: 'ORD-001', customer: 'Ahmed Al-Mansouri', venue: 'Al Manara Beach Club', time: '30 mins ago', items: 'Premium Setup + Double Apple Flavors' },
                { id: 'ORD-002', customer: 'Fatima Hassan', venue: 'Downtown Dubai Residence', time: '45 mins ago', items: 'Deluxe Setup with Ice Hose' },
                { id: 'ORD-003', customer: 'Mohammed Khan', venue: 'Marina Yacht Berth', time: '1 hour ago', items: 'Standard Setup + Citrus Mint Mix' },
              ].map((order) => (
                <div key={order.id} className="p-4 border border-slate-200 rounded-2xl bg-white/50 hover:border-amber-500/20 hover:bg-white transition shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{order.customer}</p>
                      <p className="text-xs text-slate-500">{order.venue}</p>
                    </div>
                    <span className="text-xs text-slate-400">{order.time}</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-3">{order.items}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-amber-500 text-white text-xs font-bold rounded-xl hover:shadow-glow transition">
                      Accept Request
                    </button>
                    <button className="flex-1 px-3 py-2 bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-xl hover:bg-slate-200 transition border border-slate-200">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Top Performing Setups</h3>
            <div className="space-y-3">
              {[
                { name: 'Meduse Royal Setup', sales: 156, rating: 4.8 },
                { name: 'Ember Glass Premium', sales: 142, rating: 4.7 },
                { name: 'Khalil Mamoon Classic', sales: 98, rating: 4.6 },
              ].map((product, idx) => (
                <div key={idx} className="p-4 bg-white/40 border border-slate-200 rounded-2xl flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{product.name}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{product.sales} orders this week</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Reviews & Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Reviews */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Boutique Reviews</h3>
            <div className="space-y-3">
              {[
                { customer: 'Sara Al-Mansoori', rating: 5, review: 'Excellent service! Very professional setup crew and premium hose cleanliness.' },
                { customer: 'Ali Mahmoud', rating: 4, review: 'Great experience, the coconut coals lasted over 2 hours.' },
              ].map((rev, idx) => (
                <div key={idx} className="p-4 border border-slate-200 rounded-2xl bg-white/40 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-sm text-slate-900">{rev.customer}</p>
                    <div className="flex gap-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed">{rev.review}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Messages */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Concierge Inquiries</h3>
            <div className="space-y-3">
              {[
                { customer: 'Zainab Hassan', message: 'Can we request the custom gold-plated Meduse model for our VIP party tonight?', unread: true },
                { customer: 'Omar Khalil', message: 'Is shipping included in the Al Barsha area?', unread: false },
              ].map((msg, idx) => (
                <div key={idx} className={`p-4 rounded-2xl border ${msg.unread ? 'bg-amber-50/60 border-amber-200 shadow-sm' : 'bg-white/40 border-slate-200 shadow-sm'}`}>
                  <p className={`text-xs font-bold ${msg.unread ? 'text-amber-700' : 'text-slate-900'}`}>{msg.customer}</p>
                  <p className="text-xs text-slate-600 mt-1">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
