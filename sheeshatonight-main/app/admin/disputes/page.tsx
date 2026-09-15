'use client';

import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function AdminDisputesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="p-6 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="w-8 h-8 text-[#D4AF37]" />
            <h1 className="text-3xl font-bold text-slate-900">Disputes & Order Claims</h1>
          </div>
          <p className="text-slate-600">Customer and vendor order dispute resolution center</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Open Disputes</h2>
          <p className="text-slate-600 mb-6">
            The current database schema has no registered Dispute claims recorded.
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 text-sm font-semibold rounded-lg">
            Status: Clear (0 Active Claims)
          </span>
        </div>
      </div>
    </div>
  );
}
