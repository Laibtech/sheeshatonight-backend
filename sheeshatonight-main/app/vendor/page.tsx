'use client';

import { useAuthStore } from '@/lib/store';
import { Package, ShoppingCart, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function VendorDashboard() {
  const { userName } = useAuthStore();

  const stats = [
    { label: 'Total Products', value: '24', icon: Package, color: 'from-blue-500 to-cyan-500', change: '+3 this week' },
    { label: 'Pending Orders', value: '8', icon: Clock, color: 'from-amber-500 to-orange-500', change: '3 new today' },
    { label: 'Monthly Revenue', value: 'AED 12,450', icon: DollarSign, color: 'from-green-500 to-emerald-500', change: '+18% from last month' },
    { label: 'Avg. Rating', value: '4.8/5', icon: TrendingUp, color: 'from-purple-500 to-pink-500', change: '120 reviews' },
  ];

  const recentOrders = [
    { id: '#ORD-1247', customer: 'Ahmed Al Maktoum', product: 'Premium Sheesha Set', time: '5 min ago', status: 'pending', amount: 'AED 320' },
    { id: '#ORD-1246', customer: 'Sarah Johnson', product: 'Luxury Tobacco Mix', time: '23 min ago', status: 'pending', amount: 'AED 180' },
    { id: '#ORD-1245', customer: 'Mohammed Ali', product: 'VIP Rental Package', time: '1 hour ago', status: 'accepted', amount: 'AED 550' },
    { id: '#ORD-1244', customer: 'Emma Wilson', product: 'Starter Kit', time: '2 hours ago', status: 'completed', amount: 'AED 280' },
  ];

  const topProducts = [
    { name: 'Premium Sheesha Set', sales: 45, revenue: 'AED 4,500', stock: 12 },
    { name: 'Luxury Tobacco Mix', sales: 38, revenue: 'AED 3,420', stock: 25 },
    { name: 'VIP Rental Package', sales: 22, revenue: 'AED 3,300', stock: 8 },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Pending</span>;
      case 'accepted':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Accepted</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Completed</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome back, {userName || 'Partner'}! 🎯
        </h1>
        <p className="text-slate-600">
          Manage your sheesha business and grow your revenue
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-800 mb-2">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.change}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-600" />
                Recent Orders
              </h2>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-800">{order.id}</h3>
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-sm text-slate-600">{order.customer}</p>
                    <p className="text-sm text-slate-600">{order.product}</p>
                    <p className="text-xs text-slate-500 mt-1">{order.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800 mb-2">{order.amount}</p>
                    {order.status === 'pending' && (
                      <div className="flex gap-2">
                        <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top Products
            </h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                >
                  <h3 className="font-semibold text-slate-800 mb-2">{product.name}</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{product.sales} sales</span>
                    <span className="font-bold text-green-600">{product.revenue}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        style={{ width: `${(product.stock / 30) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-600">{product.stock} left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors backdrop-blur-sm">
                + Add New Product
              </button>
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors backdrop-blur-sm">
                📊 View Analytics
              </button>
              <button className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors backdrop-blur-sm">
                💰 Check Earnings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
