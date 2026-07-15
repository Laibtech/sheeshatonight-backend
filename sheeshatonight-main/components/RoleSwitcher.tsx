'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, type UserRole } from '@/lib/store';

interface RoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

import { User, Store, Shield } from 'lucide-react';

export const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ onRoleChange }) => {
  const router = useRouter();
  const { userRole, switchRole, isLoggedIn } = useAuthStore();
  const roles: { key: UserRole; label: string; icon: React.ReactNode }[] = [
    { key: 'CUSTOMER', label: 'Customer', icon: <User size={16} /> },
    { key: 'VENDOR', label: 'Vendor Partner', icon: <Store size={16} /> },
    { key: 'ADMIN', label: 'Platform Admin', icon: <Shield size={16} /> },
  ];

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    onRoleChange?.(role);
    if (isLoggedIn) {
      const routeMap: Record<UserRole, string> = {
        CUSTOMER: '/dashboard',
        VENDOR: '/vendor/dashboard',
        ADMIN: '/admin/dashboard',
      };
      router.push(routeMap[role]);
    }
  };

  return (
    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
      {roles.map((role) => (
        <button
          key={role.key}
          onClick={() => handleSwitch(role.key)}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold transition text-xs md:text-sm ${
            userRole === role.key
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-200 hover:text-slate-800'
          }`}
        >
          {role.icon}
          <span>{role.label}</span>
        </button>
      ))}
    </div>
  );
};
