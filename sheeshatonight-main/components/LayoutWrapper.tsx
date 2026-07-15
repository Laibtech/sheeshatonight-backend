'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || '';

  // Auth pages don't need any wrapper
  const isAuthPage = pathname === '/' || pathname.startsWith('/auth');

  if (isAuthPage) {
    return <>{children}</>;
  }

  // All other pages get their own layouts (dashboard, vendor, admin have their own layout components)
  return <>{children}</>;
};
