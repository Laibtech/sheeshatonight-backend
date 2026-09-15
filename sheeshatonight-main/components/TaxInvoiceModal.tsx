'use client';

import React from 'react';
import Image from 'next/image';
import { Printer, Download, X, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface TaxInvoiceData {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  orderId?: string;
  issuedAt: string;
  status: string;
  paymentMethod?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
  };
  vendor?: {
    name: string;
    location?: string;
    phone?: string;
  };
  items?: Array<{
    id?: string;
    title: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  shippingFee?: number;
  total: number;
}

interface TaxInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TaxInvoiceData | null;
}

export function TaxInvoiceModal({ isOpen, onClose, data }: TaxInvoiceModalProps) {
  if (!isOpen || !data) return null;

  const formatAED = (amount: number = 0) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Action Top Bar (Hidden on Print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-slate-900 text-white">
          <div className="flex items-center gap-2 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official UAE Tax Invoice Preview</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Paper */}
        <div className="p-8 sm:p-12 text-slate-800 bg-white" id="printable-tax-invoice">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-8 border-b-2 border-slate-100">
            <div>
              <Image
                src="/logo.png"
                alt="SheeshaTonight"
                width={190}
                height={60}
                priority
                className="object-contain mb-3"
              />
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                SheeshaTonight Portal LLC
              </p>
              <p className="text-xs text-slate-500">Sheikh Zayed Road, Downtown Dubai</p>
              <p className="text-xs text-slate-500">Dubai, United Arab Emirates</p>
              <p className="text-xs font-semibold text-[#74189B] mt-1">
                TRN (VAT Registration): 100482938400003
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-md bg-[#74189B]/10 text-[#74189B] text-xs font-black uppercase tracking-widest mb-2">
                TAX INVOICE / فاتورة ضريبية
              </span>
              <h2 className="text-xl font-mono font-black text-slate-900">
                #{data.invoiceNumber}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Order Ref: <span className="font-bold text-slate-800">#{data.orderNumber}</span>
              </p>
              <p className="text-xs text-slate-500">
                Date:{' '}
                <span className="font-semibold text-slate-800">
                  {new Date(data.issuedAt).toLocaleDateString('en-AE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </p>
              <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black">
                <CheckCircle2 className="w-3 h-3" />
                <span>PAID & VERIFIED</span>
              </div>
            </div>
          </div>

          {/* Parties Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-6 border-b border-slate-100 text-xs">
            <div>
              <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">
                Billed To (Customer)
              </p>
              <h3 className="text-sm font-bold text-slate-900">{data.customer.name}</h3>
              <p className="text-slate-600 mt-0.5">{data.customer.email}</p>
              {data.customer.phone && <p className="text-slate-600">{data.customer.phone}</p>}
              {data.customer.address && (
                <p className="text-slate-600 mt-1">
                  {data.customer.address}
                  {data.customer.city ? `, ${data.customer.city}` : ', UAE'}
                </p>
              )}
            </div>

            <div className="sm:text-right">
              <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 mb-1">
                Fulfilled By (Vendor / Partner)
              </p>
              <h3 className="text-sm font-bold text-slate-900">
                {data.vendor?.name || 'SheeshaTonight Direct'}
              </h3>
              <p className="text-slate-600 mt-0.5">
                {data.vendor?.location || 'Dubai, United Arab Emirates'}
              </p>
              <p className="text-slate-500 mt-1">Payment Method: {data.paymentMethod || 'Online Payment'}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 text-slate-700">Item Description</th>
                  <th className="pb-3 text-center">Qty</th>
                  <th className="pb-3 text-right">Unit Price</th>
                  <th className="pb-3 text-right">VAT (5%)</th>
                  <th className="pb-3 text-right">Total (AED)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, idx) => {
                    const lineSubtotal = item.price * item.quantity;
                    const lineVat = lineSubtotal * 0.05;
                    return (
                      <tr key={idx} className="py-3">
                        <td className="py-3 font-semibold text-slate-900">
                          {item.title}
                        </td>
                        <td className="py-3 text-center text-slate-600 font-bold">
                          {item.quantity}
                        </td>
                        <td className="py-3 text-right text-slate-600 font-mono">
                          {formatAED(item.price)}
                        </td>
                        <td className="py-3 text-right text-slate-500 font-mono">
                          {formatAED(lineVat)}
                        </td>
                        <td className="py-3 text-right font-black text-slate-900 font-mono">
                          {formatAED(lineSubtotal + lineVat)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-3 font-semibold text-slate-900">
                      Standard Sheesha Rental & Service Package
                    </td>
                    <td className="py-3 text-center text-slate-600 font-bold">1</td>
                    <td className="py-3 text-right text-slate-600 font-mono">
                      {formatAED(data.subtotal)}
                    </td>
                    <td className="py-3 text-right text-slate-500 font-mono">
                      {formatAED(data.tax)}
                    </td>
                    <td className="py-3 text-right font-black text-slate-900 font-mono">
                      {formatAED(data.total)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Calculation Box */}
          <div className="flex justify-end pt-4 border-t-2 border-slate-100">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Excl. VAT)</span>
                <span className="font-mono font-semibold">{formatAED(data.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>UAE VAT (5%)</span>
                <span className="font-mono font-semibold">{formatAED(data.tax)}</span>
              </div>
              {data.shippingFee ? (
                <div className="flex justify-between text-slate-600">
                  <span>Delivery & Setup</span>
                  <span className="font-mono font-semibold">{formatAED(data.shippingFee)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-sm font-black text-slate-900 pt-3 border-t-2 border-slate-200">
                <span>Grand Total</span>
                <span className="text-base text-[#74189B] font-mono">
                  {formatAED(data.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Compliance Notice & Stamp */}
          <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="max-w-md text-left">
              <p className="font-semibold text-slate-600">
                Thank you for choosing SheeshaTonight!
              </p>
              <p className="mt-0.5">
                This document is a certified electronic tax invoice issued under the regulations of the UAE Federal Tax Authority (FTA).
              </p>
            </div>

            <div className="text-center sm:text-right border border-dashed border-slate-300 rounded-xl px-4 py-2 bg-slate-50">
              <p className="text-[10px] uppercase font-bold text-slate-500">Authorized Signatory</p>
              <p className="font-serif italic font-bold text-slate-800 text-sm mt-0.5">
                SheeshaTonight Portal LLC
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
