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
import { CardSkeleton } from '../components/common/Skeleton';

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
        // Update local state with the AI observation
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Signature Proof Engine
            </span>
            <span className="text-slate-300">•</span>
            <Badge variant="primary" size="sm">
              Tamper-Evident
            </Badge>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Before vs After Evidence Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Photographic baseline overlay & algorithmic observation review
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Inspection Selector */}
          {inspectionsList.length > 0 && (
            <select
              value={selectedMoveOutId}
              onChange={(e) => setSelectedMoveOutId(e.target.value)}
              className="text-xs rounded-xl border border-slate-300 px-3 py-2 bg-white text-slate-800 font-semibold focus:outline-none"
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
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-0.5">RentalProof Evidence Notice:</span>
          This tool presents chronological photographic records side-by-side. Attention indicators and AI observations exist solely to highlight visual variations for objective human review. They do not constitute legal rulings or automated determinations of liability.
        </div>
      </div>

      {/* Property & Inspection Header Card */}
      {comparisonData && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-2xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{comparisonData.property?.title}</h2>
              <p className="text-xs text-slate-500">
                {comparisonData.property?.address}, {comparisonData.property?.city}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Move-In Baseline</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                {new Date(comparisonData.moveInInspection.inspectionDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Move-Out Walkthrough</span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                {new Date(comparisonData.moveOutInspection.inspectionDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Total Paired Fixtures</span>
              <span className="font-bold text-slate-800">
                {comparisonData.comparisons?.length || 0} Inspected Items
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      {comparisonData && categories.length > 2 && (
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                categoryFilter === cat
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Rooms' : cat}
            </button>
          ))}
        </div>
      )}

      {/* Comparisons Stage */}
      {loading ? (
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : !comparisonData || filteredComparisons.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300">
          <SplitSquareVertical className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No paired evidence records found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Ensure a Move-Out walkthrough has been recorded with reference to a Move-In baseline.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {filteredComparisons.map((comp, idx) => (
            <ImageCompareSlider
              key={idx}
              category={comp.category}
              item={comp.item}
              moveInImage={comp.moveIn?.photos?.[0]}
              moveOutImage={comp.moveOut?.photos?.[0]}
              moveInCondition={comp.moveIn?.condition}
              moveOutCondition={comp.moveOut?.condition}
              moveInDate={comp.moveIn?.inspectionDate}
              moveOutDate={comp.moveOut?.inspectionDate}
              moveInNotes={comp.moveIn?.notes}
              moveOutNotes={comp.moveOut?.notes}
              attentionLevel={comp.attentionLevel}
              aiObservation={comp.aiObservation}
              onRunAiAnalysis={() => handleRunAiAnalysis(comp)}
              analyzing={analyzingItemId === comp.moveOutItemId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ComparisonPage;
