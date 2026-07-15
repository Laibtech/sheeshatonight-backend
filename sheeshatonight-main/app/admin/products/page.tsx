'use client';

import React, { useState, useCallback } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatCard } from '@/components/StatCard';
import { ShieldCheck, Tag, Database, Trash2 } from 'lucide-react';
import ActionModal from '@/components/ActionModal';
import { useActions } from '@/lib/hooks/useActions';
import { Toast } from '@/components/Toast';

const initialProducts = [
  { id: 'P-001', title: 'Luxury Sheesha Setup', vendor: 'Bespoke Sheesha', category: 'Premium', price: 'AED 450', status: 'Pending' },
  { id: 'P-002', title: 'Turkish Tobacco Pack', vendor: 'The Ember Room', category: 'Flavors', price: 'AED 120', status: 'Approved' },
  { id: 'P-003', title: 'Gold Hookah Kit', vendor: 'Luxury Lounge', category: 'Equipment', price: 'AED 780', status: 'Pending' },
];

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const { performAction } = useActions();
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: 'approve' as any,
    productId: '',
    productTitle: '',
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loadingIds, setLoadingIds] = useState(new Set<string | number>());

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(variant === 'error' ? 'error' : 'success');
    setToastOpen(true);
  };

  const handleAction = useCallback((productId: string, action: string, title: string) => {
    setActionModal({ isOpen: true, type: action, productId, productTitle: title });
  }, []);

  const confirmAction = useCallback(async () => {
    const { productId, type } = actionModal;

    setLoadingIds(prev => new Set(prev).add(productId));

    try {
      const result = await performAction('product', productId, type, 'admin');

      if (result.success) {
        // Update local state
        if (type === 'delete') {
          setProducts(prev => prev.filter(p => p.id !== productId));
        } else {
          setProducts(prev =>
            prev.map(p =>
              p.id === productId
                ? {
                    ...p,
                    status: type === 'approve' ? 'Approved' : type === 'reject' ? 'Rejected' : p.status,
                  }
                : p
            )
          );
        }

        showToast(`Product ${type}d successfully`, 'success');
        setActionModal({ isOpen: false, type: '', productId: '', productTitle: '' });
      } else {
        showToast(result.error || `Failed to ${type} product`, 'error');
      }
    } catch (error) {
      showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, [actionModal, performAction]);

  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Product Approval</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Review New Marketplace Products</h1>
              <p className="text-slate-600 mt-2">Approve inventory submissions from vendor partners and manage product metadata.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
              <ShieldCheck size={18} /> Review Pending
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Submitted" value={products.length.toString()} trend="+14%" icon={<Tag />} />
            <StatCard title="Approved" value={products.filter(p => p.status === 'Approved').length.toString()} trend="+9%" icon={<ShieldCheck />} />
            <StatCard title="Pending Review" value={products.filter(p => p.status === 'Pending').length.toString()} trend="+6%" icon={<Database />} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <DataTable
              loadingIds={loadingIds}
              columns={[
                { header: 'Product ID', accessor: 'id' },
                { header: 'Title', accessor: 'title' },
                { header: 'Vendor', accessor: 'vendor' },
                { header: 'Category', accessor: 'category' },
                { header: 'Price', accessor: 'price' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold w-fit ${row.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : row.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{row.status}</span> },
                {
                  header: 'Actions',
                  render: (row) => (
                    <div className="flex gap-2 flex-wrap">
                      {row.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleAction(row.id, 'approve', row.title)}
                            disabled={loadingIds.has(row.id)}
                            className="rounded px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold hover:bg-green-200 transition disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleAction(row.id, 'reject', row.title)}
                            disabled={loadingIds.has(row.id)}
                            className="rounded px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {row.status === 'Approved' && (
                        <button
                          onClick={() => handleAction(row.id, 'feature', row.title)}
                          disabled={loadingIds.has(row.id)}
                          className="rounded px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold hover:bg-blue-200 transition disabled:opacity-50"
                        >
                          Feature
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(row.id, 'delete', row.title)}
                        disabled={loadingIds.has(row.id)}
                        className="rounded px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold hover:bg-red-200 transition disabled:opacity-50 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              data={products}
            />
          </div>
        </div>
      </main>

      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: '', productId: '', productTitle: '' })}
        title={`${actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Product`}
        message={`Are you sure you want to ${actionModal.type} this product?`}
        actionType={actionModal.type}
        itemName={actionModal.productTitle}
        isDangerous={actionModal.type === 'reject' || actionModal.type === 'delete'}
        onConfirm={confirmAction}
      />

      <Toast open={toastOpen} message={toastMessage} variant={toastType} onClose={() => setToastOpen(false)} />
    </div>
  );
}
