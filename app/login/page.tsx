"use client";

import React, { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Mail, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Initialize Supabase client using the NEXT_PUBLIC keys from your Netlify settings
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Send the Magic Link to the user's email
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This ensures the link redirects the user back to your live Netlify dashboard
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Check your email for the magic link!' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
            <Globe className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Trade Compliance Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Secure access to your CBAM 2026 reporting tools
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 ml-1">
                Business Email Address
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Sending link...' : (
                  <>
                    Send Magic Link
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                {message.text}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-center text-xs text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
              Passwordless Authentication
            </p>
            <p className="mt-3 text-center text-xs text-slate-500 font-medium">
              We'll send a secure, one-time link to your inbox. No passwords required.
            </p>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs text-slate-400">
          &copy; 2026 Trade Compliance Tool. All rights reserved.
        </p>
      </div>
    </div>
  );
}
