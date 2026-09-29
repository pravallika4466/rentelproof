import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PiggyBank, Plus, HelpCircle, ShieldCheck, ArrowRight, Wrench, ClipboardCheck, Calendar } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import { SkeletonCard } from '../components/common/CinematicLoader';
import TiltCard from '../components/common/TiltCard';
import FinancialVault3D from '../components/3d/FinancialVault3D';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const DepositsPage = () => {
  const [searchParams] = useSearchParams();
  const tenancyIdParam = searchParams.get('tenancyId');
  const { isLandlord, isAdmin, isTenant } = useAuth();
  const { showToast } = useToast();

  const [depositsList, setDepositsList] = useState([]);
  const [currentDeposit, setCurrentDeposit] = useState(null);
  const [loading, setLoading] = useState(true);

  // Deduction modal
  const [deductionModalOpen, setDeductionModalOpen] = useState(false);
  const [submittingDeduction, setSubmittingDeduction] = useState(false);
  const [deductionForm, setDeductionForm] = useState({
    reason: '',
    amount: '',
    notes: '',
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deposits');
      if (res.data.success) {
        const deposits = res.data.deposits || [];
        setDepositsList(deposits);

        if (tenancyIdParam) {
          const found = deposits.find((d) => d.tenancy?._id === tenancyIdParam);
          if (found) setCurrentDeposit(found);
          else if (deposits.length > 0) setCurrentDeposit(deposits[0]);
        } else if (deposits.length > 0) {
          setCurrentDeposit(deposits[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load deposit ledgers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tenancyIdParam]);

  const handleRecordDeduction = async (e) => {
    e.preventDefault();
    if (!currentDeposit?.tenancy?._id) return;

    try {
      setSubmittingDeduction(true);
      const res = await api.post(`/deposits/tenancy/${currentDeposit.tenancy._id}/deductions`, deductionForm);
      if (res.data.success) {
        showToast('Deduction logged into deposit ledger!', 'success');
        setDeductionModalOpen(false);
        setDeductionForm({ reason: '', amount: '', notes: '' });
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to add deduction.', 'error');
    } finally {
      setSubmittingDeduction(false);
    }
  };

  if (loading) {
    return <SkeletonCard count={3} />;
  }

  const originalDeposit = currentDeposit?.originalDeposit || 0;
  const recordedBalance = currentDeposit?.recordedBalance || 0;
  const totalDeductions = originalDeposit - recordedBalance;

  return (
    <CinematicPageTransition>
      <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
              Security Deposit Protection
            </span>
            <Badge variant="primary" size="sm">
              Ledger Accounting
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
            Deposit Accounting
          </h1>
          <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            Documented deductions, repair links, and recorded balances
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Tenancy Selector if multiple */}
          {depositsList.length > 1 && (
            <select
              value={currentDeposit?._id}
              onChange={(e) => {
                const dep = depositsList.find((d) => d._id === e.target.value);
                if (dep) setCurrentDeposit(dep);
              }}
              className="text-xs rounded-xl glass-input px-3 py-2 text-dark-800 dark:text-dark-200 font-semibold focus:outline-none cursor-pointer"
            >
              {depositsList.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.property?.title} (Tenant: {d.tenant?.name})
                </option>
              ))}
            </select>
          )}

          {(isLandlord || isAdmin) && (
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setDeductionModalOpen(true)}
            >
              Record Deduction
            </Button>
          )}
        </div>
      </div>

      {/* 3D Financial Escrow Vault Banner */}
      <div className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-500/20 shadow-card-hover relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Custodial Escrow Visualizer
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-dark-950 dark:text-white tracking-tight">
            Cryptographic Custody & Transparent Deductions
          </h2>
          <p className="text-xs text-dark-500 dark:text-dark-300 leading-relaxed max-w-xl">
            Every rupee deducted must bind directly to an approved work order invoice or verified move-out walkthrough inspection record.
          </p>
        </div>

        <div className="lg:col-span-4 flex items-center justify-center">
          <div className="w-full max-w-[280px] rounded-2xl bg-dark-950/20 dark:bg-dark-950/50 border border-brand-500/20 overflow-hidden relative shadow-inner">
            <FinancialVault3D />
          </div>
        </div>
      </div>

      {/* Ethical Legal Notice */}
      <div className="p-4 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-700 dark:text-accent-300 flex items-start gap-3 text-xs leading-relaxed">
        <HelpCircle className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">Recorded Calculation Protocol:</span>
          All figures displayed below represent a digital calculation of recorded expenditures and condition claims. This ledger provides cryptographic auditability for transparent, friction-free security deposit settlement.
        </div>
      </div>

      {/* Ledger Cards with 3D Tilt */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <TiltCard className="p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 block mb-1">
            Original Security Deposit
          </span>
          <div className="text-3xl font-black text-dark-950 dark:text-white font-mono">
            <AnimatedNumber value={originalDeposit} prefix="₹" />
          </div>
          <p className="text-xs text-dark-400 mt-1">Paid upon lease signing</p>
        </TiltCard>

        <TiltCard className="p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 block mb-1">
            Recorded Deductions
          </span>
          <div className="text-3xl font-black text-rose-500 font-mono">
            - <AnimatedNumber value={totalDeductions} prefix="₹" />
          </div>
          <p className="text-xs text-rose-500/80 mt-1 font-medium">
            {currentDeposit?.deductions?.length || 0} documented entries
          </p>
        </TiltCard>

        <TiltCard className="p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 block mb-1">
            Remaining Recorded Balance
          </span>
          <div className="text-3xl font-black text-brand-600 dark:text-brand-400 font-mono">
            <AnimatedNumber value={recordedBalance} prefix="₹" />
          </div>
          <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 font-medium">Calculated refund position</p>
        </TiltCard>
      </div>

      {/* Property & Tenant Meta Banner */}
      {currentDeposit && (
        <div className="p-6 rounded-3xl glass-card flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400 font-mono">
              Property Ledger
            </span>
            <h3 className="text-base font-bold text-dark-950 dark:text-white">{currentDeposit.property?.title}</h3>
            <p className="text-xs text-dark-500 dark:text-dark-400">
              {currentDeposit.property?.address}, {currentDeposit.property?.city}
            </p>
          </div>

          <div className="text-xs text-dark-600 dark:text-dark-300">
            <span className="text-dark-400 block text-[11px]">Primary Tenant</span>
            <span className="font-bold text-dark-900 dark:text-white">{currentDeposit.tenant?.name}</span> ({currentDeposit.tenant?.email})
          </div>
        </div>
      )}

      {/* Deductions Breakdown Table */}
      <div className="rounded-3xl glass-card overflow-hidden shadow-card">
        <div className="p-6 border-b border-light-300 dark:border-dark-700/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-dark-950 dark:text-white">Documented Deduction Entries</h3>
          <span className="text-xs text-dark-500 font-mono">{currentDeposit?.deductions?.length || 0} items</span>
        </div>

        {currentDeposit?.deductions?.length === 0 ? (
          <div className="p-10 text-center text-xs text-dark-400">
            No deductions recorded. Deposit balance is fully intact.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-light-100/50 dark:bg-dark-900/60 text-dark-500 dark:text-dark-400 font-bold uppercase tracking-wider border-b border-light-300 dark:border-dark-700/80">
                <tr>
                  <th className="px-6 py-4">Reason / Description</th>
                  <th className="px-6 py-4">Recorded Amount</th>
                  <th className="px-6 py-4">Date Logged</th>
                  <th className="px-6 py-4">Linked Evidence</th>
                  <th className="px-6 py-4">Recorded Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200 dark:divide-dark-800/80">
                {currentDeposit?.deductions?.map((d, i) => (
                  <tr key={i} className="hover:bg-light-100/40 dark:hover:bg-dark-850/40 transition">
                    <td className="px-6 py-4 font-semibold text-dark-900 dark:text-white">{d.reason}</td>
                    <td className="px-6 py-4 font-bold text-rose-500 font-mono">₹{d.amount?.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-dark-500 dark:text-dark-400 font-mono">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {d.linkedMaintenance ? (
                        <Link
                          to={`/maintenance/${d.linkedMaintenance._id || d.linkedMaintenance}`}
                          className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          <Wrench className="w-3.5 h-3.5" /> Maintenance Ticket
                        </Link>
                      ) : (
                        <span className="text-dark-400">Direct Entry</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-dark-600 dark:text-dark-300">{d.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deduction Modal */}
      <Modal
        isOpen={deductionModalOpen}
        onClose={() => setDeductionModalOpen(false)}
        title="Record Deposit Deduction"
        subtitle="Log an expense deduction against the security deposit ledger"
      >
        <form onSubmit={handleRecordDeduction} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
              Deduction Reason
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Broken bedroom window glass replacement"
              value={deductionForm.reason}
              onChange={(e) => setDeductionForm({ ...deductionForm, reason: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
              Deduction Amount (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              max={recordedBalance}
              placeholder="e.g. 1200"
              value={deductionForm.amount}
              onChange={(e) => setDeductionForm({ ...deductionForm, amount: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono placeholder:text-dark-400"
            />
            <p className="text-[11px] text-dark-400 mt-1 font-mono">
              Max allowable deduction: ₹{recordedBalance.toLocaleString('en-IN')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
              Documentation & Evidence Notes
            </label>
            <textarea
              rows={3}
              placeholder="Provide context regarding the repair invoice or walkthrough findings..."
              value={deductionForm.notes}
              onChange={(e) => setDeductionForm({ ...deductionForm, notes: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-light-300 dark:border-dark-700/80">
            <Button variant="outline" size="sm" onClick={() => setDeductionModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submittingDeduction}>
              Confirm & Post Deduction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  </CinematicPageTransition>
  );
};

export default DepositsPage;
