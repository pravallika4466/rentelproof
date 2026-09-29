import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Plus, Search, Filter, AlertCircle, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/CinematicLoader';
import TiltCard from '../components/common/TiltCard';
import MaintenanceGearVisual from '../components/3d/MaintenanceGearVisual';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const MaintenancePage = () => {
  const { user, isTenant, isLandlord, isServiceProvider, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    propertyId: '',
    title: '',
    description: '',
    category: 'Plumbing',
    priority: 'Medium',
    room: 'General',
    photos: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintRes, propsRes] = await Promise.all([
        api.get('/maintenance', {
          params: {
            search: search || undefined,
            status: statusFilter,
            priority: priorityFilter,
          },
        }),
        api.get('/properties'),
      ]);

      if (maintRes.data.success) setRequests(maintRes.data.requests || []);
      if (propsRes.data.success) {
        setProperties(propsRes.data.properties || []);
        if (propsRes.data.properties?.length > 0 && !form.propertyId) {
          setForm((prev) => ({ ...prev, propertyId: propsRes.data.properties[0]._id }));
        }
      }
    } catch (error) {
      console.error('Failed to load maintenance requests:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, priorityFilter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await api.post('/maintenance', form);
      if (res.data.success) {
        showToast('Maintenance request reported successfully!', 'success');
        setCreateModalOpen(false);
        setForm({
          propertyId: properties[0]?._id || '',
          title: '',
          description: '',
          category: 'Plumbing',
          priority: 'Medium',
          room: 'General',
          photos: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80'],
        });
        fetchData();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit request.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CinematicPageTransition>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
              Maintenance Tickets
            </h1>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
              Issue reporting, service provider dispatch, and resolution evidence
            </p>
          </div>

          <Button variant="primary" size="md" icon={Plus} onClick={() => setCreateModalOpen(true)}>
            Report Maintenance
          </Button>
        </div>

        {/* 3D Kinetic Maintenance Gear Banner */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-500/20 shadow-card-hover relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Contractor Work Order Mechanism
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-dark-950 dark:text-white tracking-tight">
              Rapid Triage & Verified Photographic Rectification
            </h2>
            <p className="text-xs text-dark-500 dark:text-dark-300 leading-relaxed max-w-xl">
              Track contractor dispatches, invoice allocations, and before/after completion proofs to prevent unwarranted deposit deductions.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="text-dark-400 block text-[11px]">Total Work Orders</span>
                <span className="text-lg font-extrabold text-dark-950 dark:text-white font-mono">
                  <AnimatedNumber value={requests.length} />
                </span>
              </div>
              <div className="w-px h-8 bg-dark-200 dark:bg-dark-800" />
              <div>
                <span className="text-dark-400 block text-[11px]">Active in Progress</span>
                <span className="text-lg font-extrabold text-amber-500 font-mono">
                  <AnimatedNumber value={requests.filter((r) => r.status === 'In Progress' || r.status === 'Assigned').length} />
                </span>
              </div>
              <div className="w-px h-8 bg-dark-200 dark:bg-dark-800" />
              <div>
                <span className="text-dark-400 block text-[11px]">Completed Proofs</span>
                <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400 font-mono">
                  <AnimatedNumber value={requests.filter((r) => r.status === 'Completed').length} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-[280px] rounded-2xl bg-dark-950/20 dark:bg-dark-950/50 border border-brand-500/20 overflow-hidden relative shadow-inner">
              <MaintenanceGearVisual />
            </div>
          </div>
        </div>

      {/* Filters and Search */}
      <div className="p-4 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-dark-400" />
          <input
            type="text"
            placeholder="Search by title, description, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder:text-dark-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl glass-input px-3 py-2 text-dark-800 dark:text-dark-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Reported">Reported</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs rounded-xl glass-input px-3 py-2 text-dark-800 dark:text-dark-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Tickets List */}
      {loading ? (
        <SkeletonCard count={6} />
      ) : requests.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No maintenance requests"
          description="Everything looks good! No active maintenance tickets reported."
          actionLabel="Report New Issue"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req) => (
            <div
              key={req._id}
              className="rounded-3xl glass-card p-6 shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400 font-mono">
                    {req.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Badge variant={req.priority} size="sm">
                      {req.priority}
                    </Badge>
                    <Badge variant={req.status} size="sm">
                      {req.status}
                    </Badge>
                  </div>
                </div>

                <h3 className="text-base font-bold text-dark-950 dark:text-white line-clamp-1">{req.title}</h3>
                <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
                  {req.property?.title} • Room: <span className="font-semibold text-dark-700 dark:text-dark-200">{req.room}</span>
                </p>

                <p className="text-xs text-dark-600 dark:text-dark-300 mt-3 line-clamp-2 leading-relaxed">
                  {req.description}
                </p>

                {/* Assigned To Badge */}
                <div className="mt-4 pt-3 border-t border-light-300 dark:border-dark-700/80 flex items-center justify-between text-xs text-dark-500 dark:text-dark-400">
                  <span>Assigned:</span>
                  <span className="font-semibold text-dark-900 dark:text-dark-100">
                    {req.assignedTo?.name || 'Unassigned'}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-light-300 dark:border-dark-700/80 flex items-center justify-between">
                <span className="text-[11px] text-dark-400 font-mono">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
                <Link to={`/maintenance/${req._id}`}>
                  <Button variant="outline" size="sm" icon={ArrowRight}>
                    View Timeline
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Report Maintenance Issue"
        subtitle="Log issue details, priority, and photographic condition evidence"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Select Property</label>
            <select
              value={form.propertyId}
              onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
              required
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
            >
              {properties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Issue Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Master bath mixer cartridge leaking"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Appliance">Appliance</option>
                <option value="Structural">Structural</option>
                <option value="Carpentry">Carpentry</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Affected Room</label>
              <input
                type="text"
                placeholder="e.g. Master Bathroom"
                value={form.room}
                onChange={(e) => setForm({ ...form, room: e.target.value })}
                className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Description</label>
            <textarea
              rows={3}
              required
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-light-300 dark:border-dark-700/80">
            <Button variant="outline" size="sm" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Submit Request
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  </CinematicPageTransition>
  );
};

export default MaintenancePage;
