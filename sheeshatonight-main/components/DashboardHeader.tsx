'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Logo } from './Logo';

interface DashboardHeaderProps {
  title: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title }) => {
  const router = useRouter();

  return (
    <header className="glass sticky top-0 z-40 px-4 py-4 md:px-6 border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition"
            aria-label="Back"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-wide">{title}</h1>
            <p className="text-xs text-amber-600 font-semibold tracking-wider uppercase">Portal</p>
          </div>
        </div>

        <Logo size="sm" />
      </div>
    </header>
  );
};
