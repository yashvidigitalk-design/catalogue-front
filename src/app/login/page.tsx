'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layers, Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { triggerToast } from '@/hooks/useToast';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      triggerToast('success', 'Welcome Back!', 'Logged in successfully.');
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gradient-to-tr from-[#F1F0FB] via-[#F8F7FF] to-[#EAE7FC] select-none">
      {/* Soft Pastel Ambient Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#E0E7FF]/70 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#FFE4E6]/50 blur-[110px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#EDE9FE]/60 blur-[120px] pointer-events-none" />

      {/* Subtle Dot Mesh Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none bg-[radial-gradient(#4E45D5_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      {/* Elevated Glassmorphism Login Card */}
      <div className="w-full max-w-[410px] relative z-10">
        <div className="bg-white/85 backdrop-blur-xl border border-white/80 rounded-3xl shadow-[0_20px_50px_rgba(78,69,213,0.08),0_1px_3px_rgba(16,14,38,0.03)] ring-1 ring-[#E2E1EC]/60 p-7 sm:p-9 space-y-6">
          {/* Brand Header */}
          <div className="text-center space-y-2">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#4E45D5] to-[#6860EF] flex items-center justify-center mx-auto shadow-md shadow-[#4E45D5]/25 text-white">
              <Layers className="w-6 h-6 text-white" />
            </div>

            <div>
              <h1
                className="text-2xl font-bold text-[#100E26] tracking-tight mt-3"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                TexLoom
              </h1>
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4E45D5] text-[11px] font-semibold tracking-wide">
                Wholesale Seller Portal
              </div>
            </div>

            <p className="text-xs text-[#5A586E] pt-0.5">
              Welcome back! Please enter your details.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-[#FFF1F2] border border-[#FECDD3] text-[#E11D48] text-xs font-medium rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-[#100E26] mb-1.5"
              >
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9493A8] group-focus-within:text-[#4E45D5] transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full h-11 pl-10 pr-3.5 text-xs sm:text-sm bg-white/80 border border-[#E2E1EC] rounded-xl text-[#100E26] placeholder-[#9493A8] focus:bg-white focus:outline-none focus:border-[#4E45D5] focus:ring-4 focus:ring-[#4E45D5]/10 shadow-2xs transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-[#100E26] mb-1.5"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9493A8] group-focus-within:text-[#4E45D5] transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-10 text-xs sm:text-sm bg-white/80 border border-[#E2E1EC] rounded-xl text-[#100E26] placeholder-[#9493A8] focus:bg-white focus:outline-none focus:border-[#4E45D5] focus:ring-4 focus:ring-[#4E45D5]/10 shadow-2xs transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#9493A8] hover:text-[#100E26] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#4E45D5] to-[#6860EF] hover:from-[#4338CA] hover:to-[#5B52E0] active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#4E45D5]/25 hover:shadow-lg hover:shadow-[#4E45D5]/35 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Footnote */}
          <div className="pt-2 border-t border-[#F1F0F7] flex items-center justify-center gap-1.5 text-[11px] text-[#9493A8]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>256-bit SSL Encrypted &bull; Surat Mill Operations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
