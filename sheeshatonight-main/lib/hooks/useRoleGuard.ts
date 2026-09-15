'use client';

// Middleware for role-based route protection
import { useAuthStore, UserRole } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRoleGuard(allowedRoles: UserRole[]) {
  const router = useRouter();
  const { userRole, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      const roleRoutes: Record<UserRole, string> = {
        CUSTOMER: '/dashboard',
        VENDOR: '/vendor/dashboard',
        ADMIN: '/admin',
        SUPER_ADMIN: '/admin',
      };
      router.push(roleRoutes[userRole] || '/');
    }
  }, [userRole, isLoggedIn, router, allowedRoles]);

  return { isAllowed: allowedRoles.includes(userRole), userRole, isLoggedIn };
}
