import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, Marker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { parcelApi } from '../services/api';
import { LAND_USE_COLORS } from '../components/map/MapLegend';
import {
  Building2,
  FileText,
  User,
  History,
  Compass,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Share2,
  Download,
  Eye,
  PlusCircle,
} from 'lucide-react';

function MiniMapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 16);
    }
  }, [center, map]);
  return null;
}

export default function ParcelDossierPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDocMeta, setSelectedDocMeta] = useState(null);

  useEffect(() => {
    setLoading(true);
    parcelApi.getDossier(id)
      .then((res) => {
        setDossier(res.data);
      })
      .catch((err) => {
        console.error('Failed to load parcel dossier', err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0B2545]"></div>
        <p className="text-xs font-semibold text-slate-500">Loading Parcel Cadastral Dossier #{id}...</p>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Parcel Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">Could not find land parcel record with ID #{id}.</p>
        <Link to="/map" className="px-4 py-2 rounded-xl bg-[#0B2545] text-white text-xs font-bold">
          Return to GIS Map
        </Link>
      </div>
    );
  }

  const colorMeta = LAND_USE_COLORS[dossier.landUse] || { stroke: '#0B2545', fill: '#3B82F6', label: dossier.landUse };
  const centroid = [dossier.centroidLat, dossier.centroidLon];
  const areaHectares = (dossier.areaSqM / 10000).toFixed(4);
  const areaAcres = (dossier.areaSqM / 4046.86).toFixed(2);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INFO_REQUESTED':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 font-sans">
      {/* 1. TOP HEADER BANNER */}
      <section className="bg-gradient-to-r from-[#0B2545] to-[#134074] text-white pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-white/10 text-amber-400 border border-white/10">
                Official Land Record Dossier
              </span>
              <span className="font-mono text-xs font-bold text-slate-300">
                ULPIN: {dossier.ulpin}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Survey No. {dossier.surveyNumber}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Village {dossier.village}, Taluka {dossier.taluka}, District {dossier.district}, Maharashtra</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/map"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Locate on GIS Map</span>
            </Link>

            <button
              type="button"
              onClick={() => navigate(`/apply?parcelId=${dossier.id}`)}
              className="px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4" />
              <span>Apply for Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. MAIN DOSSIER LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLS: TABS & DOSSIER CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs Nav */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1.5 flex items-center gap-1 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
                  activeTab === 'overview'
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('ownership')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
                  activeTab === 'ownership'
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Ownership ({dossier.ownershipRecords?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('documents')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
                  activeTab === 'documents'
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Documents ({dossier.documents?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('applications')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
                  activeTab === 'applications'
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Applications ({dossier.applications?.length || 0})</span>
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl transition ${
                  activeTab === 'history'
                    ? 'bg-[#0B2545] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History ({dossier.unifiedHistory?.length || 0})</span>
              </button>
            </div>

            {/* TAB CONTENT 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Land-Use</span>
                    <span
                      className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-md text-white"
                      style={{ backgroundColor: colorMeta.fill }}
                    >
                      {colorMeta.label}
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Plot Area</span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-1">
                      {dossier.areaSqM?.toLocaleString()} m²
                    </span>
                    <span className="text-[10px] text-slate-500">{areaHectares} Hectares</span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified Active
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ULPIN Assigned</span>
                    <span className="text-xs font-mono font-bold text-slate-800 block mt-1 truncate">
                      {dossier.ulpin}
                    </span>
                  </div>
                </div>

                {/* Cadastral Details Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Cadastral & Jurisdiction Record
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Survey / Gat Number:</span>
                      <span className="font-bold text-slate-900">{dossier.surveyNumber}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Revenue Village:</span>
                      <span className="font-bold text-slate-900">{dossier.village}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Taluka:</span>
                      <span className="font-bold text-slate-900">{dossier.taluka}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">District:</span>
                      <span className="font-bold text-slate-900">{dossier.district}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">GPS Centroid:</span>
                      <span className="font-mono text-slate-800 font-semibold">
                        {dossier.centroidLat?.toFixed(5)}° N, {dossier.centroidLon?.toFixed(5)}° E
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Spatial SRS:</span>
                      <span className="font-mono text-slate-800 font-semibold">EPSG:4326 (WGS 84)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: OWNERSHIP */}
            {activeTab === 'ownership' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Registered Title Holders</h3>
                    <p className="text-xs text-slate-500">Extracted from Revenue Form VII-XII Satbara</p>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Aadhaar Masked (Privacy Protected)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider font-bold">
                        <th className="py-2.5">Owner Name</th>
                        <th className="py-2.5">Share</th>
                        <th className="py-2.5">Type</th>
                        <th className="py-2.5">Aadhaar (Masked)</th>
                        <th className="py-2.5">Mutation No</th>
                        <th className="py-2.5">Acquisition</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {dossier.ownershipRecords?.map((owner) => (
                        <tr key={owner.id} className="hover:bg-slate-50">
                          <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-[10px]">
                              {owner.ownerName.charAt(0)}
                            </div>
                            <span>{owner.ownerName}</span>
                          </td>
                          <td className="py-3 font-semibold text-blue-700">{owner.ownershipShare}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                              {owner.ownershipType}
                            </span>
                          </td>
                          <td className="py-3 font-mono text-slate-500">{owner.aadhaarMasked || 'XXXX-XXXX-4819'}</td>
                          <td className="py-3 font-mono text-xs font-bold text-slate-800">
                            {owner.mutationNumber}
                          </td>
                          <td className="py-3 text-slate-500">
                            {owner.acquiredDate ? new Date(owner.acquiredDate).toLocaleDateString() : 'Historical'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: DOCUMENTS & OCR */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Digitized Property Deeds & NOCs</h3>
                      <p className="text-xs text-slate-500">AI Tesseract extracted metadata and verified deeds</p>
                    </div>
                    <Link
                      to="/search"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                      <span>Upload & OCR Digitization</span>
                    </Link>
                  </div>

                  {dossier.documents?.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400">
                      No documents uploaded yet for this parcel.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {dossier.documents?.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                                <span>{doc.fileName}</span>
                                {doc.verified ? (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                    Pending Review
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {doc.documentTypeTitle} • {doc.fileSizeBytes ? `${(doc.fileSizeBytes / 1024).toFixed(0)} KB` : 'PDF'} • Uploaded by {doc.uploadedByName || 'Citizen'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {doc.extractedMetadata && (
                              <button
                                onClick={() => setSelectedDocMeta(selectedDocMeta === doc.id ? null : doc.id)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1 transition"
                              >
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                <span>AI Metadata</span>
                              </button>
                            )}
                          </div>

                          {/* Expanded AI Metadata Inspector */}
                          {selectedDocMeta === doc.id && doc.extractedMetadata && (
                            <div className="w-full mt-3 p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto border border-slate-800">
                              <div className="flex justify-between items-center text-slate-400 pb-1 mb-2 border-b border-slate-800 text-[10px] font-bold">
                                <span>EXTRACTED OCR METADATA (CONFIDENCE 96%)</span>
                                <button onClick={() => setSelectedDocMeta(null)} className="text-white hover:text-red-400">✕</button>
                              </div>
                              <pre className="whitespace-pre-wrap">{doc.extractedMetadata}</pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Service Applications</h3>
                    <p className="text-xs text-slate-500">Applications routed through Single-Window</p>
                  </div>
                  <button
                    onClick={() => navigate(`/apply?parcelId=${dossier.id}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#0B2545] text-white text-xs font-bold hover:bg-[#134074] transition"
                  >
                    + New Application
                  </button>
                </div>

                {dossier.applications?.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No active or past applications for this parcel.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dossier.applications?.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {app.applicationNumber}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="text-xs font-bold text-blue-900">{app.serviceDisplayName}</div>
                          <div className="text-[11px] text-slate-400">
                            Dept: {app.departmentName} • Officer: {app.assignedOfficerName}
                          </div>
                        </div>

                        <Link
                          to={`/track/${app.applicationNumber}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition flex items-center gap-1"
                        >
                          <span>Track Workflow</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 5: UNIFIED HISTORY */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-900">Unified Parcel Audit History</h3>
                  <p className="text-xs text-slate-500">Immutable chronological timeline of all municipal actions</p>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {dossier.unifiedHistory?.map((h, i) => (
                    <div key={h.id || i} className="relative">
                      {/* Circle dot on timeline */}
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#0B2545] border-2 border-white shadow-xs"></div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{h.action}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(h.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1">
                          {h.comment}
                        </p>
                        <div className="text-[10px] text-slate-400 pt-0.5">
                          Acted by: <span className="font-semibold text-slate-700">{h.actedByName}</span> ({h.actedByRole})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 1 COL: MINI MAP & QUICK ACTIONS */}
          <div className="space-y-6">
            {/* Mini Map Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between text-xs font-bold text-slate-800">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#0B2545]" />
                  <span>Cadastral Boundary</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">WGS84</span>
              </div>

              <div className="h-56 w-full relative">
                <MapContainer
                  center={centroid}
                  zoom={16}
                  scrollWheelZoom={false}
                  zoomControl={false}
                  className="w-full h-full z-0"
                >
                  <MiniMapController center={centroid} />
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution="&copy; CartoDB"
                  />
                  {dossier.boundaryCoordinates && (
                    <Polygon
                      positions={dossier.boundaryCoordinates}
                      pathOptions={{
                        color: colorMeta.stroke,
                        fillColor: colorMeta.fill,
                        fillOpacity: 0.5,
                        weight: 3,
                      }}
                    >
                      <Tooltip permanent direction="center" className="parcel-map-tooltip">
                        Survey {dossier.surveyNumber}
                      </Tooltip>
                    </Polygon>
                  )}
                </MapContainer>
              </div>

              <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-xs flex justify-between items-center">
                <span className="text-[11px] text-slate-500 font-medium">Coordinate Bounds: 4 vertices</span>
                <Link
                  to="/map"
                  className="font-bold text-[#0B2545] hover:text-amber-600 flex items-center gap-1 text-[11px]"
                >
                  Full Map <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="bg-gradient-to-br from-[#0B2545] to-[#134074] rounded-2xl p-5 text-white space-y-4 shadow-md">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Single-Window Action</span>
                <h4 className="text-base font-bold text-white mt-1">Ready to apply for this parcel?</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Submit an application for building permission, land-use conversion, or water connection in 3 simple steps.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(`/apply?parcelId=${dossier.id}`)}
                className="w-full py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Launch Application Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
