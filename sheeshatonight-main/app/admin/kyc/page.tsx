'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/GlassCard';
import { ShieldCheck, FileText, CheckCircle, XCircle } from 'lucide-react';

interface KycItem {
  id: string;
  name: string;
  user?: { email: string };
  tradeLicense?: string;
  createdAt: string;
}

export default function AdminKycPage() {
  const [kycQueue, setKycQueue] = useState<KycItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKycQueue();
  }, []);

  const fetchKycQueue = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/vendors?isActive=false', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setKycQueue(data.data);
      }
    } catch (err) {
      console.error('Error fetching KYC queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveKyc = async (id: string) => {
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
      if (data.success) fetchKycQueue();
    } catch (err) {
      console.error('Failed to approve KYC:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />
          Regulatory Tobacco Licensing & KYC Audit Queue
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Audit trade licenses, passports, and age-verification compliance for UAE vendors.
        </p>
      </div>

      <GlassCard className="p-6 border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Vendor / Entity</th>
                <th className="py-3 px-3">Contact Email</th>
                <th className="py-3 px-3">Documents</th>
                <th className="py-3 px-3">Verification Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Loading KYC verification queue...
                  </td>
                </tr>
              ) : kycQueue.length > 0 ? (
                kycQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-3 text-slate-600">{item.user?.email || 'N/A'}</td>
                    <td className="py-3 px-3">
                      {item.tradeLicense ? (
                        <a
                          href={item.tradeLicense}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                        >
                          <FileText size={14} /> Trade License PDF
                        </a>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold">
                          Pending License Upload
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        Pending Audit
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleApproveKyc(item.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1 ml-auto"
                      >
                        <CheckCircle size={14} /> Pass Verification
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No pending KYC audits in queue.
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
