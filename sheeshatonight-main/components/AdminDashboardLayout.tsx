'use client';

import React from 'react';
import { AdminLayout } from './admin/AdminLayout';

export const AdminDashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default AdminDashboardLayout;
