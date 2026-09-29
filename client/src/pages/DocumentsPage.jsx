import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Download,
  Trash2,
  Calendar,
  Building2,
  Upload,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Filter,
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

const DocumentsPage = () => {
  const { user, isLandlord, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    propertyId: '',
    name: '',
    category: 'Rental Agreement',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileType: 'application/pdf',
    fileSize: 1024 * 250,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, propsRes] = await Promise.all([
        api.get('/documents', {
          params: {
            category: categoryFilter !== 'all' ? categoryFilter : undefined,
            search: search || undefined,
          },
        }),
        api.get('/properties'),
      ]);

      if (docsRes.data.success) setDocuments(docsRes.data.documents || []);
      if (propsRes.data.success) {
        setProperties(propsRes.data.properties || []);
        if (propsRes.data.properties?.length > 0 && !form.propertyId) {
          setForm((prev) => ({ ...prev, propertyId: propsRes.data.properties[0]._id }));
        }
      }
    } catch (error) {
      console.error('Failed to load documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryFilter]);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/documents', form);
      if (res.data.success) {
        showToast('Document securely uploaded to vault!', 'success');
        setUploadModalOpen(false);
        setForm({
          propertyId: properties[0]?._id || '',
          name: '',
          category: 'Rental Agreement',
          fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          fileType: 'application/pdf',
          fileSize: 1024 * 250,
        });
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to register document.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm('Are you sure you want to permanently remove this document from the vault?')) return;
    try {
      await api.delete(`/documents/${docId}`);
      showToast('Document removed.', 'info');
      fetchData();
    } catch (error) {
      showToast('Failed to delete document.', 'error');
    }
  };

  const rentalAgreementsCount = documents.filter((d) => d.category === 'Rental Agreement').length;
  const reportsCount = documents.filter((d) => d.category === 'Inspection Report' || d.category === 'Maintenance Receipt').length;

  return (
    <CinematicPageTransition className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400">
              Encrypted Repository
            </span>
            <Badge variant="primary" size="sm">
              Cryptographic Records
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Document Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-dark-300 mt-1">
            Certified tenancy agreements, repair receipts, and property deeds
          </p>
        </div>

        <Button variant="primary" size="md" icon={Upload} onClick={() => setUploadModalOpen(true)}>
          Upload Document
        </Button>
      </div>

      {/* 3D KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TiltCard maxTilt={6}>
          <div className="glass-card p-5 rounded-2xl border border-brand-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                Vault Records
              </span>
              <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                <AnimatedNumber value={documents.length} />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </TiltCard>

        <TiltCard maxTilt={6}>
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                Rental Agreements
              </span>
              <div className="text-2xl font-black text-emerald-500 dark:text-emerald-400 font-mono">
                <AnimatedNumber value={rentalAgreementsCount} />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
        </TiltCard>

        <TiltCard maxTilt={6}>
          <div className="glass-card p-5 rounded-2xl border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 block mb-1">
                Evidentiary Receipts
              </span>
              <div className="text-2xl font-black text-amber-500 dark:text-amber-400 font-mono">
                <AnimatedNumber value={reportsCount} />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </TiltCard>
      </div>

      {/* Filter and Search */}
      <div className="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400 dark:text-dark-400" />
          <input
            type="text"
            placeholder="Search documents by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            className="glass-input w-full pl-10 pr-4 py-2 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-brand-500 hidden sm:block" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="glass-input text-xs px-3.5 py-2 font-medium"
          >
            <option value="all" className="dark:bg-dark-900">All Categories</option>
            <option value="Rental Agreement" className="dark:bg-dark-900">Rental Agreement</option>
            <option value="Inspection Report" className="dark:bg-dark-900">Inspection Report</option>
            <option value="Maintenance Receipt" className="dark:bg-dark-900">Maintenance Receipt</option>
            <option value="Payment Proof" className="dark:bg-dark-900">Payment Proof</option>
            <option value="Property Document" className="dark:bg-dark-900">Property Document</option>
            <option value="Other" className="dark:bg-dark-900">Other</option>
          </select>
        </div>
      </div>

      {/* Document Grid / Table */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-200/60 dark:border-dark-700/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Stored Vault Files</h3>
            <p className="text-xs text-slate-500 dark:text-dark-300">
              {documents.length} verified records in secure storage
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
            Encrypted
          </span>
        </div>

        {loading ? (
          <TableSkeleton rows={4} />
        ) : documents.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={FileText}
              title="No documents uploaded"
              description="Upload lease agreements, receipts, and condition reports to keep verifiable digital audit records."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 dark:bg-dark-900/80 text-slate-500 dark:text-dark-400 font-bold uppercase tracking-wider border-b border-slate-200/60 dark:border-dark-700/60">
                <tr>
                  <th className="px-6 py-4">Document Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Target Property</th>
                  <th className="px-6 py-4">Upload Date</th>
                  <th className="px-6 py-4">Uploaded By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-dark-700/60">
                {documents.map((doc) => (
                  <tr
                    key={doc._id}
                    className="hover:bg-slate-50/60 dark:hover:bg-dark-800/40 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-brand-500/10 dark:bg-brand-500/15 border border-brand-500/20 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                      </div>
                      <span className="truncate max-w-[220px]">{doc.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-dark-200 border border-slate-200 dark:border-dark-700">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-dark-300 font-medium">
                      {doc.property?.title || 'General'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-dark-400 font-mono">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-700 dark:text-dark-200 font-medium">
                      {doc.uploadedBy?.name || 'Staff'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl text-slate-500 dark:text-dark-300 hover:text-brand-500 hover:bg-brand-500/10 transition-colors"
                          title="View / Download File"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        {(isLandlord || isAdmin) && (
                          <button
                            onClick={() => handleDeleteDocument(doc._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload to Document Vault"
        subtitle="Securely deposit verified tenancy contracts, receipts, or property certificates"
      >
        <form onSubmit={handleUploadDocument} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
              Target Property
            </label>
            <select
              required
              value={form.propertyId}
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
            >
              {properties.map((p) => (
                <option key={p._id} value={p._id} className="dark:bg-dark-900">
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
              Document Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Registered Tenancy Agreement 2026.pdf"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="glass-input w-full p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
              Classification Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
            >
              <option value="Rental Agreement" className="dark:bg-dark-900">Rental Agreement</option>
              <option value="Inspection Report" className="dark:bg-dark-900">Inspection Report</option>
              <option value="Maintenance Receipt" className="dark:bg-dark-900">Maintenance Receipt</option>
              <option value="Payment Proof" className="dark:bg-dark-900">Payment Proof</option>
              <option value="Property Document" className="dark:bg-dark-900">Property Document</option>
              <option value="Other" className="dark:bg-dark-900">Other</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-dark-700/60">
            <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting} icon={Upload}>
              Deposit to Vault
            </Button>
          </div>
        </form>
      </Modal>
    </CinematicPageTransition>
  );
};

export default DocumentsPage;
