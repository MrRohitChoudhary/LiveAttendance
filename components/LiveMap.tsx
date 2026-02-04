
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LiveMapProps {
  userLocation: { lat: number; lng: number } | null;
}

const LiveMap: React.FC<LiveMapProps> = ({ userLocation }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const userMarker = useRef<L.CircleMarker | null>(null);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([0, 0], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap.current);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (leafletMap.current && userLocation) {
      const pos: [number, number] = [userLocation.lat, userLocation.lng];

      if (!userMarker.current) {
        userMarker.current = L.circleMarker(pos, {
          radius: 10,
          color: '#ffffff',
          fillColor: '#6366f1',
          fillOpacity: 1,
          weight: 4
        }).addTo(leafletMap.current);
        leafletMap.current.setView(pos, 16);
      } else {
        userMarker.current.setLatLng(pos);
        // Smoothly pan to user
        leafletMap.current.panTo(pos);
      }
    }
  }, [userLocation]);

  return (
    <div className="w-full h-56 bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative">
      <div ref={mapRef} className="absolute inset-0" />
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl text-[10px] font-black text-indigo-600 border border-indigo-100 shadow-sm flex items-center gap-2">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
        LIVE TRACKING ACTIVE
      </div>
    </div>
  );
};

export default LiveMap;
