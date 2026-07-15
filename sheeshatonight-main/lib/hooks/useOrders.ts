'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export const useOrders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  const checkout = async (payload: {
    userId: string;
    vendorId: string;
    items: any[];
    totalAmount: number;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.orders.checkout(payload);
      if (res.success) {
        setOrderId(res.orderId);
        setOrderStatus(res.status);
        return res;
      } else {
        throw new Error(res.message || 'Checkout failed');
      }
    } catch (err: any) {
      setError(err.message || 'Order creation failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.orders.updateStatus(id, status);
      if (res.success) {
        setOrderStatus(res.newStatus);
        return res;
      } else {
        throw new Error('Could not update status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    orderId,
    orderStatus,
    checkout,
    updateStatus,
  };
};
