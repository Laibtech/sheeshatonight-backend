'use client';

import React from 'react';

export type StatusType =
  // Order Statuses
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'ACTIVE_RENTAL'
  | 'COMPLETED'
  | 'CANCELLED'
  // Vendor / User Statuses
  | 'ACTIVE'
  | 'INACTIVE'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  // Payment / Settlement
  | 'PROCESSED'
  | 'PAID'
  | 'FAILED'
  | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = (status || '').toUpperCase();

  let bg = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;

  switch (normalized) {
    case 'COMPLETED':
    case 'DELIVERED':
    case 'APPROVED':
    case 'ACTIVE':
    case 'PAID':
      bg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      break;

    case 'PREPARING':
    case 'PROCESSING':
    case 'PROCESSED':
    case 'READY_FOR_PICKUP':
      bg = 'bg-blue-50 text-blue-700 border-blue-200';
      break;

    case 'OUT_FOR_DELIVERY':
    case 'ACTIVE_RENTAL':
      bg = 'bg-purple-50 text-purple-700 border-purple-200';
      break;

    case 'PENDING':
      bg = 'bg-amber-50 text-amber-800 border-amber-200';
      break;

    case 'CANCELLED':
    case 'REJECTED':
    case 'FAILED':
    case 'SUSPENDED':
    case 'INACTIVE':
      bg = 'bg-rose-50 text-rose-700 border-rose-200';
      break;

    default:
      bg = 'bg-slate-50 text-slate-700 border-slate-200';
  }

  // Format label nicely (e.g. OUT_FOR_DELIVERY -> Out For Delivery)
  label = normalized
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  );
};
