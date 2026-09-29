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
  PlayCircle,
  Shield,
  Clock,
  Layers,
  Fingerprint,
  ChevronDown,
  Scale,
  Award,
  Zap,
} from 'lucide-react';
import Button from '../components/common/Button';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import ThreeHeroVisual from '../components/common/ThreeHeroVisual';
import VantaBackground from '../components/common/VantaBackground';
import TiltCard from '../components/common/TiltCard';
import ScrollReveal from '../components/common/ScrollReveal';
import ThemeToggle from '../components/common/ThemeToggle';
import CustomCursor from '../components/common/CustomCursor';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const [depositAmount, setDepositAmount] = useState(1800);
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen bg-light-100 dark:bg-dark-950 text-dark-900 dark:text-dark-50 selection:bg-brand-500 selection:text-white transition-colors duration-300 relative overflow-x-hidden">
      <CustomCursor />

      {/* Ambient Canvas Background */}
      <VantaBackground variant="waves" className="opacity-40 dark:opacity-30" />

      {/* Cinematic Navigation Bar */}
      <header className="sticky top-0 z-40 glass-header transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group interactive">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-dark-900 dark:bg-dark-900 text-brand-400 border border-brand-500/40 shadow-emerald-glow group-hover:scale-105 transition-all duration-300">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight font-serif text-dark-950 dark:text-white flex items-center gap-1.5">
                  RentalProof
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                </span>
                <span className="text-[10px] text-dark-500 dark:text-dark-400 tracking-wider uppercase font-mono">
                  Evidence Protocol
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider text-dark-600 dark:text-dark-300">
              <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors interactive">
                Capabilities
              </a>
              <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors interactive">
                Protocol
              </a>
              <a href="#calculator" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors interactive">
                Protection ROI
              </a>
              <a href="#evidence-vault" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors interactive">
                Evidence Vault
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="font-semibold text-dark-700 dark:text-dark-200 hover:text-brand-500"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm" icon={ArrowRight}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          Cinematic Hero Section with Genuine Three.js 3D Visual
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Animated Typography & CTAs */}
            <div className="lg:col-span-7 text-center lg:text-left z-10">
              {/* Protocol Pill */}
              <ScrollReveal delay={100}>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-bold mb-6 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                  <span>Next-Generation Digital Condition & Escrow Evidence</span>
                </div>
              </ScrollReveal>

              {/* Cinematic Heading */}
              <ScrollReveal delay={200}>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-dark-950 dark:text-white">
                  Protect Your Rental. <br />
                  <span className="shimmer-text">
                    Preserve the Proof.
                  </span>
                </h1>
              </ScrollReveal>

              {/* Supporting Subtitle */}
              <ScrollReveal delay={300}>
                <p className="text-base sm:text-lg lg:text-xl text-dark-600 dark:text-dark-300 max-w-xl mx-auto lg:mx-0 mt-6 leading-relaxed">
                  Eliminate deposit disputes with tamper-evident photographic condition baseline, AI comparison timelines, and cryptographically timestamped records from move-in to move-out.
                </p>
              </ScrollReveal>

              {/* CTAs */}
              <ScrollReveal delay={400}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 sm:mt-10">
                  <Link to="/register">
                    <Button
                      variant="primary"
                      size="lg"
                      icon={ArrowRight}
                      className="shadow-emerald-glow-lg px-8 text-base font-semibold"
                    >
                      Initialize Free Portal
                    </Button>
                  </Link>

                  <Link to="/login">
                    <button
                      type="button"
                      className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-dark-900/90 hover:bg-dark-800 text-dark-50 font-semibold text-base shadow-card border border-dark-700 hover:border-brand-500/50 active:scale-[0.98] transition-all duration-300 cursor-pointer interactive"
                    >
                      <PlayCircle className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                      <span>Instant Demo Access</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-950 text-brand-300 border border-brand-700/50 ml-1">
                        Live
                      </span>
                    </button>
                  </Link>
                </div>
              </ScrollReveal>

              {/* Quick Trust Highlights */}
              <ScrollReveal delay={500}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-8 mt-12 text-xs font-semibold text-dark-600 dark:text-dark-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>Zero Deposit Disputes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>Cryptographic Timestamps</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>Legally Admissible Proof</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Column: Genuine 3D Three.js Interactive Vault */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <ScrollReveal delay={250} direction="fade">
                <div className="relative w-full max-w-[480px]">
                  {/* Ambient Emerald Aura Backing */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-500/15 dark:bg-brand-500/25 rounded-full blur-3xl pointer-events-none" />
                  
                  {/* 3D Scene */}
                  <div className="relative z-10 rounded-3xl p-2 bg-gradient-to-b from-brand-500/20 via-transparent to-transparent">
                    <ThreeHeroVisual />
                  </div>

                  {/* Floating Holographic Badge */}
                  <div className="absolute -bottom-4 -left-4 sm:bottom-2 sm:left-0 z-20 p-3 sm:p-4 rounded-2xl glass-card border border-brand-500/30 flex items-center gap-3 shadow-card-hover animate-float">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-500">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-dark-900 dark:text-white">Escrow Protection</p>
                      <p className="text-[11px] text-dark-500 dark:text-dark-400 font-mono">100% Immutable Ledger</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Interactive Inspection Comparison Showcase Preview */}
          <ScrollReveal delay={400}>
            <div className="mt-16 sm:mt-24 relative max-w-5xl mx-auto rounded-3xl p-2 sm:p-3 bg-dark-950/5 dark:bg-white/5 ring-1 ring-dark-900/10 dark:ring-white/10 shadow-card-hover">
              <div className="rounded-2xl bg-light-50 dark:bg-dark-900 border border-light-400 dark:border-dark-700 overflow-hidden shadow-sm">
                <div className="h-11 bg-light-200/80 dark:bg-dark-850 border-b border-light-300 dark:border-dark-700/80 flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-accent-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-brand-500/80"></div>
                    <span className="text-xs text-dark-500 dark:text-dark-400 font-mono ml-2 hidden sm:inline">
                      app.rentalproof.verified/inspection-audit/0x7f92
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-brand-600 dark:text-brand-400">
                    <ShieldCheck className="w-4 h-4 text-brand-500" />
                    <span>Cryptographic Evidence Lock Active</span>
                  </div>
                </div>

                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-light-100/60 dark:bg-dark-950/60">
                  <div className="bg-light-50 dark:bg-dark-900 p-4 rounded-2xl border border-light-400 dark:border-dark-700/80 text-left shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-brand-700 dark:text-brand-400">
                        Move-In Baseline Evidence
                      </span>
                      <Badge variant="Excellent" size="sm" dot>Excellent (100%)</Badge>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80"
                      alt="Move In Condition Baseline"
                      className="w-full h-44 sm:h-52 object-cover rounded-xl border border-light-300 dark:border-dark-800 mb-2.5"
                    />
                    <div className="flex items-center justify-between text-xs text-dark-500 dark:text-dark-400">
                      <span>Primary Suite & Living Space</span>
                      <span className="font-mono text-brand-600 dark:text-brand-400">Hash: 8b1f...90c4</span>
                    </div>
                  </div>

                  <div className="bg-light-50 dark:bg-dark-900 p-4 rounded-2xl border border-light-400 dark:border-dark-700/80 text-left shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-accent-700 dark:text-accent-400">
                        Move-Out Walkthrough Audit
                      </span>
                      <Badge variant="Fair" size="sm" dot>Fair Wear & Tear</Badge>
                    </div>
                    <img
                      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
                      alt="Move Out Condition Walkthrough"
                      className="w-full h-44 sm:h-52 object-cover rounded-xl border border-light-300 dark:border-dark-800 mb-2.5"
                    />
                    <div className="flex items-center justify-between text-xs text-dark-500 dark:text-dark-400">
                      <span>Verified: No Unfair Deductions</span>
                      <span className="font-mono text-accent-600 dark:text-accent-400">Status: Discharged</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          Capabilities Section with 3D Tilt Cards
          ========================================================================= */}
      <section id="features" className="py-24 border-t border-light-300 dark:border-dark-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="primary" size="md" className="mb-3">
              Comprehensive Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-dark-950 dark:text-white">
              Designed for Complete Rental Transparency
            </h2>
            <p className="text-dark-600 dark:text-dark-300 mt-4 text-base sm:text-lg">
              Engineered to protect landlords, tenants, and technicians with tamper-evident proof, automated workflows, and immutable audit logs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TiltCard className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20 shadow-emerald-glow">
                <Camera className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark-950 dark:text-white">Room-by-Room Evidence</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed">
                Guided check-in and check-out wizards with high-resolution photo documentation, room condition ratings, and digital signatures.
              </p>
            </TiltCard>

            <TiltCard className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20 shadow-emerald-glow">
                <SplitSquareVertical className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark-950 dark:text-white">Side-by-Side Comparison</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed">
                Instantly compare baseline move-in photos with move-out inspection evidence to isolate fair wear and tear from actual damage.
              </p>
            </TiltCard>

            <TiltCard className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-accent-500/10 text-accent-500 dark:text-accent-400 flex items-center justify-center mb-6 border border-accent-500/20 shadow-amber-glow">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark-950 dark:text-white">Deposit Protection Tracking</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed">
                Track security deposits, escrow allocations, return timelines, and deduction breakdowns backed by verifiable photo proof.
              </p>
            </TiltCard>

            <TiltCard className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20 shadow-emerald-glow">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark-950 dark:text-white">Maintenance Work Orders</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed">
                Log repair requests with photos, assign qualified technicians, track completion timestamps, and preserve invoices in the vault.
              </p>
            </TiltCard>

            <TiltCard className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-dark-800 text-dark-200 flex items-center justify-center mb-6 border border-dark-700 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark-950 dark:text-white">Tamper-Proof Audit Trail</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed">
                Immutable activity logs with user IDs, IP addresses, and exact timestamps ensuring all documentation holds up in arbitration.
              </p>
            </TiltCard>

            <TiltCard className="p-6 sm:p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-500 dark:text-brand-400 flex items-center justify-center mb-6 border border-brand-500/20 shadow-emerald-glow">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-dark-950 dark:text-white">Printable PDF Audit Reports</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed">
                Generate professional PDF condition certificates and comprehensive tenancy exit dossiers ready for landlords, tenants, and court.
              </p>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Protocol: How It Works Section
          ========================================================================= */}
      <section id="how-it-works" className="py-24 bg-light-200/50 dark:bg-dark-900/40 border-y border-light-300 dark:border-dark-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="warning" size="md" className="mb-3">
              Clear 3-Stage Protocol
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-dark-950 dark:text-white">
              From Move-In to Deposit Return
            </h2>
            <p className="text-dark-600 dark:text-dark-300 mt-4 text-base sm:text-lg">
              Eliminate ambiguity at every milestone of the tenancy lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl glass-card relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-emerald-glow">
                1
              </div>
              <h3 className="text-xl font-bold text-dark-950 dark:text-white mb-2">Move-In Baseline</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                Landlord and tenant perform an initial room-by-room photo inspection. Both parties digitally confirm condition ratings and sign off.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-card relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-emerald-glow">
                2
              </div>
              <h3 className="text-xl font-bold text-dark-950 dark:text-white mb-2">Ongoing Evidence</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                Log maintenance requests, track repairs, record rent payments, and store lease documents in the secure cryptographically stamped vault.
              </p>
            </div>

            <div className="p-8 rounded-2xl glass-card relative">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-lg mb-6 shadow-emerald-glow">
                3
              </div>
              <h3 className="text-xl font-bold text-dark-950 dark:text-white mb-2">Move-Out & Settlement</h3>
              <p className="text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                Side-by-side photo comparison automatically isolates new damage from fair wear and tear. Deposit deductions are settled peacefully.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          Interactive Protection ROI Calculator
          ========================================================================= */}
      <section id="calculator" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Card className="p-8 sm:p-12 glass-card">
            <div className="text-center mb-10">
              <Badge variant="primary" size="md" className="mb-3">
                Deposit Protection Calculator
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-dark-950 dark:text-white">
                Calculate Protected Value for Your Tenancy
              </h2>
              <p className="text-sm text-dark-600 dark:text-dark-300 mt-2">
                Estimate how photographic records protect against unjustified deductions and disputed claims.
              </p>
            </div>

            <div className="space-y-6 max-w-xl mx-auto">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-bold text-dark-800 dark:text-dark-200">Security Deposit Value</label>
                  <span className="text-xl font-bold text-brand-600 dark:text-brand-400 font-mono">
                    ${depositAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-light-300 dark:bg-dark-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-light-300 dark:border-dark-700/80">
                <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center">
                  <p className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                    Average Dispute Risk
                  </p>
                  <p className="text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-1">
                    Reduced by 98%
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-dark-900 border border-dark-800 text-white text-center">
                  <p className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
                    Estimated Protection Value
                  </p>
                  <p className="text-2xl font-extrabold text-brand-400 mt-1 font-mono">
                    ${(depositAmount * 0.96).toFixed(0)}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* =========================================================================
          Bottom Cinematic CTA Banner
          ========================================================================= */}
      <section className="py-24 bg-dark-950 text-white text-center relative overflow-hidden border-t border-dark-800">
        <div className="absolute inset-0 bg-radial-gradient from-brand-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Badge variant="dark" size="md" className="mb-4 text-brand-400 border-brand-500/30">
            Protocol Activation
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Start Documenting Your Rental Journey Today.
          </h2>
          <p className="text-dark-300 text-base sm:text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
            Experience effortless move-in checklists, side-by-side evidence comparison, and transparent deposit escrow management.
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

            <Link to="/login">
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-dark-850 hover:bg-dark-800 text-white font-semibold text-base shadow-lg border border-dark-700 hover:border-brand-400/60 transition-all duration-200 active:scale-[0.98] cursor-pointer interactive"
              >
                <PlayCircle className="w-5 h-5 text-brand-400 group-hover:scale-110 transition-transform" />
                <span>Explore Demo Portals</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-light-50 dark:bg-dark-950 border-t border-light-300 dark:border-dark-800 text-xs text-dark-500 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white shadow-emerald-glow">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-[11px] text-dark-500 dark:text-dark-400">
              RentalProof — Digital Rental Condition, Evidence & Deposit Protection Platform
            </p>
          </div>
          <div className="text-dark-400">
            © {new Date().getFullYear()} RentalProof. Zero Blue Cinematic Edition. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
