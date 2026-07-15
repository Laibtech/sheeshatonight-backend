'use client';

import React from 'react';
import { useRoleGuard } from '@/lib/hooks/useRoleGuard';
import type { UserRole } from '@/lib/store';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { isAllowed } = useRoleGuard(allowedRoles);

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
};
