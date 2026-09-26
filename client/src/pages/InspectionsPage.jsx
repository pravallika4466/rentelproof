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
import { TableSkeleton } from '../components/common/Skeleton';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Condition Inspections</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {['all', 'Move-In', 'Move-Out'].map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
              typeFilter === t
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t === 'all' ? 'All Inspections' : t}
          </button>
        ))}
      </div>

      {/* Inspections Grid / Table */}
      {loading ? (
        <TableSkeleton rows={4} />
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
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      insp.type === 'Move-In'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {insp.type} Baseline
                  </span>
                  <Badge variant={insp.status}>{insp.status}</Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 line-clamp-1">{insp.property?.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{insp.property?.address}, {insp.property?.city}</p>

                <div className="grid grid-cols-2 gap-3 my-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Inspection Date</span>
                    <span className="font-bold text-slate-800">
                      {new Date(insp.inspectionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Evidence Items</span>
                    <span className="font-bold text-slate-800">{insp.items?.length || 0} Rooms / Fixtures</span>
                  </div>
                </div>

                {/* Tenant sign-off state */}
                <div className="flex items-center gap-1.5 text-xs">
                  {insp.tenantAcknowledged ? (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Tenant Verified & Signed
                    </span>
                  ) : (
                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                      <Clock className="w-4 h-4" /> Awaiting Tenant Sign-Off
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
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
  );
};

export default InspectionsPage;
