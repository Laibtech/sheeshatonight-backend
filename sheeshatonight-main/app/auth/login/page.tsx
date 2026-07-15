'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';
import { setSessionCookie } from '@/lib/session';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setLoggedIn, setUserRole, setUserData } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestedRole, setRequestedRole] = useState<string | null>(null);

  useEffect(() => {
    const role = searchParams?.get('role');
    setRequestedRole(role);
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Debug: Log the URL being used
      console.log('Attempting login to:', `${BACKEND_URL}/api/auth/login`);
      console.log('BACKEND_URL:', BACKEND_URL);
      console.log('NEXT_PUBLIC_API_URL:', NEXT_PUBLIC_API_URL);
      
      // Call backend login API
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      // Store JWT tokens
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('refresh_token', data.refreshToken);

      // Extract user info
      const { user } = data;

      // Update Zustand store
      setUserData({
        email: user.email,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email,
      });
      setUserRole(user.role);
      setLoggedIn(true);

      // Set session cookies for SSR
      setSessionCookie({
        role: user.role,
        email: user.email,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email,
        region: user.region || 'Dubai, UAE',
      });

      // Redirect based on role
      const roleRoutes: Record<string, string> = {
        CUSTOMER: '/dashboard',
        VENDOR: '/vendor',
        ADMIN: '/admin/dashboard',
      };

      const redirectPath = roleRoutes[user.role] || '/dashboard';
      router.push(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
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

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="/logo.png" 
              alt="SheeshaTonight" 
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-slate-900 text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-600 text-center mb-4">
            Sign in to access your premium sheesha experience
          </p>

          {/* Demo Credentials */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
            <p className="text-xs font-semibold text-amber-900 mb-1.5">🎯 Demo Login:</p>
            <div className="space-y-0.5 text-[11px] text-amber-800 font-mono">
              <p>customer@sheeshatonight.com / customer123</p>
              <p>vendor@sheeshatonight.com / vendor123</p>
              <p>admin@sheeshatonight.com / admin123</p>
            </div>
          </div>

          {requestedRole && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-800">
                Logging in as: <span className="font-semibold capitalize">{requestedRole}</span>
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#B8902A] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{' '}
              <button 
                onClick={() => router.push('/auth/signup')}
                className="text-[#D4AF37] hover:text-[#B8902A] font-semibold"
              >
                Sign Up
              </button>
            </p>
            <p className="text-slate-400 text-xs mt-4">
              By continuing, you agree to our Terms & Privacy Policy
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
