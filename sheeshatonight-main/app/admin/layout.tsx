'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminDashboardLayout } from '@/components/AdminDashboardLayout';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <AdminDashboardLayout>
        {children}
      </AdminDashboardLayout>
    </ProtectedRoute>
  );
}
