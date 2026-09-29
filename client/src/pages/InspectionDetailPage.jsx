import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  ArrowLeft,
  SplitSquareVertical,
  Camera,
  Printer,
  FileCheck2,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ImageModal from '../components/common/ImageModal';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import { SkeletonCard } from '../components/common/CinematicLoader';

const InspectionDetailPage = () => {
  const { id } = useParams();
  const { user, isTenant } = useAuth();
  const { showToast } = useToast();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(false);
  const [tenantNotes, setTenantNotes] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchInspection = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/inspections/${id}`);
      if (res.data.success) {
        setInspection(res.data.inspection);
      }
    } catch (error) {
      console.error('Failed to load inspection details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspection();
  }, [id]);

  const handleAcknowledge = async () => {
    try {
      setAcknowledging(true);
      const res = await api.put(`/inspections/${id}/acknowledge`, { tenantNotes });
      if (res.data.success) {
        showToast('Inspection baseline digitally acknowledged!', 'success');
        fetchInspection();
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to acknowledge.', 'error');
    } finally {
      setAcknowledging(false);
    }
  };

  if (loading || !inspection) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <SkeletonCard count={2} />
      </div>
    );
  }

  return (
    <CinematicPageTransition className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/inspections"
          className="inline-flex items-center gap-2 text-xs font-bold text-dark-500 hover:text-dark-900 dark:hover:text-dark-100 transition interactive"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Inspections
        </Link>

        <div className="flex items-center gap-2">
          {inspection.type === 'Move-Out' && (
            <Link to={`/inspections/compare?moveOutId=${inspection._id}`}>
              <Button variant="secondary" size="sm" icon={SplitSquareVertical}>
                Before vs After Compare
              </Button>
            </Link>
          )}
          <Link to={`/reports?inspectionId=${inspection._id}`}>
            <Button variant="outline" size="sm" icon={Printer}>
              Generate Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Inspection Overview Card with 3D Tilt */}
      <TiltCard maxTilt={3} depth={10}>
        <div className="rounded-3xl glass-card p-6 sm:p-8 shadow-card space-y-6 border border-brand-500/20">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-light-300 dark:border-dark-700/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400 font-mono">
                {inspection.type} Condition Baseline
              </span>
              <Badge variant={inspection.status}>{inspection.status}</Badge>
            </div>
            <h1 className="text-2xl font-extrabold text-dark-950 dark:text-white">{inspection.property?.title}</h1>
            <p className="text-xs text-dark-500 dark:text-dark-400">
              {inspection.property?.address}, {inspection.property?.city}
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-dark-400 block font-mono">Inspection Date</span>
            <span className="text-sm font-bold text-dark-950 dark:text-white font-mono">
              {new Date(inspection.inspectionDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Tenant Acknowledgment Banner */}
        {inspection.tenantAcknowledged ? (
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-800 dark:text-brand-300 flex items-start gap-3 text-xs">
            <CheckCircle2 className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Digitally Verified & Signed by Tenant</span>
              <p className="text-[11px] text-brand-700 dark:text-brand-400 mt-0.5">
                Signed on {new Date(inspection.tenantSignedAt).toLocaleString()}. Note: "
                {inspection.tenantNotes || 'Condition verified in good order.'}"
              </p>
            </div>
          </div>
        ) : isTenant ? (
          <div className="p-5 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-800 dark:text-accent-300 space-y-3">
            <div className="flex items-center gap-2 font-bold text-xs">
              <Clock className="w-4 h-4 text-accent-500" />
              <span>Please review and sign off on this condition report</span>
            </div>
            <input
              type="text"
              placeholder="Add your acknowledgment notes or confirmations..."
              value={tenantNotes}
              onChange={(e) => setTenantNotes(e.target.value)}
              className="w-full text-xs rounded-xl glass-input p-2.5"
            />
            <Button variant="primary" size="sm" loading={acknowledging} onClick={handleAcknowledge} icon={FileCheck2}>
              Digitally Acknowledge & Sign Report
            </Button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl glass-panel text-dark-600 dark:text-dark-300 text-xs flex items-center gap-2">
            <Clock className="w-4 h-4 text-dark-400" />
            <span>Awaiting tenant review and digital sign-off signature.</span>
          </div>
        )}

        {/* Overall Notes */}
        {inspection.overallNotes && (
          <div className="p-4 rounded-2xl glass-panel text-xs text-dark-700 dark:text-dark-300">
            <span className="font-bold block mb-1">Inspector Notes:</span>
            {inspection.overallNotes}
          </div>
        )}

        {/* Room-by-Room Evidence Items */}
        <div className="space-y-4 pt-4 border-t border-light-300 dark:border-dark-700/80">
          <h3 className="text-base font-bold text-dark-950 dark:text-white">
            Photographic Room & Fixture Evidence ({inspection.items?.length || 0})
          </h3>

          <div className="space-y-4">
            {inspection.items?.map((item) => (
              <div
                key={item._id}
                className="p-5 rounded-2xl glass-panel hover:border-brand-500/40 transition"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400 font-mono">
                      {item.category}
                    </span>
                    <span className="text-dark-300 dark:text-dark-600">•</span>
                    <h4 className="text-sm font-bold text-dark-950 dark:text-white">{item.item}</h4>
                  </div>
                  <Badge variant={item.condition}>{item.condition}</Badge>
                </div>

                {item.notes && (
                  <p className="text-xs text-dark-600 dark:text-dark-300 mb-3 italic">"{item.notes}"</p>
                )}

                {/* Evidence Photos */}
                {item.photos && item.photos.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3">
                    {item.photos.map((photo, pIdx) => (
                      <div
                        key={pIdx}
                        onClick={() => setSelectedPhoto(photo)}
                        className="relative rounded-xl overflow-hidden border border-light-400 dark:border-dark-700 h-28 w-36 cursor-pointer group shadow-sm hover:shadow-card-hover"
                      >
                        <img
                          src={photo}
                          alt={`${item.item} Evidence`}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-dark-950/0 transition" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      </TiltCard>

      <ImageModal
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        imageUrl={selectedPhoto}
        title="Evidence Fullscreen View"
      />
    </CinematicPageTransition>
  );
};

export default InspectionDetailPage;
