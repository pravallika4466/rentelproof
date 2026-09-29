import React, { useState } from 'react';
import { CheckCircle2, Clock, Wrench, UserCheck, AlertCircle, Calendar, Image as ImageIcon } from 'lucide-react';
import ImageModal from '../common/ImageModal';

const MaintenanceTimeline = ({ timeline = [], completionPhotos = [], completionNotes = '' }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reported':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case 'Reviewed':
        return <UserCheck className="w-4 h-4 text-emerald-500" />;
      case 'Assigned':
        return <Wrench className="w-4 h-4 text-accent-400" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-brand-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400 dark:text-dark-400" />;
    }
  };

  const getDotBg = (status) => {
    switch (status) {
      case 'Reported':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
      case 'Reviewed':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'Assigned':
        return 'bg-accent-500/10 border-accent-500/30 text-accent-400';
      case 'In Progress':
        return 'bg-amber-500/15 border-amber-500/40 text-amber-300';
      case 'Completed':
        return 'bg-brand-500/15 border-brand-500/40 text-brand-400 shadow-emerald-glow';
      default:
        return 'bg-slate-500/10 border-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60 dark:border-dark-700/60">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Maintenance Resolution Audit Trail
          </h3>
          <p className="text-xs text-slate-500 dark:text-dark-300 mt-1">
            Tamper-evident chronological timeline of inspection, assignment & contractor repairs
          </p>
        </div>
      </div>

      <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-brand-500/60 before:via-slate-300 dark:before:via-dark-700 before:to-slate-200 dark:before:to-dark-800">
        {timeline.map((event, index) => (
          <div key={index} className="relative group">
            {/* Timeline node */}
            <div
              className={`absolute -left-[45px] top-1 flex items-center justify-center w-8 h-8 rounded-full border shadow-sm transition-all duration-300 group-hover:scale-110 ${getDotBg(
                event.status
              )}`}
            >
              {getStatusIcon(event.status)}
            </div>

            <div className="bg-slate-50/70 dark:bg-dark-900/60 p-4 sm:p-5 rounded-2xl border border-slate-200/70 dark:border-dark-700/70 hover:border-brand-500/40 dark:hover:border-brand-500/40 transition-all duration-300 hover:shadow-md">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  {event.status}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-dark-400 flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-brand-500" />
                  {new Date(event.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="text-xs text-slate-700 dark:text-dark-200 leading-relaxed font-sans">{event.note}</p>

              {event.updatedBy && (
                <div className="text-[11px] text-slate-500 dark:text-dark-400 mt-2.5 font-medium flex items-center gap-1.5">
                  <span>Authorized by:</span>
                  <span className="text-slate-800 dark:text-dark-100 font-semibold px-2 py-0.5 rounded-md bg-slate-200/50 dark:bg-dark-800">
                    {event.updatedBy.name || 'Technician / Staff'}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Evidence Section */}
      {completionPhotos.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-dark-700/60">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-4 h-4 text-brand-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Service Completion Photographic Evidence
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {completionPhotos.map((photo, i) => (
              <div
                key={i}
                onClick={() => setSelectedPhoto(photo)}
                className="relative rounded-2xl overflow-hidden border border-slate-200/70 dark:border-dark-700/70 h-28 cursor-pointer group shadow-sm hover:shadow-emerald-glow transition-all duration-300"
              >
                <img
                  src={photo}
                  alt={`Completion Proof ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
                />
                <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-dark-950/0 transition" />
                <div className="absolute bottom-1.5 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-dark-950/70 text-brand-400 backdrop-blur-sm">
                  Proof #{i + 1}
                </div>
              </div>
            ))}
          </div>

          {completionNotes && (
            <div className="mt-4 p-4 bg-brand-500/5 dark:bg-brand-500/10 rounded-2xl border border-brand-500/20 text-xs text-slate-700 dark:text-dark-200">
              <span className="font-bold text-brand-600 dark:text-brand-400 block mb-1">Technician Certification Note:</span>
              <p className="italic font-serif leading-relaxed">"{completionNotes}"</p>
            </div>
          )}
        </div>
      )}

      <ImageModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        src={selectedPhoto}
        title="Service Completion Photographic Evidence"
      />
    </div>
  );
};

export default MaintenanceTimeline;
