'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Lock, Bell, CreditCard, Shield, Save } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export default function SettingsPage() {
  const { userName, userEmail } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      {/* Header - CONSISTENT */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-[#D4AF37]" />
          Settings
        </h1>
        <p className="text-slate-600 text-sm mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs - CONSISTENT CARD */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                      isActive
                        ? 'bg-[#D4AF37] text-white shadow-lg'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area - CONSISTENT CARD */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Profile Information</h2>
                  <p className="text-sm text-slate-600 mb-6">Update your personal details and contact information</p>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue={userName || 'John Doe'}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={userEmail || 'john@example.com'}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+971 50 123 4567"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      defaultValue="Dubai, UAE"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Delivery Address
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Building 5, Apartment 204, Dubai Marina"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button className="px-4 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors font-medium text-sm">
                    Cancel
                  </button>
                  <button className="px-4 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#B8902A] hover:shadow-lg transition-all text-sm flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Notification Preferences</h2>
                  <p className="text-sm text-slate-600 mb-6">Choose how you want to receive updates</p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: 'Order Updates', desc: 'Get notified about your order status' },
                    { label: 'Promotions & Offers', desc: 'Receive exclusive deals and discounts' },
                    { label: 'Booking Reminders', desc: 'Reminders for upcoming reservations' },
                    { label: 'New Products', desc: 'Be the first to know about new arrivals' },
                  ].map((item, index) => (
                    <label
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={index < 2}
                        className="w-5 h-5 accent-purple-600 rounded"
                      />
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button className="px-4 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#B8902A] hover:shadow-lg transition-all text-sm flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Security Settings</h2>
                  <p className="text-sm text-slate-600 mb-6">Manage your password and security preferences</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button className="px-4 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-lg hover:bg-[#B8902A] hover:shadow-lg transition-all text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Payment Methods</h2>
                  <p className="text-sm text-slate-600 mb-6">Manage your saved payment methods</p>
                </div>

                <div className="space-y-3">
                  {[
                    { type: 'Visa', last4: '4242', expiry: '12/25' },
                    { type: 'Mastercard', last4: '8888', expiry: '06/26' },
                  ].map((card, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#D4AF37] rounded-lg flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">
                            {card.type} •••• {card.last4}
                          </p>
                          <p className="text-xs text-slate-600">Expires {card.expiry}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                <button className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors font-medium text-sm">
                  + Add New Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
