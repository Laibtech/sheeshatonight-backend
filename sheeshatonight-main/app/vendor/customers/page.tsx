'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, Loader2, Mail, Calendar, ArrowUpRight } from 'lucide-react';

interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string;
}

export default function VendorCustomers() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getAuthToken = () => {
    if (typeof window === 'undefined') return '';
    let token = localStorage.getItem('auth_token');
    if (!token) {
      const match = document.cookie.match(/(?:^|; )auth_token=([^;]*)/);
      if (match && match[1]) token = decodeURIComponent(match[1]);
    }
    return token || '';
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch('/api/vendor/orders?pageSize=100', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Aggregate unique customers from vendor orders
        const customerMap = new Map<string, CustomerSummary>();

        for (const order of data.data) {
          const user = order.user;
          if (!user) continue;

          const key = user.email || user.id;
          if (!customerMap.has(key)) {
            customerMap.set(key, {
              id: user.id || key,
              name: user.name || 'Store Customer',
              email: user.email || 'N/A',
              orderCount: 1,
              totalSpent: Number(order.totalAmount || order.total || 0),
              lastOrderDate: order.createdAt,
            });
          } else {
            const existing = customerMap.get(key)!;
            existing.orderCount += 1;
            existing.totalSpent += Number(order.totalAmount || order.total || 0);
            if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
              existing.lastOrderDate = order.createdAt;
            }
          }
        }

        setCustomers(Array.from(customerMap.values()));
      }
    } catch (err) {
      console.error('Failed to load store customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Store Customers</h2>
          <p className="text-xs text-slate-500 mt-1">
            Track customer order frequency, loyalty, and lifetime spend for your store.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#8A277E]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-[#8A277E] animate-spin mx-auto mb-2" />
            <p className="text-xs text-slate-400">Loading store customers...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No customers found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Customers who place orders with your store will appear in this directory.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Orders Placed</th>
                  <th className="py-3 px-5">Lifetime Value</th>
                  <th className="py-3 px-5">Last Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 text-[#8A277E] font-bold text-xs flex items-center justify-center shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xs">{c.name}</p>
                          <p className="text-[11px] text-slate-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-700">
                      {c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}
                    </td>
                    <td className="py-3.5 px-5 font-bold font-mono text-[#8A277E]">
                      AED {c.totalSpent.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {new Date(c.lastOrderDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
