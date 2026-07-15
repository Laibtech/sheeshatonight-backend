'use client';

import { useEffect } from 'react';
import { useAuthStore, type UserRole, type ViewScreen } from '@/lib/store';

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

export const AuthHydration: React.FC = () => {
  const { setLoggedIn, setUserRole, setUserData, setCurrentScreen, setRegion } = useAuthStore();

  useEffect(() => {
    const cookies = parseCookies();
    if (cookies.user_logged_in !== 'true') return;

    const role = (cookies.user_role as UserRole) || 'CUSTOMER';
    const email = cookies.user_email || '';
    const name = cookies.user_name || 'Guest User';
    const region = cookies.user_region || 'Dubai, UAE';

    setUserRole(role);
    setUserData({ email, name });
    setRegion(region);
    setLoggedIn(true);

    const screenMap: Record<UserRole, ViewScreen> = {
      CUSTOMER: 'CUSTOMER_DASHBOARD',
      VENDOR: 'VENDOR_PORTAL',
      ADMIN: 'ADMIN_PANEL',
    };

    setCurrentScreen(screenMap[role]);
  }, [setCurrentScreen, setLoggedIn, setRegion, setUserData, setUserRole]);

  return null;
};
