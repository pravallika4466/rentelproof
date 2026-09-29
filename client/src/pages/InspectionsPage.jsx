import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Plus,
  SplitSquareVertical,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/CinematicLoader';
import TiltCard from '../components/common/TiltCard';
import InspectionLens3D from '../components/3d/InspectionLens3D';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const InspectionsPage = () => {
  const { isLandlord, isTenant, isAdmin } = useAuth();
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const res = await api.get('/inspections', {
        params: {
          type: typeFilter !== 'all' ? typeFilter : undefined,
        },
      });
      if (res.data.success) {
        setInspections(res.data.inspections || []);
      }
    } catch (error) {
      console.error('Failed to load inspections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspections();
  }, [typeFilter]);

  return (
    <CinematicPageTransition>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
              Condition Inspections
            </h1>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
              Photographic baseline and checkout walkthrough evidence ledgers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/inspections/compare">
              <Button variant="secondary" size="md" icon={SplitSquareVertical}>
                Before vs After Compare
              </Button>
            </Link>
            {(isLandlord || isAdmin) && (
              <Link to="/inspections/new">
                <Button variant="primary" size="md" icon={Plus}>
                  Start Inspection Wizard
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* 3D Optical Lens Inspection Banner */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-500/20 shadow-card-hover relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Forensic Optical Baseline Reticle
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-dark-950 dark:text-white tracking-tight">
              Cryptographic Image Integrity & Timestamping
            </h2>
            <p className="text-xs text-dark-500 dark:text-dark-300 leading-relaxed max-w-xl">
              Inspect rooms with standardized angle anchors. Every photo taken during Move-In is permanently stamped, preventing retrospective damage claims.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="text-dark-400 block text-[11px]">Total Baselines</span>
                <span className="text-lg font-extrabold text-dark-950 dark:text-white font-mono">
                  <AnimatedNumber value={inspections.length} />
                </span>
              </div>
              <div className="w-px h-8 bg-dark-200 dark:bg-dark-800" />
              <div>
                <span className="text-dark-400 block text-[11px]">Move-In Completed</span>
                <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400 font-mono">
                  <AnimatedNumber value={inspections.filter((i) => i.type === 'Move-In').length} />
                </span>
              </div>
              <div className="w-px h-8 bg-dark-200 dark:bg-dark-800" />
              <div>
                <span className="text-dark-400 block text-[11px]">Move-Out Walkthroughs</span>
                <span className="text-lg font-extrabold text-accent-500 font-mono">
                  <AnimatedNumber value={inspections.filter((i) => i.type === 'Move-Out').length} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="w-full max-w-[280px] rounded-2xl bg-dark-950/20 dark:bg-dark-950/50 border border-brand-500/20 overflow-hidden relative shadow-inner">
              <InspectionLens3D />
            </div>
          </div>
        </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-light-300 dark:border-dark-700/80 pb-3">
        {['all', 'Move-In', 'Move-Out'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition cursor-pointer interactive ${
              typeFilter === t
                ? 'bg-brand-500 text-white shadow-emerald-glow'
                : 'glass-panel text-dark-600 dark:text-dark-300 hover:border-brand-500/40'
            }`}
          >
            {t === 'all' ? 'All Inspections' : t}
          </button>
        ))}
      </div>

      {/* Inspections Grid */}
      {loading ? (
        <SkeletonCard count={6} />
      ) : inspections.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No inspections found"
          description="Start a room-by-room inspection to create a tamper-evident condition baseline."
          actionLabel={(isLandlord || isAdmin) ? 'Start First Inspection' : undefined}
          onAction={() => (window.location.href = '/inspections/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inspections.map((insp) => (
            <div
              key={insp._id}
              className="rounded-3xl glass-card p-6 shadow-card hover:shadow-card-hover transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono ${
                      insp.type === 'Move-In'
                        ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30'
                        : 'bg-accent-500/15 text-accent-700 dark:text-accent-300 border border-accent-500/30'
                    }`}
                  >
                    {insp.type} Baseline
                  </span>
                  <Badge variant={insp.status}>{insp.status}</Badge>
                </div>

                <h3 className="text-base font-bold text-dark-950 dark:text-white line-clamp-1">{insp.property?.title}</h3>
                <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">{insp.property?.address}, {insp.property?.city}</p>

                <div className="grid grid-cols-2 gap-3 my-4 p-3 glass-panel rounded-2xl text-xs">
                  <div>
                    <span className="text-dark-400 block text-[11px]">Inspection Date</span>
                    <span className="font-bold text-dark-800 dark:text-dark-200 font-mono">
                      {new Date(insp.inspectionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-dark-400 block text-[11px]">Evidence Items</span>
                    <span className="font-bold text-dark-800 dark:text-dark-200 font-mono">{insp.items?.length || 0} Rooms / Fixtures</span>
                  </div>
                </div>

                {/* Tenant sign-off state */}
                <div className="flex items-center gap-1.5 text-xs">
                  {insp.tenantAcknowledged ? (
                    <span className="text-brand-600 dark:text-brand-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-brand-500" /> Tenant Verified & Signed
                    </span>
                  ) : (
                    <span className="text-accent-600 dark:text-accent-400 font-semibold flex items-center gap-1">
                      <Clock className="w-4 h-4 text-accent-500" /> Awaiting Tenant Sign-Off
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-light-300 dark:border-dark-700/80 flex gap-2">
                <Link to={`/inspections/${insp._id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full" icon={ArrowRight}>
                    View Evidence
                  </Button>
                </Link>
                {insp.type === 'Move-Out' && (
                  <Link to={`/inspections/compare?moveOutId=${insp._id}`}>
                    <Button variant="secondary" size="sm" icon={SplitSquareVertical}>
                      Compare
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </CinematicPageTransition>
  );
};

export default InspectionsPage;
