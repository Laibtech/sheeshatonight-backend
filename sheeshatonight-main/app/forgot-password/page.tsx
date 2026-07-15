import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-xl p-10">
        <h1 className="text-3xl font-black text-slate-900 mb-4">Forgot Password</h1>
        <p className="text-sm text-slate-600 mb-8">
          Enter your email address and we’ll send you a secure link to reset your password.
        </p>

        <label className="text-sm text-slate-700 font-semibold mb-2 block">
          Email address
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 mb-6"
        />

        <button className="w-full rounded-2xl bg-amber-500 px-4 py-3 text-slate-950 font-bold hover:bg-amber-600 transition">
          Send reset link
        </button>

        <p className="mt-6 text-sm text-slate-500 text-center">
          Remembered your password?{' '}
          <Link href="/" className="text-amber-600 hover:text-amber-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
