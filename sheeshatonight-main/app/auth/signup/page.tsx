'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, MapPin, Loader2, Eye, EyeOff, Store, CheckCircle2, UserCheck } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { setSessionCookie } from '@/lib/session';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoggedIn, setUserRole, setUserData } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    region: 'Dubai, UAE',
    businessName: '',
    businessType: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const role = searchParams?.get('role');
    if (role === 'vendor' || role === 'VENDOR') {
      setFormData((prev) => ({ ...prev, role: 'VENDOR' }));
    } else if (role === 'customer' || role === 'CUSTOMER') {
      setFormData((prev) => ({ ...prev, role: 'CUSTOMER' }));
    }
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      setError('First name must be at least 2 characters.');
      return false;
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      setError('Last name must be at least 2 characters.');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    if (formData.role === 'VENDOR') {
      if (!formData.businessName || formData.businessName.trim().length < 2) {
        setError('Business name is required for vendor registration.');
        return false;
      }
      if (!formData.businessType) {
        setError('Please select your business type.');
        return false;
      }
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Use different endpoint for vendor registration
      const endpoint = formData.role === 'VENDOR' 
        ? '/api/auth/register/vendor' 
        : '/api/auth/register';

      const requestBody = formData.role === 'VENDOR'
        ? {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            businessName: formData.businessName,
            businessType: formData.businessType,
            region: formData.region,
          }
        : {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            role: formData.role,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setError('An account with this email address already exists.');
        } else {
          setError(data.error || 'Unable to create your account. Please try again.');
        }
        setLoading(false);
        return;
      }

      const { user, token } = data;

      if (token) {
        localStorage.setItem('auth_token', token);
      }

      setUserData({
        email: user.email,
        name: user.name,
      });
      setUserRole(user.role);
      setLoggedIn(true);

      setSessionCookie({
        role: user.role,
        email: user.email,
        name: user.name,
        region: formData.region,
      });

      // Show success message
      if (formData.role === 'VENDOR') {
        setSuccess('Vendor account created successfully! Your account is pending approval.');
      } else {
        setSuccess('Account created successfully! Redirecting...');
      }

      setTimeout(() => {
        const redirectPath =
          user.role === 'ADMIN'
            ? '/admin'
            : user.role === 'VENDOR'
            ? '/vendor'
            : '/dashboard';
        router.push(redirectPath);
      }, 1000);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Unable to connect. Please check your backend server / internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      {/* Main Area */}
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gradient-to-b from-purple-950/5 via-slate-50 to-slate-100 relative overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-900/10 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl opacity-40" />
        </div>

        <div className="w-full max-w-xl relative z-10">
          {/* Header Title & Branding */}
          <div className="text-center mb-8">
            <span className="inline-block text-[#8a277d] text-xs font-extrabold uppercase tracking-[2px] mb-2">
              JOIN THE EXPERIENCE
            </span>

            {/* Signature SheeshaTonight Gold Ornament */}
            <div className="gold-line flex items-center justify-center gap-1.5 my-2">
              <i className="w-6 h-[1px] bg-[#f5b83d]" />
              <b className="w-1.5 h-1.5 bg-[#f5b83d] rounded-full" />
              <i className="w-6 h-[1px] bg-[#f5b83d]" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-serif">
              Create Your <span className="text-[#8a277d]">Account</span>
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Join UAE & UK’s premium sheesha rental and tobacco marketplace
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-[#e9e4eb] rounded-2xl shadow-xl p-6 sm:p-8 backdrop-blur-sm">
            {/* Account Type Selector (Buyer vs Vendor) */}
            <div className="mb-6 grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'CUSTOMER' }))}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
                  formData.role === 'CUSTOMER'
                    ? 'bg-[#8a277d] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Customer (Buyer)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, role: 'VENDOR' }))}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all ${
                  formData.role === 'VENDOR'
                    ? 'bg-[#8a277d] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Vendor (Seller)</span>
              </button>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    First Name <span className="text-[#8a277d]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Last Name <span className="text-[#8a277d]">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Vendor Fields */}
              {formData.role === 'VENDOR' && (
                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-xl space-y-4">
                  <p className="text-xs font-bold text-[#8a277d] uppercase tracking-wider">
                    Vendor Details
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Business Name <span className="text-[#8a277d]">*</span>
                    </label>
                    <div className="relative">
                      <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="e.g. Sultan Sheesha Lounge"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Business Type <span className="text-[#8a277d]">*</span>
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                      required
                    >
                      <option value="">Select Business Type</option>
                      <option value="retailer">Retailer</option>
                      <option value="wholesaler">Wholesaler</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="rental">Rental Service & Delivery</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address <span className="text-[#8a277d]">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Phone & Region Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-[#8a277d]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+971 50 123 4567"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Region <span className="text-[#8a277d]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium appearance-none"
                    >
                      <option value="Dubai, UAE">Dubai, UAE</option>
                      <option value="Abu Dhabi, UAE">Abu Dhabi, UAE</option>
                      <option value="Sharjah, UAE">Sharjah, UAE</option>
                      <option value="London, UK">London, UK</option>
                      <option value="Manchester, UK">Manchester, UK</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Passwords Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password <span className="text-[#8a277d]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 8 characters"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#8a277d] p-1 transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password <span className="text-[#8a277d]">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a277d]" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#8a277d] focus:ring-4 focus:ring-[#8a277d]/10 transition-all font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#8a277d] p-1 transition-colors"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 text-xs font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {/* Success Box */}
              {success && (
                <div className="p-3.5 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <p className="text-green-700 text-xs font-medium">{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-[#8a277d] hover:bg-[#641c5f] active:bg-[#52154e] text-white font-bold rounded-xl shadow-lg shadow-purple-900/20 hover:shadow-purple-900/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm tracking-wide mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            {/* Bottom Link */}
            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-600 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-[#8a277d] hover:text-[#641c5f] font-bold underline underline-offset-4 ml-1 transition-colors"
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-10 h-10 text-[#8a277d] animate-spin" />
        </div>
      }
    >
      <SignupContent />
    </Suspense>
  );
}
