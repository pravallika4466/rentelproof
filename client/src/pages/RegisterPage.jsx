import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  Home,
  UserCheck,
  Wrench,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import VantaBackground from '../components/common/VantaBackground';
import ThemeToggle from '../components/common/ThemeToggle';
import CustomCursor from '../components/common/CustomCursor';
import SignupArchitectureVisual from '../components/3d/SignupArchitectureVisual';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'landlord',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }

    setLoading(true);
    const result = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    });
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
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
                Join the Network of Verified Tenancies.
              </h3>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-2 leading-relaxed">
                Create your account in under 60 seconds. Protect your deposit, establish photographic condition baselines, and eliminate rental disputes.
              </p>

              {/* 3D Architectural Blueprint Model */}
              <div className="my-4 rounded-2xl overflow-hidden border border-brand-500/20 bg-dark-950/40 backdrop-blur-md relative flex items-center justify-center">
                <div className="absolute top-2 left-3 text-[10px] font-mono text-brand-400/80 uppercase tracking-widest z-10 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                  3D Architectural Isometric Model
                </div>
                <SignupArchitectureVisual />
              </div>

              <div className="mt-8 space-y-3.5 text-xs text-dark-600 dark:text-dark-300">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Instant digital condition verification certificates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Escrow & deposit release protection tracking</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-500 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>Automated PDF condition dossiers for dispute arbitration</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-light-300 dark:border-dark-800 flex items-center justify-between text-[11px] text-dark-500 dark:text-dark-400 font-mono">
              <span>GDPR & Evidence Standard Ready</span>
              <span className="text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Verified
              </span>
            </div>
          </div>

          {/* Right Column: Registration Form Card */}
          <div className="lg:col-span-7 max-w-lg mx-auto w-full">
            <div className="p-6 sm:p-8 rounded-3xl glass-card border border-light-400 dark:border-dark-700/80 shadow-card">
              <div className="mb-6 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-dark-950 dark:text-white">
                  Create your account
                </h2>
                <p className="mt-1 text-xs text-dark-500 dark:text-dark-400">
                  Already registered?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-brand-600 dark:text-brand-400 hover:underline underline-offset-4 interactive"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {/* Role Selector Tabs */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-2">
                    Account Classification
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'landlord', label: 'Landlord', icon: Home },
                      { value: 'tenant', label: 'Tenant', icon: UserCheck },
                      { value: 'service_provider', label: 'Technician', icon: Wrench },
                    ].map((r) => {
                      const Icon = r.icon;
                      const isSelected = formData.role === r.value;
                      return (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, role: r.value })}
                          className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 text-xs font-bold rounded-xl border transition-all cursor-pointer interactive ${
                            isSelected
                              ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border-brand-500 shadow-emerald-glow'
                              : 'glass-panel text-dark-700 dark:text-dark-300 hover:border-brand-500/40'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-dark-400'}`} />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative rounded-xl">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-dark-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Alex Taylor"
                      className="block w-full rounded-xl glass-input pl-10 pr-3.5 py-2.5 text-sm placeholder:text-dark-400 transition"
                    />
                  </div>
                </div>

                {/* Email */}
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
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="block w-full rounded-xl glass-input pl-10 pr-3.5 py-2.5 text-sm placeholder:text-dark-400 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative rounded-xl">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-dark-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="block w-full rounded-xl glass-input pl-10 pr-3.5 py-2.5 text-sm placeholder:text-dark-400 transition"
                    />
                  </div>
                </div>

                {/* Passwords */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
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

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-dark-700 dark:text-dark-300 mb-1.5">
                      Confirm Password
                    </label>
                    <div className="relative rounded-xl">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-dark-400">
                        <Lock className="h-4 w-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="block w-full rounded-xl glass-input pl-10 pr-3.5 py-2.5 text-sm placeholder:text-dark-400 transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    className="w-full font-semibold shadow-emerald-glow"
                    icon={ArrowRight}
                  >
                    Register Account
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

export default RegisterPage;
