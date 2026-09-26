import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Camera,
  SplitSquareVertical,
  Wrench,
  PiggyBank,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  Users,
  ChevronRight,
  Shield,
  Clock,
  Coins,
  Scale,
  Award,
  Star,
  PlayCircle,
  ExternalLink,
  Layers,
  Fingerprint,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import InteractiveMeshCanvas from '../components/common/InteractiveMeshCanvas';

const LandingPage = () => {
  const [depositAmount, setDepositAmount] = useState(1500);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header (Clean, minimal top bar without text logo branding) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 shadow-sm group-hover:border-emerald-500/50 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-emerald-800 transition">Features</a>
              <a href="#how-it-works" className="hover:text-emerald-800 transition">How It Works</a>
              <a href="#calculator" className="hover:text-emerald-800 transition">Protection ROI</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="font-semibold text-slate-700 hover:text-emerald-800">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section with Interactive 3D Mesh Background */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-24 sm:pb-32 bg-gradient-to-b from-emerald-50/40 via-white to-white">
        {/* Interactive Canvas Background */}
        <div className="absolute inset-0 pointer-events-auto opacity-70 z-0">
          <InteractiveMeshCanvas particleCount={40} particleColor="rgba(16, 185, 129, 0.45)" lineColor="rgba(16, 185, 129, 0.12)" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold mb-6 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Condition Evidence & Deposit Protection</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Protect Your Rental. <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 bg-clip-text text-transparent">
              Preserve the Proof.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mt-6 leading-relaxed">
            Create a transparent, tamper-evident digital record of property condition, photo evidence, maintenance logs, and security deposits from move-in to move-out.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 sm:mt-10">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="shadow-lg shadow-emerald-600/25 px-8 text-base font-semibold"
              >
                Get Started Free
              </Button>
            </Link>

            {/* High-Contrast "Explore Demo Portals" Button */}
            <Link to="/login">
              <button
                type="button"
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200 border border-slate-800 hover:border-emerald-500/50 active:scale-[0.98] cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Explore Demo Portals</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/50 ml-1">
                  Instant
                </span>
              </button>
            </Link>
          </div>

          {/* Quick trust metrics */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 mt-12 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Deposit Disputes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Legally Structured Records</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Multi-Role Access (Landlord, Tenant, Technician)</span>
            </div>
          </div>

          {/* Interactive SaaS Mockup */}
          <div className="mt-14 relative max-w-5xl mx-auto rounded-3xl p-2 sm:p-3 bg-slate-900/5 ring-1 ring-slate-900/10 shadow-2xl">
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-11 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs text-slate-500 font-mono ml-2 hidden sm:inline">
                    app.verified/inspections/compare
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Tamper-Proof Verification Active</span>
                </div>
              </div>

              {/* Mockup Body with Live Before/After Comparison */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/60">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-left shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Move-In Baseline</span>
                    <Badge variant="Excellent" size="sm" dot>Excellent</Badge>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80"
                    alt="Move In Condition"
                    className="w-full h-44 sm:h-52 object-cover rounded-xl border border-slate-100 mb-2.5"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Living Room Walls</span>
                    <span className="font-mono">Timestamped: 01 Apr 2026</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 text-left shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Move-Out Walkthrough</span>
                    <Badge variant="Fair" size="sm" dot>Minor Wear</Badge>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
                    alt="Move Out Condition"
                    className="w-full h-44 sm:h-52 object-cover rounded-xl border border-slate-100 mb-2.5"
                  />
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Living Room Walls</span>
                    <span className="font-mono">Timestamped: 15 Sep 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" size="md" className="mb-3">
              Comprehensive Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Designed for Complete Rental Transparency
            </h2>
            <p className="text-slate-600 mt-4 text-base sm:text-lg">
              Structured to protect both landlords and tenants with tamper-proof evidence, automated workflows, and crystal-clear records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card hover className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 border border-emerald-200">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Room-by-Room Inspections</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Guided check-in and check-out wizards with high-resolution photo documentation, room condition ratings, and digital signatures.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card hover className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-6 border border-teal-200">
                <SplitSquareVertical className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Side-by-Side Comparison</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Instantly compare baseline move-in photos with move-out inspection evidence to isolate fair wear and tear from actual damage.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card hover className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6 border border-amber-200">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Deposit Protection Tracking</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Track security deposits, escrow allocations, return timelines, and deduction breakdowns backed by verifiable photo proof.
              </p>
            </Card>

            {/* Feature 4 */}
            <Card hover className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6 border border-emerald-200">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Maintenance & Work Orders</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Log repair requests with photos, assign qualified technicians, track completion timestamps, and preserve invoices in the vault.
              </p>
            </Card>

            {/* Feature 5 */}
            <Card hover className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center mb-6 border border-slate-200">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Tamper-Proof Audit Trail</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Immutable activity logs with user IDs, IP addresses, and exact timestamps ensuring all documentation holds up in arbitration.
              </p>
            </Card>

            {/* Feature 6 */}
            <Card hover className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6 border border-purple-200">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Printable PDF Audit Reports</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Generate professional PDF condition certificates and comprehensive tenancy exit dossiers ready for landlords, tenants, and court.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50/80 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="warning" size="md" className="mb-3">
              Simple 3-Step Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Move-In to Deposit Return
            </h2>
            <p className="text-slate-600 mt-4 text-base sm:text-lg">
              Eliminate ambiguity at every milestone of the tenancy lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-md shadow-emerald-600/20">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Move-In Baseline</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Landlord and tenant perform an initial room-by-room photo inspection. Both parties digitally confirm condition ratings.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-md shadow-emerald-600/20">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Ongoing Evidence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Log maintenance requests, track repairs, record rent payments, and store lease documents in the secure vault.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-md shadow-emerald-600/20">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Move-Out & Settlement</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Side-by-side photo comparison identifies new damage versus fair wear. Deposit deductions are backed by evidence and settled smoothly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Protection ROI Calculator */}
      <section id="calculator" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="p-8 sm:p-12 border-slate-200 bg-gradient-to-br from-white via-emerald-50/20 to-white shadow-xl">
            <div className="text-center mb-10">
              <Badge variant="primary" size="md" className="mb-3">
                Deposit Protection Calculator
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Calculate Protected Value for Your Tenancy
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Estimate how photographic records protect against unjustified deductions and disputed claims.
              </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-slate-700">Security Deposit Value</label>
                  <span className="text-lg font-bold text-emerald-700">${depositAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 text-center">
                  <p className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Average Dispute Risk</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">Reduced by 98%</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 text-white text-center">
                  <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Estimated Protection Value</p>
                  <p className="text-2xl font-extrabold text-emerald-400 mt-1">${(depositAmount * 0.95).toFixed(0)}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-zinc-950 text-white text-center relative overflow-hidden border-t border-slate-800">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Badge variant="dark" size="md" className="mb-4 text-emerald-400 border-emerald-500/30">
            Get Started
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Start Documenting Your Rental Journey Today.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Experience effortless move-in checklists, side-by-side evidence comparison, and transparent deposit management.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="px-8 font-semibold shadow-emerald-glow"
              >
                Create Free Account
              </Button>
            </Link>

            {/* High-Contrast "Explore Demo Portals" Button */}
            <Link to="/login">
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-semibold text-base shadow-lg border border-slate-600 hover:border-emerald-400/60 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                <PlayCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Explore Demo Portals</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-slate-500">Digital Rental Condition, Evidence & Deposit Protection Platform</p>
          </div>
          <div className="text-slate-500">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
