'use client';

import React from 'react';
import { PackageOpen, Plus } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  actionText?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There are no items matching your criteria in the database.',
  icon: Icon = PackageOpen,
  actionText,
  actionLabel,
  actionHref,
  onAction,
  className = '',
}) => {
  const effectiveActionText = actionText || actionLabel;

  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-[#E9E3EB] ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#FAF8FB] border border-[#E9E3EB] flex items-center justify-center text-[#74189B] mb-4 shadow-xs">
        <Icon className="w-8 h-8 stroke-[1.5]" />
      </div>

      <h3 className="text-base font-bold text-[#29252B] mb-1">{title}</h3>
      <p className="text-xs text-[#716975] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {effectiveActionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#74189B] hover:bg-[#571275] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{effectiveActionText}</span>
        </Link>
      )}

      {effectiveActionText && onAction && !actionHref && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#74189B] hover:bg-[#571275] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{effectiveActionText}</span>
        </button>
      )}

    </div>
  );
};
