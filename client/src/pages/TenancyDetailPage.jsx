import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Calendar,
  CreditCard,
  PiggyBank,
  ArrowLeft,
  ClipboardCheck,
  Wrench,
  FileText,
  Mail,
  Phone,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import api from '../api/client';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import { CardSkeleton } from '../components/common/Skeleton';

const TenancyDetailPage = () => {
  const { id } = useParams();
  const [tenancy, setTenancy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenancy = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/tenancies/${id}`);
        if (res.data.success) {
          setTenancy(res.data.tenancy);
        }
      } catch (error) {
        console.error('Failed to load tenancy details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTenancy();
  }, [id]);

  if (loading || !tenancy) {
    return <CardSkeleton />;
  }

  return (
    <CinematicPageTransition className="space-y-6 max-w-5xl mx-auto">
      <Link
        to="/tenancies"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-500 dark:text-dark-300 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Tenancies List
      </Link>

      <TiltCard maxTilt={3} depth={10}>
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-brand-500/20">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-dark-700/60">
            <div>
              <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20">
                Official Tenancy Record
              </span>
              <Badge variant={tenancy.status}>{tenancy.status}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {tenancy.property?.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-dark-300 mt-1">
              {tenancy.property?.address}, {tenancy.property?.city}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link to={`/deposits?tenancyId=${tenancy._id}`}>
              <Button variant="outline" size="sm" icon={PiggyBank}>
                Escrow Ledger
              </Button>
            </Link>
            <Link to={`/inspections?tenancyId=${tenancy._id}`}>
              <Button variant="primary" size="sm" icon={ClipboardCheck}>
                Property Inspections
              </Button>
            </Link>
          </div>
        </div>

        {/* Landlord & Tenant Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/70 dark:border-dark-700/70">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-3">
              Landlord Details
            </span>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 dark:bg-dark-800 text-white flex items-center justify-center font-bold text-base border border-slate-700 shadow-sm">
                {tenancy.landlord?.name?.charAt(0) || 'L'}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">{tenancy.landlord?.name}</span>
                <span className="text-xs text-slate-500 dark:text-dark-300 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3 text-brand-500" />
                  {tenancy.landlord?.email}
                </span>
                {tenancy.landlord?.phone && (
                  <span className="text-xs text-slate-500 dark:text-dark-300 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-brand-500" />
                    {tenancy.landlord?.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/70 dark:border-dark-700/70">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-3">
              Tenant Details
            </span>
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-base shadow-emerald-glow">
                {tenancy.tenant?.name?.charAt(0) || 'T'}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 dark:text-white block">{tenancy.tenant?.name}</span>
                <span className="text-xs text-slate-500 dark:text-dark-300 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3 h-3 text-brand-500" />
                  {tenancy.tenant?.email}
                </span>
                {tenancy.tenant?.phone && (
                  <span className="text-xs text-slate-500 dark:text-dark-300 flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3 h-3 text-brand-500" />
                    {tenancy.tenant?.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Terms */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/70 dark:border-dark-700/70 text-xs">
          <div>
            <span className="text-slate-400 dark:text-dark-400 block mb-1">Monthly Rent</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
              ₹{tenancy.monthlyRent?.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-dark-400 block mb-1">Security Deposit</span>
            <span className="text-base font-extrabold text-brand-600 dark:text-brand-400 font-mono">
              ₹{tenancy.securityDeposit?.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-dark-400 block mb-1">Tenancy Start Date</span>
            <span className="text-sm font-bold text-slate-800 dark:text-dark-200">
              {new Date(tenancy.startDate).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-slate-400 dark:text-dark-400 block mb-1">Expected End Date</span>
            <span className="text-sm font-bold text-slate-800 dark:text-dark-200">
              {new Date(tenancy.expectedEndDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Agreement Notes */}
        {tenancy.notes && (
          <div className="p-4 rounded-2xl bg-brand-500/5 dark:bg-brand-500/10 border border-brand-500/20 text-xs text-slate-700 dark:text-dark-200">
            <span className="font-bold block mb-1 text-brand-600 dark:text-brand-400">
              Special Terms & Contractual Conditions:
            </span>
            <p className="leading-relaxed">{tenancy.notes}</p>
          </div>
        )}
        </div>
      </TiltCard>
    </CinematicPageTransition>
  );
};

export default TenancyDetailPage;
