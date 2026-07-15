'use client';

import React, { useEffect, useState } from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import { DashboardHeader } from '@/components/DashboardHeader';
import { GlassCard } from '@/components/GlassCard';
import { api } from '@/lib/api';
import { 
  Users, Store, DollarSign, ArrowUpRight, 
  Activity, Clock, AlertCircle, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { isAllowed } = useRoleGuard(['ADMIN']);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAllowed) return;
    setLoading(true);
    api.admin.getPendingVendors()
      .then((res) => {
        if (res.success) {
          setPendingCount(res.data.length);
        }
      })
      .catch((err) => {
        console.error('Error fetching pending count', err);
        setError('Failed to fetch real-time pending KYC counts.');
      })
      .finally(() => setLoading(false));
  }, [isAllowed]);

  if (!isAllowed) {
    return null;
  }

  const stats = [
    { label: 'Total Platform Users', value: '1,582', change: '+12% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { label: 'Active Vendors', value: '342', change: '+8% this month', icon: Store, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { label: 'Platform Revenue', value: 'AED 2.4M', change: '+15% this month', icon: DollarSign, color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
    { label: 'Pending KYC Checks', value: loading ? '...' : pendingCount.toString(), change: 'Requires review', icon: ShieldCheck, color: 'text-red-650', bg: 'bg-red-50 border-red-200' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <DashboardHeader title="Admin Workspace" />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Platform Analytics</h2>
            <p className="text-slate-500 text-sm mt-1">Real-time marketplace oversight, verification queues, and performance</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>API Gateway Node Active</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={idx} className="border-slate-200 bg-white/40 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</span>
                    <div className={`p-2.5 rounded-xl border ${stat.color} ${stat.bg}`}>
                      <Icon size={16} />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
                <p className="text-xs text-slate-500 mt-4 font-semibold">{stat.change}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Quick Actions Panel */}
          <GlassCard className="lg:col-span-2 p-6 border-slate-205 bg-white/40 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-amber-600" />
                Oversight Queues
              </h3>
              <span className="text-xs text-slate-400">Awaiting Action</span>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/60 border border-slate-200 rounded-2xl shadow-sm">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Vendor Registration Verification</p>
                  <p className="text-xs text-slate-500">{loading ? 'Loading...' : `${pendingCount} vendors in validation queue`}</p>
                </div>
                <Link 
                  href="/admin/vendors"
                  className="px-4 py-2 bg-slate-100 border border-slate-200 text-amber-700 font-bold hover:bg-slate-200 hover:text-amber-800 rounded-xl text-xs transition flex items-center gap-1"
                >
                  Verify Now
                  <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/60 border border-slate-200 rounded-2xl shadow-sm">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-900">Tobacco Licensing KYC Reviews</p>
                  <p className="text-xs text-slate-500">Requires regulatory age-gate auditing</p>
                </div>
                <Link 
                  href="/admin/kyc"
                  className="px-4 py-2 bg-slate-100 border border-slate-200 text-amber-700 font-bold hover:bg-slate-200 hover:text-amber-800 rounded-xl text-xs transition flex items-center gap-1"
                >
                  Audit KYC
                  <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* Quick Logs Panel */}
          <GlassCard className="p-6 border-slate-205 bg-white/40 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock size={18} className="text-amber-600" />
              Live Operations
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-slate-900">Vendor Approved</p>
                  <p className="text-slate-500 mt-0.5">Bespoke Sheesha Co. status changed to APPROVED</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-slate-900">New Checkout Placed</p>
                  <p className="text-slate-500 mt-0.5">User user_123 checked out order ORD-2026-905</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-slate-900">Age verification check</p>
                  <p className="text-slate-500 mt-0.5">Audit log node verified session check client request</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

      </main>
    </div>
  );
}

