'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  isDangerous?: boolean;
  isDanger?: boolean;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmLabel,
  cancelText = 'Cancel',
  isDangerous = true,
  isDanger,
  loading = false,
}) => {
  if (!isOpen) return null;

  const handleClose = onClose || onCancel || (() => {});
  const effectiveConfirmText = confirmLabel || confirmText;
  const effectiveIsDanger = isDanger !== undefined ? isDanger : isDangerous;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-[#E9E3EB] shadow-2xl p-6 overflow-hidden">
        <button
          onClick={handleClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              effectiveIsDanger
                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                : 'bg-purple-50 text-[#74189B] border border-purple-100'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="flex-1">
            <h3 className="text-base font-bold text-[#29252B] mb-1">{title}</h3>
            <p className="text-xs text-[#716975] leading-relaxed mb-6">{message}</p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition"
              >
                {cancelText}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`px-4 py-2 text-xs font-bold text-white rounded-xl transition shadow-xs flex items-center gap-1.5 ${
                  effectiveIsDanger
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-[#74189B] hover:bg-[#571275]'
                } disabled:opacity-50`}
              >
                {loading ? 'Processing...' : effectiveConfirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

