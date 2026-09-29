import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ClipboardCheck,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Camera,
  Image as ImageIcon,
  Plus,
  Save,
} from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import TiltCard from '../components/common/TiltCard';
import CinematicPageTransition from '../components/common/CinematicPageTransition';

const InspectionWizardPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    propertyId: '',
    type: 'Move-In',
    inspectionDate: new Date().toISOString().split('T')[0],
    overallNotes: '',
    items: [],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoadingProps(true);
        const res = await api.get('/properties');
        if (res.data.success && res.data.properties?.length > 0) {
          const props = res.data.properties;
          setProperties(props);
          const firstProp = props[0];

          // Initialize items from property's checklist
          const initialItems = [];
          firstProp.checklist?.forEach((cat) => {
            cat.items.forEach((it) => {
              initialItems.push({
                category: cat.category,
                item: it,
                condition: 'Good',
                notes: '',
                photos: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80'],
              });
            });
          });

          setFormData((prev) => ({
            ...prev,
            propertyId: firstProp._id,
            items: initialItems,
          }));
        }
      } catch (error) {
        console.error('Failed to load properties:', error);
      } finally {
        setLoadingProps(false);
      }
    };

    fetchProperties();
  }, []);

  const handlePropertyChange = (propertyId) => {
    const prop = properties.find((p) => p._id === propertyId);
    if (!prop) return;

    const initialItems = [];
    prop.checklist?.forEach((cat) => {
      cat.items.forEach((it) => {
        initialItems.push({
          category: cat.category,
          item: it,
          condition: 'Good',
          notes: '',
          photos: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=600&q=80'],
        });
      });
    });

    setFormData({
      ...formData,
      propertyId,
      items: initialItems,
    });
  };

  const handleItemConditionChange = (index, condition) => {
    const updated = [...formData.items];
    updated[index].condition = condition;
    setFormData({ ...formData, items: updated });
  };

  const handleItemNotesChange = (index, notes) => {
    const updated = [...formData.items];
    updated[index].notes = notes;
    setFormData({ ...formData, items: updated });
  };

  // Group items by category for multi-step room wizard
  const categories = [...new Set(formData.items.map((i) => i.category))];
  const steps = ['Property Setup', ...categories, 'Final Review'];

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await api.post('/inspections', {
        propertyId: formData.propertyId,
        type: formData.type,
        inspectionDate: formData.inspectionDate,
        customItems: formData.items,
      });

      if (res.data.success) {
        // Mark as completed
        await api.put(`/inspections/${res.data.inspection._id}/complete`, {
          overallNotes: formData.overallNotes,
        });

        showToast('Inspection completed & baseline recorded!', 'success');
        navigate(`/inspections/${res.data.inspection._id}`);
      }
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to complete inspection.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CinematicPageTransition className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/inspections"
        className="inline-flex items-center gap-2 text-xs font-bold text-dark-500 hover:text-dark-900 dark:hover:text-dark-100 transition interactive"
      >
        <ArrowLeft className="w-4 h-4" /> Cancel & Return
      </Link>

      {/* Progress Steps Header */}
      <div className="rounded-3xl glass-card p-5 shadow-card overflow-x-auto">
        <div className="flex items-center justify-between min-w-[500px] gap-2">
          {steps.map((stepName, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer interactive ${
                currentStep === idx
                  ? 'bg-brand-500 text-white shadow-emerald-glow'
                  : currentStep > idx
                  ? 'bg-brand-500/15 text-brand-700 dark:text-brand-300'
                  : 'text-dark-400 hover:text-dark-600 dark:hover:text-dark-300'
              }`}
            >
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current font-mono">
                {idx + 1}
              </span>
              <span>{stepName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Body */}
      <div className="rounded-3xl glass-card p-6 sm:p-10 shadow-card space-y-6">
        {/* Step 0: Setup */}
        {currentStep === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-dark-950 dark:text-white">Step 1 — Inspection Parameters</h2>
            <p className="text-xs text-dark-500 dark:text-dark-400">Select target property and verification scope</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Select Property</label>
                <select
                  value={formData.propertyId}
                  onChange={(e) => handlePropertyChange(e.target.value)}
                  className="w-full rounded-xl glass-input p-2.5 text-xs text-dark-900 dark:text-dark-100 focus:outline-none"
                >
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.title} ({p.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Inspection Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full rounded-xl glass-input p-2.5 text-xs text-dark-900 dark:text-dark-100 focus:outline-none"
                >
                  <option value="Move-In">Move-In Baseline</option>
                  <option value="Move-Out">Move-Out Walkthrough</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Inspection Date</label>
                <input
                  type="date"
                  value={formData.inspectionDate}
                  onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  className="w-full rounded-xl glass-input p-2.5 text-xs text-dark-900 dark:text-dark-100 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Room Steps (1 to categories.length) */}
        {currentStep > 0 && currentStep <= categories.length && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase text-brand-600 dark:text-brand-400 font-mono">Room Checklist</span>
              <h2 className="text-lg font-bold text-dark-950 dark:text-white">{categories[currentStep - 1]}</h2>
              <p className="text-xs text-dark-500 dark:text-dark-400">Record condition grades and photograph each fixture</p>
            </div>

            <div className="space-y-4">
              {formData.items
                .map((item, idx) => ({ ...item, globalIndex: idx }))
                .filter((item) => item.category === categories[currentStep - 1])
                .map((item) => (
                  <div
                    key={item.globalIndex}
                    className="p-5 rounded-2xl glass-panel space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-dark-950 dark:text-white">{item.item}</h4>
                      <Badge variant={item.condition}>{item.condition}</Badge>
                    </div>

                    {/* Condition Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-dark-400 mb-1.5 uppercase font-mono">
                        Condition Assessment
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Excellent', 'Good', 'Fair', 'Needs Attention', 'Damaged'].map((cond) => (
                          <button
                            key={cond}
                            type="button"
                            onClick={() => handleItemConditionChange(item.globalIndex, cond)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition interactive cursor-pointer ${
                              item.condition === cond
                                ? 'bg-brand-500 text-white border-brand-500 shadow-emerald-glow'
                                : 'glass-panel text-dark-700 dark:text-dark-300 hover:border-brand-500/40'
                            }`}
                          >
                            {cond}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes & Evidence */}
                    <div>
                      <input
                        type="text"
                        placeholder="Add observational notes (e.g. minor paint blemish, clean surface)..."
                        value={item.notes}
                        onChange={(e) => handleItemNotesChange(item.globalIndex, e.target.value)}
                        className="w-full text-xs rounded-xl glass-input p-2.5 focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Final Step: Review */}
        {currentStep === steps.length - 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-dark-950 dark:text-white">Final Review & Sign-Off</h2>
              <p className="text-xs text-dark-500 dark:text-dark-400">Review all room evaluations before recording digital baseline</p>
            </div>

            <div className="p-4 rounded-2xl glass-panel space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-dark-500 dark:text-dark-400">Total Items Evaluated:</span>
                <span className="font-bold text-dark-950 dark:text-white font-mono">{formData.items.length} Fixtures</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500 dark:text-dark-400">Inspection Type:</span>
                <span className="font-bold text-brand-600 dark:text-brand-400">{formData.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-500 dark:text-dark-400">Target Date:</span>
                <span className="font-bold text-dark-950 dark:text-white font-mono">{formData.inspectionDate}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-dark-700 dark:text-dark-300 mb-1">Overall Inspection Summary Notes</label>
              <textarea
                rows={3}
                placeholder="Overall observations, key handover remarks, or mutual confirmations..."
                value={formData.overallNotes}
                onChange={(e) => setFormData({ ...formData, overallNotes: e.target.value })}
                className="w-full rounded-xl glass-input p-2.5 text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-light-300 dark:border-dark-700/80">
          <Button
            variant="outline"
            size="md"
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          >
            Previous Room
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              variant="primary"
              size="md"
              icon={ArrowRight}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next Room
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={CheckCircle2}
              loading={submitting}
              onClick={handleSubmit}
            >
              Finalize & Save Baseline
            </Button>
          )}
        </div>
      </div>
    </CinematicPageTransition>
  );
};

export default InspectionWizardPage;
