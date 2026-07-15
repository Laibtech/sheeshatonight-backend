'use client';

import { useRoleGuard } from '@/lib/hooks/useRoleGuard';

type AdminPageProps = {
  params: {
    slug: string[];
  };
};

const formatTitle = (segments: string[]) =>
  segments
    .map((segment) =>
      segment
        .split(/[-_]/g)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    )
    .join(' / ');

export default function AdminFallbackPage({ params }: AdminPageProps) {
  const { isAllowed } = useRoleGuard(['ADMIN']);

  if (!isAllowed) return null;

  const pageTitle = formatTitle(params.slug);

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500 mb-4">Admin Page</p>
        <h1 className="text-4xl font-black text-slate-900 mb-4">{pageTitle}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          This admin route is now available: <span className="font-semibold text-slate-900">/admin/{params.slug.join('/')}</span>.
        </p>
      </div>
    </div>
  );
}
