import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Wrench,
  ArrowLeft,
  Calendar,
  Building2,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Upload,
  DollarSign,
  User,
  ShieldCheck,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import MaintenanceTimeline from '../components/maintenance/MaintenanceTimeline';
import { CardSkeleton } from '../components/common/Skeleton';
import ImageModal from '../components/common/ImageModal';

const MaintenanceDetailPage = () => {
  const { id } = useParams();
  const { user, isLandlord, isServiceProvider, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  // Assign modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Status update modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Complete modal
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [actualCost, setActualCost] = useState('');
  const [completing, setCompleting] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/maintenance/${id}`);
      if (res.data.success) {
        setTicket(res.data.maintenance);
      }
    } catch (error) {
      console.error('Failed to load maintenance ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();

    // Fetch technicians if landlord or admin
    if (isLandlord || isAdmin) {
      api
        .get('/admin/users', { params: { role: 'service_provider' } })
        .then((res) => {
          if (res.data.success) {
            setServiceProviders(res.data.users || []);
            if (res.data.users?.length > 0) setSelectedProvider(res.data.users[0]._id);
          }
        })
        .catch(() => {});
    }
  }, [id, isLandlord, isAdmin]);

  const handleAssignProvider = async (e) => {
    e.preventDefault();
    try {
      setAssigning(true);
      const res = await api.put(`/maintenance/${id}/assign`, {
        serviceProviderId: selectedProvider,
        note: 'Assigned certified service provider to handle repair.',
      });
      if (res.data.success) {
        showToast('Service technician assigned successfully!', 'success');
        setAssignModalOpen(false);
        fetchTicket();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to assign.', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    try {
      setUpdatingStatus(true);
      const res = await api.put(`/maintenance/${id}/status`, {
        status: newStatus,
        note: statusNote || `Status updated to ${newStatus}`,
      });
      if (res.data.success) {
        showToast(`Status updated to ${newStatus}!`, 'success');
        setStatusModalOpen(false);
        setStatusNote('');
        fetchTicket();
      }
    } catch (error) {
      showToast('Failed to update status.', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCompleteRepair = async (e) => {
    e.preventDefault();
    try {
      setCompleting(true);
      const res = await api.put(`/maintenance/${id}/complete`, {
        completionNotes,
        actualCost: actualCost ? Number(actualCost) : ticket.costEstimate,
        completionPhotos: ['https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'],
      });
      if (res.data.success) {
        showToast('Ticket marked as completed with photographic proof!', 'success');
        setCompleteModalOpen(false);
        fetchTicket();
      }
    } catch (error) {
      showToast('Failed to finalize repair.', 'error');
    } finally {
      setCompleting(false);
    }
  };

  if (loading || !ticket) {
    return <CardSkeleton />;
  }

  return (
    <CinematicPageTransition className="space-y-6 max-w-5xl mx-auto">
      <Link
        to="/maintenance"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-500 dark:text-dark-300 dark:hover:text-brand-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Maintenance Work Orders
      </Link>

      {/* Ticket Header Card with 3D Tilt */}
      <TiltCard maxTilt={3} depth={10}>
        <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-brand-500/20">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200/60 dark:border-dark-700/60">
            <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400 px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/20">
                {ticket.category}
              </span>
              <Badge variant={ticket.priority}>{ticket.priority} Priority</Badge>
              <Badge variant={ticket.status}>{ticket.status}</Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {ticket.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-dark-300 flex items-center gap-2 mt-1">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
              <span>{ticket.property?.title}</span>
              <span>•</span>
              <span>Room: <strong className="text-slate-700 dark:text-dark-100">{ticket.room}</strong></span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {(isLandlord || isAdmin) && ticket.status === 'Reported' && (
              <Button variant="primary" size="sm" icon={UserCheck} onClick={() => setAssignModalOpen(true)}>
                Dispatch Technician
              </Button>
            )}

            {(isServiceProvider || isLandlord || isAdmin) && ticket.status !== 'Completed' && (
              <>
                <Button variant="outline" size="sm" icon={Clock} onClick={() => setStatusModalOpen(true)}>
                  Update Progress
                </Button>
                <Button variant="success" size="sm" icon={CheckCircle2} onClick={() => setCompleteModalOpen(true)}>
                  Mark Completed
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Issue Details & Initial Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-5">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 mb-2">
                Reported Description & Symptoms
              </h3>
              <p className="text-sm text-slate-700 dark:text-dark-200 leading-relaxed bg-slate-50/70 dark:bg-dark-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-dark-700/60">
                {ticket.description}
              </p>
            </div>

            {/* Financial Ledger Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-50/70 dark:bg-dark-900/60 rounded-2xl border border-slate-200/60 dark:border-dark-700/60 text-xs">
              <div>
                <span className="text-slate-400 dark:text-dark-400 block text-[11px] font-medium">Reported By</span>
                <span className="font-bold text-slate-800 dark:text-dark-100 truncate block mt-0.5">
                  {ticket.reportedBy?.name || 'Tenant'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-dark-400 block text-[11px] font-medium">Assigned Pro</span>
                <span className="font-bold text-slate-800 dark:text-dark-100 truncate block mt-0.5">
                  {ticket.assignedTo?.name || 'Pending Assignment'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-dark-400 block text-[11px] font-medium">Initial Estimate</span>
                <span className="font-bold text-slate-800 dark:text-dark-100 block font-mono mt-0.5">
                  ₹{ticket.costEstimate?.toLocaleString('en-IN') || 0}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-dark-400 block text-[11px] font-medium">Final Invoiced</span>
                <span className="font-bold text-brand-600 dark:text-brand-400 block font-mono mt-0.5">
                  ₹{ticket.actualCost?.toLocaleString('en-IN') || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-dark-400 mb-2">
              Reported Photographic Proof
            </h3>
            {ticket.photos && ticket.photos.length > 0 ? (
              <div
                onClick={() => setPreviewPhoto(ticket.photos[0])}
                className="relative rounded-2xl overflow-hidden border border-slate-200/70 dark:border-dark-700/70 h-44 shadow-sm group cursor-pointer"
              >
                <img
                  src={ticket.photos[0]}
                  alt="Issue Evidence"
                  className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                />
                <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-dark-950/0 transition" />
                <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-dark-950/70 text-[10px] text-white backdrop-blur-sm flex items-center gap-1 font-mono">
                  <ExternalLink className="w-3 h-3 text-brand-400" /> Click to Expand
                </div>
              </div>
            ) : (
              <div className="h-44 flex items-center justify-center p-6 text-center bg-slate-50/70 dark:bg-dark-900/60 rounded-2xl border border-dashed border-slate-200/80 dark:border-dark-700/80 text-xs text-slate-400 dark:text-dark-400">
                No initial photo attached to report
              </div>
            )}
          </div>
        </div>
      </div>
      </TiltCard>

      {/* Visual Resolution Timeline */}
      <MaintenanceTimeline
        timeline={ticket.timeline}
        completionPhotos={ticket.completionPhotos}
        completionNotes={ticket.completionNotes}
      />

      {/* Assign Provider Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Dispatch Service Technician"
        subtitle="Route work order to certified tradesperson or contractor"
      >
        <form onSubmit={handleAssignProvider} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
              Select Certified Technician
            </label>
            <select
              required
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
            >
              {serviceProviders.map((sp) => (
                <option key={sp._id} value={sp._id} className="dark:bg-dark-900">
                  {sp.name} ({sp.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-dark-700/60">
            <Button variant="outline" size="sm" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={assigning} icon={UserCheck}>
              Confirm Dispatch
            </Button>
          </div>
        </form>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title="Update Resolution Progress"
        subtitle="Log real-time work status to the tamper-evident audit trail"
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="glass-input w-full p-2.5 text-xs text-slate-900 dark:text-white"
            >
              <option value="Reviewed" className="dark:bg-dark-900">Reviewed</option>
              <option value="In Progress" className="dark:bg-dark-900">In Progress (Parts Procured / On-Site)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">Timeline Note</label>
            <textarea
              rows={3}
              placeholder="e.g. Technician arrived on site; replacement gasket sourced and tested..."
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="glass-input w-full p-2.5 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-dark-700/60">
            <Button variant="outline" size="sm" onClick={() => setStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={updatingStatus} icon={Clock}>
              Save Note
            </Button>
          </div>
        </form>
      </Modal>

      {/* Mark Completed Modal */}
      <Modal
        isOpen={completeModalOpen}
        onClose={() => setCompleteModalOpen(false)}
        title="Certify Completion & Record Proof"
        subtitle="Provide verified photographic proof and final invoice cost"
      >
        <form onSubmit={handleCompleteRepair} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
              Actual Repair Cost (₹)
            </label>
            <input
              type="number"
              required
              placeholder="1200"
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              className="glass-input w-full p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-dark-200 mb-1.5">
              Technician Resolution Summary
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Replaced 35mm ceramic disc cartridge and renewed Teflon seals. Tested under full pressure with zero leakage."
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              className="glass-input w-full p-2.5 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/60 dark:border-dark-700/60">
            <Button variant="outline" size="sm" onClick={() => setCompleteModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="success" size="sm" loading={completing} icon={CheckCircle2}>
              Confirm Completion
            </Button>
          </div>
        </form>
      </Modal>

      <ImageModal
        isOpen={!!previewPhoto}
        onClose={() => setPreviewPhoto(null)}
        src={previewPhoto}
        title="Reported Defect Photographic Proof"
      />
    </CinematicPageTransition>
  );
};

export default MaintenanceDetailPage;
