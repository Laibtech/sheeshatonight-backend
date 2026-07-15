'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ open, title, children, footer, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-900 transition">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">{footer}</div>}
      </div>
    </div>
  );
};
