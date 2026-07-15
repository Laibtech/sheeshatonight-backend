'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  package: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Gold Sheesha Setup',
      price: 1299,
      quantity: 1,
      image: '/api/placeholder/150/150',
      package: 'gold'
    }
  ]);

  const updateQuantity = (id: string, change: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% VAT
  const total = subtotal + tax;

  return (
    <PageLayout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingCart className="w-24 h-24 mx-auto text-slate-300 mb-6" />
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
              <p className="text-slate-600 mb-8">Add some items to get started!</p>
              <Link
                href="/rentals"
                className="inline-block px-8 py-4 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#B8902A] transition"
              >
                Browse Packages
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-6 p-6 border-b border-slate-100 last:border-0"
                    >
                      {/* Image */}
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingCart className="w-12 h-12 text-slate-400" />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-slate-500 mb-3">Package: {item.package}</p>
                        <p className="text-xl font-bold text-[#D4AF37]">AED {item.price}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 bg-slate-100 rounded-lg hover:bg-slate-200 transition flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 bg-slate-100 rounded-lg hover:bg-slate-200 transition flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="mt-6">
                  <Link
                    href="/rentals"
                    className="text-[#D4AF37] hover:text-[#B8902A] font-semibold flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">AED {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>VAT (5%)</span>
                      <span className="font-semibold">AED {tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Delivery</span>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-slate-900">Total</span>
                      <span className="text-2xl font-bold text-[#D4AF37]">AED {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className="block w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-white rounded-lg font-semibold text-center hover:shadow-xl transition"
                  >
                    Proceed to Checkout
                  </Link>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="space-y-3 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Free delivery on all orders</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Professional setup included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Secure payment processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
