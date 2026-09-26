import React, { useState } from 'react';
import { CheckCircle2, Clock, Wrench, UserCheck, AlertCircle, Calendar, Image as ImageIcon } from 'lucide-react';
import ImageModal from '../common/ImageModal';

const MaintenanceTimeline = ({ timeline = [], completionPhotos = [], completionNotes = '' }) => {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Reported':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'Reviewed':
        return <UserCheck className="w-4 h-4 text-teal-600" />;
      case 'Assigned':
        return <Wrench className="w-4 h-4 text-purple-600" />;
      case 'In Progress':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'Completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getDotBg = (status) => {
    switch (status) {
      case 'Reported':
        return 'bg-amber-50 border-amber-200';
      case 'Reviewed':
        return 'bg-teal-50 border-teal-200';
      case 'Assigned':
        return 'bg-purple-50 border-purple-200';
      case 'In Progress':
        return 'bg-amber-50 border-amber-200';
      case 'Completed':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-slate-900">Maintenance Resolution Timeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">Chronological audit trail of technician service & repairs</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.map((event, index) => (
          <div key={index} className="relative group">
            {/* Timeline node */}
            <div
              className={`absolute -left-[31px] top-0 flex items-center justify-center w-8 h-8 rounded-full border shadow-sm ${getDotBg(
                event.status
              )}`}
            >
              {getStatusIcon(event.status)}
            </div>

            <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <span className="text-xs font-bold text-slate-900">{event.status}</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3" />
                  {new Date(event.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{event.note}</p>

              {event.updatedBy && (
                <div className="text-[11px] text-slate-400 mt-2 font-medium">
                  Updated by: <span className="text-slate-700">{event.updatedBy.name || 'Staff'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Completion Evidence Section */}
      {completionPhotos.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <h4 className="text-xs font-bold text-slate-900">Service Completion Photographic Proof</h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {completionPhotos.map((photo, i) => (
              <div
                key={i}
                onClick={() => setSelectedPhoto(photo)}
                className="relative rounded-xl overflow-hidden border border-slate-200 h-24 cursor-pointer group shadow-sm hover:shadow"
              >
                <img
                  src={photo}
                  alt={`Completion Proof ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/0 transition" />
              </div>
            ))}
          </div>

          {completionNotes && (
            <p className="text-xs text-slate-600 mt-3 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 italic">
              "{completionNotes}"
            </p>
          )}
        </div>
      )}

      <ImageModal
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        src={selectedPhoto}
        title="Service Completion Evidence"
      />
    </div>
  );
};

export default MaintenanceTimeline;
