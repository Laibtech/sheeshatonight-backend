'use client';

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

const threads = [
  { id: 'M-001', customer: 'Amina Ali', preview: 'Can I change the flavor pack?', time: '8m ago', unread: true },
  { id: 'M-002', customer: 'Majid Khan', preview: 'Please update the delivery window.', time: '45m ago', unread: false },
  { id: 'M-003', customer: 'Leila Omar', preview: 'Is the hookah set available tomorrow?', time: '2h ago', unread: false },
];

export default function VendorMessages() {
  const [selectedId, setSelectedId] = useState('M-001');

  const activeThread = threads.find((thread) => thread.id === selectedId) ?? threads[0]!;

  return (
    <div className="bg-slate-50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Messages</p>
              <h1 className="text-3xl font-black text-slate-900 mt-3">Customer Conversations</h1>
              <p className="text-slate-600 mt-2">Respond quickly to customer questions and order clarifications.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-3xl bg-amber-500 px-4 py-3 text-white shadow-lg shadow-amber-500/20">
              <MessageSquare size={18} /> Live Chat
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedId(thread.id)}
                  className={`w-full rounded-3xl p-4 text-left transition ${thread.id === selectedId ? 'bg-amber-50 border border-amber-200' : 'hover:bg-slate-50'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{thread.customer}</p>
                    <span className="text-xs text-slate-500">{thread.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{thread.preview}</p>
                </button>
              ))}
            </div>

            <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500 font-semibold">Conversation</p>
                  <h2 className="text-xl font-bold text-slate-900 mt-2">{activeThread.customer}</h2>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Active</span>
              </div>
              <div className="space-y-4 rounded-3xl bg-slate-50 p-4">
                <div className="rounded-3xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-900">{activeThread.customer}</p>
                  <p className="text-slate-600 mt-2">Hi — I want to confirm whether the hookah shipment can be delivered at 9 PM.</p>
                </div>
                <div className="rounded-3xl bg-amber-50 p-4 shadow-sm self-end">
                  <p className="text-sm font-semibold text-slate-900">You</p>
                  <p className="text-slate-600 mt-2">Yes, we can schedule it for 9 PM and include the extra flavor pack. Would you like the premium tobacco?</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-4">
                <input type="text" placeholder="Write a message..." className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-amber-500" />
                <button className="rounded-3xl bg-amber-500 px-5 py-3 text-white font-semibold hover:bg-amber-600 transition">Send</button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
