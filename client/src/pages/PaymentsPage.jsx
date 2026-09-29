import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Search, Calendar, CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/CinematicLoader';
import TiltCard from '../components/common/TiltCard';
import FinancialVault3D from '../components/3d/FinancialVault3D';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const PaymentsPage = () => {
  const { user, isLandlord, isTenant, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [payments, setPayments] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    tenancyId: '',
    amount: '',
    month: 'October 2026',
    dueDate: new Date().toISOString().split('T')[0],
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'UPI',
    status: 'Paid',
    referenceNumber: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, tenanciesRes] = await Promise.all([
        api.get('/payments', {
          params: { status: statusFilter !== 'all' ? statusFilter : undefined },
        }),
        api.get('/tenancies'),
      ]);

      if (paymentsRes.data.success) setPayments(paymentsRes.data.payments || []);
      if (tenanciesRes.data.success) {
        setTenancies(tenanciesRes.data.tenancies || []);
        if (tenanciesRes.data.tenancies?.length > 0 && !form.tenancyId) {
          setForm((prev) => ({
            ...prev,
            tenancyId: tenanciesRes.data.tenancies[0]._id,
            amount: tenanciesRes.data.tenancies[0].monthlyRent,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter]);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/payments', form);
      if (res.data.success) {
        showToast('Payment record added to ledger!', 'success');
        setModalOpen(false);
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to record payment.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCollected = payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const pendingAmount = payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <CinematicPageTransition>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
              Rent Payment Records
            </h1>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
              Documented monthly rental transactions and payment receipts
            </p>
          </div>

          <Button variant="primary" size="md" icon={Plus} onClick={() => setModalOpen(true)}>
            Record Payment
          </Button>
        </div>

        {/* Financial Metrics Cards with 3D Tilt */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <TiltCard className="p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 block mb-1">
              Total Rent Collected
            </span>
            <div className="text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">
              <AnimatedNumber value={totalCollected} prefix="₹" />
            </div>
            <p className="text-xs text-dark-400 mt-1">Verified on-time collection</p>
          </TiltCard>

          <TiltCard className="p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 block mb-1">
              Pending / In Transit
            </span>
            <div className="text-3xl font-black text-accent-500 font-mono">
              <AnimatedNumber value={pendingAmount} prefix="₹" />
            </div>
            <p className="text-xs text-dark-400 mt-1">Awaiting bank settlement</p>
          </TiltCard>

          <TiltCard className="p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 block mb-1">
              Total Ledger Entries
            </span>
            <div className="text-3xl font-black text-dark-950 dark:text-white font-mono">
              <AnimatedNumber value={payments.length} />
            </div>
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">100% cryptographically recorded</p>
          </TiltCard>
        </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 border-b border-light-300 dark:border-dark-700/80 pb-3">
        {['all', 'Paid', 'Pending', 'Late'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer interactive ${
              statusFilter === s
                ? 'bg-brand-500 text-white shadow-emerald-glow'
                : 'glass-panel text-dark-600 dark:text-dark-300 hover:border-brand-500/40'
            }`}
          >
            {s === 'all' ? 'All Payments' : s}
          </button>
        ))}
      </div>

      {/* Payments Table */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : payments.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No payments recorded"
          description="Click 'Record Payment' to add a monthly rent transaction to the ledger."
          actionLabel="Record Payment"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="rounded-3xl glass-card overflow-hidden shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-light-100/50 dark:bg-dark-900/60 text-dark-500 dark:text-dark-400 font-bold uppercase tracking-wider border-b border-light-300 dark:border-dark-700/80">
                <tr>
                  <th className="px-6 py-4">Property & Tenant</th>
                  <th className="px-6 py-4">Month</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Method / Ref</th>
                  <th className="px-6 py-4">Date Recorded</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200 dark:divide-dark-800/80">
                {payments.map((p) => (
                  <tr key={p._id} className="hover:bg-light-100/40 dark:hover:bg-dark-850/40 transition">
                    <td className="px-6 py-4">
                      <span className="font-bold text-dark-900 dark:text-white block">{p.property?.title}</span>
                      <span className="text-[11px] text-dark-500 dark:text-dark-400">{p.tenant?.name}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-dark-800 dark:text-dark-200">{p.month}</td>
                    <td className="px-6 py-4 font-extrabold text-brand-600 dark:text-brand-400 font-mono text-sm">
                      ₹{p.amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={p.status}>{p.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-dark-600 dark:text-dark-300 font-mono">
                      <span className="font-semibold block">{p.paymentMethod}</span>
                      <span className="text-[10px] text-dark-400">{p.referenceNumber || '—'}</span>
                    </td>
                    <td className="px-6 py-4 text-dark-500 dark:text-dark-400 font-mono">
                      {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Rent Payment"
        subtitle="Log a rental transaction with method and receipt reference"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Select Tenancy</label>
            <select
              value={form.tenancyId}
              onChange={(e) => {
                const t = tenancies.find((item) => item._id === e.target.value);
                setForm({
                  ...form,
                  tenancyId: e.target.value,
                  amount: t ? t.monthlyRent : form.amount,
                });
              }}
              required
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            >
              {tenancies.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.property?.title} (Tenant: {t.tenant?.name}) — ₹{t.monthlyRent}/mo
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Rent Amount (₹)</label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Billing Month</label>
              <input
                type="text"
                placeholder="e.g. October 2026"
                value={form.month}
                onChange={(e) => setForm({ ...form, month: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Payment Method</label>
              <select
                value={form.paymentMethod}
                onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              >
                <option value="UPI">UPI / GooglePay / PhonePe</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="Cash">Cash with Receipt</option>
                <option value="Card">Debit / Credit Card</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Late">Late</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
              Transaction Reference ID
            </label>
            <input
              type="text"
              placeholder="e.g. UPI Ref: 32091823901"
              value={form.referenceNumber}
              onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono placeholder:text-dark-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-light-300 dark:border-dark-700/80">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Add to Ledger
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  </CinematicPageTransition>
  );
};

export default PaymentsPage;
