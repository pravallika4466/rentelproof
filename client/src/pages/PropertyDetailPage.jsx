import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Wrench,
  CreditCard,
  ClipboardCheck,
  SplitSquareVertical,
  Plus,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import { SkeletonCard } from '../components/common/CinematicLoader';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { isLandlord, isAdmin } = useAuth();
  const [property, setProperty] = useState(null);
  const [activeTenancy, setActiveTenancy] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'checklist' | 'timeline'

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const [propRes, timelineRes] = await Promise.all([
          api.get(`/properties/${id}`),
          api.get(`/properties/${id}/timeline`),
        ]);

        if (propRes.data.success) {
          setProperty(propRes.data.property);
          setActiveTenancy(propRes.data.activeTenancy);
        }

        if (timelineRes.data.success) {
          setTimeline(timelineRes.data.timeline || []);
        }
      } catch (error) {
        console.error('Failed to load property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (loading || !property) {
    return (
      <div className="space-y-6">
        <SkeletonCard count={2} />
      </div>
    );
  }

  const primaryImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80';

  return (
    <CinematicPageTransition className="space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 text-xs font-bold text-dark-500 hover:text-dark-900 dark:hover:text-dark-100 transition interactive"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Properties
        </Link>

        <div className="flex items-center gap-2">
          <Link to={`/inspections?propertyId=${property._id}`}>
            <Button variant="outline" size="sm" icon={ClipboardCheck}>
              Inspections
            </Button>
          </Link>
          <Link to="/inspections/compare">
            <Button variant="secondary" size="sm" icon={SplitSquareVertical}>
              Compare Baseline
            </Button>
          </Link>
          {(isLandlord || isAdmin) && (
            <Link to="/tenancies">
              <Button variant="primary" size="sm" icon={Users}>
                Manage Tenancy
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Property Hero Banner with 3D Tilt */}
      <TiltCard maxTilt={3} depth={15}>
        <div className="rounded-3xl glass-card overflow-hidden shadow-card border border-brand-500/20">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Cover Image */}
            <div className="lg:col-span-1 h-64 lg:h-auto relative overflow-hidden bg-dark-900">
              <img src={primaryImage} alt={property.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <Badge variant={property.status}>{property.status}</Badge>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-2 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <span className="text-2xl font-black text-dark-950 dark:text-white font-mono">
                  ₹{property.rentAmount?.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-dark-500 dark:text-dark-400">/ month</span>
                </span>
                <span className="text-xs bg-dark-100 dark:bg-dark-800 px-3 py-1 rounded-full font-bold text-dark-700 dark:text-dark-300 font-mono">
                  Deposit: ₹{property.depositAmount?.toLocaleString('en-IN')}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-extrabold text-dark-950 dark:text-white tracking-tight">
                {property.title}
              </h1>

              <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-brand-500 shrink-0" />
                {property.address}, {property.city}, {property.state} - {property.pincode}
              </p>

              <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-300 mt-4 leading-relaxed line-clamp-3">
                {property.description}
              </p>
            </div>

            {/* Spec Icons */}
            <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-light-300 dark:border-dark-700/80 text-center text-xs">
              <div className="p-3 glass-panel rounded-2xl">
                <Bed className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                <span className="font-bold text-dark-900 dark:text-dark-100 block">{property.bedrooms} Bedrooms</span>
                <span className="text-[10px] text-dark-400">Accommodations</span>
              </div>
              <div className="p-3 glass-panel rounded-2xl">
                <Bath className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                <span className="font-bold text-dark-900 dark:text-dark-100 block">{property.bathrooms} Bathrooms</span>
                <span className="text-[10px] text-dark-400">Fittings</span>
              </div>
              <div className="p-3 glass-panel rounded-2xl">
                <Maximize className="w-4 h-4 text-brand-500 mx-auto mb-1" />
                <span className="font-bold text-dark-900 dark:text-dark-100 block font-mono">{property.areaSqFt} Sq.Ft</span>
                <span className="text-[10px] text-dark-400">Carpet Area</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </TiltCard>

      {/* Navigation Tabs */}
      <div className="flex border-b border-light-300 dark:border-dark-700/80 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition interactive ${
            activeTab === 'overview'
              ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-400'
              : 'text-dark-500 hover:text-dark-900 dark:hover:text-dark-100'
          }`}
        >
          Property Overview
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`pb-3 transition interactive ${
            activeTab === 'checklist'
              ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-400'
              : 'text-dark-500 hover:text-dark-900 dark:hover:text-dark-100'
          }`}
        >
          Condition Checklist Schema
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 transition interactive ${
            activeTab === 'timeline'
              ? 'border-b-2 border-brand-500 text-brand-600 dark:text-brand-400'
              : 'text-dark-500 hover:text-dark-900 dark:hover:text-dark-100'
          }`}
        >
          Property History Timeline ({timeline.length})
        </button>
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Tenancy */}
          <div className="lg:col-span-2 glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-dark-950 dark:text-white">Current Occupancy & Lease</h3>
            {activeTenancy ? (
              <div className="p-5 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {activeTenancy.tenant?.avatar ? (
                    <img
                      src={activeTenancy.tenant.avatar}
                      alt={activeTenancy.tenant.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-brand-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-emerald-glow">
                      {activeTenancy.tenant?.name?.charAt(0) || 'T'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-dark-950 dark:text-white">{activeTenancy.tenant?.name}</h4>
                    <p className="text-xs text-dark-500 dark:text-dark-400">
                      {activeTenancy.tenant?.email} • {activeTenancy.tenant?.phone}
                    </p>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold block mt-0.5 font-mono">
                      Lease Term: {new Date(activeTenancy.startDate).toLocaleDateString()} —{' '}
                      {new Date(activeTenancy.expectedEndDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Link to={`/tenancies/${activeTenancy._id}`}>
                  <Button variant="primary" size="sm">
                    View Agreement
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="p-6 rounded-2xl glass-panel text-center border border-dashed border-light-400 dark:border-dark-700">
                <p className="text-xs text-dark-500 dark:text-dark-400 mb-3">No active tenant connected to this property.</p>
                {(isLandlord || isAdmin) && (
                  <Link to="/tenancies">
                    <Button variant="outline" size="sm" icon={Users}>
                      Send Tenancy Invitation
                    </Button>
                  </Link>
                )}
              </div>
            )}

            {/* Amenities list */}
            <div className="pt-4 border-t border-light-300 dark:border-dark-700/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500 mb-3">
                Verified Amenities
              </h4>
              <div className="flex flex-wrap gap-2">
                {property.amenities?.map((amenity, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl glass-panel text-dark-700 dark:text-dark-300 text-xs font-medium"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-brand-500" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Landlord Contact Card */}
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-dark-950 dark:text-white">Property Ownership</h3>
            <div className="flex items-center gap-3 p-4 rounded-2xl glass-panel">
              {property.landlord?.avatar ? (
                <img
                  src={property.landlord.avatar}
                  alt={property.landlord.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-brand-500/20"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-dark-200 dark:bg-dark-800 text-dark-700 dark:text-dark-200 flex items-center justify-center font-bold">
                  {property.landlord?.name?.charAt(0) || 'L'}
                </div>
              )}
              <div>
                <span className="text-xs font-bold text-dark-950 dark:text-white block">{property.landlord?.name}</span>
                <span className="text-[11px] text-dark-500 dark:text-dark-400 block">{property.landlord?.email}</span>
                <span className="text-[11px] text-dark-500 dark:text-dark-400 block">{property.landlord?.phone}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-dark-900 border border-dark-800 text-white text-xs space-y-2">
              <span className="font-bold text-brand-400 block">Digital Verification State</span>
              <p className="text-[11px] text-dark-300 leading-relaxed">
                Property documents and room baseline records are cryptographically stored on RentalProof.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: CHECKLIST SCHEMA */}
      {activeTab === 'checklist' && (
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-dark-950 dark:text-white">Room-by-Room Inspection Checklist</h3>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
              Standard inspection items populated during Move-In and Move-Out walkthroughs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {property.checklist?.map((category, idx) => (
              <div key={idx} className="p-5 rounded-2xl glass-panel">
                <h4 className="text-sm font-bold text-dark-950 dark:text-white mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-500" />
                  {category.category}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {category.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="px-3 py-1.5 rounded-lg bg-light-50 dark:bg-dark-850 border border-light-300 dark:border-dark-700/80 text-xs font-medium text-dark-700 dark:text-dark-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="glass-card p-6 rounded-3xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-dark-950 dark:text-white">Chronological Property Timeline</h3>
            <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
              Complete historical record of all tenancy milestones and evidence
            </p>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-light-300 dark:before:bg-dark-700">
            {timeline.map((event, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-0 flex items-center justify-center w-8 h-8 rounded-full border bg-light-50 dark:bg-dark-900 shadow-sm border-brand-500/40 text-brand-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl glass-panel">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-dark-950 dark:text-white">{event.title}</span>
                    <span className="text-[11px] text-dark-400 font-mono">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </CinematicPageTransition>
  );
};

export default PropertyDetailPage;
