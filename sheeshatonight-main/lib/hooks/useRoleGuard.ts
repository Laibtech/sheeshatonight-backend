'use client';

// Middleware for role-based route protection
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useRoleGuard(allowedRoles: ('CUSTOMER' | 'VENDOR' | 'ADMIN')[]) {
  const router = useRouter();
  const { userRole, isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    if (!allowedRoles.includes(userRole)) {
      const roleRoutes = {
        CUSTOMER: '/dashboard',
        VENDOR: '/vendor/dashboard',
        ADMIN: '/admin/dashboard',
      };
      router.push(roleRoutes[userRole]);
    }
  }, [userRole, isLoggedIn, router, allowedRoles]);

  return { isAllowed: allowedRoles.includes(userRole), userRole, isLoggedIn };
}
