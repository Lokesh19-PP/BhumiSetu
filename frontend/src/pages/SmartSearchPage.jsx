import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { documentApi } from '../services/api';
import {
  Search,
  FileText,
  Filter,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Building,
  User,
  ShieldCheck,
  X,
  FileCheck,
} from 'lucide-react';

export default function SmartSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [docType, setDocType] = useState('');
  const [village, setVillage] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleQueries = [
    '125/2',
    'Hinjewadi',
    'Ramesh Patil',
    'MH-PUN-HIN-001',
    'Sale Deed',
    'Building Sanction',
    'Baner',
  ];

  const handleSearch = async (overrideQuery = null) => {
    const activeQuery = overrideQuery !== null ? overrideQuery : query;
    setLoading(true);
    setHasSearched(true);
    try {
      const res = await documentApi.smartSearch({
        q: activeQuery,
        documentType: docType || undefined,
        village: village || undefined,
        verifiedOnly: verifiedOnly || undefined,
      });
      setResults(res.data || []);
    } catch (err) {
      console.error('Smart search failed', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(initialQuery);
  }, []);

  const handlePillClick = (pill) => {
    setQuery(pill);
    handleSearch(pill);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const highlightMatches = (text, term) => {
    if (!text) return '';
    if (!term || term.trim() === '') return text;

    const regex = new RegExp(`(${term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-200 text-amber-950 font-bold px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Search Hero Header */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="max-w-2xl space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Text & Cadastral Metadata Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Smart Document Search
            </h1>
            <p className="text-sm text-slate-200">
              Search across digitized property records, 7/12 Satbara extracts, owner names, survey numbers, and municipal building approvals.
            </p>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleFormSubmit} className="mt-6 relative z-10">
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by Survey No (125/2), ULPIN, Village, Owner Name, or Keywords..."
                  className="w-full pl-12 pr-10 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      handleSearch('');
                    }}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Records</span>
              </button>
            </div>
          </form>

          {/* Quick Query Sample Pills */}
          <div className="mt-4 flex items-center gap-2 flex-wrap text-xs relative z-10">
            <span className="text-slate-300 font-semibold">Try searching:</span>
            {sampleQueries.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => handlePillClick(pill)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs transition border border-white/10 cursor-pointer"
              >
                {pill}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-[#0B2545]" />
            <span>Refine Search Filters:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Document Type Filter */}
            <select
              value={docType}
              onChange={(e) => {
                setDocType(e.target.value);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Document Types</option>
              <option value="EXTRACT_7_12">7/12 Satbara Extract</option>
              <option value="SALE_DEED">Registered Sale Deed</option>
              <option value="BUILDING_PLAN">Sanctioned Building Plan</option>
              <option value="TAX_RECEIPT">Property Tax Receipt</option>
            </select>

            {/* Village Filter */}
            <select
              value={village}
              onChange={(e) => {
                setVillage(e.target.value);
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">All Villages (Pune)</option>
              <option value="Hinjewadi">Hinjewadi</option>
              <option value="Baner">Baner</option>
              <option value="Wakad">Wakad</option>
              <option value="Wagholi">Wagholi</option>
              <option value="Hadapsar">Hadapsar</option>
              <option value="Kharadi">Kharadi</option>
            </select>

            {/* Verified Only Checkbox */}
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => {
                  setVerifiedOnly(e.target.checked);
                }}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Only
              </span>
            </label>

            <button
              onClick={() => handleSearch()}
              className="px-3.5 py-1.5 rounded-xl bg-[#0B2545] text-white font-bold hover:bg-[#134074] transition"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Results Count & Status Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div>
            Showing <span className="font-bold text-slate-900">{results.length}</span> matching land documents
            {query && (
              <span>
                {' '}for query &ldquo;<span className="text-slate-800 font-bold">{query}</span>&rdquo;
              </span>
            )}
          </div>
          {results.length > 0 && (
            <div className="flex items-center gap-1 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Full-text OCR matched</span>
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-40 bg-slate-200 rounded"></div>
                  <div className="h-4 w-20 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                <div className="h-12 w-full bg-slate-100 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Search Results List */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* Header row: Doc Type, Badges, Target Parcel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {doc.documentTypeTitle}
                    </span>

                    {doc.verified ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Record
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        Pending Verification
                      </span>
                    )}

                    <span className="text-xs text-slate-400 font-mono">
                      #{doc.id}
                    </span>
                  </div>

                  {/* Parcel Link */}
                  {doc.parcelId && (
                    <Link
                      to={`/parcel/${doc.parcelId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B2545] hover:text-blue-700 transition"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>
                        Survey No. {doc.surveyNumber} ({doc.village})
                      </span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </Link>
                  )}
                </div>

                {/* Match Highlight Snippet */}
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-xs text-slate-700 font-mono leading-relaxed">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>OCR Extracted Text Snippet</span>
                  </div>
                  <div>{highlightMatches(doc.matchSnippet, query)}</div>
                </div>

                {/* Extracted Metadata Badges & File details */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 pt-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">ULPIN:</span>
                      <span className="font-mono">{highlightMatches(doc.ulpin, query)}</span>
                    </div>

                    {doc.extractedMetadata?.ownerNames?.length > 0 && (
                      <div className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">Holder:</span>
                        <span>{highlightMatches(doc.extractedMetadata.ownerNames[0], query)}</span>
                      </div>
                    )}

                    {doc.extractedMetadata?.areaSqM && (
                      <div className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">Area:</span>
                        <span>{doc.extractedMetadata.areaSqM.toLocaleString()} m²</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-[11px]">
                      File: {doc.fileName}
                    </span>
                    {doc.parcelId && (
                      <Link
                        to={`/parcel/${doc.parcelId}`}
                        className="px-3.5 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold transition shadow-xs flex items-center gap-1"
                      >
                        <span>Open Dossier</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && hasSearched && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                No matching land records found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                No property records matched &ldquo;{query}&rdquo;. Try searching for Pune survey numbers (e.g. 125/2, 45/1), village names (Hinjewadi, Baner), or clear active filters.
              </p>
            </div>
            <button
              onClick={() => {
                setQuery('');
                setDocType('');
                setVillage('');
                setVerifiedOnly(false);
                handleSearch('');
              }}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
