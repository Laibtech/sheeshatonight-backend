'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, User, Phone, MapPin, Loader2, Eye, EyeOff, Store } from 'lucide-react';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    region: 'Dubai, UAE',
    businessName: '', // For vendors
    businessType: '', // For vendors
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const role = searchParams?.get('role');
    if (role === 'vendor') {
      setFormData(prev => ({ ...prev, role: 'VENDOR' }));
    } else if (role === 'customer') {
      setFormData(prev => ({ ...prev, role: 'CUSTOMER' }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.firstName || formData.firstName.length < 2) {
      setError('First name must be at least 2 characters');
      return false;
    }
    if (!formData.lastName || formData.lastName.length < 2) {
      setError('Last name must be at least 2 characters');
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.role === 'VENDOR') {
      if (!formData.businessName || formData.businessName.length < 2) {
        setError('Business name is required for vendors');
        return false;
      }
      if (!formData.businessType) {
        setError('Business type is required for vendors');
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
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword, // Add confirmPassword
          role: formData.role,
          region: formData.region,
          // Vendor-specific fields
          ...(formData.role === 'VENDOR' && {
            businessName: formData.businessName,
            businessType: formData.businessType,
          }),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/auth/login?role=' + (formData.role === 'VENDOR' ? 'vendor' : 'customer'));
      }, 2000);
    } catch (err) {
      console.error('Signup error:', err);
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-amber-200/20 rounded-full blur-3xl top-20 left-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-amber-300/15 rounded-full blur-3xl bottom-20 right-20 animate-pulse delay-1000" />
      </div>

      {/* Signup Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.png" 
              alt="SheeshaTonight" 
              className="h-14 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
            Create Account
          </h1>
          <p className="text-slate-600 text-center mb-6">
            Join as a {formData.role === 'VENDOR' ? 'Seller' : 'Buyer'}
          </p>

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Vendor-specific fields */}
            {formData.role === 'VENDOR' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Name
                  </label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      placeholder="Your Business Name"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Business Type
                  </label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="retailer">Retailer</option>
                    <option value="wholesaler">Wholesaler</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="rental">Rental Service</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+971 50 123 4567"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Region
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all appearance-none"
                >
                  <option value="Dubai, UAE">Dubai, UAE</option>
                  <option value="Abu Dhabi, UAE">Abu Dhabi, UAE</option>
                  <option value="Sharjah, UAE">Sharjah, UAE</option>
                  <option value="London, UK">London, UK</option>
                  <option value="Manchester, UK">Manchester, UK</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#B8902A] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Already have an account?{' '}
              <button 
                onClick={() => router.push('/auth/login')}
                className="text-[#D4AF37] hover:text-[#B8902A] font-semibold"
              >
                Sign In
              </button>
            </p>
            <p className="text-slate-400 text-xs mt-4">
              By signing up, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#D4AF37]/10 rounded-full blur-xl" />
        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-xl" />
      </div>
    </div>
  );
}
