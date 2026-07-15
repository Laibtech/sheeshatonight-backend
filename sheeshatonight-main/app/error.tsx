"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-xl text-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500 font-semibold">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">Application error</h1>
        <p className="mt-4 text-slate-600">An unexpected error occurred while loading this page. Try refreshing or return to safety.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button onClick={reset} className="rounded-3xl bg-amber-500 px-6 py-3 text-white font-semibold hover:bg-amber-600 transition">Try again</button>
          <Link href="/" className="rounded-3xl border border-slate-200 px-6 py-3 text-slate-700 hover:bg-slate-100 transition">Home</Link>
        </div>
      </div>
    </div>
  );
}
