import React from 'react';

interface PlaceholderPageProps {
  title: string;
  subtitle: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, subtitle }) => (
  <div className="p-6 max-w-7xl mx-auto">
    <h1 className="text-3xl font-black text-slate-900 mb-2">{title}</h1>
    <p className="text-slate-600 mb-8">{subtitle}</p>
    <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center">
      <p className="text-slate-600 text-lg">Page content coming soon</p>
    </div>
  </div>
);
