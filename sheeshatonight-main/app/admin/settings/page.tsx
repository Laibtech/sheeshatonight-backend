'use client';

import { useState } from 'react';
import { Settings, Bell, Shield, CreditCard, Globe, Mail, Key, Save, RefreshCw } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    // General
    siteName: 'SheeshaTonight',
    siteUrl: 'https://sheeshatonight.com',
    supportEmail: 'support@sheeshatonight.com',
    contactPhone: '+971 50 123 4567',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyOnNewOrder: true,
    notifyOnKycSubmission: true,
    notifyOnLowStock: true,
    
    // Security
    requireEmailVerification: true,
    require2FA: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Payments
    platformCommission: 5,
    vendorCommission: 15,
    minimumPayoutAmount: 100,
    payoutSchedule: 'weekly',
    
    // Regional
    defaultCurrency: 'AED',
    defaultTimezone: 'Asia/Dubai',
    supportedRegions: ['Dubai', 'Abu Dhabi', 'Sharjah', 'London', 'Manchester'],
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'regional', label: 'Regional', icon: Globe },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Configuration</p>
          <h1 className="text-3xl font-black text-slate-900 mt-3">Admin Settings</h1>
          <p className="text-slate-600 mt-2">Manage platform configuration and preferences</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#D4AF37] text-white shadow-md'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">General Settings</h2>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Site URL</label>
                    <input
                      type="url"
                      value={settings.siteUrl}
                      onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">Email Notifications</p>
                        <p className="text-sm text-slate-600">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">SMS Notifications</p>
                        <p className="text-sm text-slate-600">Receive notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.smsNotifications}
                          onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">Push Notifications</p>
                        <p className="text-sm text-slate-600">Receive browser push notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                      </label>
                    </div>

                    <div className="border-t border-slate-200 my-6"></div>

                    <h3 className="font-bold text-slate-900 mb-4">Alert Triggers</h3>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">New Orders</p>
                        <p className="text-sm text-slate-600">Alert when new orders are placed</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifyOnNewOrder}
                          onChange={(e) => setSettings({ ...settings, notifyOnNewOrder: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">KYC Submissions</p>
                        <p className="text-sm text-slate-600">Alert when vendors submit KYC</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifyOnKycSubmission}
                          onChange={(e) => setSettings({ ...settings, notifyOnKycSubmission: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-slate-900">Low Stock</p>
                        <p className="text-sm text-slate-600">Alert when products are low on stock</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifyOnLowStock}
                          onChange={(e) => setSettings({ ...settings, notifyOnLowStock: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Security Settings</h2>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900">Email Verification Required</p>
                      <p className="text-sm text-slate-600">Users must verify email before access</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.requireEmailVerification}
                        onChange={(e) => setSettings({ ...settings, requireEmailVerification: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="font-semibold text-slate-900">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-600">Require 2FA for admin accounts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.require2FA}
                        onChange={(e) => setSettings({ ...settings, require2FA: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D4AF37]"></div>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Max Login Attempts</label>
                      <input
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => setSettings({ ...settings, maxLoginAttempts: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Settings */}
              {activeTab === 'payments' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Payment Settings</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Platform Commission (%)</label>
                      <input
                        type="number"
                        value={settings.platformCommission}
                        onChange={(e) => setSettings({ ...settings, platformCommission: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Vendor Commission (%)</label>
                      <input
                        type="number"
                        value={settings.vendorCommission}
                        onChange={(e) => setSettings({ ...settings, vendorCommission: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Payout Amount (AED)</label>
                    <input
                      type="number"
                      value={settings.minimumPayoutAmount}
                      onChange={(e) => setSettings({ ...settings, minimumPayoutAmount: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Payout Schedule</label>
                    <select
                      value={settings.payoutSchedule}
                      onChange={(e) => setSettings({ ...settings, payoutSchedule: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Regional Settings */}
              {activeTab === 'regional' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Regional Settings</h2>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Default Currency</label>
                      <select
                        value={settings.defaultCurrency}
                        onChange={(e) => setSettings({ ...settings, defaultCurrency: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="AED">AED - UAE Dirham</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Default Timezone</label>
                      <select
                        value={settings.defaultTimezone}
                        onChange={(e) => setSettings({ ...settings, defaultTimezone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                      >
                        <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                        <option value="America/New_York">America/New York (EST)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Supported Regions</label>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex flex-wrap gap-2">
                        {settings.supportedRegions.map((region, index) => (
                          <span key={index} className="px-3 py-1 bg-[#D4AF37] text-white rounded-full text-sm font-medium">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 flex gap-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-[#B8902A] text-white font-semibold rounded-xl shadow-lg transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
