'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/lib/store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

function getInitialAuth(allowedRoles: UserRole[]) {
  if (typeof document === 'undefined') {
    return { isAuthorized: false, isChecking: true };
  }

  try {
    const cookies = document.cookie.split(';').reduce<Record<string, string>>((acc, cookie) => {
      const [rawName, rawValue] = cookie.split('=');
      if (!rawName || !rawValue) return acc;
      try {
        acc[rawName.trim()] = decodeURIComponent(rawValue.trim());
      } catch {
        acc[rawName.trim()] = rawValue.trim();
      }
      return acc;
    }, {});

    const role = (cookies.user_role as UserRole) || (localStorage.getItem('user_role') as UserRole);
    const token = localStorage.getItem('auth_token') || cookies.auth_token;

    if (token && role && allowedRoles.includes(role)) {
      return { isAuthorized: true, isChecking: false };
    }
  } catch {
    // Ignore storage/cookie parsing errors
  }

  return { isAuthorized: false, isChecking: true };
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const rolesKey = allowedRoles.join(',');

  useEffect(() => {
    let isMounted = true;
    setMounted(true);

    const verifyAccess = async () => {
      try {
        const initial = getInitialAuth(allowedRoles);
        if (initial.isAuthorized) {
          if (isMounted) {
            setIsAuthorized(true);
            setIsChecking(false);
          }
          return;
        }

        const parseCookies = () => {
          if (typeof document === 'undefined') return {};
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
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const token = storedToken || cookies.auth_token || null;
        let currentRole = cookies.user_role as UserRole | undefined;

        // Verify with server API /api/auth/me to get authoritative database user role
        const headers: Record<string, string> = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/auth/me', { headers, cache: 'no-store' });

        if (res.ok) {
          const resData = await res.json();
          const serverUser = resData.data || resData.user;
          if (serverUser && serverUser.role) {
            currentRole = serverUser.role as UserRole;
            // Sync cookie and localStorage for client middleware
            if (typeof window !== 'undefined') {
              if (token) {
                localStorage.setItem('auth_token', token);
                document.cookie = `auth_token=${encodeURIComponent(token)}; path=/; max-age=604800;`;
              }
              localStorage.setItem('user_role', currentRole);
              document.cookie = `user_role=${encodeURIComponent(currentRole)}; path=/; max-age=604800;`;
              document.cookie = `user_email=${encodeURIComponent(serverUser.email)}; path=/; max-age=604800;`;
              document.cookie = `user_name=${encodeURIComponent(serverUser.name || 'User')}; path=/; max-age=604800;`;
            }
          }
        } else if (!currentRole && !token) {
          // Unauthenticated
          if (isMounted) {
            setIsChecking(false);
            setIsAuthorized(false);
            router.replace('/auth/login');
          }
          return;
        }

        // Fallback check against cookie/localStorage if server call didn't return
        if (!currentRole && cookies.user_role) {
          currentRole = cookies.user_role as UserRole;
        }

        if (!currentRole) {
          if (isMounted) {
            setIsChecking(false);
            setIsAuthorized(false);
            router.replace('/auth/login');
          }
          return;
        }

        // Check if role is allowed
        if (!allowedRoles.includes(currentRole)) {
          const roleRoutes: Record<string, string> = {
            CUSTOMER: '/dashboard',
            VENDOR: '/vendor',
            ADMIN: '/admin',
            SUPER_ADMIN: '/admin',
          };
          if (isMounted) {
            setIsChecking(false);
            setIsAuthorized(false);
            router.replace(roleRoutes[currentRole] || '/');
          }
          return;
        }

        // Authorization success
        if (isMounted) {
          setIsAuthorized(true);
          setIsChecking(false);
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        // If not already authorized optimistically, redirect to login
        if (isMounted && !isAuthorized) {
          setIsChecking(false);
          router.replace('/auth/login');
        }
      }
    };

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, [router, rolesKey, isAuthorized]);

  if (!mounted || (isChecking && !isAuthorized)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#74189B] animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-semibold tracking-wide uppercase">Opening Page...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
