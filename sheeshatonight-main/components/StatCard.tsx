import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  icon?: React.ReactNode;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon, description }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">{title}</p>
          <p className="text-3xl font-black text-slate-900 mt-4">{value}</p>
        </div>
        {icon && <div className="text-3xl text-amber-500">{icon}</div>}
      </div>
      {trend && <p className="mt-4 text-sm text-green-600 font-semibold">{trend}</p>}
      {description && <p className="mt-3 text-sm text-slate-500">{description}</p>}
    </div>
  );
};
