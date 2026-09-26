import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, UserCheck, Wrench, Shield, Home, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import InteractiveMeshCanvas from '../components/common/InteractiveMeshCanvas';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    const result = await demoLogin(role);
    setLoading(false);
    if (result.success) {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle Interactive Particle Canvas Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
        <InteractiveMeshCanvas particleCount={30} particleColor="rgba(16, 185, 129, 0.4)" lineColor="rgba(16, 185, 129, 0.1)" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-slate-900 block">RentalProof</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 block -mt-1">
              Evidence Platform
            </span>
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h2>
        <p className="mt-2 text-sm text-slate-600">
          Or{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:text-emerald-800 transition underline underline-offset-4">
            create a new account
          </Link>
        </p>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        {/* Quick 1-Click Demo Logins for Instant Exploration */}
        <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 p-6 rounded-3xl text-white shadow-xl mb-6 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                1-Click Demo Portals
              </span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full font-semibold">
              Instant Exploration
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Click any role to test the platform instantly:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('landlord')}
              disabled={loading}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left text-xs font-semibold border border-white/10 hover:border-emerald-500/50 active:scale-98 cursor-pointer"
            >
              <Home className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="block text-white">Landlord</span>
                <span className="text-[10px] text-slate-400 block font-normal">Portfolio View</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('tenant')}
              disabled={loading}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left text-xs font-semibold border border-white/10 hover:border-teal-500/50 active:scale-98 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-teal-400 shrink-0" />
              <div>
                <span className="block text-white">Tenant</span>
                <span className="text-[10px] text-slate-400 block font-normal">Renter View</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('service_provider')}
              disabled={loading}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left text-xs font-semibold border border-white/10 hover:border-amber-500/50 active:scale-98 cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="block text-white">Technician</span>
                <span className="text-[10px] text-slate-400 block font-normal">Work Orders</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
              className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition text-left text-xs font-semibold border border-white/10 hover:border-purple-500/50 active:scale-98 cursor-pointer"
            >
              <Shield className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="block text-white">Admin</span>
                <span className="text-[10px] text-slate-400 block font-normal">Platform Control</span>
              </div>
            </button>
          </div>
        </div>

        {/* Standard Credentials Card */}
        <div className="bg-white py-8 px-6 shadow-sm border border-slate-200/90 rounded-3xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-100 transition"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-semibold shadow-emerald-glow"
              icon={ArrowRight}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
