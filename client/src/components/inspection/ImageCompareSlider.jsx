import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Columns,
  Maximize2,
  Calendar,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Eye,
} from 'lucide-react';
import Badge from '../common/Badge';
import ImageModal from '../common/ImageModal';

const ImageCompareSlider = ({
  category,
  item,
  moveInImage,
  moveOutImage,
  moveInCondition = 'Good',
  moveOutCondition = 'Good',
  moveInDate,
  moveOutDate,
  moveInNotes = '',
  moveOutNotes = '',
  attentionLevel = 'No Significant Change',
  aiObservation,
  onRunAiAnalysis,
  analyzing = false,
}) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [viewMode, setViewMode] = useState('split'); // 'split' (interactive slider) or 'side-by-side'
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const fallbackMoveIn =
    moveInImage || 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80';
  const fallbackMoveOut =
    moveOutImage || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="rounded-3xl glass-card overflow-hidden shadow-card transition-all">
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border-b border-light-300 dark:border-dark-700/80 bg-light-100/50 dark:bg-dark-900/40">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 font-mono">
              {category}
            </span>
            <span className="text-dark-300 dark:text-dark-600">•</span>
            <h3 className="text-base font-bold text-dark-950 dark:text-white">{item}</h3>
          </div>
          <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
            Baseline vs Move-Out condition documentation & verification
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant={attentionLevel} size="md">
            {attentionLevel}
          </Badge>

          {/* Mode Switcher */}
          <div className="flex items-center glass-panel p-1 rounded-xl">
            <button
              onClick={() => setViewMode('split')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition interactive ${
                viewMode === 'split'
                  ? 'bg-light-50 dark:bg-dark-800 text-dark-950 dark:text-white shadow-sm border border-brand-500/30'
                  : 'text-dark-500 hover:text-dark-900 dark:hover:text-dark-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-brand-500" /> Slider
            </button>
            <button
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition interactive ${
                viewMode === 'side-by-side'
                  ? 'bg-light-50 dark:bg-dark-800 text-dark-950 dark:text-white shadow-sm border border-brand-500/30'
                  : 'text-dark-500 hover:text-dark-900 dark:hover:text-dark-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-brand-500" /> Side-by-Side
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Visual Stage */}
      <div className="p-5 sm:p-6">
        {viewMode === 'split' ? (
          /* Interactive Split Image Comparison Slider */
          <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden select-none shadow-card border border-light-400 dark:border-dark-700/80 group">
            {/* Move-Out Image (Underneath) */}
            <img
              src={fallbackMoveOut}
              alt="Move Out Condition"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-dark-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full pointer-events-none z-10 flex items-center gap-1.5 border border-white/10">
              <span>Move-Out</span>
              <span className="text-dark-400">•</span>
              <Badge variant={moveOutCondition} size="sm">
                {moveOutCondition}
              </Badge>
            </div>

            {/* Move-In Image (Clipped by slider position) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={fallbackMoveIn}
                alt="Move In Condition"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: '100%', height: '100%', minWidth: '100%' }}
              />
              <div className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full pointer-events-none z-10 flex items-center gap-1.5 border border-white/10">
                <span>Move-In</span>
                <span className="text-dark-400">•</span>
                <Badge variant={moveInCondition} size="sm">
                  {moveInCondition}
                </Badge>
              </div>
            </div>

            {/* Slider Divider Bar */}
            <div
              className="absolute inset-y-0 w-1 bg-brand-400 shadow-emerald-glow z-20 flex items-center justify-center cursor-ew-resize"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="w-8 h-8 rounded-full bg-dark-900 shadow-emerald-glow border-2 border-brand-500 flex items-center justify-center text-brand-400">
                <Sliders className="w-4 h-4 rotate-90" />
              </div>
            </div>

            {/* Range Input for dragging */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Image comparison slider"
            />

            {/* Fullscreen zoom action */}
            <button
              onClick={() => setFullscreenImage(fallbackMoveOut)}
              className="absolute bottom-3 right-3 z-30 p-2 bg-dark-950/80 hover:bg-dark-900 text-white rounded-xl backdrop-blur-md transition interactive border border-white/10"
              title="View full resolution"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Side-by-Side Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative rounded-2xl overflow-hidden border border-light-400 dark:border-dark-700 h-72 group">
              <img
                src={fallbackMoveIn}
                alt="Move In Condition"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                <span>Move-In</span>
                <span className="text-dark-400">•</span>
                <Badge variant={moveInCondition} size="sm">
                  {moveInCondition}
                </Badge>
              </div>
              <button
                onClick={() => setFullscreenImage(fallbackMoveIn)}
                className="absolute bottom-3 right-3 p-2 bg-dark-950/80 hover:bg-dark-900 text-white rounded-xl backdrop-blur-md transition interactive"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-light-400 dark:border-dark-700 h-72 group">
              <img
                src={fallbackMoveOut}
                alt="Move Out Condition"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute top-3 left-3 bg-dark-950/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/10">
                <span>Move-Out</span>
                <span className="text-dark-400">•</span>
                <Badge variant={moveOutCondition} size="sm">
                  {moveOutCondition}
                </Badge>
              </div>
              <button
                onClick={() => setFullscreenImage(fallbackMoveOut)}
                className="absolute bottom-3 right-3 p-2 bg-dark-950/80 hover:bg-dark-900 text-white rounded-xl backdrop-blur-md transition interactive"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Notes & AI Analysis Bar */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl glass-panel text-xs">
            <span className="font-bold text-dark-500 dark:text-dark-400 block mb-1">Move-In Notes:</span>
            <p className="text-dark-700 dark:text-dark-300 italic">{moveInNotes || 'No specific notes logged.'}</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel text-xs">
            <span className="font-bold text-dark-500 dark:text-dark-400 block mb-1">Move-Out Notes:</span>
            <p className="text-dark-700 dark:text-dark-300 italic">{moveOutNotes || 'No damage observed.'}</p>
          </div>
        </div>

        {/* AI Observation Card */}
        {aiObservation && (
          <div className="mt-4 p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-xs">
            <div className="flex items-center gap-2 mb-1 text-brand-600 dark:text-brand-400 font-bold">
              <Sparkles className="w-4 h-4" />
              <span>AI Condition Observation</span>
            </div>
            <p className="text-dark-700 dark:text-dark-300 leading-relaxed">{aiObservation}</p>
          </div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <ImageModal
          isOpen={Boolean(fullscreenImage)}
          onClose={() => setFullscreenImage(null)}
          imageUrl={fullscreenImage}
          title={`${item} — Full Resolution Evidence`}
        />
      )}
    </div>
  );
};

export default ImageCompareSlider;
