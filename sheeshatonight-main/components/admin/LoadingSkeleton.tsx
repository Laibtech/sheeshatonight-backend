'use client';

import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 5,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-[#E9E3EB] overflow-hidden animate-pulse p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E9E3EB]">
        <div className="h-6 w-48 bg-slate-100 rounded-md" />
        <div className="h-8 w-32 bg-slate-100 rounded-md" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-2">
            {Array.from({ length: cols }).map((_, j) => (
              <div
                key={j}
                className="h-4 bg-slate-100 rounded-sm flex-1"
                style={{ width: `${Math.floor(Math.random() * 40 + 60)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#E9E3EB] p-5 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 w-28 bg-slate-100 rounded-sm" />
        <div className="w-8 h-8 rounded-xl bg-slate-100" />
      </div>
      <div className="h-8 w-36 bg-slate-100 rounded-md" />
      <div className="h-3 w-20 bg-slate-100 rounded-sm" />
    </div>
  );
};
