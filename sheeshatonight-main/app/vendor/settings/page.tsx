'use client';

import React, { useState } from 'react';
import { Store, Mail, Clock, Bell, Save, RefreshCw, User, MapPin, Phone, Globe } from 'lucide-react';

export default function VendorSettings() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    shopName: 'Luxury Lounge',
    contactEmail: 'vendor@sheeshatonight.ae',
    businessHours: '5:00 PM - 2:00 AM',
    notificationEmail: 'alerts@sheeshatonight.ae',
    ownerName: 'John Smith',
    phone: '+971 50 123 4567',
    address: 'Dubai Marina, UAE',
    website: 'www.luxurylounge.ae',
  });

  const handleChange = (field: string, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    setSettings({
      shopName: 'Luxury Lounge',
      contactEmail: 'vendor@sheeshatonight.ae',
      businessHours: '5:00 PM - 2:00 AM',
      notificationEmail: 'alerts@sheeshatonight.ae',
      ownerName: 'John Smith',
      phone: '+971 50 123 4567',
      address: 'Dubai Marina, UAE',
      website: 'www.luxurylounge.ae',
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Settings</p>
          <h1 className="text-3xl font-black text-slate-900 mt-3">Vendor Preferences</h1>
          <p className="text-slate-600 mt-2">Configure shop settings, notifications, and account controls for your vendor profile.</p>
        </div>

        {/* Main Settings Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          {/* Business Information Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 rounded-xl">
                <Store className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Business Information</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Store className="w-4 h-4 text-slate-400" />
                  Shop Name
                </label>
                <input
                  type="text"
                  value={settings.shopName}
                  onChange={(e) => handleChange('shopName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Enter shop name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <User className="w-4 h-4 text-slate-400" />
                  Owner Name
                </label>
                <input
                  type="text"
                  value={settings.ownerName}
                  onChange={(e) => handleChange('ownerName', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Enter owner name"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Phone className="w-4 h-4 text-slate-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="+971 50 123 4567"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Business Hours
                </label>
                <input
                  type="text"
                  value={settings.businessHours}
                  onChange={(e) => handleChange('businessHours', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="5:00 PM - 2:00 AM"
                />
              </div>

              <div className="space-y-2 lg:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  Business Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Enter business address"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Globe className="w-4 h-4 text-slate-400" />
                  Website
                </label>
                <input
                  type="url"
                  value={settings.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="www.yoursite.com"
                />
              </div>
            </div>
          </div>

          {/* Contact & Notifications Section */}
          <div className="border-t border-slate-200 pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Contact & Notifications</h2>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="contact@email.com"
                />
                <p className="text-xs text-slate-500">Primary email for customer inquiries</p>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Bell className="w-4 h-4 text-slate-400" />
                  Notification Email
                </label>
                <input
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => handleChange('notificationEmail', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="alerts@email.com"
                />
                <p className="text-xs text-slate-500">Email for order and system notifications</p>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-3">Email Notification Preferences</p>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500" />
                  <span className="text-sm text-slate-700">New order notifications</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500" />
                  <span className="text-sm text-slate-700">Payment confirmations</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500" />
                  <span className="text-sm text-slate-700">Customer reviews</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500" />
                  <span className="text-sm text-slate-700">Low stock alerts</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Settings
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              <RefreshCw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
