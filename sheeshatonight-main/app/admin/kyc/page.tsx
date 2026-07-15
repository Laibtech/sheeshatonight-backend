'use client';

import React, { useState, useEffect } from 'react';
import { Check, X, Shield, FileText, Eye, RefreshCw, Download, AlertCircle } from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

interface Vendor {
  id: string;
  businessName: string;
  businessType: string;
  kycStatus: string;
  kycDocument: string | null;
  createdAt: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export default function AdminKyc() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchPendingVendors = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${BACKEND_URL}/api/admin/vendors/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVendors(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch pending vendors:', error);
      setFeedback({ type: 'error', message: 'Failed to load KYC requests' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVendors();
  }, []);

  const handleVerify = async (vendorId: string, action: 'approve' | 'reject') => {
    setLoadingId(vendorId);
    setFeedback(null);

    try {
      const token = localStorage.getItem('auth_token');
      const endpoint = action === 'approve' 
        ? `${BACKEND_URL}/api/admin/vendors/${vendorId}/approve`
        : `${BACKEND_URL}/api/admin/vendors/${vendorId}/reject`;

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: action === 'reject' ? JSON.stringify({ reason: 'Document verification failed' }) : undefined,
      });

      if (response.ok) {
        setVendors(prev => prev.filter(v => v.id !== vendorId));
        setFeedback({
          type: 'success',
          message: `Vendor ${action === 'approve' ? 'approved' : 'rejected'} successfully`
        });
      } else {
        setFeedback({
          type: 'error',
          message: `Failed to ${action} vendor`
        });
      }
    } catch (error) {
      console.error('Failed to verify vendor:', error);
      setFeedback({
        type: 'error',
        message: 'Network error occurred'
      });
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#D4AF37]/10 rounded-xl">
              <Shield className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">KYC Management</p>
              <h1 className="text-3xl font-black text-slate-900 mt-1">Identity & Licensing Audits</h1>
            </div>
          </div>
          <p className="text-slate-600">Verify merchant trade compliance credentials and age-restriction enforcement approvals</p>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`p-4 rounded-xl mb-6 border ${
            feedback.type === 'success' 
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <p className="text-sm font-semibold">{feedback.message}</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Pending Reviews</p>
                <p className="text-3xl font-black text-slate-900 mt-2">{vendors.length}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <FileText className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Avg. Review Time</p>
                <p className="text-3xl font-black text-slate-900 mt-2">2.4h</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <RefreshCw className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-semibold">Approval Rate</p>
                <p className="text-3xl font-black text-slate-900 mt-2">94%</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Vendor KYC Cards */}
        {vendors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
            <Shield size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">All Caught Up!</h3>
            <p className="text-slate-600">All KYC queues are fully verified and up to date.</p>
            <button
              onClick={() => fetchPendingVendors()}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
            >
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vendors.map((vendor) => (
              <div key={vendor.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">
                      KYC-{vendor.id.slice(0, 8)}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">{vendor.businessName}</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      {vendor.user.firstName} {vendor.user.lastName} • {vendor.user.email}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    {vendor.kycStatus}
                  </span>
                </div>

                {/* Business Info */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">Business Type</p>
                      <p className="text-sm font-bold text-slate-900 mt-1 capitalize">{vendor.businessType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold uppercase">Submitted</p>
                      <p className="text-sm font-bold text-slate-900 mt-1">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Document Preview */}
                {vendor.kycDocument && (
                  <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 font-semibold uppercase">Document</p>
                        <p className="text-sm font-bold text-slate-900 truncate">
                          Trade License & ID Verification
                        </p>
                      </div>
                      <button className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                    <div className="h-32 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition duration-300">
                        <span className="text-xs font-bold text-white uppercase tracking-widest flex items-center gap-1">
                          <Eye size={12} /> View Document
                        </span>
                      </div>
                      <div className="text-center">
                        <FileText size={36} className="text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 font-bold">PDF Document</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleVerify(vendor.id, 'approve')}
                    disabled={loadingId !== null}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
                  >
                    {loadingId === vendor.id ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <>
                        <Check size={18} />
                        Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleVerify(vendor.id, 'reject')}
                    disabled={loadingId !== null}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-red-600 font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loadingId === vendor.id ? (
                      <RefreshCw size={18} className="animate-spin" />
                    ) : (
                      <>
                        <X size={18} />
                        Reject
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
