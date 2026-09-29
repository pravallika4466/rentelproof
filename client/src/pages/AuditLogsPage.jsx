import React, { useState, useEffect } from 'react';
import { History, Search, Filter, ShieldCheck, Clock, User, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { SkeletonCard } from '../components/common/CinematicLoader';
import EmptyState from '../components/common/EmptyState';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import AnimatedNumber from '../components/common/AnimatedNumber';

const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/audit-logs', {
        params: {
          entity: entityFilter !== 'all' ? entityFilter : undefined,
          search: search || undefined,
        },
      });
      if (res.data.success) {
        setLogs(res.data.logs || []);
      }
    } catch (error) {
      console.error('Failed to load audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityFilter]);

  return (
    <CinematicPageTransition className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
            Tamper-Evident Ledger
          </span>
          <span className="text-dark-300 dark:text-dark-600">•</span>
          <span className="text-xs font-semibold text-dark-500 dark:text-dark-400">Immutable Audit Trail</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
          System Activity & Evidence Trail
        </h1>
        <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
          Verifiable record of every property listing, inspection upload, and maintenance status shift
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-dark-400" />
          <input
            type="text"
            placeholder="Search audit trail by action or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder:text-dark-400 focus:outline-none"
          />
        </div>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="text-xs rounded-xl glass-input px-3 py-2 text-dark-800 dark:text-dark-200 font-medium focus:outline-none cursor-pointer"
        >
          <option value="all">All Evidence Entities</option>
          <option value="Property">Property</option>
          <option value="Tenancy">Tenancy</option>
          <option value="Inspection">Inspection</option>
          <option value="Evidence">Evidence Pair</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Payment">Payment</option>
          <option value="Deposit">Deposit</option>
          <option value="Document">Document</option>
          <option value="User">User</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="rounded-3xl glass-card overflow-hidden shadow-card">
        <div className="p-6 border-b border-light-300 dark:border-dark-700/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-dark-950 dark:text-white">
            Recorded Audit Events (<AnimatedNumber value={logs.length} />)
          </h3>
        </div>

        {loading ? (
          <SkeletonCard count={3} />
        ) : logs.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={History}
              title="No audit entries found"
              description="Actions taken across properties and inspections will automatically appear here."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-light-100/50 dark:bg-dark-900/60 text-dark-500 dark:text-dark-400 font-bold uppercase tracking-wider border-b border-light-300 dark:border-dark-700/80">
                <tr>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Actor</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200 dark:divide-dark-800/80">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-light-100/40 dark:hover:bg-dark-850/40 transition">
                    <td className="px-6 py-4 font-bold text-dark-950 dark:text-white">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 shadow-emerald-glow" />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md glass-panel text-dark-700 dark:text-dark-300 font-mono">
                        {log.entity}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-600 dark:text-dark-300 max-w-md leading-relaxed">{log.description}</td>
                    <td className="px-6 py-4 font-semibold text-dark-800 dark:text-dark-200">
                      {log.user?.name || 'System / Guest'}
                    </td>
                    <td className="px-6 py-4 text-dark-500 dark:text-dark-400 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
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

export default AuditLogsPage;
