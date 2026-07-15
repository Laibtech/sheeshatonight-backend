'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { UnifiedDashboardLayout } from '@/components/UnifiedDashboardLayout';

export default function CustomerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['CUSTOMER']}>
      <UnifiedDashboardLayout>
        {children}
      </UnifiedDashboardLayout>
    </ProtectedRoute>
  );
}
