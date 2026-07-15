'use client';

import { useAuthContext } from '@/components/AuthProvider';

export const useAuth = () => {
  const context = useAuthContext();
  return {
    user: context.user,
    loading: context.loading,
    error: context.error,
    sessionId: context.sessionId,
    login: context.login,
    verifyAge: context.verifyAge,
    logout: context.logout,
  };
};
