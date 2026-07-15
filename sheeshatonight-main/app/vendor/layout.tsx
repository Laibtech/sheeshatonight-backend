'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { VendorDashboardLayout } from '@/components/VendorDashboardLayout';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={['VENDOR']}>
      <VendorDashboardLayout>
        {children}
      </VendorDashboardLayout>
    </ProtectedRoute>
  );
}
