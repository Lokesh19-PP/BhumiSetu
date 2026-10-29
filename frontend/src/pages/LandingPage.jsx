import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { parcelApi } from '../services/api';
import {
  Search,
  MapPin,
  Building2,
  Trees,
  Droplets,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCheck2,
  Clock,
  Compass,
  CheckCircle2,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [featuredParcels, setFeaturedParcels] = useState([]);

  useEffect(() => {
    parcelApi.getAll()
      .then((res) => {
        setFeaturedParcels(res.data.slice(0, 6));
      })
      .catch((err) => console.error('Failed to load featured parcels', err));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await parcelApi.getAll(searchQuery);
      setSearchResults(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectParcel = (parcelId) => {
    navigate(`/parcel/${parcelId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0B2545] via-[#102A43] to-[#134074] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F59E0B_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-amber-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Enabled • GIS Cadastral Land Information System</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            One Land Parcel.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400">
              One Unified Window.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Eliminate department silos and physical queues. Bhumisetu anchors all land records, ownership deeds, and municipal service applications directly to official cadastral GIS parcels.
          </p>

          {/* SEARCH PARCEL BOX */}
          <div className="max-w-3xl mx-auto pt-2">
            <form onSubmit={handleSearch} className="relative shadow-2xl rounded-2xl bg-white p-2 text-slate-800">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-3 flex-1 px-4 py-2 w-full">
                  <Search className="w-5 h-5 text-amber-500 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Survey No (e.g. 125/2), ULPIN (MH-PUN-...), or Village..."
                    className="w-full text-sm font-medium focus:outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-semibold text-sm transition flex items-center justify-center gap-2 shrink-0 shadow-md"
                >
                  {isSearching ? 'Searching...' : 'Search Parcel'}
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>

              {/* Instant Search Suggestions Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-3 bg-white rounded-xl shadow-2xl border border-slate-200 divide-y divide-slate-100 max-h-72 overflow-y-auto z-40 text-left">
                  <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                    Found {searchResults.length} Matching Pune Parcels
                  </div>
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectParcel(p.id)}
                      className="w-full px-4 py-3 hover:bg-amber-50/60 flex items-center justify-between text-xs transition"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>Survey {p.surveyNumber}</span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {p.ulpin}
                          </span>
                        </div>
                        <div className="text-slate-500">
                          {p.village}, {p.taluka}, {p.district} • {p.areaSqM?.toLocaleString()} sq.m
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800">
                          {p.landUse}
                        </span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Quick demo search chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs text-slate-300">
              <span className="font-semibold text-slate-400">Quick Searches:</span>
              <button
                type="button"
                onClick={() => { setSearchQuery('125/2'); parcelApi.getAll('125/2').then(res => setSearchResults(res.data)); }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-amber-300 font-medium"
              >
                Hinjewadi 125/2
              </button>
              <button
                type="button"
                onClick={() => { setSearchQuery('84/1A'); parcelApi.getAll('84/1A').then(res => setSearchResults(res.data)); }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-amber-300 font-medium"
              >
                Baner 84/1A
              </button>
              <button
                type="button"
                onClick={() => { setSearchQuery('204/1'); parcelApi.getAll('204/1').then(res => setSearchResults(res.data)); }}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer text-amber-300 font-medium"
              >
                Wagholi 204/1
              </button>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Interactive GIS Map</span>
            </Link>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>AI Document Digitizer</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. STATS COUNTER STRIP */}
      <section className="bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-extrabold text-[#0B2545]">25+</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Pune GIS Parcels Seeded</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-[#F59E0B]">3</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Municipal Departments</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-emerald-600">100%</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Single-Window Transparency</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-blue-600">PostGIS</div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Spatial Cadastral Precision</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THREE CORE SERVICES */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">Integrated Services</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Apply Once. Automated Department Routing.
          </h3>
          <p className="text-sm text-slate-600 mt-3">
            Citizens select their verified land parcel and submit one application. Bhumisetu automatically routes files to the designated authority with zero physical paperwork.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Service 1: Building Permission */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2545] flex items-center justify-center mb-6 group-hover:bg-[#0B2545] group-hover:text-white transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-1">
              Town Planning Authority
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Building Permission
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Sanction for residential, commercial, or mixed-use construction. Auto-checks zoning bylaws, FSI coefficients, and setback compliance against PostGIS boundaries.
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Authority: Planning Officer</span>
              <Link to="/map" className="font-bold text-[#0B2545] hover:text-amber-600 flex items-center gap-1">
                Apply on Map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 2: Land-Use Change */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-6 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Layers className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1">
              Revenue & Land Records
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Land-Use Change (NA Conversion)
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Conversion of agricultural land to residential, commercial, or industrial classification. Direct validation of 7/12 extract and mutation records.
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Authority: Revenue Officer</span>
              <Link to="/map" className="font-bold text-amber-700 hover:text-slate-900 flex items-center gap-1">
                Apply on Map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Service 3: Water Connection */}
          <div className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-6 group-hover:bg-cyan-700 group-hover:text-white transition-colors">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-cyan-700 mb-1">
              Public Utilities Department
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">
              Water Connection
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Direct municipal water supply line and sewerage connection. Automated pipeline distance calculation and PMC tax payment verification.
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-500">Authority: Utility Officer</span>
              <Link to="/map" className="font-bold text-cyan-700 hover:text-slate-900 flex items-center gap-1">
                Apply on Map <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS 5-STEP STRIP */}
      <section className="bg-slate-100 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-emerald-700 uppercase tracking-widest mb-2">Workflow Simplicity</h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              5 Steps from Parcel Click to Service Approval
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
              <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-xs font-extrabold mb-3">
                1
              </div>
              <h5 className="font-bold text-sm text-slate-900 mb-1">Search Parcel</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Locate parcel via interactive GIS map, survey number, or 14-char ULPIN.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
              <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-xs font-extrabold mb-3">
                2
              </div>
              <h5 className="font-bold text-sm text-slate-900 mb-1">View Dossier</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Inspect 360° dossier: registered owners, 7/12 extract, active encumbrances.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-extrabold mb-3">
                3
              </div>
              <h5 className="font-bold text-sm text-slate-900 mb-1">AI OCR Verify</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tesseract AI extracts deed metadata with confidence scoring for instant review.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
              <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-xs font-extrabold mb-3">
                4
              </div>
              <h5 className="font-bold text-sm text-slate-900 mb-1">Auto-Routing</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Application is safely assigned to the designated department officer's queue.
              </p>
            </div>

            {/* Step 5 */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold mb-3">
                5
              </div>
              <h5 className="font-bold text-sm text-slate-900 mb-1">Decision & Sanction</h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Citizen tracks real-time audit timeline and receives digital sanction certificate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEEDED PUNE PARCELS PREVIEW GRID */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-2">Live Demonstration Zone</h2>
            <h3 className="text-2xl font-extrabold text-slate-900">
              Sample Seeded Parcels around Pune
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Click any parcel to inspect its complete 360° Dossier or test the application wizard.
            </p>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2545] hover:text-amber-600 transition"
          >
            <span>View all 25 parcels on Map</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredParcels.map((parcel) => (
            <div
              key={parcel.id}
              className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {parcel.ulpin}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    parcel.landUse === 'COMMERCIAL'
                      ? 'bg-amber-100 text-amber-800'
                      : parcel.landUse === 'RESIDENTIAL'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {parcel.landUse}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition">
                  Survey No. {parcel.surveyNumber}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Village {parcel.village}, Taluka {parcel.taluka}, {parcel.district}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Area</span>
                    <span className="font-semibold text-slate-800">{parcel.areaSqM?.toLocaleString()} m²</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Primary Owner</span>
                    <span className="font-semibold text-slate-800 truncate block">{parcel.primaryOwner}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {parcel.documentCount} Verified Docs
                </span>
                <Link
                  to={`/parcel/${parcel.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#0B2545] hover:text-amber-600 transition"
                >
                  <span>Open Dossier</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
