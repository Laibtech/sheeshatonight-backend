'use client';

import { Calendar, Clock, MapPin, User, ArrowUpRight, CheckCircle, XCircle } from 'lucide-react';

export default function BookingsPage() {
  const bookings = [
    {
      id: 'BK-001',
      lounge: 'Cloud Nine Lounge',
      date: '2024-06-15',
      time: '7:00 PM - 10:00 PM',
      guests: 4,
      status: 'confirmed',
      address: 'Dubai Marina, Tower 5',
      amount: 'AED 450',
    },
    {
      id: 'BK-002',
      lounge: 'Sultan Sheesha Palace',
      date: '2024-06-18',
      time: '8:30 PM - 11:30 PM',
      guests: 6,
      status: 'pending',
      address: 'Downtown Dubai, Level 2',
      amount: 'AED 650',
    },
    {
      id: 'BK-003',
      lounge: 'Royal Palace Sheesha',
      date: '2024-06-12',
      time: '6:00 PM - 9:00 PM',
      guests: 2,
      status: 'completed',
      address: 'Palm Jumeirah, Villa 12',
      amount: 'AED 800',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <CheckCircle className="w-3 h-3" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1.5">
            <XCircle className="w-3 h-3" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header - CONSISTENT */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#D4AF37]" />
          My Bookings
        </h1>
        <p className="text-slate-600 text-sm mt-1">Manage your upcoming and past reservations</p>
      </div>

      {/* Stats - CONSISTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium">Upcoming</p>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">2</p>
          <p className="text-xs text-slate-500 mt-1">Confirmed reservations</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium">This Month</p>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">5</p>
          <p className="text-xs text-slate-500 mt-1">Total bookings</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium">Total Spent</p>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">AED 2,450</p>
          <p className="text-xs text-slate-500 mt-1">On reservations</p>
        </div>
      </div>

      {/* Bookings List - CONSISTENT CARDS */}
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              {/* Booking Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{booking.id}</h3>
                  {getStatusBadge(booking.status)}
                </div>

                <div className="space-y-2">
                  <p className="text-slate-900 font-semibold">{booking.lounge}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{booking.guests} guests</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {booking.address}
                  </p>
                </div>
              </div>

              {/* Booking Actions */}
              <div className="flex flex-col items-end gap-3">
                <p className="text-2xl font-bold text-[#D4AF37]">{booking.amount}</p>
                <div className="flex gap-2">
                  {booking.status === 'confirmed' && (
                    <>
                      <button className="px-4 py-2 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium text-sm flex items-center gap-1">
                        View Details
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                      <button className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm">
                        Cancel
                      </button>
                    </>
                  )}
                  {booking.status === 'pending' && (
                    <button className="px-4 py-2 bg-amber-50 text-[#D4AF37] hover:bg-amber-100 rounded-lg transition-colors font-medium text-sm">
                      Contact Support
                    </button>
                  )}
                  {booking.status === 'completed' && (
                    <button className="px-4 py-2 bg-amber-50 text-[#D4AF37] hover:bg-amber-100 rounded-lg transition-colors font-medium text-sm">
                      Book Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No bookings yet</h3>
          <p className="text-slate-500 mb-6">Start browsing to make your first reservation</p>
          <button className="px-6 py-3 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B8902A] hover:shadow-lg transition-all">
            Browse Lounges
          </button>
        </div>
      )}
    </div>
  );
}
