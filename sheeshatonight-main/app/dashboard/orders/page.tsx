'use client';

import { Package, Clock, CheckCircle, Truck, MapPin, ArrowUpRight } from 'lucide-react';

export default function CustomerOrders() {
  const orders = [
    { 
      id: '#ORD-1247', 
      product: 'Premium Sheesha Set', 
      vendor: 'Cloud Nine Lounge',
      date: '2 hours ago', 
      status: 'delivered', 
      amount: 'AED 320',
      address: 'Dubai Marina, Building 5, Apt 204'
    },
    { 
      id: '#ORD-1246', 
      product: 'Luxury Tobacco Mix', 
      vendor: 'Sultan Sheesha Palace',
      date: '1 day ago', 
      status: 'in_transit', 
      amount: 'AED 180',
      address: 'Downtown Dubai, Tower A, Floor 12'
    },
    { 
      id: '#ORD-1245', 
      product: 'VIP Sheesha Rental', 
      vendor: 'Dubai Nights',
      date: '3 days ago', 
      status: 'completed', 
      amount: 'AED 450',
      address: 'Palm Jumeirah, Villa 25'
    },
    { 
      id: '#ORD-1244', 
      product: 'Starter Kit', 
      vendor: 'Marina Lounge',
      date: '1 week ago', 
      status: 'completed', 
      amount: 'AED 280',
      address: 'Business Bay, Office Tower 3'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Delivered
          </span>
        );
      case 'in_transit':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Truck className="w-3 h-3" />
            In Transit
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header - CONSISTENT */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-6 h-6 text-[#D4AF37]" />
          My Orders
        </h1>
        <p className="text-slate-600 text-sm mt-1">Track and manage your sheesha orders</p>
      </div>

      {/* Orders List - CONSISTENT CARDS */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Order Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{order.id}</h3>
                  {getStatusBadge(order.status)}
                </div>
                
                <div className="space-y-1.5">
                  <p className="text-slate-900 font-semibold">{order.product}</p>
                  <p className="text-sm text-slate-600">Vendor: {order.vendor}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {order.address}
                  </p>
                  <p className="text-xs text-slate-400">{order.date}</p>
                </div>
              </div>

              {/* Order Actions */}
              <div className="flex flex-col items-end gap-3">
                <p className="text-2xl font-bold text-[#D4AF37]">{order.amount}</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium text-sm flex items-center gap-1">
                    View Details
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                  {order.status === 'delivered' && (
                    <button className="px-4 py-2 bg-amber-50 text-[#D4AF37] hover:bg-amber-100 rounded-lg transition-colors font-medium text-sm">
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no orders) */}
      {orders.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Start browsing to place your first order</p>
          <button className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B8902A] hover:shadow-lg transition-all">
            Browse Sheesha
          </button>
        </div>
      )}
    </div>
  );
}
