'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Layers,
  Smartphone,
  ShoppingCart,
  BarChart3,
  Palette,
  Star,
  User,
  Mail,
  Building2,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from 'lucide-react';
import { useToast } from '@/hooks/useToast';

const BUSINESS_CATEGORIES = [
  'Manufacturer / Weaving Mill',
  'Wholesaler / Stockist',
  'Semi-Wholesaler / Trader',
  'Commission Agent / Broker (Adatiya)',
  'Garment Manufacturer / Apparel Brand',
  'Dyeing & Printing Processing Mill',
  'Retailer / Boutique Buyer',
  'Jewellery / Gems & Stones',
  'Other Business',
];

const INDIAN_STATES = [
  'Gujarat',
  'Maharashtra',
  'Rajasthan',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Delhi',
  'Punjab',
  'West Bengal',
  'Karnataka',
  'Madhya Pradesh',
  'Haryana',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Bihar',
  'Odisha',
  'Other State',
];

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & Submit State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!businessName.trim()) {
      newErrors.businessName = 'Business / organization name is required';
    }

    if (!businessCategory) {
      newErrors.businessCategory = 'Please select a business category';
    }

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      newErrors.phone = 'Phone number is required';
    } else if (cleanPhone.length !== 10) {
      newErrors.phone = 'Enter a valid 10-digit mobile number';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Please fill in all required fields correctly');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast('success', 'Account created successfully! Welcome to TexLoom.');
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* ============================================================= */}
      {/* LEFT COLUMN: Dark Violet / Purple Feature Showcase             */}
      {/* ============================================================= */}
      <div className="lg:w-[45%] xl:w-[42%] bg-gradient-to-b from-[#1E194B] via-[#1A1442] to-[#0F0B2A] text-white p-7 sm:p-10 lg:p-12 xl:p-14 flex flex-col justify-between shrink-0 relative overflow-hidden">
        {/* Background glow decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#4E45D5]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-8 lg:space-y-10">
          {/* Brand Logo - Same as Dashboard */}
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#4E45D5] flex items-center justify-center shrink-0 shadow-md shadow-[#4E45D5]/30 group-hover:bg-[#6860EF] transition-colors">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-none">
                TexLoom
              </span>
              <span className="text-[10px] uppercase tracking-wider text-indigo-200/80 mt-1 font-semibold">
                Wholesale Seller
              </span>
            </div>
          </Link>

          {/* Headline & Description */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-[1.2]">
              Grow your business <br className="hidden sm:inline" />
              with digital catalogs
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed max-w-md">
              Join 1,000+ businesses using TexLoom to share products, collect orders and track buyers — all from one link.
            </p>
          </div>

          {/* 4 Feature Points */}
          <div className="space-y-5 sm:space-y-6 pt-2">
            {/* Feature 1 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-indigo-200 shadow-inner">
                <Smartphone className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Share in seconds
                </h3>
                <p className="text-[11px] sm:text-xs text-indigo-200/70 leading-relaxed">
                  Send your catalog link via WhatsApp, SMS or email — customers browse instantly without downloading an app.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-indigo-200 shadow-inner">
                <ShoppingCart className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Collect orders directly
                </h3>
                <p className="text-[11px] sm:text-xs text-indigo-200/70 leading-relaxed">
                  Buyers add to cart and place orders right inside your catalog — no separate checkout needed.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-indigo-200 shadow-inner">
                <BarChart3 className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Real-time visitor tracking
                </h3>
                <p className="text-[11px] sm:text-xs text-indigo-200/70 leading-relaxed">
                  See who opened your catalog, which products they viewed, and when — all live.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0 text-indigo-200 shadow-inner">
                <Palette className="w-4 h-4 text-indigo-200" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-white">
                  Beautiful, branded pages
                </h3>
                <p className="text-[11px] sm:text-xs text-indigo-200/70 leading-relaxed">
                  Customise colours, logo and layout to match your brand in minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof Card */}
        <div className="relative z-10 mt-8 pt-4">
          <div className="p-3.5 rounded-xl bg-white/[0.07] border border-white/15 backdrop-blur-md flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Loved by businesses across India
              </div>
              <div className="text-[11px] text-indigo-200/70">
                4.8 / 5 average rating · 1,000+ active stores
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* RIGHT COLUMN: Clean Account Registration Form                */}
      {/* ============================================================= */}
      <div className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-6 sm:px-12 lg:px-16 xl:px-20 overflow-y-auto">
        <div className="max-w-lg w-full mx-auto space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#100E26]">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-[#5A586E]">
              Start free for 7 days — no credit card required. Upgrade any time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. Full Name */}
            <div>
              <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                Full Name <span className="text-[#E11D48] mr-1">*</span>
              </label>
              <div
                className={`h-11 px-3.5 rounded-xl border bg-white flex items-center gap-2.5 transition-colors ${
                  errors.fullName
                    ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                    : 'border-[#E2E1EC] focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]'
                }`}
              >
                <User className="w-4 h-4 text-[#9493A8] shrink-0" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Your full name"
                  className="w-full h-full text-xs text-[#100E26] placeholder-[#9493A8] bg-transparent focus:outline-none"
                />
              </div>
              {errors.fullName && (
                <span className="text-[11px] text-[#E11D48] mt-1 block font-medium">
                  {errors.fullName}
                </span>
              )}
            </div>

            {/* 2. Email */}
            <div>
              <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                Email <span className="text-[#E11D48] mr-1">*</span>
              </label>
              <div
                className={`h-11 px-3.5 rounded-xl border bg-white flex items-center gap-2.5 transition-colors ${
                  errors.email
                    ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                    : 'border-[#E2E1EC] focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]'
                }`}
              >
                <Mail className="w-4 h-4 text-[#9493A8] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  placeholder="you@company.com"
                  className="w-full h-full text-xs text-[#100E26] placeholder-[#9493A8] bg-transparent focus:outline-none"
                />
              </div>
              {errors.email && (
                <span className="text-[11px] text-[#E11D48] mt-1 block font-medium">
                  {errors.email}
                </span>
              )}
            </div>

            {/* 3. Business / Organization Name */}
            <div>
              <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                Business / Organization Name <span className="text-[#E11D48] mr-1">*</span>
              </label>
              <div
                className={`h-11 px-3.5 rounded-xl border bg-white flex items-center gap-2.5 transition-colors ${
                  errors.businessName
                    ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                    : 'border-[#E2E1EC] focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#9493A8] shrink-0" />
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (errors.businessName)
                      setErrors((prev) => ({ ...prev, businessName: '' }));
                  }}
                  placeholder="e.g. Sharma Jewellers"
                  className="w-full h-full text-xs text-[#100E26] placeholder-[#9493A8] bg-transparent focus:outline-none"
                />
              </div>
              {errors.businessName && (
                <span className="text-[11px] text-[#E11D48] mt-1 block font-medium">
                  {errors.businessName}
                </span>
              )}
            </div>

            {/* 4. Business Category */}
            <div>
              <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                Business Category <span className="text-[#E11D48] mr-1">*</span>
              </label>
              <div
                className={`relative h-11 px-3.5 rounded-xl border bg-white flex items-center justify-between transition-colors ${
                  errors.businessCategory
                    ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                    : 'border-[#E2E1EC] focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]'
                }`}
              >
                <select
                  value={businessCategory}
                  onChange={(e) => {
                    setBusinessCategory(e.target.value);
                    if (errors.businessCategory)
                      setErrors((prev) => ({ ...prev, businessCategory: '' }));
                  }}
                  className={`w-full h-full text-xs bg-transparent focus:outline-none appearance-none pr-6 cursor-pointer ${
                    businessCategory ? 'text-[#100E26]' : 'text-[#9493A8]'
                  }`}
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="text-[#100E26]">
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#9493A8] pointer-events-none absolute right-3.5" />
              </div>
              {errors.businessCategory && (
                <span className="text-[11px] text-[#E11D48] mt-1 block font-medium">
                  {errors.businessCategory}
                </span>
              )}
            </div>

            {/* 5. Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                Phone Number <span className="text-[#E11D48] mr-1">*</span>
              </label>
              <div className="flex gap-2.5">
                {/* Country Code Pill */}
                <div className="h-11 px-3 rounded-xl border border-[#E2E1EC] bg-white flex items-center gap-1.5 shrink-0 select-none">
                  <span className="text-base leading-none">🇮🇳</span>
                  <span className="text-xs font-semibold text-[#100E26]">+91</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#9493A8]" />
                </div>

                {/* Phone Input Box */}
                <div
                  className={`flex-1 h-11 px-3.5 rounded-xl border bg-white flex items-center gap-2.5 transition-colors ${
                    errors.phone
                      ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                      : 'border-[#E2E1EC] focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-[#9493A8] shrink-0" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^0-9]/g, ''));
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    placeholder="Phone number"
                    maxLength={10}
                    className="w-full h-full text-xs text-[#100E26] placeholder-[#9493A8] bg-transparent focus:outline-none"
                  />
                </div>
              </div>
              {errors.phone && (
                <span className="text-[11px] text-[#E11D48] mt-1 block font-medium">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* 6. State & City (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* State */}
              <div>
                <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                  State
                </label>
                <div className="relative h-11 px-3.5 rounded-xl border border-[#E2E1EC] bg-white flex items-center justify-between focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]">
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className={`w-full h-full text-xs bg-transparent focus:outline-none appearance-none pr-6 cursor-pointer ${
                      state ? 'text-[#100E26]' : 'text-[#9493A8]'
                    }`}
                  >
                    <option value="" disabled>
                      Select state
                    </option>
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="text-[#100E26]">
                        {st}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#9493A8] pointer-events-none absolute right-3.5" />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                  City
                </label>
                <div className="h-11 px-3.5 rounded-xl border border-[#E2E1EC] bg-white flex items-center focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full h-full text-xs text-[#100E26] placeholder-[#9493A8] bg-transparent focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 7. Password */}
            <div>
              <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                Password <span className="text-[#E11D48] mr-1">*</span>
              </label>
              <div
                className={`h-11 px-3.5 rounded-xl border bg-white flex items-center gap-2.5 transition-colors ${
                  errors.password
                    ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                    : 'border-[#E2E1EC] focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]'
                }`}
              >
                <Lock className="w-4 h-4 text-[#9493A8] shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  placeholder="Min 8 characters"
                  className="w-full h-full text-xs text-[#100E26] placeholder-[#9493A8] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#9493A8] hover:text-[#100E26] transition-colors shrink-0"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] text-[#E11D48] mt-1 block font-medium">
                  {errors.password}
                </span>
              )}
            </div>

            {/* 8. Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-[#100E26] mb-1.5">
                Confirm Password <span className="text-[#E11D48] mr-1">*</span>
              </label>
              <div
                className={`h-11 px-3.5 rounded-xl border bg-white flex items-center gap-2.5 transition-colors ${
                  errors.confirmPassword
                    ? 'border-[#E11D48] ring-1 ring-[#E11D48]'
                    : 'border-[#E2E1EC] focus-within:border-[#4E45D5] focus-within:ring-1 focus-within:ring-[#4E45D5]'
                }`}
              >
                <Lock className="w-4 h-4 text-[#9493A8] shrink-0" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder="Re-enter your password"
                  className="w-full h-full text-xs text-[#100E26] placeholder-[#9493A8] bg-transparent focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#9493A8] hover:text-[#100E26] transition-colors shrink-0"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-[11px] text-[#E11D48] mt-1 block font-medium">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 rounded-xl bg-[#4E45D5] hover:bg-[#4338CA] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:shadow-md disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Creating account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Already have an account link */}
            <div className="text-center pt-2 text-xs text-[#5A586E]">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-[#4E45D5] hover:underline"
              >
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
