'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  RefreshCw, 
  Clock, 
  User, 
  Activity, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  X,
  Laptop,
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { EmptyState } from '@/components/admin/EmptyState';
import { TableSkeleton } from '@/components/admin/LoadingSkeleton';
import { useToast } from '@/components/admin/Toast';

interface AuditLogEntry {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  beforeState: string | null;
  afterState: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export default function AdminAuditLogsPage() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Selected Log Detail Modal
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, resourceFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });
      if (actionFilter) params.append('action', actionFilter);
      if (resourceFilter) params.append('resourceType', resourceFilter);

      const response = await fetch(`/api/admin/audit-logs?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }

      const data = await response.json();
      if (data.success) {
        setLogs(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotal(data.pagination?.total || 0);
      } else {
        showToast(data.message || 'Failed to load audit trail', 'error');
      }
    } catch (err: any) {
      console.error('Error fetching audit logs:', err);
      showToast(err.message || 'Failed to load audit logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes('DELETE')) {
      return 'bg-rose-50 text-rose-700 border-rose-200';
    }
    if (act.includes('CREATE') || act.includes('INSERT')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (act.includes('UPDATE') || act.includes('STATUS')) {
      return 'bg-purple-50 text-[#74189B] border-purple-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Logs & Security Trail</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#74189B]/10 text-[#74189B]">
              {total} Events
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Immutable log of administrative operations, catalog changes, order updates, and status modifications.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition shadow-xs disabled:opacity-50"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh Trail
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter By:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-auto flex-1 max-w-lg">
          <select
            value={actionFilter}
            onChange={(e) => {
              setActionFilter(e.target.value);
              setPage(1);
            }}
            className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
          >
            <option value="">All Actions</option>
            <option value="CREATE_PRODUCT">CREATE_PRODUCT</option>
            <option value="UPDATE_PRODUCT">UPDATE_PRODUCT</option>
            <option value="DELETE_PRODUCT">DELETE_PRODUCT</option>
            <option value="UPDATE_ORDER_STATUS">UPDATE_ORDER_STATUS</option>
            <option value="APPROVE_VENDOR">APPROVE_VENDOR</option>
            <option value="UPDATE_USER_ROLE">UPDATE_USER_ROLE</option>
          </select>

          <select
            value={resourceFilter}
            onChange={(e) => {
              setResourceFilter(e.target.value);
              setPage(1);
            }}
            className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
          >
            <option value="">All Resource Types</option>
            <option value="Order">Order</option>
            <option value="Product">Product</option>
            <option value="Vendor">Vendor</option>
            <option value="User">User</option>
            <option value="Category">Category</option>
            <option value="CMS">CMS</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-6">
            <TableSkeleton rows={6} cols={5} />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState
            title="No audit events logged"
            description={
              actionFilter || resourceFilter
                ? 'No log entries match the selected filters.'
                : 'No administrative security events have been logged yet.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-5">Admin / Initiator</th>
                  <th className="py-3.5 px-5">Action</th>
                  <th className="py-3.5 px-5">Resource Type</th>
                  <th className="py-3.5 px-5">Resource ID</th>
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#74189B] flex items-center justify-center font-bold shrink-0">
                          {log.user?.name ? log.user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{log.user?.name || 'Admin User'}</p>
                          <p className="text-[11px] text-slate-400">{log.user?.email || log.userId}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold font-mono border ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-5 font-bold text-slate-700 capitalize">
                      {log.resourceType}
                    </td>

                    <td className="py-4 px-5 font-mono text-[11px] text-slate-500">
                      {log.resourceId ? `${log.resourceId.substring(0, 12)}...` : 'N/A'}
                    </td>

                    <td className="py-4 px-5 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-slate-400" />
                        <span>{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-2 rounded-lg text-slate-500 hover:text-[#74189B] hover:bg-purple-50 transition"
                        title="View Full Payload & Details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {page} of {totalPages} ({total} total entries)
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

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-[#74189B]" />
                <h3 className="font-bold text-slate-900">Audit Trail Event Detail</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400 font-bold uppercase">Initiator</p>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedLog.user?.name}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{selectedLog.user?.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase">Action</p>
                  <p className="font-mono font-bold text-[#74189B] mt-0.5">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase">Resource</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedLog.resourceType} ({selectedLog.resourceId || 'N/A'})</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase">Logged At</p>
                  <p className="font-bold text-slate-800 mt-0.5">{new Date(selectedLog.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Client Environment Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <p className="text-slate-400 font-bold uppercase">Network & Client Metadata</p>
                <p className="text-slate-700">
                  <span className="font-bold">IP Address:</span> <code className="font-mono">{selectedLog.ipAddress || '127.0.0.1'}</code>
                </p>
                <p className="text-slate-700">
                  <span className="font-bold">User Agent:</span> <span className="font-mono text-[11px] text-slate-500 break-all">{selectedLog.userAgent || 'Mozilla/5.0'}</span>
                </p>
              </div>

              {/* Before vs After States */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileCode2 size={16} className="text-[#74189B]" />
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">State Payload Snapshot</h4>
                </div>

                {selectedLog.beforeState && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Previous State (Before)</label>
                    <pre className="p-3 bg-slate-900 text-amber-400 rounded-xl text-xs font-mono overflow-x-auto max-h-48">
                      {selectedLog.beforeState}
                    </pre>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Resulting State (After)</label>
                  <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto max-h-48">
                    {selectedLog.afterState || JSON.stringify({ action: selectedLog.action, resourceId: selectedLog.resourceId, status: 'EXECUTED' }, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2 rounded-xl font-bold text-xs bg-slate-900 text-white hover:bg-slate-800 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
