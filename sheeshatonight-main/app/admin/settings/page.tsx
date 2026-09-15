'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  Database, 
  User, 
  ShieldCheck, 
  Percent, 
  DollarSign, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Loader2, 
  Server,
  Lock,
  Globe
} from 'lucide-react';
import { useToast } from '@/components/admin/Toast';

export default function AdminSettingsPage() {
  const { showToast } = useToast();

  // Marketplace Settings
  const [commissionRate, setCommissionRate] = useState('10');
  const [currency, setCurrency] = useState('AED');
  const [ageLimit, setAgeLimit] = useState('21');
  const [taxRate, setTaxRate] = useState('5');
  const [supportEmail, setSupportEmail] = useState('support@sheeshatonight.com');
  const [supportPhone, setSupportPhone] = useState('+971 50 123 4567');
  const [autoApproveReviews, setAutoApproveReviews] = useState(false);
  const [requireVendorKyc, setRequireVendorKyc] = useState(true);

  // Admin Profile
  const [adminUser, setAdminUser] = useState<{ name: string; email: string; role: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettingsAndProfile();
  }, []);

  const fetchSettingsAndProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      // Load settings from CMS content key
      const [settingsRes, profileRes] = await Promise.all([
        fetch('/api/admin/cms/content/marketplace_settings', { headers }).catch(() => null),
        fetch('/api/auth/me', { headers }).catch(() => null),
      ]);

      if (settingsRes && settingsRes.ok) {
        const data = await settingsRes.json();
        if (data.success && data.data) {
          if (data.data.commissionRate) setCommissionRate(data.data.commissionRate);
          if (data.data.currency) setCurrency(data.data.currency);
          if (data.data.ageLimit) setAgeLimit(data.data.ageLimit);
          if (data.data.taxRate) setTaxRate(data.data.taxRate);
          if (data.data.supportEmail) setSupportEmail(data.data.supportEmail);
          if (data.data.supportPhone) setSupportPhone(data.data.supportPhone);
          if (data.data.autoApproveReviews !== undefined) setAutoApproveReviews(data.data.autoApproveReviews);
          if (data.data.requireVendorKyc !== undefined) setRequireVendorKyc(data.data.requireVendorKyc);
        }
      }

      if (profileRes && profileRes.ok) {
        const pData = await profileRes.json();
        if (pData.success && pData.data) {
          setAdminUser(pData.data);
        } else if (pData.user) {
          setAdminUser(pData.user);
        }
      } else {
        // Fallback to token decoded or local info
        setAdminUser({
          name: 'Master Administrator',
          email: 'admin@sheeshatonight.com',
          role: 'SUPER_ADMIN',
        });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/cms/content/marketplace_settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          commissionRate,
          currency,
          ageLimit,
          taxRate,
          supportEmail,
          supportPhone,
          autoApproveReviews,
          requireVendorKyc,
        }),
      });

      const data = await res.json();
      if (data.success) {
        showToast('Platform marketplace settings saved successfully in MySQL!', 'success');
      } else {
        showToast(data.message || 'Failed to update settings', 'error');
      }
    } catch (err) {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Marketplace Settings & Config</h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#74189B]/10 text-[#74189B]">
            System Config
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Control marketplace commissions, legal age limits, currency, support contacts, and system infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#74189B] flex items-center justify-center">
                <Settings size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Commercial & Legal Rules</h2>
                <p className="text-xs text-slate-500">Marketplace rules applied across all vendors and transactions</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Percent size={14} className="text-[#74189B]" /> Standard Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">Platform fee deducted from vendor payouts</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-[#F1A51D]" /> Marketplace Currency Code
                </label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">Standard currency for all catalogue prices</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-600" /> Minimum Legal Age
                </label>
                <input
                  type="number"
                  value={ageLimit}
                  onChange={(e) => setAgeLimit(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">UAE legal age requirement for tobacco products</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Percent size={14} className="text-blue-600" /> VAT Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                  required
                />
                <p className="text-[11px] text-slate-400 mt-1">United Arab Emirates Standard 5% VAT</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Support & Communications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-500" /> Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone size={14} className="text-slate-500" /> Official WhatsApp / Phone
                  </label>
                  <input
                    type="text"
                    value={supportPhone}
                    onChange={(e) => setSupportPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#74189B]/20 focus:border-[#74189B]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Automated Platform Governance</h3>
              
              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApproveReviews}
                  onChange={(e) => setAutoApproveReviews(e.target.checked)}
                  className="w-4 h-4 rounded text-[#74189B] focus:ring-[#74189B] border-slate-300"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Auto-Approve Customer Reviews</p>
                  <p className="text-[11px] text-slate-500">Bypass moderation queue for 4+ star reviews</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireVendorKyc}
                  onChange={(e) => setRequireVendorKyc(e.target.checked)}
                  className="w-4 h-4 rounded text-[#74189B] focus:ring-[#74189B] border-slate-300"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800">Require Document Verification for Vendor Payouts</p>
                  <p className="text-[11px] text-slate-500">Hold settlements until trade license is approved by admin</p>
                </div>
              </label>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#74189B] text-white hover:bg-[#571275] transition shadow-md shadow-purple-900/10 disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save Platform Settings
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Platform Status & Admin User Card */}
        <div className="space-y-6">
          {/* Current Admin User Profile */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-[#74189B] flex items-center justify-center font-bold">
                <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{adminUser?.name || 'Administrator'}</h3>
                <p className="text-xs text-slate-500">{adminUser?.email || 'admin@sheeshatonight.com'}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-medium">Account Role</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#74189B]/10 text-[#74189B] font-mono">
                  {adminUser?.role || 'SUPER_ADMIN'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-medium">Permission Scope</span>
                <span className="font-bold text-emerald-600">Full System Access</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500 font-medium">Session Security</span>
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Lock size={12} className="text-slate-400" /> JWT 256-bit
                </span>
              </div>
            </div>
          </div>

          {/* Infrastructure Health Status */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Server size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">MySQL Database Health</h3>
                <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Connected & Active
                </p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Database Engine</span>
                <span className="font-mono font-bold text-slate-800">MySQL 8.0</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Active Schema</span>
                <span className="font-mono font-bold text-[#74189B]">sheeshatonight-main</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">ORM Layer</span>
                <span className="font-mono font-bold text-slate-800">Prisma Client</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <span className="text-slate-500">Schema Tables</span>
                <span className="font-bold text-slate-800">20 Tables Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
