'use client';

import { ShoppingCart, CheckCircle, XCircle, Clock, Package } from 'lucide-react';

export default function VendorOrders() {
  const orders = [
    { id: '#ORD-1247', customer: 'Ahmed Al Maktoum', product: 'Premium Sheesha Set', time: '5 min ago', status: 'pending', amount: 'AED 320' },
    { id: '#ORD-1246', customer: 'Sarah Johnson', product: 'Luxury Tobacco Mix', time: '23 min ago', status: 'pending', amount: 'AED 180' },
    { id: '#ORD-1245', customer: 'Mohammed Ali', product: 'VIP Rental Package', time: '1 hour ago', status: 'accepted', amount: 'AED 550' },
    { id: '#ORD-1244', customer: 'Emma Wilson', product: 'Starter Kit', time: '2 hours ago', status: 'completed', amount: 'AED 280' },
    { id: '#ORD-1243', customer: 'Omar Hassan', product: 'Premium Coal Box', time: '3 hours ago', status: 'completed', amount: 'AED 45' },
    { id: '#ORD-1242', customer: 'Fatima Al Zaabi', product: 'Luxury Tobacco Mix', time: '5 hours ago', status: 'rejected', amount: 'AED 180' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'accepted':
        return <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1"><Package className="w-3 h-3" /> Accepted</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'rejected':
        return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <ShoppingCart className="w-8 h-8 text-purple-600" />
            Order Management
          </h1>
          <p className="text-slate-600">Accept, reject, and track customer orders</p>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-800">{order.id}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{order.customer}</td>
                    <td className="px-6 py-4 text-slate-600">{order.product}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.time}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{order.amount}</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4">
                      {order.status === 'pending' ? (
                        <div className="flex gap-2">
                          <button className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
