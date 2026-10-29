import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationApi } from '../services/api';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  MapPin,
  ExternalLink,
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Droplets,
  RefreshCw,
} from 'lucide-react';

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await applicationApi.getMyApplications();
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const totalCount = applications.length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;
  const inReviewCount = applications.filter((a) => a.status === 'UNDER_REVIEW' || a.status === 'SUBMITTED').length;
  const infoRequestedCount = applications.filter((a) => a.status === 'INFO_REQUESTED').length;

  const filteredApps = applications.filter((app) => {
    if (filterStatus === 'ALL') return true;
    return app.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under Review
          </span>
        );
      case 'INFO_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            Info Requested
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      case 'SUBMITTED':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Submitted
          </span>
        );
    }
  };

  const getServiceIcon = (serviceType) => {
    switch (serviceType) {
      case 'BUILDING_PERMISSION':
        return <Building className="w-4 h-4 text-blue-600" />;
      case 'WATER_CONNECTION':
        return <Droplets className="w-4 h-4 text-cyan-600" />;
      case 'LAND_USE_CHANGE':
      default:
        return <FileText className="w-4 h-4 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Citizen Portal & Single Window</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Citizen'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Manage all your land parcels, track pending municipal applications, and initiate new clearance workflows from one integrated window.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <Link
              to="/apply"
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Apply for Service</span>
            </Link>

            <Link
              to="/map"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition border border-white/20 flex items-center gap-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Explore GIS Map</span>
            </Link>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Applications</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalCount}</div>
            <p className="text-[11px] text-slate-400">All services requested</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
              <span>In Processing</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{inReviewCount}</div>
            <p className="text-[11px] text-slate-400">Under officer review</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span>Sanctioned / Approved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{approvedCount}</div>
            <p className="text-[11px] text-slate-400">Ready for certificate download</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-purple-700 text-xs font-semibold">
              <span>Action Required</span>
              <AlertCircle className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600">{infoRequestedCount}</div>
            <p className="text-[11px] text-slate-400">Additional info requested</p>
          </div>
        </div>

        {/* Quick Citizen Action Strip */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Have a physical 7/12 Satbara extract or Sale Deed?</p>
              <p className="text-slate-600">Use our AI OCR scanner to extract survey parameters and link directly to your dossier.</p>
            </div>
          </div>
          <Link
            to="/digitize"
            className="px-4 py-2 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold transition shadow-xs shrink-0"
          >
            Digitize Document →
          </Link>
        </div>

        {/* Applications List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">My Service Applications</h2>
              <p className="text-xs text-slate-500">
                Track status, view officer remarks, and download digital sanctions.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'INFO_REQUESTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-lg transition capitalize cursor-pointer ${
                    filterStatus === st
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st.toLowerCase().replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />
              <span>Loading applications...</span>
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No applications found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven&apos;t submitted any applications under this filter. Select a land parcel and apply for building permission, land-use conversion, or water connection.
              </p>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Start Application Wizard</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-6">App Number</th>
                    <th className="py-3 px-6">Service Type</th>
                    <th className="py-3 px-6">Land Parcel</th>
                    <th className="py-3 px-6">Routed Dept</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Date</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredApps.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {app.applicationNumber}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 font-semibold">
                          {getServiceIcon(app.serviceType)}
                          <span>{app.serviceTypeTitle}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {app.parcelId ? (
                          <Link
                            to={`/parcel/${app.parcelId}`}
                            className="font-semibold text-blue-900 hover:underline flex items-center gap-1"
                          >
                            <span>Survey {app.surveyNumber}</span>
                            <span className="text-slate-400">({app.village})</span>
                          </Link>
                        ) : (
                          <span>Survey {app.surveyNumber}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {app.departmentName}
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
                      <td className="py-4 px-6 text-slate-500">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/track/${app.applicationNumber}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#134074] text-white font-bold transition shadow-xs text-xs"
                        >
                          <span>Track</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
