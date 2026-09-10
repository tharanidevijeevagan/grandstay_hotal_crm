import React, { useState } from 'react';
import { useHotel } from '../../context/HotelContext';
import { UserRole } from '../../types';
import {
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Building,
  KeyRound,
  ArrowRight,
  HelpCircle,
  XCircle,
  Clock,
  Star,
  Users,
  Check
} from 'lucide-react';

interface SignInViewProps {
  onSuccess?: () => void;
}

const DEMO_ACCOUNTS: Array<{
  role: UserRole;
  name: string;
  title: string;
  email: string;
  avatar: string;
  badgeBg: string;
  badgeText: string;
}> = [
  {
    role: 'admin',
    name: 'Vikram Malhotra',
    title: 'General Manager / Hotel Admin',
    email: 'admin@grandstay.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    badgeBg: 'bg-purple-100 border-purple-200 text-purple-800',
    badgeText: 'Full PMS Control',
  },
  {
    role: 'manager',
    name: 'Siddharth Verma',
    title: 'Operations & Guest Experience Manager',
    email: 'manager@grandstay.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    badgeBg: 'bg-indigo-100 border-indigo-200 text-indigo-800',
    badgeText: 'Operations & AI Hub',
  },
  {
    role: 'receptionist',
    name: 'Priya Sharma',
    title: 'Front Desk Lead & Concierge',
    email: 'reception@grandstay.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    badgeBg: 'bg-blue-100 border-blue-200 text-blue-800',
    badgeText: 'Check-in & Service Desk',
  },
  {
    role: 'sales',
    name: 'Ananya Roy',
    title: 'Corporate Sales & Events Lead',
    email: 'sales@grandstay.com',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
    badgeBg: 'bg-emerald-100 border-emerald-200 text-emerald-800',
    badgeText: 'Leads & Deals CRM',
  },
  {
    role: 'housekeeping',
    name: 'Ramesh Kumar',
    title: 'Housekeeping Floor Supervisor',
    email: 'housekeeping@grandstay.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    badgeBg: 'bg-amber-100 border-amber-200 text-amber-800',
    badgeText: 'Room Sanitation & Status',
  },
];

const HOTEL_PROPERTIES = [
  'GrandStay Resort & Spa - Main Palace',
  'GrandStay Executive City Hotel - Downtown',
  'GrandStay Oceanfront Luxury Villas - Bay',
];

export const SignInView: React.FC<SignInViewProps> = ({ onSuccess }) => {
  const { login } = useHotel();

  const [selectedProperty, setSelectedProperty] = useState(HOTEL_PROPERTIES[0]);
  const [email, setEmail] = useState('admin@grandstay.com');
  const [password, setPassword] = useState('grandstay2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const handleDemoSelect = (acc: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(acc.email);
    setPassword('grandstay2026');
    setSelectedRole(acc.role);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email address and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const activeAcc = DEMO_ACCOUNTS.find((a) => a.role === selectedRole) || DEMO_ACCOUNTS[0];
      login(email, password, selectedRole, activeAcc.name, activeAcc.avatar, selectedProperty);
      setLoading(false);
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Subtle Background Glow Spheres */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

      {/* Main Split Login Card */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
        
        {/* Left Visual & Property Showcase Panel (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 text-white flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-15 mix-blend-overlay pointer-events-none" />

          {/* Top Brand */}
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h1 className="font-extrabold text-lg text-white tracking-tight leading-none">
                  GrandStay
                </h1>
                <p className="text-[10px] font-semibold text-indigo-300 uppercase tracking-widest mt-0.5">
                  Hospitality Operations Suite
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal pt-2">
              Enterprise Property Management, Unified Guest CRM, AI Concierge, and Housekeeping Operations Engine.
            </p>
          </div>

          {/* Center Property Highlights */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-amber-300" /> 4.9 / 5.0 Guest Satisfaction
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  98.4% Occupancy
                </span>
              </div>
              <p className="text-[11px] text-slate-200 italic">
                "GrandStay PMS reduced front-desk check-in time by 60% and raised direct corporate lead conversion rate by 34%."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Active Rooms</span>
                <span className="text-base font-extrabold text-white">124 Suites</span>
              </div>
              <div className="rounded-xl bg-slate-800/60 p-3 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">AI Concierge</span>
                <span className="text-base font-extrabold text-indigo-300">24/7 Active</span>
              </div>
            </div>
          </div>

          {/* Bottom Security Footer */}
          <div className="relative z-10 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1 text-slate-300 font-medium">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              256-Bit SSL Encrypted
            </span>
            <span>v3.4.0 Production</span>
          </div>
        </div>

        {/* Right Form & Quick Preset Accounts Panel (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Staff Sign In</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your hotel property and log in to access staff tools.
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-700">
                Authorized Personnel Only
              </span>
            </div>

            {/* Error Alert */}
            {errorMsg && (
              <div className="mb-4 rounded-xl bg-rose-50 p-3 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1-CLICK QUICK DEMO ROLE ACCOUNTS */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Quick Demo Role Sign-In (1-Click Switch)</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Click to autofill credentials</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => {
                  const isSelected = selectedRole === acc.role;
                  return (
                    <div
                      key={acc.role}
                      onClick={() => handleDemoSelect(acc)}
                      className={`cursor-pointer rounded-xl p-2.5 border transition flex items-center gap-2.5 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-2xs'
                          : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="h-8 w-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900 truncate">{acc.name}</span>
                          {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{acc.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MAIN LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Hotel Property Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Hotel Property
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <select
                    value={selectedProperty}
                    onChange={(e) => setSelectedProperty(e.target.value)}
                    className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                  >
                    {HOTEL_PROPERTIES.map((prop) => (
                      <option key={prop} value={prop}>
                        {prop}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email & Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Staff Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. staff@grandstay.com"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 pl-9 pr-10 py-2 text-xs text-slate-800 font-medium focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Checkbox & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                  />
                  <span>Keep me logged in on this workstation</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-800 transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 active:scale-98 transition disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Authenticating Staff Credentials...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <KeyRound className="h-4 w-4" />
                    <span>Sign In to PMS Suite</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Footer Terms */}
          <div className="text-[11px] text-slate-400 text-center border-t border-slate-100 pt-3">
            By logging in, you agree to the GrandStay Internal Operations & Security Guidelines.
          </div>
        </div>
      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4 border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
              </div>
              <button
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            {forgotSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <span>Password Reset Link Sent!</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  We have dispatched a password recovery token to <strong>{forgotEmail}</strong>. Please check your inbox or contact IT Support if you do not receive it within 2 minutes.
                </p>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSuccess(false);
                  }}
                  className="w-full mt-2 rounded-lg bg-emerald-600 py-2 font-bold text-white hover:bg-emerald-700"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-3">
                <p className="text-slate-600 leading-relaxed">
                  Enter your registered staff email address below. We will send a secure password reset link to your inbox.
                </p>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Staff Work Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="e.g. staff@grandstay.com"
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
