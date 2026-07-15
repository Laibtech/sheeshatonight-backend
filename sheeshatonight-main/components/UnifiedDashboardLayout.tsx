'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  User,
  ChevronDown,
  Heart,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { clearSessionCookie } from '@/lib/session';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

interface UnifiedDashboardLayoutProps {
  children: React.ReactNode;
}

export const UnifiedDashboardLayout: React.FC<UnifiedDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userName, userEmail, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Browse Sheesha', icon: Store, href: '/dashboard/browse' },
    { label: 'My Orders', icon: ShoppingBag, href: '/dashboard/orders', badge: 2 },
    { label: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
    { label: 'Wishlist', icon: Heart, href: '/dashboard/wishlist' },
    { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
    clearSessionCookie();
    router.push('/auth/login');
  };

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 fixed h-screen z-30`}
      >
        {/* Logo */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-slate-200">
          {sidebarOpen ? (
            <img 
              src="/logo.png" 
              alt="SheeshaTonight" 
              className="h-12 w-auto object-contain"
            />
          ) : (
            <img 
              src="/logo.png" 
              alt="SheeshaTonight" 
              className="w-8 h-8 object-contain"
            />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <button
                    onClick={() => router.push(item.href)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                      active
                        ? 'bg-[#D4AF37] text-white shadow-lg shadow-amber-500/30'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="w-64 bg-white h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-18 flex items-center justify-between px-6 border-b border-slate-200">
              <img 
                src="/logo.png" 
                alt="SheeshaTonight" 
                className="h-12 w-auto object-contain"
              />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <nav className="py-6">
              <ul className="space-y-1 px-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <li key={item.href}>
                      <button
                        onClick={() => {
                          router.push(item.href);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                          active
                            ? 'bg-[#D4AF37] text-white shadow-lg'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="flex-1 text-left font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="absolute bottom-0 w-full p-3 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-20">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>

            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, lounges, products..."
                className="pl-10 pr-4 py-2 w-80 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-slate-900">{userName || 'User'}</p>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{userName || 'User'}</p>
                    <p className="text-xs text-slate-500">{userEmail || 'user@example.com'}</p>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/settings')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
