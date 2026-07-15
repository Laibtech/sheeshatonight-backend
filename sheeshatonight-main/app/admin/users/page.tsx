'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { Check, X, Lock, Unlock, Trash2, Mail, Phone } from 'lucide-react';
import ActionModal from '@/components/ActionModal';
import { useActions } from '@/lib/hooks/useActions';
import { Toast } from '@/components/Toast';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  phone?: string;
  createdAt?: string;
}

export default function AdminUsers() {
  const { isAllowed } = useRoleGuard(['ADMIN']);
  const { performAction } = useActions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    type: 'suspend' as any,
    userId: '',
    userName: '',
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');
  const [loadingIds, setLoadingIds] = useState(new Set<string>());

  // Fetch users
  useEffect(() => {
    if (!isAllowed) return;
    
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.data || []);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch users';
        setError(message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAllowed]);

  const getStatusBadge = (status: string) => {
    if (status === 'ACTIVE') {
      return <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit"><Check size={12} />Active</span>;
    }
    if (status === 'SUSPENDED') {
      return <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit"><Lock size={12} />Suspended</span>;
    }
    return <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1 w-fit"><X size={12} />Inactive</span>;
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-700',
      VENDOR: 'bg-amber-100 text-amber-700',
      CUSTOMER: 'bg-blue-100 text-blue-700',
    };
    return <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors[role] || 'bg-gray-100 text-gray-700'}`}>{role}</span>;
  };

  const showToast = (message: string, variant: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(variant === 'error' ? 'error' : 'success');
    setToastOpen(true);
  };

  const handleAction = useCallback(async (userId: string, action: string, userName: string) => {
    setActionModal({ isOpen: true, type: action, userId, userName });
  }, []);

  const confirmAction = useCallback(async () => {
    const { userId, type } = actionModal;
    
    setLoadingIds(prev => new Set(prev).add(userId));

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('auth_token') : ''}`,
        },
        body: JSON.stringify({
          status: type === 'activate' ? 'ACTIVE' : type === 'suspend' ? 'SUSPENDED' : 'INACTIVE',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      const result = await response.json();

      if (result.success) {
        // Update local state
        setUsers(prev =>
          prev.map(u =>
            u.id === userId
              ? {
                  ...u,
                  status:
                    type === 'activate'
                      ? 'ACTIVE'
                      : type === 'suspend'
                      ? 'SUSPENDED'
                      : 'INACTIVE',
                }
              : u
          )
        );

        showToast(`User ${type}d successfully`, 'success');
        setActionModal({ isOpen: false, type: '', userId: '', userName: '' });
      } else {
        showToast(result.message || `Failed to ${type} user`, 'error');
      }
    } catch (error) {
      showToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  }, [actionModal]);

  if (!isAllowed) return null;

  if (loading) {
    return (
      <div className="flex h-screen bg-slate-50">
        <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="text-center py-12">
              <p className="text-slate-500">Loading users...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-slate-50">
        <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
          <div className="p-6 max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto lg:ml-64 pt-20 lg:pt-0">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Users Management</h1>
          <p className="text-slate-600 mb-8">Manage platform users and their access</p>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            {users.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-slate-500">No users found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600">Email</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600">Role</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600">Joined</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={`border-b border-slate-200 hover:bg-slate-50 transition ${loadingIds.has(user.id) ? 'opacity-60' : ''}`}>
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="px-6 py-4 text-slate-600 flex items-center gap-2">
                        <Mail size={14} className="text-slate-400" />
                        {user.email}
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                      <td className="px-6 py-4 text-slate-600">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {user.status === 'ACTIVE' && (
                            <button
                              onClick={() => handleAction(user.id, 'suspend', `${user.firstName} ${user.lastName}`)}
                              disabled={loadingIds.has(user.id)}
                              className="px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded hover:bg-red-200 transition disabled:opacity-50 flex items-center gap-1"
                            >
                              <Lock size={12} /> Suspend
                            </button>
                          )}
                          {user.status === 'SUSPENDED' && (
                            <button
                              onClick={() => handleAction(user.id, 'activate', `${user.firstName} ${user.lastName}`)}
                              disabled={loadingIds.has(user.id)}
                              className="px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded hover:bg-green-200 transition disabled:opacity-50 flex items-center gap-1"
                            >
                              <Unlock size={12} /> Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      <ActionModal
        isOpen={actionModal.isOpen}
        title={`${actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)} User`}
        message={`Are you sure you want to ${actionModal.type} ${actionModal.userName}?`}
        confirmText={actionModal.type.charAt(0).toUpperCase() + actionModal.type.slice(1)}
        onConfirm={confirmAction}
        onCancel={() => setActionModal({ isOpen: false, type: '', userId: '', userName: '' })}
        variant={actionModal.type === 'delete' ? 'destructive' : 'primary'}
      />

      <Toast
        isOpen={toastOpen}
        message={toastMessage}
        type={toastType}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
}
