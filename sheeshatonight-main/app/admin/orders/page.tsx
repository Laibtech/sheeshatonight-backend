'use client';

import React, { useState, useCallback } from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { DataTable } from '@/components/DataTable';
import { StatCard } from '@/components/StatCard';
import { ShoppingCart, TrendingUp, Clock, Trash2 } from 'lucide-react';
import ActionModal from '@/components/ActionModal';
import { useActions } from '@/lib/hooks/useActions';
import { Toast } from '@/components/Toast';

const initialOrders = [
  { id: 'ORD-001', customer: 'Ahmed Al-Khaleej', total: 'AED 450', items: 2, status: 'Pending', date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Fatima Hassan', total: 'AED 1,230', items: 5, status: 'Preparing', date: '2024-01-14' },
  { id: 'ORD-003', customer: 'Mohammed Khan', total: 'AED 780', items: 3, status: 'Shipped', date: '2024-01-13' },
  { id: 'ORD-004', customer: 'Sara Al-Mansouri', total: 'AED 560', items: 2, status: 'Delivered', date: '2024-01-12' },
];

export default function AdminOrders() {
  const { isAllowed } = useRoleGuard(['ADMIN']);
  const { performAction } = useActions();
  const [orders, setOrders] = useState(initialOrders);
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: 'accept' as any,
    orderId: '',
    orderRef: '',
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loadingIds, setLoadingIds] = useState(new Set<string | number>());

  if (!isAllowed) return null;

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(variant === 'error' ? 'error' : 'success');
    setToastOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, { bg: string; text: string }> = {
      Pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      Preparing: { bg: 'bg-blue-100', text: 'text-blue-700' },
      Shipped: { bg: 'bg-purple-100', text: 'text-purple-700' },
      Delivered: { bg: 'bg-green-100', text: 'text-green-700' },
      Cancelled: { bg: 'bg-red-100', text: 'text-red-700' },
    };
    const colors = statusColors[status] || { bg: 'bg-slate-100', text: 'text-slate-700' };
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold w-fit ${colors.bg} ${colors.text}`}>
        {status}
      </span>
    );
  };

  const handleAction = useCallback((orderId: string, action: string, orderRef: string) => {
    setActionModal({ isOpen: true, type: action, orderId, orderRef });
  }, []);

  const confirmAction = useCallback(async () => {
    const { orderId, type } = actionModal;

    setLoadingIds(prev => new Set(prev).add(orderId));

    try {
      const result = await performAction('order', orderId, type);

      if (result.success) {
        // Update local state
        setOrders(prev =>
          prev.map(o =>
            o.id === orderId
              ? {
                  ...o,
                  status:
                    type === 'accept'
                      ? 'Preparing'
                      : type === 'decline'
                      ? 'Cancelled'
                      : type === 'cancel'
                      ? 'Cancelled'
                      : type === 'ship'
                      ? 'Shipped'
                      : type === 'deliver'
                      ? 'Delivered'
                      : o.status,
                }
              : o
          )
        );

        showToast(`Order ${type}ed successfully`, 'success');
        setActionModal({ isOpen: false, type: '', orderId: '', orderRef: '' });
      } else {
        showToast(result.error || `Failed to ${type} order`, 'error');
      }
    } catch (error) {
      showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(orderId);
        return next;
      });
    }
  }, [actionModal, performAction]);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    completed: orders.filter(o => o.status === 'Delivered').length,
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Orders Management</h1>
          <p className="text-slate-600 mb-8">Manage all platform orders and fulfillment</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Orders" value={stats.total.toString()} trend="+12%" icon={<ShoppingCart />} />
            <StatCard title="Pending" value={stats.pending.toString()} trend="+5%" icon={<Clock />} />
            <StatCard title="Completed" value={stats.completed.toString()} trend="+8%" icon={<TrendingUp />} />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Total</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Items</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className={`border-b border-slate-200 hover:bg-slate-50 transition ${loadingIds.has(order.id) ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 font-semibold text-slate-900">{order.id}</td>
                    <td className="px-6 py-4 text-slate-600">{order.customer}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{order.total}</td>
                    <td className="px-6 py-4 text-slate-600">{order.items}</td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4 text-slate-600">{order.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleAction(order.id, 'accept', order.id)}
                              disabled={loadingIds.has(order.id)}
                              className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded hover:bg-green-200 transition disabled:opacity-50"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAction(order.id, 'decline', order.id)}
                              disabled={loadingIds.has(order.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition disabled:opacity-50"
                            >
                              Decline
                            </button>
                          </>
                        )}
                        {order.status === 'Preparing' && (
                          <button
                            onClick={() => handleAction(order.id, 'ship', order.id)}
                            disabled={loadingIds.has(order.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded hover:bg-blue-200 transition disabled:opacity-50"
                          >
                            Ship
                          </button>
                        )}
                        {order.status === 'Shipped' && (
                          <button
                            onClick={() => handleAction(order.id, 'deliver', order.id)}
                            disabled={loadingIds.has(order.id)}
                            className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded hover:bg-green-200 transition disabled:opacity-50"
                          >
                            Deliver
                          </button>
                        )}
                        {(order.status === 'Pending' || order.status === 'Preparing') && (
                          <button
                            onClick={() => handleAction(order.id, 'cancel', order.id)}
                            disabled={loadingIds.has(order.id)}
                            className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition disabled:opacity-50 flex items-center gap-1"
                          >
                            <Trash2 size={12} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: '', orderId: '', orderRef: '' })}
        title={`${actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Order`}
        message={`Are you sure you want to ${actionModal.type} this order?`}
        actionType={actionModal.type}
        itemName={actionModal.orderRef}
        isDangerous={actionModal.type === 'decline' || actionModal.type === 'cancel'}
        onConfirm={confirmAction}
      />

      <Toast open={toastOpen} message={toastMessage} variant={toastType} onClose={() => setToastOpen(false)} />
    </div>
  );
}
