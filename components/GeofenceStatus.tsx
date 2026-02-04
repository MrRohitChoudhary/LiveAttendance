
import React from 'react';
import { MapPin, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { formatDistance } from '../utils/geofencing';

interface GeofenceStatusProps {
  inRange: boolean;
  distance: number | null;
  loading: boolean;
  officeName: string;
}

const GeofenceStatus: React.FC<GeofenceStatusProps> = ({ inRange, distance, loading, officeName }) => {
  return (
    <div className={`p-4 rounded-2xl border ${inRange ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'} transition-all`}>
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${inRange ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
          <MapPin className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800 text-sm">Target: {officeName}</h4>
          {loading ? (
            <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs">
              <Loader2 className="w-3 h-3 animate-spin" />
              Verifying Location...
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mt-1">
                {inRange ? (
                  <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 className="w-3 h-3" /> In Range
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-600 text-xs font-bold uppercase tracking-wider">
                    <XCircle className="w-3 h-3" /> Out of Range
                  </span>
                )}
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-slate-600 text-xs">Distance: {distance !== null ? formatDistance(distance) : 'Unknown'}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeofenceStatus;
