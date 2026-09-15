'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { clearSessionCookie } from '@/lib/session';
import { useCart } from '@/contexts/CartContext';
import '@/app/dashboard/CustomerDashboard.css';

function Icon({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`icon ${className}`}>{children}</span>;
}

export function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { userName, userEmail, logout } = useAuthStore();
  const { itemCount } = useCart();

  const [mounted, setMounted] = useState(false);
  const [customerName, setCustomerName] = useState('Sara Ahmed');
  const [customerEmail, setCustomerEmail] = useState('sara.ahmed@email.com');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Dubai');
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (userName && userName.trim()) {
      setCustomerName(userName);
    } else {
      const match = document.cookie.match(/(?:^|; )user_name=([^;]*)/);
      if (match && match[1]) {
        setCustomerName(decodeURIComponent(match[1]));
      }
    }

    if (userEmail && userEmail.trim()) {
      setCustomerEmail(userEmail);
    } else {
      const match = document.cookie.match(/(?:^|; )user_email=([^;]*)/);
      if (match && match[1]) {
        setCustomerEmail(decodeURIComponent(match[1]));
      }
    }
  }, [userName, userEmail]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/shop');
    }
  };

  const handleSignOut = () => {
    logout();
    localStorage.removeItem('auth_token');
    clearSessionCookie();
    router.push('/auth/login');
  };

  const isNavActive = (path: string) => {
    if (path === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(path);
  };

  return (
    <div className="customer-dashboard">
      {/* ================= HEADER ================= */}
      <header className="dashboard-header">
        <div className="brand">
          <Link href="/">
            <img src="/logo.png" alt="SheeshaTonight" />
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="header-search">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search for sheesha products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="header-actions">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              className="location-selector"
            >
              <span>⌖</span>
              {selectedLocation}
              <span className="arrow">⌄</span>
            </button>

            {showLocationMenu && (
              <div className="absolute top-full mt-1.5 left-0 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50">
                {['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman'].map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocationMenu(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-purple-50 hover:text-[#7b2377] transition"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/dashboard/wishlist" className="header-icon" title="Wishlist">
            ♡
          </Link>

          <Link href="/cart" className="header-icon cart" title="View Cart">
            🛒
            <small>{mounted && itemCount > 0 ? itemCount : 3}</small>
          </Link>

          <div className="relative">
            <div
              className="user-menu"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <img
                src="/users/sara.jpg"
                alt={customerName}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              <div>
                <strong>{customerName}</strong>
              </div>

              <span>⌄</span>
            </div>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{customerName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{customerEmail}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs text-slate-600 hover:bg-purple-50 hover:text-[#7b2377] transition"
                >
                  Dashboard Home
                </Link>
                <Link
                  href="/dashboard/orders"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs text-slate-600 hover:bg-purple-50 hover:text-[#7b2377] transition"
                >
                  My Orders
                </Link>
                <Link
                  href="/dashboard/wishlist"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs text-slate-600 hover:bg-purple-50 hover:text-[#7b2377] transition"
                >
                  My Wishlist
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="block px-4 py-2 text-xs text-slate-600 hover:bg-purple-50 hover:text-[#7b2377] transition"
                >
                  Account Settings
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition border-t border-slate-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="dashboard-body">
        {/* ================= SIDEBAR ================= */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <Link href="/dashboard" className={isNavActive('/dashboard') && pathname === '/dashboard' ? 'active' : ''}>
              <Icon>⌂</Icon>
              Dashboard
            </Link>

            <Link href="/dashboard/orders" className={isNavActive('/dashboard/orders') ? 'active' : ''}>
              <Icon>▣</Icon>
              My Orders
            </Link>

            <Link href="/dashboard/wishlist" className={isNavActive('/dashboard/wishlist') ? 'active' : ''}>
              <Icon>♡</Icon>
              Wishlist
            </Link>

            <Link href="/dashboard/bookings" className={isNavActive('/dashboard/bookings') ? 'active' : ''}>
              <Icon>⌖</Icon>
              Bookings
            </Link>

            <Link href="/dashboard/settings" className={isNavActive('/dashboard/settings') ? 'active' : ''}>
              <Icon>⚙</Icon>
              Settings
            </Link>

            <Link href="/contact" className={pathname === '/contact' ? 'active' : ''}>
              <Icon>?</Icon>
              Support
            </Link>
          </nav>

          <div className="sidebar-promo">
            <div className="promo-icon">♛</div>

            <h3>
              Premium Sheesha
              <br />
              Products & Accessories
            </h3>

            <p>Quality. Authenticity. Luxury.</p>

            <div className="gold-line">◆</div>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <div className="dashboard-content-area" style={{ flex: 1, minWidth: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
