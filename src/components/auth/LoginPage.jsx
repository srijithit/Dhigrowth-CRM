import React, { useState } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LoginPage = () => {
  const { login, showToast } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Small simulated auth delay for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 350));
      await login({
        username,
        password,
        remember: rememberMe,
      });
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8F9FC] font-sans text-[#101828] selection:bg-[#7C3AED]/20">
      {/* Left Column: Brand Hero & Value Proposition */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-gradient-to-br from-[#1E1B4B] via-[#2E1065] to-[#0F172A] text-white relative overflow-hidden">
        {/* Subtle Background Lighting Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#7C3AED]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#9333EA]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src="/logo.webp"
            alt="DhiGrowth CRM Logo"
            className="w-10 h-10 object-contain rounded-full shadow-lg border border-white/20 bg-white/10 backdrop-blur-md p-0.5"
          />
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Dhigrowth CRM
            </span>
            <div className="text-[10px] text-purple-300 font-mono tracking-wide uppercase">
              AI Business Solutions & WhatsApp Automation
            </div>
          </div>
        </div>

        {/* Main Center Message */}
        <div className="relative z-10 my-auto max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-semibold text-purple-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>Next-Gen Omnichannel Customer Engagement</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Scale your business with <span className="bg-gradient-to-r from-[#C084FC] via-[#E879F9] to-[#F472B6] bg-clip-text text-transparent">AI Auto-Pilot</span>.
          </h1>

          <p className="text-sm xl:text-base text-purple-200/90 leading-relaxed">
            Welcome to the unified workspace for Meta WhatsApp Cloud API, Instagram, Messenger, and live AI Sales Concierge.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Bot className="w-4 h-4 text-[#A855F7]" />
                <span>24/7 AI Concierge</span>
              </div>
              <p className="text-[11px] text-purple-200/70">Instant replies, multilingual translation & lead capture.</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Zap className="w-4 h-4 text-[#FACC15]" />
                <span>Smart Invoicing</span>
              </div>
              <p className="text-[11px] text-purple-200/70">Payment Due & Paid Receipt PDFs sent on WhatsApp.</p>
            </div>
          </div>
        </div>

        {/* Bottom Trust Footer */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-purple-300/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#4ADE80]" />
            <span>Official Meta WhatsApp Cloud API Certified</span>
          </div>
          <span className="font-mono text-[11px]">v2.5.0 Secure</span>
        </div>
      </div>

      {/* Right Column: Sign In Card */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Brand Logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center mb-4">
            <img
              src="/logo.webp"
              alt="DhiGrowth CRM Logo"
              className="w-10 h-10 object-contain rounded-full shadow-md"
            />
            <div className="text-left">
              <span className="text-lg font-extrabold tracking-tight text-[#101828]">
                Dhigrowth CRM
              </span>
              <div className="text-[10px] text-[#667085] font-mono">
                AI Business Solutions
              </div>
            </div>
          </div>

          {/* Form Header */}
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101828]">
              Sign in to your account
            </h2>
            <p className="text-xs sm:text-sm text-[#667085]">
              Enter your credentials to access your DhiGrowth CRM dashboard
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FEF2F2] border border-[#FECACA] flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="text-xs text-[#B91C1C] font-semibold">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#344054]">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98A2B3]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="admin or your-name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-xs sm:text-sm text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#344054]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Please contact your organization administrator or support@dhigrowth.com to reset your password.', 'info')}
                  className="text-[11px] font-semibold text-[#7C3AED] hover:text-[#6D28D9] cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#98A2B3]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#D0D5DD] rounded-xl text-xs sm:text-sm text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15 transition-all shadow-2xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#98A2B3] hover:text-[#344054] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#D0D5DD] text-[#7C3AED] focus:ring-[#7C3AED] cursor-pointer accent-[#7C3AED]"
                />
                <span className="text-xs text-[#475467] font-medium">Remember me on this browser</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#7C3AED]/20 cursor-pointer disabled:opacity-75 active:scale-[0.99] mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Note */}
          <div className="text-center text-[11px] text-[#98A2B3] pt-2">
            Protected by DhiGrowth Enterprise Security · End-to-End Encrypted Session
          </div>
        </div>
      </div>
    </div>
  );
};
