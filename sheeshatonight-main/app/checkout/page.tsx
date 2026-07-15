'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, Wallet, CheckCircle, ArrowLeft, Shield, Lock } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emirate: string;
  zipCode: string;
  paymentMethod: 'card' | 'cash' | '';
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    emirate: '',
    zipCode: '',
    paymentMethod: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Mock cart data - in real app, this would come from context/state
  const subtotal = 1299;
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Here you would make API call to backend
      // const response = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(formData) });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page
      router.push('/order-success');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Back to Cart */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#B8902A] font-semibold mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>

          <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Customer Information</h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                        placeholder="+971 50 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Emirate <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="emirate"
                        required
                        value={formData.emirate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                      >
                        <option value="">Select Emirate</option>
                        <option value="dubai">Dubai</option>
                        <option value="abu-dhabi">Abu Dhabi</option>
                        <option value="sharjah">Sharjah</option>
                        <option value="ajman">Ajman</option>
                        <option value="rak">Ras Al Khaimah</option>
                        <option value="fujairah">Fujairah</option>
                        <option value="uaq">Umm Al Quwain</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                        placeholder="Building 123, Street Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                        placeholder="Dubai"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                        placeholder="00000"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Method</h2>

                  <div className="space-y-4 mb-6">
                    {/* Credit/Debit Card */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div className="ml-4 flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-slate-600" />
                        <div>
                          <p className="font-semibold text-slate-900">Credit / Debit Card</p>
                          <p className="text-sm text-slate-500">Pay securely with your card</p>
                        </div>
                      </div>
                    </label>

                    {/* Cash on Delivery */}
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-[#D4AF37] focus:ring-[#D4AF37]"
                      />
                      <div className="ml-4 flex items-center gap-3">
                        <Wallet className="w-6 h-6 text-slate-600" />
                        <div>
                          <p className="font-semibold text-slate-900">Cash on Delivery</p>
                          <p className="text-sm text-slate-500">Pay when you receive</p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Card Details (shown only when card is selected) */}
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-4 mt-6 pt-6 border-t border-slate-200">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Card Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Expiry Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardExpiry"
                            required
                            value={formData.cardExpiry}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardCvv"
                            required
                            value={formData.cardCvv}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent placeholder:text-slate-400"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>

                      {/* Security Badge */}
                      <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                        <Lock className="w-4 h-4" />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.paymentMethod}
                  className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8902A] text-white rounded-lg font-semibold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>

                {/* Mock Order Items */}
                <div className="border-b border-slate-200 pb-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg"></div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">Gold Sheesha Setup</h3>
                      <p className="text-sm text-slate-500">Package: Gold</p>
                      <p className="text-sm text-slate-500">Quantity: 1</p>
                    </div>
                    <p className="font-bold text-[#D4AF37]">AED {subtotal}</p>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
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

                <div className="border-t border-slate-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-bold text-[#D4AF37]">AED {total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-500" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Professional setup included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Free delivery on all orders</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
