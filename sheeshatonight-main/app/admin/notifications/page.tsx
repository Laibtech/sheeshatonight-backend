'use client';

import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Trash2, RefreshCw, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: any;
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${BACKEND_URL}/api/notifications?limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${BACKEND_URL}/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map((notice) => 
        notice.id === id ? { ...notice, read: true } : notice
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${BACKEND_URL}/api/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map((notice) => ({ ...notice, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`${BACKEND_URL}/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.filter((notice) => notice.id !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ORDER':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'PAYMENT':
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
      case 'SYSTEM':
        return <Bell className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Notifications</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Admin Alerts</h1>
              <p className="text-slate-600 mt-2">
                Stay on top of marketplace events and platform updates. 
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={fetchNotifications}
                className="inline-flex items-center gap-2 rounded-3xl bg-slate-200 px-5 py-3 text-slate-700 font-semibold shadow-lg shadow-slate-900/10 transition hover:bg-slate-300"
              >
                <RefreshCw size={18} /> Refresh
              </button>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-white font-semibold shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                >
                  <Bell size={18} /> Mark all read
                </button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
              <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No notifications yet</h3>
              <p className="text-slate-600">You're all caught up! We'll notify you when something important happens.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notice) => (
                <div 
                  key={notice.id} 
                  className={`rounded-3xl border p-6 shadow-sm transition-all ${
                    !notice.read 
                      ? 'border-amber-300 bg-amber-50/50 shadow-amber-100' 
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notice.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{notice.title}</p>
                          <p className="text-sm text-slate-600 mt-1">{notice.message}</p>
                          <p className="text-xs text-slate-400 mt-2">{formatTime(notice.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notice.read && (
                            <button
                              onClick={() => markAsRead(notice.id)}
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition whitespace-nowrap"
                            >
                              Mark read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notice.id)}
                            className="p-2 rounded-full hover:bg-red-50 text-red-600 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
