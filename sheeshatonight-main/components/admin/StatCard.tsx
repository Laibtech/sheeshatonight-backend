'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  subtitle?: string;
  badge?: string;
  className?: string;
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  badge,
  className = '',
  highlight = false,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition-all duration-200 hover:shadow-md ${
        highlight
          ? 'border-[#74189B]/40 shadow-xs shadow-purple-500/5'
          : 'border-[#E9E3EB]'
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-bold text-[#716975] uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            highlight
              ? 'bg-[#74189B] text-white shadow-xs'
              : 'bg-[#FAF8FB] text-[#74189B] border border-[#E9E3EB]'
          }`}
        >
          <Icon className="w-5 h-5 stroke-[1.8]" />
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-2xl font-black text-[#29252B] tracking-tight">
          {value}
        </h3>

        {(trend || subtitle || badge) && (
          <div className="mt-2 flex items-center gap-2 flex-wrap text-xs">
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 font-bold ${
                  trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                <span>{trend.value}%</span>
              </span>
            )}

            {subtitle && <span className="text-[#8B838E] text-[11px]">{subtitle}</span>}

            {badge && (
              <span className="px-2 py-0.5 rounded-md bg-[#FAF8FB] border border-[#E9E3EB] text-[10px] font-bold text-[#74189B]">
                {badge}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
