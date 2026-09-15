"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Header() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [rentalsOpen, setRentalsOpen] = useState(false);

  return (
    <>
      <div className="bg-[#74189B] text-white text-center text-[12px] sm:text-[13px] py-2.5 px-4 tracking-wide">
        Premium Sheesha Experiences Across the UAE{" "}
        <span className="hidden sm:inline">|</span>{" "}
        <span className="font-semibold">Same-Day Delivery Available</span>
      </div>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-[76px] flex items-center justify-between gap-6">
            <Link href="/" className="shrink-0">
              <img
                src="/logo.png"
                alt="SheeshaTonight"
                className="w-[115px] sm:w-[130px] h-auto object-contain transition-all"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-7">
              <Link
                href="/"
                className="text-[13px] font-semibold text-[#571275] hover:text-[#74189B] transition"
              >
                HOME
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
                >
                  SHOP
                  <ChevronDown size={14} />
                </Link>

                {shopOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4">
                    <div className="w-[700px] bg-white rounded-2xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,.12)] p-7">
                      <div className="grid grid-cols-3 gap-8">
                        <div>
                          <p className="text-[11px] uppercase tracking-[2px] text-[#F1A51D] font-bold mb-4">
                            Shop Sheesha
                          </p>

                          <div className="space-y-3">
                            <Link
                              href="/categories/buy-sheesha"
                              className="flex justify-between items-center group"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                                Buy Sheesha
                              </span>
                              <ChevronRight size={15} />
                            </Link>

                            <Link
                              href="/categories/flavors"
                              className="flex justify-between items-center group"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                                Sheesha Flavors
                              </span>
                              <ChevronRight size={15} />
                            </Link>

                            <Link
                              href="/categories/accessories"
                              className="flex justify-between items-center group"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                                Accessories
                              </span>
                              <ChevronRight size={15} />
                            </Link>
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-[2px] text-[#F1A51D] font-bold mb-4">
                            Featured
                          </p>

                          <div className="space-y-3">
                            <Link
                              href="/shop"
                              className="flex justify-between items-center group"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                                Best Sellers
                              </span>
                              <ChevronRight size={15} />
                            </Link>

                            <Link
                              href="/shop?sort=newest"
                              className="flex justify-between items-center group"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                                New Arrivals
                              </span>
                              <ChevronRight size={15} />
                            </Link>

                            <Link
                              href="/shop?sale=true"
                              className="flex justify-between items-center group"
                            >
                              <span className="text-sm font-medium text-gray-700 group-hover:text-[#74189B]">
                                Special Offers
                              </span>
                              <ChevronRight size={15} />
                            </Link>
                          </div>
                        </div>

                        <div className="bg-[#F8F2FA] rounded-xl p-5">
                          <span className="text-[10px] uppercase tracking-[2px] text-[#74189B] font-bold">
                            Premium Collection
                          </span>

                          <h3 className="mt-2 text-lg font-bold text-[#571275]">
                            Elevate Your Setup
                          </h3>

                          <p className="text-xs text-gray-500 mt-2 leading-5">
                            Discover premium sheesha products, flavors and
                            accessories.
                          </p>

                          <Link
                            href="/shop"
                            className="inline-flex items-center gap-1 mt-4 text-xs font-bold text-[#74189B]"
                          >
                            Shop Collection
                            <ChevronRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div
                className="relative"
                onMouseEnter={() => setRentalsOpen(true)}
                onMouseLeave={() => setRentalsOpen(false)}
              >
                <Link
                  href="/rentals"
                  className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
                >
                  RENTALS
                  <ChevronDown size={14} />
                </Link>

                {rentalsOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4">
                    <div className="w-[650px] bg-white rounded-2xl border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,.12)] p-7">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-[11px] uppercase tracking-[2px] text-[#F1A51D] font-bold mb-4">
                            Rent For
                          </p>

                          <div className="space-y-3">
                            {[
                              { name: "Villa", href: "/rentals?event=villa" },
                              { name: "Yacht", href: "/rentals?event=yacht" },
                              { name: "Corporate", href: "/rentals?event=corporate" },
                              { name: "Weddings", href: "/rentals?event=weddings" },
                              { name: "Birthdays", href: "/rentals?event=birthday" },
                              { name: "Private Gatherings", href: "/rentals?event=private" },
                            ].map(({ name, href }) => (
                              <Link
                                key={name}
                                href={href}
                                className="flex items-center justify-between text-sm font-medium text-gray-700 hover:text-[#74189B]"
                              >
                                {name}
                                <ChevronRight size={15} />
                              </Link>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl overflow-hidden min-h-[230px] relative">
                          <img
                            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=700&q=85"
                            alt="Sheesha experience"
                            className="absolute inset-0 w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#571275]/90 via-[#571275]/20 to-transparent" />

                          <div className="absolute bottom-5 left-5 right-5 text-white">
                            <p className="text-[10px] uppercase tracking-[2px] text-[#F1A51D] font-bold">
                              Premium Experiences
                            </p>

                            <h3 className="text-xl font-bold mt-1">
                              Rent. Relax. Enjoy.
                            </h3>

                            <Link
                              href="/rentals"
                              className="inline-flex items-center gap-1 mt-3 text-xs font-semibold"
                            >
                              Explore Rentals
                              <ChevronRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/experiences"
                className="text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
              >
                EXPERIENCES
              </Link>

              <Link
                href="/vendors"
                className="text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
              >
                VENDORS
              </Link>

              <Link
                href="/about"
                className="text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
              >
                ABOUT
              </Link>

              <Link
                href="/contact"
                className="text-[13px] font-semibold text-gray-700 hover:text-[#74189B]"
              >
                CONTACT
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/shop"
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[#F8F2FA] text-gray-700 hover:text-[#74189B]"
              >
                <Search size={19} strokeWidth={1.8} />
              </Link>

              <Link
                href="/wishlist"
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[#F8F2FA] text-gray-700 hover:text-[#74189B]"
              >
                <Heart size={19} strokeWidth={1.8} />
              </Link>

              <Link
                href="/dashboard"
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-[#F8F2FA] text-gray-700 hover:text-[#74189B]"
              >
                <User size={19} strokeWidth={1.8} />
              </Link>

              <Link
                href="/cart"
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F2FA] text-gray-700 hover:text-[#74189B]"
              >
                <ShoppingBag size={19} strokeWidth={1.8} />

                <span className="absolute -top-0.5 -right-0.5 w-[17px] h-[17px] rounded-full bg-[#F1A51D] text-white text-[9px] flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F8F2FA]"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <nav className="px-5 py-5 space-y-1">
              {[
                { label: "HOME", href: "/" },
                { label: "SHOP", href: "/shop" },
                { label: "RENTALS", href: "/rentals" },
                { label: "EXPERIENCES", href: "/experiences" },
                { label: "VENDORS", href: "/vendors" },
                { label: "ABOUT", href: "/about" },
                { label: "CONTACT", href: "/contact" },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between py-3.5 border-b border-gray-100 text-sm font-semibold text-gray-700"
                >
                  {label}
                  <ChevronRight size={16} />
                </Link>
              ))}

              <div className="grid grid-cols-3 gap-2 pt-4">
                <Link
                  href="/wishlist"
                  className="bg-[#F8F2FA] rounded-xl py-3 text-center text-xs font-semibold text-[#74189B]"
                >
                  Wishlist
                </Link>

                <Link
                  href="/dashboard"
                  className="bg-[#F8F2FA] rounded-xl py-3 text-center text-xs font-semibold text-[#74189B]"
                >
                  Account
                </Link>

                <Link
                  href="/cart"
                  className="bg-[#F8F2FA] rounded-xl py-3 text-center text-xs font-semibold text-[#74189B]"
                >
                  Cart
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}

