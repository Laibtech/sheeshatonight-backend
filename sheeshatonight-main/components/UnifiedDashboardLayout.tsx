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
    <div className="min-h-screen bg-[#0b0b0b] flex dashboard-layout">
      {/* Sidebar - Desktop */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } hidden lg:flex flex-col bg-[#111111] border-r border-[#D4AF37]/15 transition-all duration-300 fixed h-screen z-30 text-slate-200`}
      >
        {/* Logo */}
        <div className="h-18 flex items-center justify-between px-6 border-b border-[#D4AF37]/15">
          {sidebarOpen ? (
            <img 
              src="/logo.png" 
              alt="SheeshaTonight" 
              className="h-12 w-auto object-contain brightness-0 invert"
            />
          ) : (
            <img 
              src="/logo.png" 
              alt="SheeshaTonight" 
              className="w-8 h-8 object-contain brightness-0 invert"
            />
          )}
        </div>

        {/* Back to Website Button - Desktop */}
        {sidebarOpen && (
          <div className="px-3 pt-4 pb-2">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-semibold rounded-lg hover:from-[#e0bb4d] hover:to-[#d39b1b] transition-all shadow-md hover:shadow-lg shadow-amber-500/20"
            >
              <Store className="w-4 h-4" />
              <span className="text-sm">Back to Website</span>
            </button>
          </div>
        )}

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
                        ? 'bg-[#D4AF37] text-slate-950 shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
        <div className="p-3 border-t border-[#D4AF37]/15">
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
            className="w-64 bg-[#111111] text-slate-200 h-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-18 flex items-center justify-between px-6 border-b border-[#D4AF37]/15">
              <img 
                src="/logo.png" 
                alt="SheeshaTonight" 
                className="h-12 w-auto object-contain brightness-0 invert"
              />
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Back to Website Button - Mobile */}
            <div className="px-3 pt-4 pb-2">
              <button
                onClick={() => {
                  router.push('/');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-semibold rounded-lg hover:from-[#e0bb4d] hover:to-[#d39b1b] transition-all shadow-md"
              >
                <Store className="w-4 h-4" />
                <span className="text-sm">Back to Website</span>
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
                            ? 'bg-[#D4AF37] text-slate-950 shadow-lg'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
        <header className="h-18 bg-[#111111] border-b border-[#D4AF37]/15 flex items-center justify-between px-6 sticky top-0 z-20 text-slate-100">
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-200" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-200" />
            </button>

            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders, lounges, products..."
                className="pl-10 pr-4 py-2 w-80 bg-slate-900 border border-[#D4AF37]/20 rounded-lg text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-200" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-slate-950 font-semibold text-sm shadow-md">
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white">{userName || 'User'}</p>
                  <p className="text-xs text-[#D4AF37]">Customer</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-300" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#111111] rounded-xl shadow-xl border border-[#D4AF37]/15 py-2 z-50">
                  <div className="px-4 py-3 border-b border-[#D4AF37]/10">
                    <p className="text-sm font-semibold text-white">{userName || 'User'}</p>
                    <p className="text-xs text-slate-300">{userEmail || 'user@example.com'}</p>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard/settings')}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#D4AF37]" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-800 transition-colors"
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
