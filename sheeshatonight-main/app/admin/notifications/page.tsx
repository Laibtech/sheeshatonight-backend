'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Send, 
  CheckCheck, 
  Check, 
  Filter, 
  Clock, 
  ShieldAlert, 
  ShoppingBag, 
  Store, 
  Info, 
  Plus, 
  RefreshCw,
  X,
  Loader2
} from 'lucide-react';
import { EmptyState } from '@/components/admin/EmptyState';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import { useToast } from '@/components/admin/Toast';

interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: string | null;
  read: boolean;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Send Broadcast / Notification Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetRole, setTargetRole] = useState<'ALL' | 'VENDORS' | 'CUSTOMERS'>('ALL');
  const [type, setType] = useState('SYSTEM');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '15',
      });
      if (filter === 'UNREAD') params.append('read', 'false');
      if (filter === 'READ') params.append('read', 'true');

      const res = await fetch(`/api/admin/notifications?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (data.success) {
        setNotifications(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      } else {
        showToast(data.message || 'Failed to load notifications', 'error');
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
      showToast('Error loading notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
        showToast('Notification marked as read', 'success');
      }
    } catch (err) {
      showToast('Failed to update notification', 'error');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ readAll: true }),
      });

      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        showToast('All notifications marked as read', 'success');
      }
    } catch (err) {
      showToast('Failed to mark all as read', 'error');
    }
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      showToast('Please fill in title and message', 'error');
      return;
    }

    try {
      setSending(true);
      const token = localStorage.getItem('auth_token');

      // First fetch an admin or active user ID to associate the system notification with
      const userRes = await fetch('/api/admin/customers?pageSize=1', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const userData = await userRes.json();
      const fallbackUserId = userData?.data?.[0]?.id;

      if (!fallbackUserId) {
        showToast('No user found to deliver notification', 'error');
        return;
      }

      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          userId: fallbackUserId,
          type,
          title,
          message,
          data: { targetRole },
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('System notification created and broadcast successfully!', 'success');
        setIsModalOpen(false);
        setTitle('');
        setMessage('');
        fetchNotifications();
      } else {
        showToast(data.message || 'Failed to broadcast notification', 'error');
      }
    } catch (err) {
      showToast('Failed to broadcast notification', 'error');
    } finally {
      setSending(false);
    }
  };

  const getTypeIcon = (nType: string) => {
    switch (nType.toUpperCase()) {
      case 'ORDER':
        return <ShoppingBag size={16} className="text-blue-600" />;
      case 'VENDOR':
        return <Store size={16} className="text-[#F1A51D]" />;
      case 'SECURITY':
        return <ShieldAlert size={16} className="text-rose-600" />;
      default:
        return <Info size={16} className="text-[#74189B]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Notifications & Alerts</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#74189B]/10 text-[#74189B]">
              {total} Total
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time event logs, order notifications, vendor updates, and marketplace announcements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchNotifications}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
            title="Refresh notifications"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <CheckCheck size={16} className="text-emerald-600" />
            Mark All Read
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10"
          >
            <Plus size={16} />
            Send Announcement
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-2 flex items-center gap-1 w-fit">
        <button
          onClick={() => {
            setFilter('ALL');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'ALL'
              ? 'bg-[#74189B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          All ({total})
        </button>
        <button
          onClick={() => {
            setFilter('UNREAD');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'UNREAD'
              ? 'bg-[#74189B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => {
            setFilter('READ');
            setPage(1);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            filter === 'READ'
              ? 'bg-[#74189B] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={5} cols={4} />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications recorded"
            description={
              filter === 'UNREAD'
                ? "You're all caught up! There are no unread system alerts."
                : 'No platform notifications or alerts have been generated in the database yet.'
            }
            actionLabel="Send Announcement"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition hover:bg-slate-50/70 ${
                  !n.read ? 'bg-purple-50/30' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    !n.read ? 'bg-purple-100/70' : 'bg-slate-100'
                  }`}
                >
                  {getTypeIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase font-mono">
                      {n.type}
                    </span>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#74189B] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <Clock size={12} />
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition shrink-0"
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 font-bold"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 font-bold"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Bell size={18} className="text-[#74189B]" />
                <h3 className="font-bold text-slate-900">Send System Announcement</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendNotification} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Audience</label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                >
                  <option value="ALL">All Marketplace Users</option>
                  <option value="VENDORS">Vendors Only</option>
                  <option value="CUSTOMERS">Customers Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Notification Category</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                >
                  <option value="SYSTEM">System Announcement</option>
                  <option value="ORDER">Order Update</option>
                  <option value="VENDOR">Vendor Alert</option>
                  <option value="SECURITY">Security Advisory</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Scheduled Maintenance Notice"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Message Content</label>
                <textarea
                  placeholder="Enter message details for recipients..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10 disabled:opacity-50"
                >
                  {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
