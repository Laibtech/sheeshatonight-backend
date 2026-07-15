'use client';

import React, { useState, useCallback } from 'react';
import { DataTable } from '@/components/DataTable';
import { StatCard } from '@/components/StatCard';
import { Users, CheckCircle, UserPlus, Trash2 } from 'lucide-react';
import ActionModal from '@/components/ActionModal';
import { useActions } from '@/lib/hooks/useActions';
import { Toast } from '@/components/Toast';

const initialCustomers = [
  { id: 'C-001', name: 'Yara Al-Farsi', email: 'yara@dubai.ae', location: 'Downtown Dubai', orders: 18, status: 'Active' },
  { id: 'C-002', name: 'Omar Nasser', email: 'omar@uae.ae', location: 'JBR', orders: 6, status: 'Paused' },
  { id: 'C-003', name: 'Nadia Saleh', email: 'nadia@abudhabi.ae', location: 'Abu Dhabi', orders: 32, status: 'Active' },
  { id: 'C-004', name: 'Khalid Bin Zayed', email: 'khalid@shesha.ae', location: 'Sharjah', orders: 12, status: 'Active' },
];

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(initialCustomers);
  const { performAction } = useActions();
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: 'activate' as any,
    customerId: '',
    customerName: '',
  });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loadingIds, setLoadingIds] = useState(new Set<string | number>());
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState('All locations');

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(variant === 'error' ? 'error' : 'success');
    setToastOpen(true);
  };

  const handleAction = useCallback((customerId: string, action: string, customerName: string) => {
    setActionModal({ isOpen: true, type: action, customerId, customerName });
  }, []);

  const confirmAction = useCallback(async () => {
    const { customerId, type } = actionModal;

    setLoadingIds(prev => new Set(prev).add(customerId));

    try {
      const result = await performAction('user', customerId, type, 'admin');

      if (result.success) {
        // Update local state
        if (type === 'delete') {
          setCustomers(prev => prev.filter(c => c.id !== customerId));
        } else {
          setCustomers(prev =>
            prev.map(c =>
              c.id === customerId
                ? {
                    ...c,
                    status: type === 'activate' ? 'Active' : type === 'deactivate' ? 'Paused' : c.status,
                  }
                : c
            )
          );
        }

        showToast(`Customer ${type}d successfully`, 'success');
        setActionModal({ isOpen: false, type: '', customerId: '', customerName: '' });
      } else {
        showToast(result.error || `Failed to ${type} customer`, 'error');
      }
    } catch (error) {
      showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(customerId);
        return next;
      });
    }
  }, [actionModal, performAction]);

  const filteredCustomers = customers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesLocation = locationFilter === 'All locations' || c.location === locationFilter;
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-10">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Customers</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Customer Management</h1>
              <p className="text-slate-600 mt-2">Review customer profiles, engagement and order history across the platform.</p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold shadow-lg shadow-amber-500/20 transition hover:bg-amber-600">
              <UserPlus size={18} /> Add Customer
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Customers" value={customers.length.toString()} trend="+8% this month" icon={<Users />} />
            <StatCard title="Active Profiles" value={customers.filter(c => c.status === 'Active').length.toString()} trend="+12%" icon={<CheckCircle />} />
            <StatCard title="Loyalty Members" value={Math.floor(customers.length * 0.35).toString()} trend="+9%" icon={<UserPlus />} />
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Directory</h2>
                <p className="text-slate-500 mt-1">Filter and segment registered customers by location, status, or spending.</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-inner outline-none focus:border-amber-500"
                />
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-amber-500"
                >
                  <option>All locations</option>
                  <option>Downtown Dubai</option>
                  <option>Abu Dhabi</option>
                  <option>Sharjah</option>
                  <option>JBR</option>
                </select>
              </div>
            </div>

            <DataTable
              loadingIds={loadingIds}
              columns={[
                { header: 'Customer ID', accessor: 'id' },
                { header: 'Name', accessor: 'name' },
                { header: 'Email', accessor: 'email' },
                { header: 'Location', accessor: 'location' },
                { header: 'Orders', accessor: 'orders' },
                { header: 'Status', render: (row) => <span className={`rounded-full px-3 py-1 text-xs font-semibold w-fit ${row.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{row.status}</span> },
                {
                  header: 'Actions',
                  render: (row) => (
                    <div className="flex gap-2 flex-wrap">
                      {row.status === 'Active' && (
                        <button
                          onClick={() => handleAction(row.id, 'deactivate', row.name)}
                          disabled={loadingIds.has(row.id)}
                          className="px-3 py-1 bg-yellow-100 text-yellow-600 text-xs font-semibold rounded hover:bg-yellow-200 transition disabled:opacity-50"
                        >
                          Deactivate
                        </button>
                      )}
                      {row.status === 'Paused' && (
                        <button
                          onClick={() => handleAction(row.id, 'activate', row.name)}
                          disabled={loadingIds.has(row.id)}
                          className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded hover:bg-green-200 transition disabled:opacity-50"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => handleAction(row.id, 'delete', row.name)}
                        disabled={loadingIds.has(row.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition disabled:opacity-50 flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  ),
                },
              ]}
              data={filteredCustomers}
            />
          </div>
        </div>
      </main>

      <ActionModal
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal({ isOpen: false, type: '', customerId: '', customerName: '' })}
        title={`${actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} Customer`}
        message={`Are you sure you want to ${actionModal.type} this customer?`}
        actionType={actionModal.type}
        itemName={actionModal.customerName}
        isDangerous={actionModal.type === 'delete' || actionModal.type === 'deactivate'}
        onConfirm={confirmAction}
      />

      <Toast open={toastOpen} message={toastMessage} variant={toastType} onClose={() => setToastOpen(false)} />
    </div>
  );
}
