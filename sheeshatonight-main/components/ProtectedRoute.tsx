'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/lib/store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const router = useRouter();
  const { isLoggedIn, userRole } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check authentication on client side
    const token = localStorage.getItem('auth_token');
    const parseCookies = () => {
      return document.cookie.split(';').reduce<Record<string, string>>((acc, cookie) => {
        const [rawName, rawValue] = cookie.split('=');
        if (!rawName || !rawValue) return acc;
        try {
          acc[rawName.trim()] = decodeURIComponent(rawValue.trim());
        } catch {
          acc[rawName.trim()] = rawValue.trim();
        }
        return acc;
      }, {});
    };

    const cookies = parseCookies();

    // Not logged in - redirect to login
    if (!token || !cookies.user_role) {
      router.push('/auth/login');
      return;
    }

    // Logged in but wrong role - redirect to correct dashboard
    const currentRole = cookies.user_role as UserRole;
    if (!allowedRoles.includes(currentRole)) {
      const roleRoutes: Record<UserRole, string> = {
        CUSTOMER: '/dashboard',
        VENDOR: '/vendor',
        ADMIN: '/admin',
      };
      router.push(roleRoutes[currentRole]);
      return;
    }

    setIsChecking(false);
  }, [router, allowedRoles, isLoggedIn, userRole]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
