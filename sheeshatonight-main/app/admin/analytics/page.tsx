'use client';

import React from 'react';
import { StatCard } from '@/components/StatCard';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';

export default function AdminAnalytics() {
  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Analytics</p>
            <h1 className="text-3xl font-black text-slate-900 mt-3">Platform Insights</h1>
            <p className="text-slate-600 mt-2">Monitor marketplace performance across usage, revenue, and growth metrics.</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <StatCard title="Gross Sales" value="AED 9.2M" trend="+18.4%" icon={<TrendingUp />} />
            <StatCard title="Vendor Adoption" value="12.5K" trend="+10.6%" icon={<BarChart3 />} />
            <StatCard title="Repeat Customers" value="7.8K" trend="+14.1%" icon={<PieChart />} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Revenue Trend</p>
                  <h2 className="text-xl font-bold text-slate-900 mt-3">Weekly Platform Revenue</h2>
                </div>
                <BarChart3 className="text-amber-500" size={24} />
              </div>
              <div className="h-72 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100" />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Marketplace Share</p>
                  <h2 className="text-xl font-bold text-slate-900 mt-3">Category Distribution</h2>
                </div>
                <PieChart className="text-amber-500" size={24} />
              </div>
              <div className="h-72 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200" />
            </div>
          </div>
        </div>
    </div>
  );
}
