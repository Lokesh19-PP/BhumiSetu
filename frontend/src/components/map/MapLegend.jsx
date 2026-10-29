import React from 'react';

export const LAND_USE_COLORS = {
  RESIDENTIAL: { stroke: '#1D4ED8', fill: '#3B82F6', label: 'Residential' },
  COMMERCIAL: { stroke: '#B45309', fill: '#F59E0B', label: 'Commercial' },
  AGRICULTURAL: { stroke: '#15803D', fill: '#22C55E', label: 'Agricultural' },
  INDUSTRIAL: { stroke: '#6D28D9', fill: '#8B5CF6', label: 'Industrial' },
  MIXED_USE: { stroke: '#C2410C', fill: '#F97316', label: 'Mixed Use' },
  PUBLIC_UTILITY: { stroke: '#0E7490', fill: '#06B6D4', label: 'Public Utility' },
};

export default function MapLegend() {
  return (
    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs space-y-2 pointer-events-auto">
      <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center justify-between">
        <span>Land-Use Legend</span>
        <span className="text-[10px] text-slate-400 font-normal">25 Pune Parcels</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {Object.entries(LAND_USE_COLORS).map(([key, item]) => (
          <div key={key} className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-sm border shrink-0"
              style={{ backgroundColor: item.fill, borderColor: item.stroke }}
            />
            <span className="text-slate-700 text-[11px] font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
