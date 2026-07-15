'use client';

import React from 'react';
import { GlassCard } from './GlassCard';
import { ProgressBar } from './ProgressBar';
import { ChevronRight } from 'lucide-react';
import type { Order } from '@/lib/types';

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <GlassCard className="mb-4 hover:shadow-[0_0_50px_rgba(234,179,8,0.15)]">
      <div className="flex flex-col gap-4">
        {/* Header Row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-amber-500 font-semibold uppercase tracking-wide">
              {order.orderNumber}
            </p>
            <h3 className="text-lg font-bold text-slate-900 mt-1">{order.venue}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Status: <span className="text-amber-650 font-semibold">{order.status}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black text-amber-600">{order.total}</p>
            <p className="text-xs text-slate-400 mt-1">{order.estimatedDelivery}</p>
          </div>
        </div>

        {/* Progress */}
        <ProgressBar progress={order.progress} label="Order Progress" />

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Est. Delivery: <span className="text-amber-650 font-semibold">{order.estimatedDelivery}</span>
          </p>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-lg hover:shadow-sm transition">
            View Live Details
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
