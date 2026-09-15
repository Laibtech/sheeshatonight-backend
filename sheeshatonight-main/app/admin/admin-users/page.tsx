'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Award, ShieldCheck, RefreshCw, UserPlus } from 'lucide-react';
import { Toast } from '@/components/Toast';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    let token = localStorage.getItem('auth_token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match && match[1]) token = decodeURIComponent(match[1]);
    }
    return token || '';
  };

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const res = await fetch('/api/admin/users?role=ADMIN', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setAdminUsers(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Award className="w-7 h-7 text-[#D4AF37]" />
            Administrator Roles & Privileges
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage system administrative accounts, role permissions, and staff credentials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdminUsers}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <GlassCard className="p-6 border-slate-200 bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Active Platform Administrators</h3>
          <span className="text-xs font-bold text-slate-500">
            Total Admins: <span className="text-slate-900 font-black">{adminUsers.length}</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Admin Name</th>
                <th className="py-3 px-3">Email Address</th>
                <th className="py-3 px-3">Role Badge</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading admin accounts...
                  </td>
                </tr>
              ) : adminUsers.length > 0 ? (
                adminUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{user.name}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono">{user.email}</td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                        <ShieldCheck size={12} />
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No administrative accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Toast open={toastOpen} message={toastMessage} variant="success" onClose={() => setToastOpen(false)} />
    </div>
  );
}
