'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, AuthUser } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { setSessionCookie, clearSessionCookie } from '@/lib/session';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  login: (payload: { phone?: string; email?: string }) => Promise<void>;
  verifyAge: (ageVerified: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const { setLoggedIn, setUserRole, setUserData, logout: storeLogout } = useAuthStore();

  useEffect(() => {
    // Check if token exists in localStorage on hydration
    const token = localStorage.getItem('auth_token');
    
    const parseCookies = () => {
      if (typeof document === 'undefined') return {};
      return document.cookie.split(';').reduce<Record<string, string>>((acc, cookie) => {
        const [rawName, rawValue] = cookie.split('=');
        if (!rawName || !rawValue) return acc;
        try {
          acc[rawName.trim()] = decodeURIComponent(rawValue.trim());
        } catch {
          acc[rawName.trim()] = rawValue.trim();
        }
        return acc;
      }, {});
    };

    const cookies = parseCookies();

    if (token && cookies.user_email && cookies.user_role) {
      const decodedUser: AuthUser = {
        id: 'user_123',
        role: cookies.user_role as any,
        email: cookies.user_email,
        name: cookies.user_name || 'Guest User',
      };
      setUser(decodedUser);
      setUserData({
        email: decodedUser.email,
        name: decodedUser.name || 'Guest User',
      });
      setUserRole(decodedUser.role);
      setLoggedIn(true);
    }
    setLoading(false);
  }, [setLoggedIn, setUserData, setUserRole]);

  const login = async (payload: { phone?: string; email?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.login(payload);
      if (res.success) {
        setSessionId(res.sessionId);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyAge = async (ageVerified: boolean) => {
    if (!sessionId) {
      throw new Error('No active login session');
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.auth.ageGateVerify({ sessionId, ageVerified });
      if (res.success && res.user) {
        setUser(res.user);
        
        // Sync to Zustand Store
        setUserData({
          email: res.user.email,
          name: res.user.name || 'Guest User',
        });
        setUserRole(res.user.role);
        setLoggedIn(true);

        // Sync to cookies for SSR Middleware
        setSessionCookie({
          role: res.user.role,
          email: res.user.email,
          name: res.user.name || 'Guest User',
          region: 'Dubai, UAE',
        });
      } else {
        throw new Error(res.message || 'Age verification failed');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSessionId(null);
    localStorage.removeItem('auth_token');
    clearSessionCookie();
    storeLogout();
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, sessionId, login, verifyAge, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
