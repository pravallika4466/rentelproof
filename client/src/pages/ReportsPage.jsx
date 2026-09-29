import React, { useState, useEffect } from 'react';
import { Printer, Plus, FileText, CheckCircle2, ShieldCheck, Download, Calendar, Building2, User } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/CinematicLoader';
import TiltCard from '../components/common/TiltCard';
import DataMesh3D from '../components/3d/DataMesh3D';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const ReportsPage = () => {
  const { isLandlord, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [properties, setProperties] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [tenancies, setTenancies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate modal
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportForm, setReportForm] = useState({
    reportType: 'Move-In Inspection',
    propertyId: '',
    tenancyId: '',
    inspectionId: '',
  });

  // Report viewer modal
  const [viewingReport, setViewingReport] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reportsRes, propsRes, inspRes, tenanciesRes] = await Promise.all([
        api.get('/reports'),
        api.get('/properties'),
        api.get('/inspections'),
        api.get('/tenancies'),
      ]);

      if (reportsRes.data.success) setReports(reportsRes.data.reports || []);
      if (propsRes.data.success) {
        setProperties(propsRes.data.properties || []);
        if (propsRes.data.properties?.length > 0 && !reportForm.propertyId) {
          setReportForm((prev) => ({ ...prev, propertyId: propsRes.data.properties[0]._id }));
        }
      }
      if (inspRes.data.success) {
        setInspections(inspRes.data.inspections || []);
        if (inspRes.data.inspections?.length > 0 && !reportForm.inspectionId) {
          setReportForm((prev) => ({ ...prev, inspectionId: inspRes.data.inspections[0]._id }));
        }
      }
      if (tenanciesRes.data.success) {
        setTenancies(tenanciesRes.data.tenancies || []);
        if (tenanciesRes.data.tenancies?.length > 0 && !reportForm.tenancyId) {
          setReportForm((prev) => ({ ...prev, tenancyId: tenanciesRes.data.tenancies[0]._id }));
        }
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGenerateReport = async (e) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const res = await api.post('/reports/generate', reportForm);
      if (res.data.success) {
        showToast('Report generated successfully!', 'success');
        setGenerateModalOpen(false);
        fetchData();
        setViewingReport(res.data.report);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to generate report.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <CinematicPageTransition>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
              Audit & Inspection Reports
            </h1>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
              Branded digital documentation for move-in, move-out, and tenancy lifecycle
            </p>
          </div>

          <Button variant="primary" size="md" icon={Plus} onClick={() => setGenerateModalOpen(true)}>
            Generate New Report
          </Button>
        </div>

        {/* 3D Topographic Data Analytics Banner */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-500/20 shadow-card-hover relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Cryptographic Audit Dossier Engine
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-dark-950 dark:text-white tracking-tight">
              Legal Admissibility & Condition Proof Compilations
            </h2>
            <p className="text-xs text-dark-500 dark:text-dark-300 leading-relaxed max-w-xl">
              Compile verified tenancy agreements, room baseline photographs, and repair invoices into tamper-evident PDF dossiers ready for tribunal or deposit settlement.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="text-dark-400 block text-[11px]">Generated Reports</span>
                <span className="text-lg font-extrabold text-dark-950 dark:text-white font-mono">
                  <AnimatedNumber value={reports.length} />
                </span>
              </div>
              <div className="w-px h-8 bg-dark-200 dark:bg-dark-800" />
              <div>
                <span className="text-dark-400 block text-[11px]">Inspection Dossiers</span>
                <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400 font-mono">
                  <AnimatedNumber value={reports.filter((r) => r.reportType.includes('Inspection')).length} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-[280px] rounded-2xl bg-dark-950/20 dark:bg-dark-950/50 border border-brand-500/20 overflow-hidden relative shadow-inner">
              <DataMesh3D />
            </div>
          </div>
        </div>

      {/* Reports Table */}
      <div className="rounded-3xl glass-card overflow-hidden shadow-card">
        <div className="p-6 border-b border-light-300 dark:border-dark-700/80 flex items-center justify-between">
          <h3 className="text-base font-bold text-dark-950 dark:text-white">Generated Reports ({reports.length})</h3>
        </div>

        {loading ? (
          <SkeletonCard count={3} />
        ) : reports.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Printer}
              title="No reports generated yet"
              description="Compile move-in baseline, move-out comparison, or tenancy financial reports with one click."
              actionLabel="Generate Report"
              onAction={() => setGenerateModalOpen(true)}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-light-100/50 dark:bg-dark-900/60 text-dark-500 dark:text-dark-400 font-bold uppercase tracking-wider border-b border-light-300 dark:border-dark-700/80">
                <tr>
                  <th className="px-6 py-4">Report Title</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Property</th>
                  <th className="px-6 py-4">Generated Date</th>
                  <th className="px-6 py-4">Generated By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-light-200 dark:divide-dark-800/80">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-light-100/40 dark:hover:bg-dark-850/40 transition">
                    <td className="px-6 py-4 font-bold text-dark-950 dark:text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{r.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20 font-mono">
                        {r.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-dark-700 dark:text-dark-300">{r.property?.title}</td>
                    <td className="px-6 py-4 text-dark-500 dark:text-dark-400 font-mono">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-dark-700 dark:text-dark-200 font-medium">{r.generatedBy?.name}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="outline" size="sm" icon={Printer} onClick={() => setViewingReport(r)}>
                        View & Print
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Generate Report Modal */}
      <Modal
        isOpen={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        title="Generate Official Audit Report"
        subtitle="Compiles property specifications, condition photographs, and ledgers"
      >
        <form onSubmit={handleGenerateReport} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Report Category</label>
            <select
              value={reportForm.reportType}
              onChange={(e) => setReportForm({ ...reportForm, reportType: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            >
              <option value="Move-In Inspection">Move-In Inspection Baseline Report</option>
              <option value="Move-Out Inspection">Move-Out Inspection Walkthrough Report</option>
              <option value="Tenancy Summary">Full Tenancy Summary Ledger Report</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Target Property</label>
            <select
              required
              value={reportForm.propertyId}
              onChange={(e) => setReportForm({ ...reportForm, propertyId: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            >
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {reportForm.reportType.includes('Inspection') ? (
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Linked Inspection</label>
              <select
                required
                value={reportForm.inspectionId}
                onChange={(e) => setReportForm({ ...reportForm, inspectionId: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              >
                {inspections.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.type} — {i.property?.title} ({new Date(i.inspectionDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Linked Tenancy</label>
              <select
                required
                value={reportForm.tenancyId}
                onChange={(e) => setReportForm({ ...reportForm, tenancyId: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              >
                {tenancies.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.property?.title} (Tenant: {t.tenant?.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-light-300 dark:border-dark-700/80">
            <Button variant="outline" size="sm" onClick={() => setGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={generating} icon={Printer}>
              Generate Report
            </Button>
          </div>
        </form>
      </Modal>

      {/* Printable Report Preview Modal */}
      {viewingReport && (
        <Modal
          isOpen={Boolean(viewingReport)}
          onClose={() => setViewingReport(null)}
          title="Printable Evidence Report"
          maxWidth="max-w-4xl"
        >
          <div className="space-y-6 text-dark-800 dark:text-dark-100">
            {/* Action Bar inside Modal */}
            <div className="flex justify-end gap-2 no-print border-b border-light-300 dark:border-dark-700/80 pb-4">
              <Button variant="primary" size="sm" icon={Printer} onClick={() => window.print()}>
                Print / Save PDF
              </Button>
            </div>

            {/* PRINTABLE REPORT DOCUMENT */}
            <div className="border border-light-400 dark:border-dark-700 p-8 rounded-2xl bg-white dark:bg-dark-900 text-dark-950 dark:text-white space-y-6">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b-2 border-dark-900 dark:border-brand-500 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold shadow-emerald-glow">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black tracking-tight font-serif">RentalProof</h2>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-600 dark:text-brand-400 block font-mono">
                      Digital Evidence & Condition Certificate
                    </span>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-bold block">{viewingReport.reportType}</span>
                  <span className="text-dark-500 dark:text-dark-400 font-mono">
                    Generated: {new Date(viewingReport.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Property & Tenancy Summary */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-light-100 dark:bg-dark-850 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-dark-400 block mb-1 uppercase text-[10px]">Property Asset</span>
                  <span className="font-bold text-sm block">
                    {viewingReport.summaryData?.property?.title}
                  </span>
                  <span className="text-dark-600 dark:text-dark-300">
                    {viewingReport.summaryData?.property?.address}, {viewingReport.summaryData?.property?.city}
                  </span>
                </div>

                <div>
                  <span className="font-bold text-dark-400 block mb-1 uppercase text-[10px]">Parties Involved</span>
                  <span className="text-dark-700 dark:text-dark-300 block">
                    <strong className="text-dark-950 dark:text-white">Landlord:</strong>{' '}
                    {viewingReport.summaryData?.landlord?.name || 'Verified Landlord'}
                  </span>
                  {viewingReport.summaryData?.tenant && (
                    <span className="text-dark-700 dark:text-dark-300 block">
                      <strong className="text-dark-950 dark:text-white">Tenant:</strong>{' '}
                      {viewingReport.summaryData?.tenant?.name} ({viewingReport.summaryData?.tenant?.email})
                    </span>
                  )}
                </div>
              </div>

              {/* Inspection Items Table if Inspection Report */}
              {viewingReport.summaryData?.inspection && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Condition Itemization & Photographic Evidence
                  </h4>
                  <table className="w-full text-left text-xs border border-light-300 dark:border-dark-700">
                    <thead className="bg-light-100 dark:bg-dark-850 font-bold border-b border-light-300 dark:border-dark-700">
                      <tr>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Item</th>
                        <th className="p-2.5">Recorded Condition</th>
                        <th className="p-2.5">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-light-200 dark:divide-dark-800">
                      {viewingReport.summaryData.inspection.items?.map((it, i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-semibold">{it.category}</td>
                          <td className="p-2.5">{it.item}</td>
                          <td className="p-2.5">
                            <Badge variant={it.condition} size="sm">
                              {it.condition}
                            </Badge>
                          </td>
                          <td className="p-2.5 italic text-dark-600 dark:text-dark-300">{it.notes || 'Good condition'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sign-off Blocks */}
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-light-300 dark:border-dark-700 text-xs">
                <div className="space-y-4">
                  <span className="text-dark-400 uppercase text-[10px] font-bold block">
                    Landlord / Inspector Signature
                  </span>
                  <div className="h-12 border-b border-dark-300 dark:border-dark-600 flex items-end font-serif italic text-sm">
                    {viewingReport.generatedBy?.name || 'Digital Signature Stored'}
                  </div>
                  <span className="text-[10px] text-dark-400 font-mono">Digitally Verified via RentalProof platform</span>
                </div>

                <div className="space-y-4">
                  <span className="text-dark-400 uppercase text-[10px] font-bold block">
                    Tenant Acknowledgment Signature
                  </span>
                  <div className="h-12 border-b border-dark-300 dark:border-dark-600 flex items-end font-serif italic text-sm">
                    {viewingReport.summaryData?.inspection?.tenantAcknowledged
                      ? `${viewingReport.summaryData.tenant?.name || 'Verified Tenant'} (Signed)`
                      : 'Digitally Acknowledged'}
                  </div>
                  <span className="text-[10px] text-dark-400 font-mono">Timestamped upon receipt</span>
                </div>
              </div>

              {/* Mandatory Legal Principle Disclaimer */}
              <div className="pt-4 border-t border-light-300 dark:border-dark-700 text-[10px] text-dark-500 leading-relaxed text-center">
                This report represents a transparent digital compilation of photographic evidence and condition records stored on the RentalProof platform. It is designed to facilitate mutual transparency and dispute arbitration.
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  </CinematicPageTransition>
  );
};

export default ReportsPage;
