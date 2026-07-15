'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Shield,
  CreditCard,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { clearSessionCookie } from '@/lib/session';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userName, userEmail, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);

  // Fetch notification and alert counts
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        
        // Fetch notifications
        const notifResponse = await fetch(`${BACKEND_URL}/api/notifications/unread-count`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (notifResponse.ok) {
          const notifData = await notifResponse.json();
          setNotificationCount(notifData.count || 0);
        }

        // Fetch admin alerts
        const alertResponse = await fetch(`${BACKEND_URL}/api/notifications/admin/alerts`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (alertResponse.ok) {
          const alertData = await alertResponse.json();
          setAlertCount(alertData.totalCount || 0);
        }
      } catch (error) {
        console.error('Failed to fetch counts:', error);
      }
    };

    fetchCounts();
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { label: 'Users', icon: Users, href: '/admin/users' },
    { label: 'Vendors', icon: Store, href: '/admin/vendors', badge: 5 },
    { label: 'Products', icon: Package, href: '/admin/products' },
    { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
    { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
    { label: 'KYC Approvals', icon: Shield, href: '/admin/kyc', badge: 12 },
    { label: 'Support', icon: AlertCircle, href: '/admin/support' },
    { label: 'Settings', icon: Settings, href: '/admin/settings' },
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
            <div>
              <img 
                src="/logo.png" 
                alt="SheeshaTonight" 
                className="h-10 w-auto object-contain mb-1"
              />
              <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">Admin Portal</p>
            </div>
          ) : (
            <Shield className="w-6 h-6 text-[#D4AF37]" />
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
                        ? 'bg-[#D4AF37] text-white shadow-lg shadow-amber-500/20'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
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
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
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
              <div>
                <img 
                  src="/logo.png" 
                  alt="SheeshaTonight" 
                  className="h-10 w-auto object-contain mb-1"
                />
                <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider">Admin Portal</p>
              </div>
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
                        <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
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
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="h-18 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
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
                placeholder="Search users, vendors, orders..."
                className="pl-10 pr-4 py-2 w-96 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Alerts */}
            <button 
              onClick={() => router.push('/admin/kyc')}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <AlertCircle className="w-5 h-5 text-orange-500" />
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {alertCount > 99 ? '99+' : alertCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button 
              onClick={() => router.push('/admin/notifications')}
              className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-colors relative z-50"
              >
                <div className="w-9 h-9 bg-[#D4AF37] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {userName ? userName.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-bold text-slate-900">{userName || 'Admin'}</p>
                  <p className="text-xs text-[#D4AF37] font-semibold">Platform Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userMenuOpen && (
                <>
                  {/* Overlay to close menu when clicking outside */}
                  <div 
                    className="fixed inset-0 z-[60]" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-[70]">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{userName || 'Admin User'}</p>
                      <p className="text-xs text-slate-600 mt-1 truncate">{userEmail || 'admin@sheeshatonight.com'}</p>
                      <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] rounded-full">
                        <Shield className="w-3 h-3 text-white flex-shrink-0" />
                        <span className="text-xs text-white font-bold">Platform Admin</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        router.push('/admin/settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4 flex-shrink-0" />
                      <span>Admin Settings</span>
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-semibold"
                      >
                        <LogOut className="w-4 h-4 flex-shrink-0" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
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
