'use client';

import React from 'react';
import { Home, Clock, Search, ShoppingBag, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

const CUSTOMER_NAVIGATION = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Orders', href: '/dashboard/orders', icon: Clock },
  { label: 'Search', href: '/customer/search', icon: Search },
  { label: 'Cart', href: '/customer/cart', icon: ShoppingBag },
  { label: 'Profile', href: '/customer/profile', icon: User },
];

export const CustomerBottomNav: React.FC = () => {
  const pathname = usePathname() || '';
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 glass border-t border-slate-200/80 bg-white/80 backdrop-blur-md z-45 lg:hidden">
        <div className="grid grid-cols-5 gap-1 py-1">
          {CUSTOMER_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 transition ${
                  isActive
                    ? 'text-amber-600'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-bold mt-1 tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-64 glass border-r border-slate-200 bg-white/20 flex-col p-6 z-40">
        <nav className="flex-1 space-y-2 mt-4">
          {CUSTOMER_NAVIGATION.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-bold text-sm ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                    : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition text-sm font-bold"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Spacing padding helper */}
      <div className="lg:hidden h-16" />
    </>
  );
};
