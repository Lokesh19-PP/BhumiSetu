import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  FileText,
  User,
  Compass,
  Building2,
  Droplets,
  Layers,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { LAND_USE_COLORS } from './MapLegend';

export default function ParcelDrawer({ parcel, onClose }) {
  const navigate = useNavigate();

  if (!parcel) return null;

  const colorMeta = LAND_USE_COLORS[parcel.landUse] || { fill: '#3B82F6', label: parcel.landUse };
  const areaHectares = (parcel.areaSqM / 10000).toFixed(4);
  const areaAcres = (parcel.areaSqM / 4046.86).toFixed(2);

  return (
    <div className="absolute right-0 top-0 bottom-0 w-full sm:w-96 bg-white shadow-2xl border-l border-slate-200 z-[1000] flex flex-col justify-between animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div>
        <div className="p-4 bg-[#0B2545] text-white flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Cadastral Parcel Summary
            </span>
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <span>Survey No. {parcel.surveyNumber}</span>
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 space-y-5 overflow-y-auto max-h-[calc(100vh-210px)]">
          {/* ULPIN & Land Use */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
              {parcel.ulpin}
            </span>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: colorMeta.fill }}
            >
              {colorMeta.label}
            </span>
          </div>

          {/* Location card */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2 text-xs">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#0B2545]" />
              <span>Geographic Jurisdiction</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-200 text-slate-600">
              <div>
                <span className="block text-[10px] text-slate-400">Village</span>
                <span className="font-semibold text-slate-800">{parcel.village}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">Taluka</span>
                <span className="font-semibold text-slate-800">{parcel.taluka || 'Haveli'}</span>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400">District</span>
                <span className="font-semibold text-slate-800">{parcel.district || 'Pune'}</span>
              </div>
            </div>
          </div>

          {/* Area metrics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Total Area</span>
              <span className="text-base font-extrabold text-blue-950">
                {parcel.areaSqM?.toLocaleString()} m²
              </span>
              <span className="text-[10px] text-blue-600 block mt-0.5">({areaHectares} Ha / {areaAcres} Ac)</span>
            </div>
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Record Status</span>
              <span className="text-xs font-bold text-emerald-950 flex items-center gap-1 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Active
              </span>
              <span className="text-[10px] text-emerald-700 block mt-1">Mahabhulekh Sync</span>
            </div>
          </div>

          {/* Ownership snapshot */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Registered Owner</span>
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500" />
              <span>{parcel.primaryOwner || 'Ramesh Narayan Patil'}</span>
            </div>
          </div>

          {/* Quick Apply Service Links */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Apply for Single-Window Service
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                type="button"
                onClick={() => navigate(`/apply?parcelId=${parcel.id}&service=BUILDING_PERMISSION`)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">1. Building Permission</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate(`/apply?parcelId=${parcel.id}&service=LAND_USE_CHANGE`)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-slate-800">2. Land-Use Change</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => navigate(`/apply?parcelId=${parcel.id}&service=WATER_CONNECTION`)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-cyan-400 hover:bg-cyan-50/50 transition flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-cyan-600" />
                  <span className="font-semibold text-slate-800">3. Water Connection</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        <button
          type="button"
          onClick={() => navigate(`/parcel/${parcel.id}`)}
          className="w-full py-3 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Open Complete 360° Dossier</span>
        </button>
      </div>
    </div>
  );
}
