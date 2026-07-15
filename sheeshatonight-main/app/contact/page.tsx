'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you! We will contact you soon.');
  };

  return (
    <PageLayout>
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-4">Contact Us</h1>
            <p className="text-xl text-slate-600">Get in touch with our team</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Phone</h3>
                    <p className="text-slate-600">+971 50 123 1111</p>
                    <p className="text-sm text-slate-500 mt-1">Mon-Sun: 24/7 Available</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                    <p className="text-slate-600">support@sheeshatonight.com</p>
                    <p className="text-sm text-slate-500 mt-1">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1">Location</h3>
                    <p className="text-slate-600">Dubai, United Arab Emirates</p>
                    <p className="text-sm text-slate-500 mt-1">Serving all Emirates</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-[#D4AF37] text-white rounded-lg font-semibold hover:bg-[#B8902A] transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
