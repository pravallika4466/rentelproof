import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Search, Plus, MapPin, Bed, Bath, Maximize, ArrowRight, Filter } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import { SkeletonCard } from '../components/common/CinematicLoader';
import TiltCard from '../components/common/TiltCard';
import PropertyArchitecturalScene from '../components/3d/PropertyArchitecturalScene';
import AnimatedNumber from '../components/common/AnimatedNumber';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const PropertiesPage = () => {
  const { isLandlord, isAdmin } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/properties', {
        params: {
          search: search || undefined,
          status: statusFilter,
          propertyType: typeFilter,
        },
      });
      if (res.data.success) {
        setProperties(res.data.properties || []);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProperties();
  };

  return (
    <CinematicPageTransition>
      <div className="space-y-6 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
              Properties Directory
            </h1>
            <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
              Manage your rental assets, room checklists, and occupancy records
            </p>
          </div>

          {(isLandlord || isAdmin) && (
            <Link to="/properties/new">
              <Button variant="primary" size="md" icon={Plus}>
                Add Property
              </Button>
            </Link>
          )}
        </div>

        {/* 3D Architectural Asset Banner */}
        <div className="p-6 sm:p-7 rounded-3xl glass-card border border-brand-500/20 shadow-card-hover relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-600 dark:text-brand-400 px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Asset Portfolio Visualization
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-dark-950 dark:text-white tracking-tight">
              Spatial Registry & Photographic Baselines
            </h2>
            <p className="text-xs text-dark-500 dark:text-dark-300 leading-relaxed max-w-xl">
              Every property asset links directly to condition inventories, room-by-room photographic proofs, and verified deposit escrow terms.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="text-dark-400 block text-[11px]">Total Properties</span>
                <span className="text-lg font-extrabold text-dark-950 dark:text-white font-mono">
                  <AnimatedNumber value={properties.length} />
                </span>
              </div>
              <div className="w-px h-8 bg-dark-200 dark:bg-dark-800" />
              <div>
                <span className="text-dark-400 block text-[11px]">Occupied Units</span>
                <span className="text-lg font-extrabold text-brand-600 dark:text-brand-400 font-mono">
                  <AnimatedNumber value={properties.filter((p) => p.status === 'Occupied').length} />
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-[340px] rounded-2xl bg-dark-950/20 dark:bg-dark-950/50 border border-brand-500/20 overflow-hidden relative shadow-inner">
              <PropertyArchitecturalScene />
            </div>
          </div>
        </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-card flex flex-wrap items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[240px]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-dark-400" />
            <input
              type="text"
              placeholder="Search properties by title, city, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder:text-dark-400 focus:outline-none"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl glass-input px-3 py-2 text-dark-800 dark:text-dark-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs rounded-xl glass-input px-3 py-2 text-dark-800 dark:text-dark-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Property Types</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
          </select>
        </div>
      </div>

      {/* Property Cards Grid */}
      {loading ? (
        <SkeletonCard count={6} />
      ) : properties.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No properties found"
          description="Try adjusting your search filters or create a new property."
          actionLabel={(isLandlord || isAdmin) ? 'Create First Property' : undefined}
          onAction={() => (window.location.href = '/properties/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => {
            const coverImage =
              p.images && p.images.length > 0
                ? p.images[0]
                : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';

            return (
              <div
                key={p._id}
                className="rounded-3xl glass-card overflow-hidden shadow-card flex flex-col justify-between group"
              >
                <div>
                  {/* Property Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-dark-900">
                    <img
                      src={coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant={p.status}>{p.status}</Badge>
                    </div>
                    <div className="absolute top-3 right-3 bg-dark-950/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      {p.propertyType}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-5">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-lg font-extrabold text-dark-950 dark:text-white font-mono">
                        ₹{p.rentAmount?.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-normal text-dark-500 dark:text-dark-400">/month</span>
                      </span>
                      <span className="text-xs text-dark-400 font-mono">
                        Dep: ₹{p.depositAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-dark-950 dark:text-white group-hover:text-brand-500 transition line-clamp-1">
                      {p.title}
                    </h3>

                    <p className="text-xs text-dark-500 dark:text-dark-400 flex items-center gap-1.5 mt-1 line-clamp-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                      {p.address}, {p.city}
                    </p>

                    {/* Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-light-300 dark:border-dark-700/80 text-dark-600 dark:text-dark-300 text-xs text-center font-mono">
                      <div className="flex items-center justify-center gap-1">
                        <Bed className="w-3.5 h-3.5 text-dark-400" />
                        <span>{p.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Bath className="w-3.5 h-3.5 text-dark-400" />
                        <span>{p.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Maximize className="w-3.5 h-3.5 text-dark-400" />
                        <span>{p.areaSqFt} sq.ft</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <Link to={`/properties/${p._id}`}>
                    <Button variant="outline" size="sm" className="w-full" icon={ArrowRight}>
                      View Property & Timeline
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </CinematicPageTransition>
  );
};

export default PropertiesPage;
