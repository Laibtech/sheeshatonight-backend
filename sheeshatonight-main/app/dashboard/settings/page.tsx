'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Bell,
  CreditCard,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  User,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  X,
} from 'lucide-react';

interface Profile {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: string;
}

interface Address {
  id: string;
  label: string;
  street: string;
  building?: string | null;
  city: string;
  country: string;
  zipcode?: string | null;
  isDefault: boolean;
}

type Tab = 'profile' | 'addresses' | 'security' | 'payments' | 'notifications';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('auth_token');
  if (token) return token;
  const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
  return match && match[1] ? decodeURIComponent(match[1]) : null;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile Edit State
  const [nameInput, setNameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Security (Password Change) State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);
  const [passwordErrorMsg, setPasswordErrorMsg] = useState<string | null>(null);

  // Add Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState('Home');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrBuilding, setNewAddrBuilding] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Dubai');
  const [newAddrCountry, setNewAddrCountry] = useState('United Arab Emirates');
  const [newAddrZipcode, setNewAddrZipcode] = useState('');
  const [newAddrDefault, setNewAddrDefault] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [addressErrorMsg, setAddressErrorMsg] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const [profileResponse, addressesResponse] = await Promise.all([
        fetch('/api/users/me', { headers, cache: 'no-store' }),
        fetch('/api/users/me/addresses', { headers, cache: 'no-store' }),
      ]);

      const profileResult = await profileResponse.json();
      const addressesResult = await addressesResponse.json();

      if (profileResponse.ok && profileResult.success) {
        const u = profileResult.data || profileResult.user;
        setProfile(u);
        setNameInput(u?.name || '');
        setPhoneInput(u?.phone || '');
      }

      if (addressesResponse.ok && addressesResult.success) {
        setAddresses(Array.isArray(addressesResult.data) ? addressesResult.data : []);
      }
    } catch (fetchError) {
      console.error('Failed to load settings:', fetchError);
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load account settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: nameInput,
          phone: phoneInput,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update profile.');
      }

      setProfileSuccessMsg('Profile information updated successfully!');
      setProfile((prev) => (prev ? { ...prev, name: nameInput, phone: phoneInput } : null));
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg(null);
    setPasswordErrorMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordErrorMsg('Password must be at least 8 characters long');
      return;
    }

    setSavingPassword(true);
    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch('/api/users/me', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to change password.');
      }

      setPasswordSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordErrorMsg(err.message || 'Error changing password');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);
    setAddressErrorMsg(null);

    try {
      const token = getAuthToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      const res = await fetch('/api/users/me/addresses', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          label: newAddrLabel,
          street: newAddrStreet,
          building: newAddrBuilding || undefined,
          city: newAddrCity,
          country: newAddrCountry,
          zipcode: newAddrZipcode || undefined,
          isDefault: newAddrDefault,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add address');
      }

      setShowAddressModal(false);
      setNewAddrStreet('');
      setNewAddrBuilding('');
      setNewAddrZipcode('');
      setNewAddrDefault(false);
      fetchSettings();
    } catch (err: any) {
      setAddressErrorMsg(err.message || 'Error creating address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const token = getAuthToken();
      const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/users/me/addresses/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete address:', err);
    }
  };

  const tabs: Array<{ id: Tab; label: string; icon: typeof User }> = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'addresses', label: 'Delivery Addresses', icon: MapPin },
    { id: 'security', label: 'Security & Password', icon: Shield },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  if (loading) {
    return (
      <div className="p-8 min-h-full bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 font-semibold">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-full bg-slate-50 flex items-center justify-center">
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center max-w-md shadow-sm">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Settings unavailable</h1>
          <p className="text-sm text-slate-600 mb-5">{error}</p>
          <button
            onClick={fetchSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-white rounded-xl font-bold text-xs shadow-md hover:bg-[#b8902a] transition"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-full space-y-6 max-w-7xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#251541] flex items-center gap-2.5 tracking-tight">
          <User className="w-7 h-7 text-[#7b2377]" />
          Account Settings
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your personal details, delivery addresses, and account security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-xs font-bold ${
                    activeTab === tab.id
                      ? 'bg-[#D4AF37] text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Update your contact details for live delivery updates and invoices
                </p>
              </div>

              {profileSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              {profileErrorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{profileErrorMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                      placeholder="e.g. Ahmed Al Mansoori"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Email Address (Account ID)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Email is locked to your authenticated session.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Mobile Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      placeholder="+971 50 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 bg-[#D4AF37] text-slate-950 rounded-xl font-bold text-xs hover:bg-[#b8902a] transition shadow-md flex items-center gap-2"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Saved Addresses</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Manage your delivery locations for faster sheesha ordering
                  </p>
                </div>

                <button
                  onClick={() => setShowAddressModal(true)}
                  className="px-4 py-2 bg-[#D4AF37] text-slate-950 font-bold text-xs rounded-xl hover:bg-[#b8902a] transition flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="p-10 text-center border border-dashed border-slate-200 rounded-2xl">
                  <MapPin className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-bold text-slate-700 text-sm">No addresses saved yet</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Add your home, office, or villa address for express sheesha delivery.
                  </p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition"
                  >
                    Add First Address
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-[#D4AF37]" />
                            {address.label}
                          </span>
                          {address.isDefault && (
                            <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#74189B] text-[10px] font-bold rounded-md">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600">
                          {[address.building, address.street, address.city, address.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        {address.zipcode && (
                          <p className="text-[11px] text-slate-400">Postal Code: {address.zipcode}</p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-200/60 mt-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Security & Password</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Change your password to keep your account safe and protected
                </p>
              </div>

              {passwordSuccessMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}

              {passwordErrorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat new password"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="px-6 py-2.5 bg-[#D4AF37] text-slate-950 rounded-xl font-bold text-xs hover:bg-[#b8902a] transition shadow-md flex items-center gap-2"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: Payment Methods */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Supported Payment Methods</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Payment configuration for UAE delivery and verified transactions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Card on Arrival</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Our dispatch couriers carry wireless POS terminals accepting Visa, Mastercard, and Apple Pay.
                    </p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md">
                      ACTIVE
                    </span>
                  </div>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Cash on Delivery (COD)</h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Pay in cash directly to the certified SheeshaTonight driver upon delivery and setup.
                    </p>
                    <span className="inline-block mt-3 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-800 space-y-1">
                <p className="font-bold">FTA Compliant Tax Invoicing</p>
                <p>
                  Every completed order generates an official UAE VAT Tax Invoice (5% VAT) under TRN: 100482938400003, accessible in your order history.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 max-w-xl">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Notification Preferences</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Choose how you want to be notified about live orders and exclusive specials
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Live Order Dispatch & Delivery Tracking',
                    desc: 'Instant notifications when your sheesha driver is en route.',
                    defaultChecked: true,
                  },
                  {
                    title: 'Rental Session End Reminders',
                    desc: 'Alerts 1 hour before scheduled sheesha pickup or rental extension.',
                    defaultChecked: true,
                  },
                  {
                    title: 'VIP Offers & Lounge Discounts',
                    desc: 'Curated promotional codes and weekend special packages.',
                    defaultChecked: false,
                  },
                ].map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100/60 transition"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.defaultChecked}
                      className="mt-0.5 w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-slate-300"
                    />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-900 text-white">
              <h3 className="font-bold text-sm">Add New Delivery Address</h3>
              <button
                onClick={() => setShowAddressModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAddress} className="p-6 space-y-4 text-xs">
              {addressErrorMsg && (
                <div className="p-3 bg-red-50 text-red-600 rounded-xl font-semibold">
                  {addressErrorMsg}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Label (e.g. Home, Office, Villa)
                </label>
                <input
                  type="text"
                  value={newAddrLabel}
                  onChange={(e) => setNewAddrLabel(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Street Address
                </label>
                <input
                  type="text"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  required
                  placeholder="Street / Area name"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                  Building / Villa / Apt Number
                </label>
                <input
                  type="text"
                  value={newAddrBuilding}
                  onChange={(e) => setNewAddrBuilding(e.target.value)}
                  placeholder="e.g. Villa 12, Tower B, Apt 1404"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    City
                  </label>
                  <input
                    type="text"
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 uppercase tracking-wider text-[10px]">
                    Country
                  </label>
                  <input
                    type="text"
                    value={newAddrCountry}
                    onChange={(e) => setNewAddrCountry(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={newAddrDefault}
                  onChange={(e) => setNewAddrDefault(e.target.checked)}
                  className="w-4 h-4 text-[#D4AF37] focus:ring-[#D4AF37] rounded border-slate-300"
                />
                <span className="font-semibold text-slate-700">Set as default delivery address</span>
              </label>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingAddress}
                  className="px-5 py-2 bg-[#D4AF37] text-slate-950 rounded-xl font-bold hover:bg-[#b8902a] transition flex items-center gap-1.5"
                >
                  {savingAddress ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  <span>Save Address</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
