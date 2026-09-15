'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { Activity, Search, Shield } from 'lucide-react';

interface AuditItem {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  createdAt: string;
}

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setLogs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="w-7 h-7 text-[#D4AF37]" />
          System Activity & Security Audit Logs
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track administrative actions, vendor status updates, product edits, and authorization events in MySQL.
        </p>
      </div>

      <GlassCard className="p-6 border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Action</th>
                <th className="py-3 px-3">Resource Type</th>
                <th className="py-3 px-3">User ID</th>
                <th className="py-3 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Loading audit logs from database...
                  </td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{log.action}</td>
                    <td className="py-3 px-3 font-mono text-purple-700">{log.resourceType}</td>
                    <td className="py-3 px-3 text-slate-600 font-mono">{log.userId}</td>
                    <td className="py-3 px-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No activity logs recorded in database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
