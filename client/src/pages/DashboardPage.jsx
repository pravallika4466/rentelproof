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
  Clock,
  AlertCircle,
  CreditCard,
  FileText,
  Calendar,
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
  LineChart,
  Line,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { CardSkeleton } from '../components/common/Skeleton';

const DashboardPage = () => {
  const { user, isLandlord, isTenant, isServiceProvider, isAdmin } = useAuth();
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
          api.get('/properties'),
          api.get('/tenancies'),
          api.get('/maintenance'),
          api.get('/inspections'),
          api.get('/payments'),
        ]);

        setData({
          properties: propsRes.data.properties || [],
          tenancies: tenanciesRes.data.tenancies || [],
          maintenance: maintRes.data.requests || [],
          inspections: inspRes.data.inspections || [],
          payments: paymentsRes.data.payments || [],
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Analytics data for Recharts
  const occupancyData = [
    { name: 'Occupied', value: data.properties.filter((p) => p.status === 'Occupied').length, color: '#059669' },
    { name: 'Available', value: data.properties.filter((p) => p.status === 'Available').length, color: '#10b981' },
    {
      name: 'Maintenance',
      value: data.properties.filter((p) => p.status === 'Under Maintenance').length,
      color: '#f59e0b',
    },
  ];

  const maintenanceByCategory = [
    { category: 'Plumbing', count: data.maintenance.filter((m) => m.category === 'Plumbing').length },
    { category: 'Electrical', count: data.maintenance.filter((m) => m.category === 'Electrical').length },
    { category: 'Appliance', count: data.maintenance.filter((m) => m.category === 'Appliance').length },
    { category: 'Structural', count: data.maintenance.filter((m) => m.category === 'Structural').length },
  ];

  const rentTrendData = [
    { month: 'Apr', amount: 15000 },
    { month: 'May', amount: 15000 },
    { month: 'Jun', amount: 15000 },
    { month: 'Jul', amount: 15000 },
    { month: 'Aug', amount: 15000 },
    { month: 'Sep', amount: 15000 },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-slate-900 to-zinc-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-2 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Digital Evidence Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            {isLandlord && 'Monitor portfolio condition baselines, maintenance tickets, and deposit records.'}
            {isTenant && 'Your digital rental vault. Review your move-in baseline, maintenance tickets, and rent receipts.'}
            {isServiceProvider && 'View assigned service requests, upload completion photos, and update resolution states.'}
            {isAdmin && 'Platform administration overview, user verification, and global activity audit logs.'}
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex flex-wrap items-center gap-3">
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
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Properties</span>
                <div className="p-2 bg-brand-50 text-brand-600 rounded-xl">
                  <Building2 className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">{data.properties.length}</div>
              <p className="text-xs text-slate-500 mt-1">
                {data.properties.filter((p) => p.status === 'Occupied').length} occupied units
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Active Tenancies</span>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {data.tenancies.filter((t) => t.status === 'Active').length}
              </div>
              <p className="text-xs text-slate-500 mt-1">Verified agreements</p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Open Maintenance</span>
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Wrench className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">
                {data.maintenance.filter((m) => m.status !== 'Completed').length}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {data.maintenance.filter((m) => m.status === 'Completed').length} resolved
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">Deposits Recorded</span>
                <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                  <PiggyBank className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900">₹30,000</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">Ledger balanced</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rent Trend */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Monthly Rent Collection</h3>
                  <p className="text-xs text-slate-500">Verified rent receipts over last 6 months</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" /> 100% on time
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rentTrendData}>
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${val / 1000}k`} />
                    <Tooltip
                      formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Rent Collected']}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Bar dataKey="amount" fill="#059669" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Occupancy Status */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-1">Portfolio Occupancy</h3>
              <p className="text-xs text-slate-500 mb-4">Active rental status distribution</p>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={occupancyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={70}>
                      {occupancyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-around text-center pt-2 border-t border-slate-100">
                {occupancyData.map((item) => (
                  <div key={item.name}>
                    <span className="text-xs text-slate-500 block">{item.name}</span>
                    <span className="text-sm font-bold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Quick Management Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/properties/new"
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 transition group text-left"
                >
                  <Building2 className="w-5 h-5 text-brand-600 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-800 block">Add Property</span>
                  <span className="text-[10px] text-slate-500">List unit</span>
                </Link>

                <Link
                  to="/tenancies"
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition group text-left"
                >
                  <Users className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-800 block">Invite Tenant</span>
                  <span className="text-[10px] text-slate-500">Digital lease</span>
                </Link>

                <Link
                  to="/inspections"
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-purple-50 border border-slate-100 hover:border-purple-200 transition group text-left"
                >
                  <ClipboardCheck className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-800 block">Start Inspection</span>
                  <span className="text-[10px] text-slate-500">Room checklist</span>
                </Link>

                <Link
                  to="/maintenance"
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-100 hover:border-amber-200 transition group text-left"
                >
                  <Wrench className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition" />
                  <span className="text-xs font-bold text-slate-800 block">Maintenance</span>
                  <span className="text-[10px] text-slate-500">Assign jobs</span>
                </Link>
              </div>
            </div>

            {/* Recent Evidence Activity */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">Recent Platform Activities</h3>
                <Link to="/audit-logs" className="text-xs font-bold text-brand-600 hover:underline">
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
                  <div key={i} className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{act.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                          {act.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{act.desc}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0 font-medium">{act.time}</span>
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
            {/* Rented Property Info Card */}
            <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-600">Your Current Lease</span>
                  <h3 className="text-lg font-bold text-slate-900">Green Valley Apartments, Unit 402</h3>
                  <p className="text-xs text-slate-500">402 Palm Grove Enclave, Ring Road, Guntur</p>
                </div>
                <Badge variant="Active">Active Tenancy</Badge>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
                <div>
                  <span className="text-xs text-slate-400 block">Monthly Rent</span>
                  <span className="text-sm font-bold text-slate-900">₹15,000 / mo</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Original Deposit</span>
                  <span className="text-sm font-bold text-slate-900">₹30,000</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Recorded Balance</span>
                  <span className="text-sm font-bold text-emerald-600">₹28,800</span>
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

            {/* Quick Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900">Your Digital Protection</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-100 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Move-In Baseline Signed</span>
                  </div>
                  <span className="font-bold">Verified</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50 text-teal-900 border border-teal-100 text-xs">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-teal-600" />
                    <span>September Rent Status</span>
                  </div>
                  <span className="font-bold">Paid</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50 text-purple-900 border border-purple-100 text-xs">
                  <div className="flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-purple-600" />
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
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">Assigned Work Orders</h3>
            {data.maintenance.length === 0 ? (
              <p className="text-xs text-slate-500">No pending work orders.</p>
            ) : (
              <div className="space-y-3">
                {data.maintenance.map((m) => (
                  <div
                    key={m._id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{m.title}</span>
                        <Badge variant={m.status}>{m.status}</Badge>
                        <Badge variant={m.priority}>{m.priority}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
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
  );
};

export default DashboardPage;
