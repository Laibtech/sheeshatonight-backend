'use client';

import React, { useState, useCallback } from 'react';
import { DataTable } from '@/components/DataTable';
import { Package, Plus, Edit3, Trash2 } from 'lucide-react';
import ActionModal from '@/components/ActionModal';
import { useActions } from '@/lib/hooks/useActions';
import { Toast } from '@/components/Toast';

const initialProducts = [
  { id: 'VP-101', name: 'Emerald Sheesha Pack', price: 'AED 360', stock: 18, status: 'Active' },
  { id: 'VP-102', name: 'Gold Hookah Set', price: 'AED 780', stock: 6, status: 'Active' },
  { id: 'VP-103', name: 'Signature Tobacco Blend', price: 'AED 220', stock: 24, status: 'Paused' },
];

export default function VendorProducts() {
  const [products, setProducts] = useState(initialProducts);
  const { performAction } = useActions();
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: 'toggle-active' as any,
    productId: '',
    productName: '',
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

  const handleAction = useCallback((productId: string, action: string, productName: string) => {
    setActionModal({ isOpen: true, type: action, productId, productName });
  }, []);

  const confirmAction = useCallback(async () => {
    const { productId, type } = actionModal;

    setLoadingIds(prev => new Set(prev).add(productId));

    try {
      const result = await performAction('vendor-product', productId, type, 'vendor');

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
                    status: type === 'toggle-active' ? (p.status === 'Active' ? 'Paused' : 'Active') : p.status,
                  }
                : p
            )
          );
        }

        const actionText = type === 'toggle-active' ? 'toggled' : type;
        showToast(`Product ${actionText} successfully`, 'success');
        setActionModal({ isOpen: false, type: '', productId: '', productName: '' });
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
    <>
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Product Management</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Marketplace Inventory</h1>
              <p className="text-slate-600 mt-2">Manage product assets, pricing, and publish status for your vendor store.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold shadow-lg shadow-amber-500/20 transition hover:bg-amber-600">
              <Plus size={18} /> Add Product
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <DataTable
              loadingIds={loadingIds}
              columns={[
                { header: 'SKU', accessor: 'id' },
                { header: 'Product', accessor: 'name' },
                { header: 'Price', accessor: 'price' },
                { header: 'Stock', accessor: 'stock' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold w-fit ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span> },
                {
                  header: 'Actions',
                  render: (row) => (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleAction(row.id, 'toggle-active', row.name)}
                        disabled={loadingIds.has(row.id)}
                        className={`rounded px-3 py-1 text-xs font-semibold transition disabled:opacity-50 ${
                          row.status === 'Active'
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {row.status === 'Active' ? 'Pause' : 'Activate'}
                      </button>
                      <button className="rounded px-3 py-1 bg-blue-100 text-blue-600 text-xs font-semibold hover:bg-blue-200 transition disabled:opacity-50 flex items-center gap-1">
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleAction(row.id, 'delete', row.name)}
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
        onClose={() => setActionModal({ isOpen: false, type: '', productId: '', productName: '' })}
        title={`${actionModal.type === 'toggle-active' ? 'Toggle' : actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Product`}
        message={
          actionModal.type === 'toggle-active'
            ? `Are you sure you want to toggle this product's status?`
            : `Are you sure you want to ${actionModal.type} this product?`
        }
        actionType={actionModal.type}
        itemName={actionModal.productName}
        isDangerous={actionModal.type === 'delete'}
        onConfirm={confirmAction}
      />

      <Toast open={toastOpen} message={toastMessage} variant={toastType} onClose={() => setToastOpen(false)} />
    </>
  );
}
