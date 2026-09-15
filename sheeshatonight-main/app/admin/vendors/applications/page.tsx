'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { UserCheck, CheckCircle, XCircle, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ApplicationItem {
  id: string;
  name: string;
  tradeLicense?: string;
  isActive: boolean;
  user?: { name: string; email: string };
  createdAt: string;
}

export default function VendorApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/vendors?isActive=false', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/admin/vendors/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: true }),
      });
      const data = await res.json();
      if (data.success) fetchApplications();
    } catch (err) {
      console.error('Failed to approve application:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/vendors" className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Back to All Vendors
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-7 h-7 text-[#D4AF37]" />
            Vendor Registration Applications
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review and approve incoming vendor store registration requests.
          </p>
        </div>
      </div>

      <GlassCard className="p-6 border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Applicant / Store</th>
                <th className="py-3 px-3">Email</th>
                <th className="py-3 px-3">Date Submitted</th>
                <th className="py-3 px-3">License Document</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading pending applications from database...
                  </td>
                </tr>
              ) : applications.length > 0 ? (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{app.name}</td>
                    <td className="py-3 px-3 text-slate-600">{app.user?.email || 'N/A'}</td>
                    <td className="py-3 px-3 text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-3">
                      {app.tradeLicense ? (
                        <a
                          href={app.tradeLicense}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                        >
                          <FileText size={14} /> View License PDF
                        </a>
                      ) : (
                        <span className="text-slate-400">Pending Upload</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(app.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1"
                        >
                          <CheckCircle size={14} /> Approve Store
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No pending vendor applications at this time.
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
