'use client';

import React, { useState, useCallback } from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { Check, X, Clock, Store, User, Trash2 } from 'lucide-react';
import ActionModal from '@/components/ActionModal';
import { useActions } from '@/lib/hooks/useActions';
import { Toast } from '@/components/Toast';

export default function AdminVendors() {
  const { isAllowed } = useRoleGuard(['ADMIN']);
  const { performAction } = useActions();
  const [vendors, setVendors] = useState([
    { id: '1', name: 'Bespoke Sheesha', owner: 'Ahmed Al-Khaleej', status: 'Verified', orders: 342, rating: 4.8 },
    { id: '2', name: 'Luxury Lounge', owner: 'Fatima Hassan', status: 'Verified', orders: 287, rating: 4.9 },
    { id: '3', name: 'The Ember Room', owner: 'Mohammed Khan', status: 'Pending', orders: 0, rating: 0 },
  ]);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: 'approve' as any,
    vendorId: '',
    vendorName: '',
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loadingIds, setLoadingIds] = useState(new Set<string | number>());

  const getStatusBadge = (status: string) => {
    if (status === 'Verified') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit"><Check size={12} />Verified</span>;
    }
    if (status === 'Pending') {
      return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit"><Clock size={12} />Pending</span>;
    }
    return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit"><X size={12} />Rejected</span>;
  };

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(variant === 'error' ? 'error' : 'success');
    setToastOpen(true);
  };

  const handleAction = useCallback(async (vendorId: string, action: string, vendorName: string) => {
    setActionModal({ isOpen: true, type: action, vendorId, vendorName });
  }, []);

  const confirmAction = useCallback(async () => {
    const { vendorId, type } = actionModal;
    
    setLoadingIds(prev => new Set(prev).add(vendorId));

    try {
      const result = await performAction('vendor', vendorId, type, 'admin');

      if (result.success) {
        // Update local state
        setVendors(prev =>
          prev.map(v =>
            v.id === vendorId
              ? {
                  ...v,
                  status:
                    type === 'approve'
                      ? 'Verified'
                      : type === 'reject'
                      ? 'Rejected'
                      : type === 'activate'
                      ? 'Verified'
                      : 'Inactive',
                }
              : v
          )
        );

        showToast(`Vendor ${type}d successfully`, 'success');
        setActionModal({ isOpen: false, type: '', vendorId: '', vendorName: '' });
      } else {
        showToast(result.error || `Failed to ${type} vendor`, 'error');
      }
    } catch (error) {
      showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(vendorId);
        return next;
      });
    }
  }, [actionModal, performAction]);

  if (!isAllowed) return null;

  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Vendors Management</h1>
          <p className="text-slate-600 mb-8">Manage vendor accounts and approvals</p>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Vendor Name</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Owner</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Orders</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Rating</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className={`border-b border-slate-200 hover:bg-slate-50 transition ${loadingIds.has(vendor.id) ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                      <Store size={16} className="text-amber-600" />
                      {vendor.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                      <User size={14} />
                      {vendor.owner}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(vendor.status)}</td>
                    <td className="px-6 py-4 font-semibold text-slate-900">{vendor.orders}</td>
                    <td className="px-6 py-4 font-semibold text-amber-600">{vendor.rating || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 flex-wrap">
                        {vendor.status === 'Verified' && (
                          <>
                            <button
                              onClick={() => handleAction(vendor.id.toString(), 'deactivate', vendor.name)}
                              disabled={loadingIds.has(vendor.id)}
                              className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-semibold rounded hover:bg-yellow-200 transition disabled:opacity-50"
                            >
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleAction(vendor.id.toString(), 'delete', vendor.name)}
                              disabled={loadingIds.has(vendor.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition disabled:opacity-50 flex items-center gap-1"
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </>
                        )}
                        {vendor.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleAction(vendor.id.toString(), 'approve', vendor.name)}
                              disabled={loadingIds.has(vendor.id)}
                              className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded hover:bg-green-200 transition disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAction(vendor.id.toString(), 'reject', vendor.name)}
                              disabled={loadingIds.has(vendor.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {vendor.status === 'Rejected' && (
                          <button
                            onClick={() => handleAction(vendor.id.toString(), 'activate', vendor.name)}
                            disabled={loadingIds.has(vendor.id)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded hover:bg-blue-200 transition disabled:opacity-50"
                          >
                            Reactivate
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
        onClose={() => setActionModal({ isOpen: false, type: '', vendorId: '', vendorName: '' })}
        title={`${actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Vendor`}
        message={`Are you sure you want to ${actionModal.type} this vendor?`}
        actionType={actionModal.type}
        itemName={actionModal.vendorName}
        isDangerous={actionModal.type === 'reject' || actionModal.type === 'delete' || actionModal.type === 'deactivate'}
        onConfirm={confirmAction}
      />

      <Toast open={toastOpen} message={toastMessage} variant={toastType} onClose={() => setToastOpen(false)} />
    </div>
  );
}
