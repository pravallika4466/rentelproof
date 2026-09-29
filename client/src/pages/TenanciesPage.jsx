import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Mail,
  Calendar,
  CreditCard,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Search,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import TiltCard from '../components/common/TiltCard';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import { TableSkeleton } from '../components/common/Skeleton';

const TenanciesPage = () => {
  const { isLandlord, isTenant, isAdmin, user } = useAuth();
  const { showToast } = useToast();
  const [tenancies, setTenancies] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [search, setSearch] = useState('');

  const [inviteForm, setInviteForm] = useState({
    propertyId: '',
    tenantEmail: '',
    tenantName: '',
    tenantPhone: '',
    monthlyRent: '',
    securityDeposit: '',
    startDate: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tenanciesRes, invitesRes, propsRes] = await Promise.all([
        api.get('/tenancies'),
        api.get('/invitations'),
        isLandlord || isAdmin ? api.get('/properties') : Promise.resolve({ data: { properties: [] } }),
      ]);

      if (tenanciesRes.data.success) setTenancies(tenanciesRes.data.tenancies || []);
      if (invitesRes.data.success) setInvitations(invitesRes.data.invitations || []);
      if (propsRes.data.success) {
        setProperties(propsRes.data.properties || []);
        if (propsRes.data.properties?.length > 0) {
          setInviteForm((prev) => ({
            ...prev,
            propertyId: propsRes.data.properties[0]._id,
            monthlyRent: propsRes.data.properties[0].rentAmount,
            securityDeposit: propsRes.data.properties[0].depositAmount,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load tenancies data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendInvite = async (e) => {
    e.preventDefault();
    try {
      setInviting(true);
      const res = await api.post('/invitations', inviteForm);
      if (res.data.success) {
        showToast('Tenancy invitation sent successfully!', 'success');
        setInviteModalOpen(false);
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to send invitation', 'error');
    } finally {
      setInviting(false);
    }
  };

  const handleAcceptInvite = async (inviteId) => {
    try {
      const res = await api.put(`/invitations/${inviteId}/accept`);
      if (res.data.success) {
        showToast('Invitation accepted! Tenancy created.', 'success');
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to accept invitation', 'error');
    }
  };

  const handleRejectInvite = async (inviteId) => {
    try {
      const res = await api.put(`/invitations/${inviteId}/reject`);
      if (res.data.success) {
        showToast('Invitation declined.', 'info');
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to decline invitation', 'error');
    }
  };

  const filteredTenancies = tenancies.filter((t) => {
    if (!search) return true;
    const term = search.toLowerCase();
    const propTitle = t.property?.title?.toLowerCase() || '';
    const otherName = (isTenant ? t.landlord?.name : t.tenant?.name)?.toLowerCase() || '';
    return propTitle.includes(term) || otherName.includes(term);
  });

  const totalMonthlyRent = tenancies.reduce((acc, t) => acc + (t.monthlyRent || 0), 0);
  const totalSecurityDeposit = tenancies.reduce((acc, t) => acc + (t.securityDeposit || 0), 0);
  const activeLeasesCount = tenancies.filter((t) => t.status === 'Active').length;

  return (
    <CinematicPageTransition className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400">
              Contract Lifecycle
            </span>
            <Badge variant="primary" size="sm">
              Digital Lease
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tenancy Agreements
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-dark-300 mt-1">
            Binding lease contracts, invitation dispatches, and custodial deposit ties
          </p>
        </div>

        {(isLandlord || isAdmin) && (
          <Button variant="primary" size="md" icon={Plus} onClick={() => setInviteModalOpen(true)}>
            Invite New Tenant
          </Button>
        )}
      </div>

      {/* 3D KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TiltCard maxTilt={6}>
          <div className="glass-card p-5 rounded-2xl border border-brand-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                Active Leases
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                <AnimatedNumber value={activeLeasesCount} />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </TiltCard>

        <TiltCard maxTilt={6}>
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                Monthly Contract Volume
              </span>
              <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
                ₹<AnimatedNumber value={totalMonthlyRent} />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </TiltCard>

        <TiltCard maxTilt={6}>
          <div className="glass-card p-5 rounded-2xl border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                Custodial Escrow Tied
              </span>
              <div className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">
                ₹<AnimatedNumber value={totalSecurityDeposit} />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Invitations Section (If any pending) */}
      {invitations.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-dark-700/60">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-500" />
              Pending Invitations ({invitations.length})
            </h3>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">Awaiting Confirmation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invitations.map((inv) => (
              <div
                key={inv._id}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/70 dark:border-dark-700/70 flex flex-col justify-between hover:border-brand-500/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{inv.property?.title}</span>
                    <Badge variant={inv.status}>{inv.status}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-dark-300 mb-3">
                    {isLandlord
                      ? `Recipient: ${inv.tenantEmail}`
                      : `From Landlord: ${inv.landlord?.name} (${inv.landlord?.email})`}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-xl bg-white/60 dark:bg-dark-800/60 border border-slate-200/50 dark:border-dark-700/50">
                    <div>
                      <span className="text-slate-400 dark:text-dark-400 block text-[10px]">Monthly Rent</span>
                      <strong className="text-slate-900 dark:text-white font-mono">
                        ₹{inv.monthlyRent?.toLocaleString('en-IN')}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-dark-400 block text-[10px]">Escrow Deposit</span>
                      <strong className="text-slate-900 dark:text-white font-mono">
                        ₹{inv.securityDeposit?.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Actions for tenant */}
                {isTenant && inv.status === 'Pending' && (
                  <div className="flex gap-2.5 mt-4 pt-3 border-t border-slate-200/60 dark:border-dark-700/60">
                    <Button variant="primary" size="sm" onClick={() => handleAcceptInvite(inv._id)}>
                      Accept & Bind Lease
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleRejectInvite(inv._id)}>
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tenancies Table */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 dark:border-dark-700/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active & Historical Tenancies</h3>
            <p className="text-xs text-slate-500 dark:text-dark-300">
              Verified legal tenancies documented on RentalProof
            </p>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400 dark:text-dark-400" />
            <input
              type="text"
              placeholder="Filter by property or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-10 pr-4 py-1.5 text-xs w-full"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : filteredTenancies.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users}
              title="No tenancies found"
              description="Invite a tenant to an approved property to generate lease records and deposit ledgers."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-dark-900/80 text-slate-500 dark:text-dark-400 font-bold uppercase tracking-wider border-b border-slate-200/60 dark:border-dark-700/60">
                <tr>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">{isTenant ? 'Landlord' : 'Tenant'}</th>
                  <th className="px-6 py-4">Term Dates</th>
                  <th className="px-6 py-4">Monthly Rent</th>
                  <th className="px-6 py-4">Security Deposit</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-dark-700/60">
                {filteredTenancies.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-dark-800/40 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{t.property?.title}</div>
                      <div className="text-[11px] text-slate-400 dark:text-dark-400">{t.property?.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 dark:text-dark-100">
                        {isTenant ? t.landlord?.name : t.tenant?.name}
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-dark-400">
                        {isTenant ? t.landlord?.email : t.tenant?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-dark-300">
                      <div>{new Date(t.startDate).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400 dark:text-dark-400">
                        to {new Date(t.expectedEndDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white font-mono">
                      ₹{t.monthlyRent?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 font-bold text-brand-600 dark:text-brand-400 font-mono">
                      ₹{t.securityDeposit?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={t.status}>{t.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/tenancies/${t._id}`}>
                        <Button variant="outline" size="sm" icon={ArrowRight}>
                          Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite Tenant Modal */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Tenant to Property"
        subtitle="Generates an official digital tenancy invitation and draft agreement"
      >
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">Select Property</label>
            <select
              required
              value={inviteForm.propertyId}
              onChange={(e) => {
                const prop = properties.find((p) => p._id === e.target.value);
                setInviteForm({
                  ...inviteForm,
                  propertyId: e.target.value,
                  monthlyRent: prop?.rentAmount || inviteForm.monthlyRent,
                  securityDeposit: prop?.depositAmount || inviteForm.securityDeposit,
                });
              }}
              className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
            >
              {properties.map((p) => (
                <option key={p._id} value={p._id} className="dark:bg-dark-900">
                  {p.title} ({p.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">Tenant Email</label>
            <input
              type="email"
              required
              placeholder="tenant@example.com"
              value={inviteForm.tenantEmail}
              onChange={(e) => setInviteForm({ ...inviteForm, tenantEmail: e.target.value })}
              className="glass-input w-full p-2.5 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                Monthly Rent (₹)
              </label>
              <input
                type="number"
                required
                value={inviteForm.monthlyRent}
                onChange={(e) => setInviteForm({ ...inviteForm, monthlyRent: e.target.value })}
                className="glass-input w-full p-2.5 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                required
                value={inviteForm.securityDeposit}
                onChange={(e) => setInviteForm({ ...inviteForm, securityDeposit: e.target.value })}
                className="glass-input w-full p-2.5 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
              Tenancy Start Date
            </label>
            <input
              type="date"
              required
              value={inviteForm.startDate}
              onChange={(e) => setInviteForm({ ...inviteForm, startDate: e.target.value })}
              className="glass-input w-full p-2.5 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-dark-700/60">
            <Button variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={inviting} icon={ArrowRight}>
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>
    </CinematicPageTransition>
  );
};

export default TenanciesPage;
