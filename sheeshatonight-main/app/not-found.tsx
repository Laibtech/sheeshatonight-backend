import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-xl text-center rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-500 font-semibold">Page not found</p>
        <h1 className="mt-4 text-4xl font-black text-slate-900">404 — nothing to see here</h1>
        <p className="mt-4 text-slate-600">We couldn’t find the page you were looking for. Try returning home or checking the link.</p>
        <Link href="/" className="mt-8 inline-flex rounded-3xl bg-amber-500 px-6 py-3 text-white font-semibold hover:bg-amber-600 transition">Go back home</Link>
      </div>
    </div>
  );
}
