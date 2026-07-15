'use client';

import React, { useEffect } from 'react';

interface ToastProps {
  open: boolean;
  message: string;
  variant?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ open, message, variant = 'info', onClose }) => {
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(onClose, 3200);
    return () => window.clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  const bgClass = variant === 'success' ? 'bg-emerald-500' : variant === 'error' ? 'bg-rose-500' : 'bg-slate-900';

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-3xl px-6 py-4 text-white shadow-2xl ${bgClass}`}>
      {message}
    </div>
  );
};
