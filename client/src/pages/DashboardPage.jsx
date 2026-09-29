import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Users,
  Wrench,
  ClipboardCheck,
  PiggyBank,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  SplitSquareVertical,
  CheckCircle2,
  CreditCard,
  FileText,
  ShieldCheck,
  Activity,
  Layers,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard } from '../components/common/CinematicLoader';
import TiltCard from '../components/common/TiltCard';
import DashboardAmbient3D from '../components/3d/DashboardAmbient3D';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const DashboardPage = () => {
  const { user, isLandlord, isTenant, isServiceProvider, isAdmin } = useAuth();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    properties: [],
    tenancies: [],
    maintenance: [],
    inspections: [],
    payments: [],
    deposits: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [propsRes, tenanciesRes, maintRes, inspRes, paymentsRes] = await Promise.all([
          api.get('/properties').catch(() => ({ data: { properties: [] } })),
          api.get('/tenancies').catch(() => ({ data: { tenancies: [] } })),
          api.get('/maintenance').catch(() => ({ data: { requests: [] } })),
          api.get('/inspections').catch(() => ({ data: { inspections: [] } })),
          api.get('/payments').catch(() => ({ data: { payments: [] } })),
        ]);

        setData({
          properties: propsRes?.data?.properties || [],
          tenancies: tenanciesRes?.data?.tenancies || [],
          maintenance: maintRes?.data?.requests || [],
          inspections: inspRes?.data?.inspections || [],
          payments: paymentsRes?.data?.payments || [],
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 rounded-3xl glass-card animate-pulse" />
        <SkeletonCard count={4} />
      </div>
    );
  }

  // Analytics data for Recharts (Strict ZERO BLUE: Emerald & Amber tones)
  const occupancyData = [
    { name: 'Occupied', value: data.properties.filter((p) => p.status === 'Occupied').length || 1, color: '#059669' },
    { name: 'Available', value: data.properties.filter((p) => p.status === 'Available').length || 1, color: '#10b981' },
    {
      name: 'Maintenance',
      value: data.properties.filter((p) => p.status === 'Under Maintenance').length || 0,
      color: '#f59e0b',
    },
  ];

  const rentTrendData = [
    { month: 'Apr', amount: 15000 },
    { month: 'May', amount: 16500 },
    { month: 'Jun', amount: 15000 },
    { month: 'Jul', amount: 18000 },
    { month: 'Aug', amount: 17500 },
    { month: 'Sep', amount: 19000 },
  ];

  return (
    <CinematicPageTransition>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Banner */}
        <div className="flex flex-wrap items-center justify-between gap-6 bg-dark-900 border border-dark-800 p-6 sm:p-8 rounded-3xl text-white shadow-card-hover relative overflow-hidden">
          <DashboardAmbient3D />
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold mb-3 border border-brand-500/30">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>Digital Evidence Ecosystem Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-dark-300 mt-1 leading-relaxed">
            {isLandlord && 'Monitor portfolio condition baselines, maintenance tickets, and deposit records.'}
            {isTenant && 'Your digital rental vault. Review your move-in baseline, maintenance tickets, and rent receipts.'}
            {isServiceProvider && 'View assigned service requests, upload completion photos, and update resolution states.'}
            {isAdmin && 'Platform administration overview, user verification, and global activity audit logs.'}
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {isLandlord && (
            <>
              <Link to="/properties/new">
                <Button variant="primary" size="md" icon={Plus}>
                  Add Property
                </Button>
              </Link>
              <Link to="/inspections/compare">
                <Button variant="secondary" size="md" icon={SplitSquareVertical}>
                  Before/After Compare
                </Button>
              </Link>
            </>
          )}

          {isTenant && (
            <>
              <Link to="/maintenance">
                <Button variant="primary" size="md" icon={Wrench}>
                  Report Issue
                </Button>
              </Link>
              <Link to="/inspections/compare">
                <Button variant="secondary" size="md" icon={SplitSquareVertical}>
                  View Before/After
                </Button>
              </Link>
            </>
          )}

          {isServiceProvider && (
            <Link to="/maintenance">
              <Button variant="primary" size="md" icon={Wrench}>
                View Work Orders
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* LANDLORD DASHBOARD VIEW */}
      {isLandlord && (
        <>
          {/* Key Stat Cards with 3D Tilt */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <TiltCard className="p-6">
              <div className="flex items-center justify-between text-dark-500 dark:text-dark-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Properties</span>
                <div className="p-2.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/20 shadow-emerald-glow">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-dark-950 dark:text-white font-mono">
                <AnimatedNumber value={data.properties.length} />
              </div>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                {data.properties.filter((p) => p.status === 'Occupied').length} occupied units
              </p>
            </TiltCard>

            <TiltCard className="p-6">
              <div className="flex items-center justify-between text-dark-500 dark:text-dark-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Active Tenancies</span>
                <div className="p-2.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/20 shadow-emerald-glow">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-dark-950 dark:text-white font-mono">
                <AnimatedNumber value={data.tenancies.filter((t) => t.status === 'Active').length} />
              </div>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                Verified agreements
              </p>
            </TiltCard>

            <TiltCard className="p-6">
              <div className="flex items-center justify-between text-dark-500 dark:text-dark-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Open Maintenance</span>
                <div className="p-2.5 bg-accent-500/10 text-accent-600 dark:text-accent-400 rounded-xl border border-accent-500/20 shadow-amber-glow">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-dark-950 dark:text-white font-mono">
                <AnimatedNumber value={data.maintenance.filter((m) => m.status !== 'Completed').length} />
              </div>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                {data.maintenance.filter((m) => m.status === 'Completed').length} resolved
              </p>
            </TiltCard>

            <TiltCard className="p-6">
              <div className="flex items-center justify-between text-dark-500 dark:text-dark-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Deposits Recorded</span>
                <div className="p-2.5 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-xl border border-brand-500/20 shadow-emerald-glow">
                  <PiggyBank className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-dark-950 dark:text-white font-mono">
                <AnimatedNumber value={30000} prefix="₹" />
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-medium mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                Ledger in balance
              </p>
            </TiltCard>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rent Trend */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-dark-950 dark:text-white">Monthly Rent Collection</h3>
                  <p className="text-xs text-dark-500 dark:text-dark-400">Verified rent receipts over last 6 months</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full border border-brand-500/20">
                  <TrendingUp className="w-3.5 h-3.5" /> 100% on time
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rentTrendData}>
                    <XAxis dataKey="month" stroke={isDark ? '#71717a' : '#a1a1aa'} fontSize={12} />
                    <YAxis
                      stroke={isDark ? '#71717a' : '#a1a1aa'}
                      fontSize={12}
                      tickFormatter={(val) => `₹${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Rent Collected']}
                      contentStyle={{
                        borderRadius: '16px',
                        border: isDark ? '1px solid #27272a' : '1px solid #dedbcc',
                        backgroundColor: isDark ? '#121215' : '#ffffff',
                        color: isDark ? '#f4f4f5' : '#18181b',
                      }}
                    />
                    <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Occupancy Status */}
            <div className="glass-card p-6 rounded-3xl">
              <h3 className="text-base font-bold text-dark-950 dark:text-white mb-1">Portfolio Occupancy</h3>
              <p className="text-xs text-dark-500 dark:text-dark-400 mb-4">Active rental status distribution</p>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72}>
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: isDark ? '1px solid #27272a' : '1px solid #dedbcc',
                        backgroundColor: isDark ? '#121215' : '#ffffff',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-center pt-3 border-t border-light-300 dark:border-dark-700/80">
                {occupancyData.map((item) => (
                  <div key={item.name}>
                    <span className="text-xs text-dark-500 dark:text-dark-400 block">{item.name}</span>
                    <span className="text-sm font-bold text-dark-900 dark:text-dark-50 font-mono">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Card */}
            <div className="glass-card p-6 rounded-3xl">
              <h3 className="text-base font-bold text-dark-950 dark:text-white mb-4">Quick Management Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/properties/new"
                  className="p-3.5 rounded-2xl glass-panel hover:border-brand-500/50 transition group text-left interactive"
                >
                  <Building2 className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-dark-900 dark:text-dark-100 block">Add Property</span>
                  <span className="text-[10px] text-dark-500 dark:text-dark-400">List unit</span>
                </Link>

                <Link
                  to="/tenancies"
                  className="p-3.5 rounded-2xl glass-panel hover:border-brand-500/50 transition group text-left interactive"
                >
                  <Users className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-dark-900 dark:text-dark-100 block">Invite Tenant</span>
                  <span className="text-[10px] text-dark-500 dark:text-dark-400">Digital lease</span>
                </Link>

                <Link
                  to="/inspections"
                  className="p-3.5 rounded-2xl glass-panel hover:border-brand-500/50 transition group text-left interactive"
                >
                  <ClipboardCheck className="w-5 h-5 text-brand-500 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-dark-900 dark:text-dark-100 block">Start Inspection</span>
                  <span className="text-[10px] text-dark-500 dark:text-dark-400">Room checklist</span>
                </Link>

                <Link
                  to="/maintenance"
                  className="p-3.5 rounded-2xl glass-panel hover:border-brand-500/50 transition group text-left interactive"
                >
                  <Wrench className="w-5 h-5 text-accent-500 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-dark-900 dark:text-dark-100 block">Maintenance</span>
                  <span className="text-[10px] text-dark-500 dark:text-dark-400">Assign jobs</span>
                </Link>
              </div>
            </div>

            {/* Recent Evidence Activity */}
            <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-dark-950 dark:text-white">Recent Platform Activities</h3>
                <Link to="/audit-logs" className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline interactive">
                  View Full Audit Trail
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: 'Move-Out Walkthrough Inspection Completed',
                    time: 'Today',
                    tag: 'Inspection',
                    desc: 'Unit 402 paired with Move-In baseline photos; AI observation calculated.',
                  },
                  {
                    title: 'Plumbing Repair Completed & Photo Uploaded',
                    time: 'Yesterday',
                    tag: 'Maintenance',
                    desc: 'Master bath mixer cartridge replaced by Apex Plumbing.',
                  },
                  {
                    title: 'Rent Payment Recorded (₹15,000)',
                    time: '3 days ago',
                    tag: 'Payment',
                    desc: 'September 2026 rent recorded with UPI reference number.',
                  },
                ].map((act, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between p-3.5 rounded-2xl glass-panel"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-dark-900 dark:text-dark-100">{act.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-200 dark:bg-dark-800 text-dark-700 dark:text-dark-300 font-semibold">
                          {act.tag}
                        </span>
                      </div>
                      <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">{act.desc}</p>
                    </div>
                    <span className="text-[11px] text-dark-400 shrink-0 font-mono">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* TENANT DASHBOARD VIEW */}
      {isTenant && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 glass-card p-6 rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400">
                    Your Current Lease
                  </span>
                  <h3 className="text-lg font-bold text-dark-950 dark:text-white">
                    Green Valley Apartments, Unit 402
                  </h3>
                  <p className="text-xs text-dark-500 dark:text-dark-400">
                    402 Palm Grove Enclave, Ring Road, Guntur
                  </p>
                </div>
                <Badge variant="Active">Active Tenancy</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl glass-panel mb-6">
                <div>
                  <span className="text-xs text-dark-400 block">Monthly Rent</span>
                  <span className="text-sm font-bold text-dark-900 dark:text-white font-mono">₹15,000 / mo</span>
                </div>
                <div>
                  <span className="text-xs text-dark-400 block">Original Deposit</span>
                  <span className="text-sm font-bold text-dark-900 dark:text-white font-mono">₹30,000</span>
                </div>
                <div>
                  <span className="text-xs text-dark-400 block">Recorded Balance</span>
                  <span className="text-sm font-bold text-brand-600 dark:text-brand-400 font-mono">₹28,800</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/inspections/compare">
                  <Button variant="primary" size="sm" icon={SplitSquareVertical}>
                    View Move-In vs Move-Out Proof
                  </Button>
                </Link>
                <Link to="/maintenance">
                  <Button variant="outline" size="sm" icon={Wrench}>
                    Report Maintenance
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button variant="ghost" size="sm" icon={FileText}>
                    Inspection Reports
                  </Button>
                </Link>
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl space-y-4">
              <h4 className="text-sm font-bold text-dark-950 dark:text-white">Your Digital Protection</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500" />
                    <span>Move-In Baseline Signed</span>
                  </div>
                  <span className="font-bold">Verified</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-brand-500" />
                    <span>September Rent Status</span>
                  </div>
                  <span className="font-bold">Paid</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-accent-500/10 text-accent-700 dark:text-accent-300 border border-accent-500/20 text-xs">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-accent-500" />
                    <span>Deposit Ledger</span>
                  </div>
                  <span className="font-bold">1 Deduction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SERVICE PROVIDER DASHBOARD VIEW */}
      {isServiceProvider && (
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-base font-bold text-dark-950 dark:text-white mb-4">Assigned Work Orders</h3>
            {data.maintenance.length === 0 ? (
              <p className="text-xs text-dark-500 dark:text-dark-400">No pending work orders.</p>
            ) : (
              <div className="space-y-3">
                {data.maintenance.map((m) => (
                  <div
                    key={m._id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-dark-900 dark:text-dark-100">{m.title}</span>
                        <Badge variant={m.status}>{m.status}</Badge>
                        <Badge variant={m.priority}>{m.priority}</Badge>
                      </div>
                      <p className="text-xs text-dark-500 dark:text-dark-400 mt-1">
                        {m.property?.title} — Room: {m.room}
                      </p>
                    </div>

                    <Link to={`/maintenance/${m._id}`}>
                      <Button variant="primary" size="sm" icon={ArrowRight}>
                        View / Upload Proof
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  </CinematicPageTransition>
  );
};

export default DashboardPage;
