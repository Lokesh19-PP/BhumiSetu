import React from 'react';

export default function Logo({ size = 'default', showTagline = true, light = false }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  return (
    <div className="flex items-center gap-3">
      {/* SVG Bridge + Land Parcel Motif */}
      <div className={`relative flex items-center justify-center rounded-xl p-2 transition-transform duration-300 hover:scale-105 ${
        light ? 'bg-white/10 text-white' : 'bg-gradient-to-br from-[#0B2545] to-[#134074] text-white shadow-md shadow-navy-900/10'
      }`}>
        <svg
          className={`${isSmall ? 'w-6 h-6' : isLarge ? 'w-10 h-10' : 'w-8 h-8'}`}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base Land Grid / Cadastral Parcel Boundaries */}
          <path
            d="M8 34L24 42L40 34L24 26L8 34Z"
            fill="#138808"
            fillOpacity="0.25"
            stroke="#138808"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M24 26V42"
            stroke="#138808"
            strokeWidth="2"
            strokeDasharray="2 2"
          />
          {/* Connecting Bridge Arch (Setu) */}
          <path
            d="M10 28C10 18 16 12 24 12C32 12 38 18 38 28"
            stroke="#F59E0B"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Bridge Suspension Cables */}
          <path d="M16 19V30" stroke="#F59E0B" strokeWidth="1.8" strokeOpacity="0.8" />
          <path d="M24 12V26" stroke="#F59E0B" strokeWidth="2.2" />
          <path d="M32 19V30" stroke="#F59E0B" strokeWidth="1.8" strokeOpacity="0.8" />
          {/* Central Chakra / Sun Pin */}
          <circle cx="24" cy="8" r="3.5" fill="#F59E0B" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-extrabold tracking-tight font-sans ${
            light ? 'text-white' : 'text-[#0B2545]'
          } ${isSmall ? 'text-lg' : isLarge ? 'text-3xl' : 'text-2xl'}`}>
            Bhumi<span className="text-[#F59E0B]">setu</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            GIS
          </span>
        </div>
        {showTagline && (
          <span className={`text-[11px] font-medium tracking-wide ${
            light ? 'text-slate-300' : 'text-slate-500'
          }`}>
            One Parcel. One Window.
          </span>
        )}
      </div>
    </div>
  );
}
