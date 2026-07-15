'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Users, Award } from 'lucide-react';

export default function Header() {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const pathname = usePathname() || '';

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/rentals', label: 'Rentals' },
    { href: '/blogs', label: 'Blogs' },
    { href: '/make-your-sheesha', label: 'Make Your Sheesha' },
    { href: '/contact', label: 'Contact' }
  ];

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-slate-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <img src="/logo.png" alt="SheeshaTonight" className="h-12 w-auto object-contain" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition font-medium ${
                  isActive(item.href)
                    ? 'text-[#D4AF37] font-semibold'
                    : 'text-slate-700 hover:text-[#D4AF37]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Account Button */}
          <div className="relative">
            <button 
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="btn-gradient inline-flex items-center justify-center font-medium"
            >
              Account
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl py-2 z-50">
                <Link href="/auth/signup?role=customer" className="flex items-center px-4 py-3 hover:bg-gray-50 transition">
                  <div className="bg-[#D4AF37]/20 rounded-full p-2 mr-3">
                    <Users className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Buyer Account</p>
                    <p className="text-xs text-gray-500">Book Sheesha for events</p>
                  </div>
                </Link>

                <Link href="/auth/signup?role=vendor" className="flex items-center px-4 py-3 hover:bg-gray-50 transition">
                  <div className="bg-[#B8902A]/20 rounded-full p-2 mr-3">
                    <Award className="w-5 h-5 text-[#B8902A]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Vendor Account</p>
                    <p className="text-xs text-gray-500">Sell Sheesha services</p>
                  </div>
                </Link>

                <div className="border-t mt-2 pt-2">
                  <Link href="/auth/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
