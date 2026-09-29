import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SplitSquareVertical,
  Sparkles,
  Printer,
  ShieldCheck,
  Building2,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ArrowLeft,
  Filter,
} from 'lucide-react';
import api from '../api/client';
import { useToast } from '../context/ToastContext';
import ImageCompareSlider from '../components/inspection/ImageCompareSlider';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { SkeletonCard } from '../components/common/CinematicLoader';
import CinematicPageTransition from '../components/common/CinematicPageTransition';
import TiltCard from '../components/common/TiltCard';

const ComparisonPage = () => {
  const [searchParams] = useSearchParams();
  const moveOutIdParam = searchParams.get('moveOutId');
  const { showToast } = useToast();

  const [inspectionsList, setInspectionsList] = useState([]);
  const [selectedMoveOutId, setSelectedMoveOutId] = useState(moveOutIdParam || '');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzingItemId, setAnalyzingItemId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load available Move-Out inspections
  useEffect(() => {
    const fetchInspections = async () => {
      try {
        const res = await api.get('/inspections', { params: { type: 'Move-Out' } });
        if (res.data.success) {
          const moveOuts = res.data.inspections || [];
          setInspectionsList(moveOuts);
          if (!selectedMoveOutId && moveOuts.length > 0) {
            setSelectedMoveOutId(moveOuts[0]._id);
          }
        }
      } catch (error) {
        console.error('Failed to load move-out inspections:', error);
      }
    };

    fetchInspections();
  }, []);

  // Fetch comparison data for selected move-out inspection
  useEffect(() => {
    if (!selectedMoveOutId) return;

    const fetchComparison = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/comparison/${selectedMoveOutId}`);
        if (res.data.success) {
          setComparisonData(res.data);
        }
      } catch (error) {
        console.error('Failed to load comparison data:', error);
        showToast(error.response?.data?.message || 'Unable to load comparison.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [selectedMoveOutId]);

  // Handle running AI Analysis on a specific item pair
  const handleRunAiAnalysis = async (compItem) => {
    try {
      setAnalyzingItemId(compItem.moveOutItemId);
      const res = await api.post('/comparison/analyze', {
        moveOutInspectionId: selectedMoveOutId,
        itemId: compItem.moveOutItemId,
        moveInImage: compItem.moveIn?.photos?.[0],
        moveOutImage: compItem.moveOut?.photos?.[0],
        category: compItem.category,
        item: compItem.item,
        moveInCondition: compItem.moveIn?.condition,
        moveOutCondition: compItem.moveOut?.condition,
      });

      if (res.data.success) {
        showToast(`AI analysis completed for ${compItem.item}!`, 'success');
        setComparisonData((prev) => {
          if (!prev) return prev;
          const updatedComparisons = prev.comparisons.map((c) => {
            if (c.moveOutItemId === compItem.moveOutItemId) {
              return {
                ...c,
                aiObservation: res.data.analysis,
                attentionLevel: res.data.analysis.changeDetected ? 'Possible Change' : c.attentionLevel,
              };
            }
            return c;
          });
          return { ...prev, comparisons: updatedComparisons };
        });
      }
    } catch (error) {
      showToast('AI analysis failed. Please try again.', 'error');
    } finally {
      setAnalyzingItemId(null);
    }
  };

  const categories = comparisonData
    ? ['all', ...new Set(comparisonData.comparisons.map((c) => c.category))]
    : ['all'];

  const filteredComparisons = comparisonData
    ? comparisonData.comparisons.filter(
        (c) => categoryFilter === 'all' || c.category === categoryFilter
      )
    : [];

  return (
    <CinematicPageTransition>
      <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
              Signature Proof Engine
            </span>
            <span className="text-dark-300 dark:text-dark-600">•</span>
            <Badge variant="primary" size="sm">
              Tamper-Evident
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-dark-950 dark:text-white tracking-tight">
            Before vs After Evidence Comparison
          </h1>
          <p className="text-xs sm:text-sm text-dark-500 dark:text-dark-400 mt-0.5">
            Photographic baseline overlay & algorithmic observation review
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Inspection Selector */}
          {inspectionsList.length > 0 && (
            <select
              value={selectedMoveOutId}
              onChange={(e) => setSelectedMoveOutId(e.target.value)}
              className="text-xs rounded-xl glass-input px-3 py-2 text-dark-800 dark:text-dark-200 font-semibold focus:outline-none cursor-pointer"
            >
              {inspectionsList.map((insp) => (
                <option key={insp._id} value={insp._id}>
                  {insp.property?.title} ({new Date(insp.inspectionDate).toLocaleDateString()})
                </option>
              ))}
            </select>
          )}

          <Button
            variant="outline"
            size="md"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print Comparison
          </Button>
        </div>
      </div>

      {/* Product Principle Ethical Banner */}
      <div className="p-4 rounded-2xl bg-accent-500/10 border border-accent-500/20 text-accent-700 dark:text-accent-300 flex items-start gap-3 text-xs leading-relaxed">
        <HelpCircle className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">RentalProof Evidence Protocol:</span>
          This tool presents chronological photographic records side-by-side. Attention indicators and AI observations exist solely to highlight visual variations for objective human review. They do not constitute legal rulings or automated liability claims.
        </div>
      </div>

      {/* Property & Inspection Header Card */}
      {comparisonData && (
        <div className="p-6 rounded-3xl glass-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/10 text-brand-600 dark:text-brand-400 rounded-2xl border border-brand-500/20 shadow-emerald-glow">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-dark-950 dark:text-white">{comparisonData.property?.title}</h2>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                {comparisonData.property?.address}, {comparisonData.property?.city}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div>
              <span className="text-dark-400 block text-[11px]">Move-In Baseline</span>
              <span className="font-bold text-dark-800 dark:text-dark-200 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-brand-500" />
                {new Date(comparisonData.moveInInspection.inspectionDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-dark-400 block text-[11px]">Move-Out Walkthrough</span>
              <span className="font-bold text-dark-800 dark:text-dark-200 flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-accent-500" />
                {new Date(comparisonData.moveOutInspection.inspectionDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-dark-400 block text-[11px]">Total Paired Fixtures</span>
              <span className="font-bold text-dark-800 dark:text-dark-200 font-mono">
                {comparisonData.comparisons?.length || 0} Inspected Items
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Category Pills */}
      {categories.length > 1 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition capitalize cursor-pointer interactive ${
                categoryFilter === cat
                  ? 'bg-brand-500 text-white shadow-emerald-glow'
                  : 'glass-panel text-dark-600 dark:text-dark-300 hover:border-brand-500/40'
              }`}
            >
              {cat === 'all' ? 'All Rooms & Fixtures' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Sliders List */}
      {loading ? (
        <SkeletonCard count={3} />
      ) : filteredComparisons.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-card text-xs text-dark-500">
          No paired inspection items found for comparison.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredComparisons.map((comp) => (
            <ImageCompareSlider
              key={comp.moveOutItemId}
              category={comp.category}
              item={comp.item}
              moveInImage={comp.moveIn?.photos?.[0]}
              moveOutImage={comp.moveOut?.photos?.[0]}
              moveInCondition={comp.moveIn?.condition}
              moveOutCondition={comp.moveOut?.condition}
              moveInDate={comparisonData?.moveInInspection?.inspectionDate}
              moveOutDate={comparisonData?.moveOutInspection?.inspectionDate}
              moveInNotes={comp.moveIn?.notes}
              moveOutNotes={comp.moveOut?.notes}
              attentionLevel={comp.attentionLevel}
              aiObservation={comp.aiObservation?.notes}
              onRunAiAnalysis={() => handleRunAiAnalysis(comp)}
              analyzing={analyzingItemId === comp.moveOutItemId}
            />
          ))}
        </div>
      )}
    </div>
  </CinematicPageTransition>
  );
};

export default ComparisonPage;
