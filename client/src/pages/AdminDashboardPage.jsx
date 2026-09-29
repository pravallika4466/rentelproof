import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  Building2,
  Wrench,
  ClipboardCheck,
  FileText,
  Search,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  UserX,
  UserCheck,
  Activity,
  Layers,
} from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TiltCard from '../components/common/TiltCard';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import DashboardAmbient3D from '../components/3d/DashboardAmbient3D';
import { CardSkeleton, TableSkeleton } from '../components/common/Skeleton';

const AdminDashboardPage = () => {
  const { showToast } = useToast();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get('/admin/users', {
        params: {
          role: roleFilter !== 'all' ? roleFilter : undefined,
          search: search || undefined,
        },
      });
      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleUser = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-status`);
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchUsers();
        fetchStats();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to toggle status.', 'error');
    }
  };

  return (
    <CinematicPageTransition className="space-y-8 relative">
      {/* 3D Ambient Visual Container for Platform Governance */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-dark-900 to-slate-950 border border-brand-500/20 shadow-2xl">
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <DashboardAmbient3D />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Administrative Control Center
            </span>
            <Badge variant="danger" size="sm">
              Root Authority
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Governance
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time administrative telemetry, user moderation, cryptographic custodial integrity, and cluster health
          </p>
        </div>
      </div>

      {/* Global Stat Cards with 3D Tilt */}
      {loadingStats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <TiltCard maxTilt={5}>
            <div className="glass-card p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-brand-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                  Registered Users
                </span>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
                  <AnimatedNumber value={stats.users?.total || 0} />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-dark-300 mt-3 pt-3 border-t border-slate-200/60 dark:border-dark-700/60 font-medium">
                {stats.users?.landlords} landlords • {stats.users?.tenants} tenants
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5}>
            <div className="glass-card p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                  Total Properties
                </span>
                <div className="text-2xl sm:text-3xl font-black text-brand-500 dark:text-brand-400 font-mono">
                  <AnimatedNumber value={stats.properties?.total || 0} />
                </div>
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-3 pt-3 border-t border-slate-200/60 dark:border-dark-700/60">
                {stats.properties?.occupied} units currently leased
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5}>
            <div className="glass-card p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 flex items-center justify-center mb-3">
                  <Wrench className="w-5 h-5 text-amber-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                  Service Tickets
                </span>
                <div className="text-2xl sm:text-3xl font-black text-amber-500 dark:text-amber-400 font-mono">
                  <AnimatedNumber value={stats.maintenance?.total || 0} />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-dark-300 mt-3 pt-3 border-t border-slate-200/60 dark:border-dark-700/60 font-medium">
                {stats.maintenance?.completed} verified completions
              </div>
            </div>
          </TiltCard>

          <TiltCard maxTilt={5}>
            <div className="glass-card p-5 sm:p-6 rounded-3xl h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-accent-500/10 dark:bg-accent-500/15 border border-accent-500/20 flex items-center justify-center mb-3">
                  <ClipboardCheck className="w-5 h-5 text-accent-500" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                  Inspection Records
                </span>
                <div className="text-2xl sm:text-3xl font-black text-accent-400 font-mono">
                  <AnimatedNumber value={stats.inspections?.total || 0} />
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-dark-300 mt-3 pt-3 border-t border-slate-200/60 dark:border-dark-700/60 font-medium">
                Photographic baseline vaults
              </div>
            </div>
          </TiltCard>
        </div>
      ) : null}

      {/* User Management Section */}
      <div className="glass-card rounded-3xl overflow-hidden space-y-4">
        <div className="p-6 border-b border-slate-200/60 dark:border-dark-700/60 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">User Moderation & Account States</h3>
            <p className="text-xs text-slate-500 dark:text-dark-300">
              Manage platform role privileges and access control states
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400 dark:text-dark-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="glass-input pl-10 pr-3 py-1.5 text-xs rounded-xl"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="glass-input text-xs px-3.5 py-1.5 font-medium"
            >
              <option value="all" className="dark:bg-dark-900">All Roles</option>
              <option value="landlord" className="dark:bg-dark-900">Landlords</option>
              <option value="tenant" className="dark:bg-dark-900">Tenants</option>
              <option value="service_provider" className="dark:bg-dark-900">Service Providers</option>
              <option value="admin" className="dark:bg-dark-900">Administrators</option>
            </select>
          </div>
        </div>

        {loadingUsers ? (
          <TableSkeleton rows={4} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-dark-900/80 text-slate-500 dark:text-dark-400 font-bold uppercase tracking-wider border-b border-slate-200/60 dark:border-dark-700/60">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Moderation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-dark-700/60">
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-dark-800/40 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span>{u.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 dark:text-dark-400 ml-9">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="primary" size="sm" className="capitalize">
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-dark-300 font-mono">{u.phone || '—'}</td>
                    <td className="px-6 py-4 text-slate-500 dark:text-dark-400 font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {u.isActive ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5" /> Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant={u.isActive ? 'outline' : 'success'}
                        size="sm"
                        onClick={() => handleToggleUser(u._id)}
                        icon={u.isActive ? UserX : UserCheck}
                      >
                        {u.isActive ? 'Deactivate' : 'Reactivate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CinematicPageTransition>
  );
};

export default AdminDashboardPage;
