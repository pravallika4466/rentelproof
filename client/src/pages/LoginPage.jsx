import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  Wrench,
  Shield,
  Home,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import VantaBackground from '../components/common/VantaBackground';
import ThemeToggle from '../components/common/ThemeToggle';
import CustomCursor from '../components/common/CustomCursor';
import LoginOrbVisual from '../components/3d/LoginOrbVisual';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const handleDemoLogin = async (role) => {
    setActiveDemo(role);
    setLoading(true);
    const result = await demoLogin(role);
    setLoading(false);
    setActiveDemo(null);
    if (result.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-light-100 dark:bg-dark-950 text-dark-900 dark:text-dark-50 flex flex-col justify-center relative overflow-hidden transition-colors duration-300">
      <CustomCursor />
      
      {/* Background Ambient Three.js Waves */}
      <VantaBackground variant="waves" className="opacity-35 dark:opacity-25" />

      {/* Top Floating Controls */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/"
          className="text-xs font-semibold px-3 py-1.5 rounded-xl glass-card hover:border-brand-500/50 text-dark-700 dark:text-dark-300 transition interactive"
        >
          Exit to Home
        </Link>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Cinematic Visual & Value Pillar */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl glass-card border border-brand-500/20 shadow-card-hover relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <Link to="/" className="inline-flex items-center gap-3 mb-8 group interactive">
                <div className="h-12 w-12 rounded-2xl bg-dark-900 text-brand-400 border border-brand-500/40 flex items-center justify-center shadow-emerald-glow group-hover:scale-105 transition-all">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-dark-950 dark:text-white font-serif">
                    RentalProof
                  </h2>
                  <p className="text-[10px] text-brand-600 dark:text-brand-400 font-mono tracking-widest uppercase">
                    Protocol 2.0
                  </p>
                </div>
              </Link>

              <h3 className="text-2xl font-bold tracking-tight text-dark-950 dark:text-white leading-snug">
                The Standard in Digital Evidence & Deposit Custody.
              </h3>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-2 leading-relaxed">
                Log in to access your properties, cryptographically verifiable move-in baselines, and dispute-free deposit ledgers.
              </p>

              {/* 3D Holographic Cryptographic Orb */}
              <div className="my-4 rounded-2xl overflow-hidden border border-brand-500/20 bg-dark-950/40 backdrop-blur-md relative flex items-center justify-center">
                <div className="absolute top-2 left-3 text-[10px] font-mono text-brand-400/80 uppercase tracking-widest z-10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  3D Cryptographic Core
                </div>
                <LoginOrbVisual />
              </div>

              <div className="mt-8 space-y-3.5 text-xs text-dark-600 dark:text-dark-300">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Tamper-evident photographic audit timelines</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Automated deposit deduction calculations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Multi-role access for landlords, tenants, technicians</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-light-300 dark:border-dark-800 flex items-center justify-between text-[11px] text-dark-500 dark:text-dark-400 font-mono">
              <span>Security Level: Enterprise</span>
              <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* Right Column: Authentication Card & Demo Portals */}
          <div className="lg:col-span-7 max-w-lg mx-auto w-full">
            {/* 1-Click Instant Demo Portals */}
            <div className="p-6 rounded-3xl bg-dark-900 border border-dark-800 text-white shadow-card-hover mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-brand-400">
                    1-Click Instant Demo Portals
                  </span>
                </div>
                <span className="text-[10px] bg-brand-500/20 text-brand-300 border border-brand-500/40 px-2 py-0.5 rounded-full font-semibold">
                  Zero Password
                </span>
              </div>
              <p className="text-xs text-dark-400 mb-4 leading-relaxed">
                Click any role to enter the workspace immediately:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('landlord')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-white/5 hover:bg-brand-500/15 transition text-center text-xs font-semibold border border-white/10 hover:border-brand-500/50 active:scale-95 cursor-pointer interactive group"
                >
                  <Home className="w-4 h-4 text-brand-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white text-[11px]">Landlord</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('tenant')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-white/5 hover:bg-brand-500/15 transition text-center text-xs font-semibold border border-white/10 hover:border-brand-500/50 active:scale-95 cursor-pointer interactive group"
                >
                  <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white text-[11px]">Tenant</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('service_provider')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-white/5 hover:bg-accent-500/15 transition text-center text-xs font-semibold border border-white/10 hover:border-accent-500/50 active:scale-95 cursor-pointer interactive group"
                >
                  <Wrench className="w-4 h-4 text-accent-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white text-[11px]">Technician</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={loading}
                  className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-white/5 hover:bg-purple-500/15 transition text-center text-xs font-semibold border border-white/10 hover:border-purple-500/50 active:scale-95 cursor-pointer interactive group"
                >
                  <Shield className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white text-[11px]">Admin</span>
                </button>
              </div>
            </div>

            {/* Standard Sign In Form Card */}
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-light-400 dark:border-dark-700/80 shadow-card">
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-dark-950 dark:text-white">
                  Sign in to your account
                </h2>
                <p className="mt-1 text-xs text-dark-500 dark:text-dark-400">
                  New to RentalProof?{' '}
                  <Link
                    to="/register"
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline underline-offset-4 interactive"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative rounded-xl">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-dark-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="block w-full rounded-xl glass-input pl-10 pr-3.5 py-2.5 text-sm placeholder:text-dark-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative rounded-xl">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-dark-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-xl glass-input pl-10 pr-10 py-2.5 text-sm placeholder:text-dark-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark-400 hover:text-dark-600 dark:hover:text-dark-200 transition interactive"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading && !activeDemo}
                    className="w-full font-semibold shadow-emerald-glow"
                    icon={ArrowRight}
                  >
                    Authenticate Portal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
