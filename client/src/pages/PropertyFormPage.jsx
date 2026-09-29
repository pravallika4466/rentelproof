import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, ArrowLeft, ArrowRight, Plus, X } from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const PropertyFormPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: 'Andhra Pradesh',
    pincode: '',
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    rentAmount: 15000,
    depositAmount: 30000,
    amenities: ['Covered Parking', 'Elevator', '24/7 Water Supply'],
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
  });

  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] });
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (item) => {
    setFormData({ ...formData, amenities: formData.amenities.filter((a) => a !== item) });
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData({ ...formData, images: [...formData.images, newImageUrl.trim()] });
      setNewImageUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/properties', formData);
      if (res.data.success) {
        showToast('Property registered successfully!', 'success');
        navigate(`/properties/${res.data.property._id}`);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to create property.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CinematicPageTransition className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/properties"
        className="inline-flex items-center gap-2 text-xs font-bold text-dark-500 hover:text-dark-900 dark:hover:text-dark-100 transition interactive"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel & Back
      </Link>

      <TiltCard maxTilt={2} depth={8}>
        <div className="glass-card p-6 sm:p-10 rounded-3xl shadow-card border border-brand-500/20">
        <div className="flex items-center gap-3 pb-6 border-b border-light-300 dark:border-dark-700/80 mb-6">
          <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-500/20 shadow-emerald-glow">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-dark-950 dark:text-white">Add New Rental Property</h1>
            <p className="text-xs text-dark-500 dark:text-dark-400">
              Configure property specifications and default inspection baseline schema
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Property Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Green Valley Apartments, Unit 402"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Property Classification
                </label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                >
                  <option value="Apartment">Apartment</option>
                  <option value="House">Independent House</option>
                  <option value="Villa">Luxury Villa</option>
                  <option value="Studio">Studio Apartment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Square Footage (sq.ft)
                </label>
                <input
                  type="number"
                  name="areaSqFt"
                  required
                  value={formData.areaSqFt}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  required
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  required
                  min="0"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Financials */}
          <div className="space-y-4 pt-6 border-t border-light-300 dark:border-dark-700/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500">
              Financial Terms & Escrow
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Monthly Rent (₹)
                </label>
                <input
                  type="number"
                  name="rentAmount"
                  required
                  min="0"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  name="depositAmount"
                  required
                  min="0"
                  value={formData.depositAmount}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm font-mono"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 pt-6 border-t border-light-300 dark:border-dark-700/80">
            <h3 className="text-xs font-bold uppercase tracking-wider text-dark-400 dark:text-dark-500">
              Location & Address
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. 402 Palm Grove Enclave, Ring Road"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="e.g. Guntur"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  placeholder="e.g. 522002"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm placeholder:text-dark-400 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-light-300 dark:border-dark-700/80 flex justify-end gap-3">
            <Link to="/properties">
              <Button variant="outline" size="md">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={ArrowRight}
              className="shadow-emerald-glow px-6"
            >
              Register Property
            </Button>
          </div>
        </form>
        </div>
      </TiltCard>
    </CinematicPageTransition>
  );
};

export default PropertyFormPage;
