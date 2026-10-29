import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationApi } from '../services/api';
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  MapPin,
  ExternalLink,
  Search,
  User,
  Calendar,
  Layers,
  ArrowRight,
  Filter,
  Eye,
  Check,
  Send,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function OfficerDashboardPage() {
  const { user, isOfficer, isAdmin, isCitizen } = useAuth();
  const navigate = useNavigate();

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Application for Review
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [decisionAction, setDecisionAction] = useState('APPROVE');
  const [decisionComment, setDecisionComment] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const statusParam = statusFilter === 'ALL' ? undefined : statusFilter;
      const res = await applicationApi.getOfficerQueue(statusParam);
      setQueue(res.data || []);
    } catch (err) {
      console.error('Failed to load officer queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOfficer || isAdmin) {
      fetchQueue();
    }
  }, [statusFilter, user?.role]);

  // If citizen, show restricted message
  if (isCitizen) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          Officer Portal Restricted
        </h2>
        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          You are currently signed in as a <span className="font-bold text-slate-800">Citizen</span>.
          In Bhumisetu&apos;s role-based security model, citizens are strictly prohibited from reviewing or approving land applications.
          Use the <strong>Demo Switcher</strong> on the top right to switch to a Planning or Revenue Officer.
        </p>
        <Link
          to="/dashboard"
          className="px-5 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold transition shadow-md"
        >
          Return to Citizen Dashboard
        </Link>
      </div>
    );
  }

  const getOfficerDepartmentTitle = () => {
    switch (user?.role) {
      case 'PLANNING_OFFICER':
        return {
          title: 'Town Planning & Municipal Sanctions Desk',
          subtitle: 'Reviewing Building Permissions & FSI Clearances',
          badge: 'Planning Officer',
          icon: <Building className="w-5 h-5 text-blue-500" />,
        };
      case 'REVENUE_OFFICER':
        return {
          title: 'Revenue & Land Records Office (Collectorate)',
          subtitle: 'Reviewing Land-Use Changes (NA Conversion) & 7/12 Records',
          badge: 'Revenue Officer (Tahsildar)',
          icon: <FileText className="w-5 h-5 text-amber-500" />,
        };
      case 'UTILITY_OFFICER':
        return {
          title: 'Water Supply & Public Utilities Authority',
          subtitle: 'Sanctioning Municipal Pipeline & Sewerage Clearances',
          badge: 'Utility Officer',
          icon: <ShieldCheck className="w-5 h-5 text-cyan-500" />,
        };
      case 'ADMIN':
      default:
        return {
          title: 'Integrated Single-Window Master Queue',
          subtitle: 'Administrative Oversight Across All Pune Municipal Sectors',
          badge: 'System Administrator',
          icon: <Sparkles className="w-5 h-5 text-purple-500" />,
        };
    }
  };

  const deptMeta = getOfficerDepartmentTitle();

  const filteredQueue = queue.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.applicationNumber?.toLowerCase().includes(q) ||
      app.surveyNumber?.toLowerCase().includes(q) ||
      app.applicantName?.toLowerCase().includes(q) ||
      app.village?.toLowerCase().includes(q)
    );
  });

  const openReviewModal = (app) => {
    setSelectedApp(app);
    setDecisionAction('APPROVE');
    setDecisionComment('Application verified against cadastral geometry and municipal bye-laws. Granted approval.');
    setActionSuccessMsg('');
    setReviewModalOpen(true);
  };

  const handleDecisionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setIsSubmittingDecision(true);
    try {
      await applicationApi.takeDecision(selectedApp.id, {
        action: decisionAction,
        comment: decisionComment,
      });

      setActionSuccessMsg(`Application ${selectedApp.applicationNumber} updated to ${decisionAction}!`);
      setTimeout(() => {
        setReviewModalOpen(false);
        fetchQueue();
      }, 1200);
    } catch (err) {
      console.error('Decision error', err);
      alert(err.response?.data?.message || 'Failed to submit decision.');
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const setQuickComment = (text, action) => {
    setDecisionAction(action);
    setDecisionComment(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Officer Banner Header */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              {deptMeta.icon}
              <span>{deptMeta.badge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {deptMeta.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              {deptMeta.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 text-xs">
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 text-right">
              <span className="text-slate-300 block">Logged Officer:</span>
              <span className="font-bold text-white text-sm">{user?.fullName}</span>
              <span className="text-[10px] text-amber-300 block font-mono">Role: {user?.role}</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'INFO_REQUESTED', 'APPROVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition capitalize whitespace-nowrap cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.toLowerCase().replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search queue by App#, Survey#, or Name..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
            />
          </div>
        </div>

        {/* Queue Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Department Pending Queue</h2>
              <p className="text-xs text-slate-500">
                Applications awaiting official scrutiny, field verification, or final sanction order.
              </p>
            </div>
            <button
              onClick={fetchQueue}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
              title="Refresh queue"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 mx-auto animate-spin mb-2" />
              <span>Fetching departmental review records...</span>
            </div>
          ) : filteredQueue.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">Review Queue Clear</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No applications currently match the &ldquo;{statusFilter}&rdquo; filter for your department.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-6">App Number</th>
                    <th className="py-3 px-6">Service Type</th>
                    <th className="py-3 px-6">Land Parcel</th>
                    <th className="py-3 px-6">Applicant</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6">Submitted</th>
                    <th className="py-3 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredQueue.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-slate-900">
                        {app.applicationNumber}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {app.serviceTypeTitle}
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/parcel/${app.parcelId}`}
                          target="_blank"
                          className="font-semibold text-blue-900 hover:underline flex items-center gap-1"
                        >
                          <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>Survey {app.surveyNumber} ({app.village})</span>
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-400">{app.applicantPhone || app.applicantEmail}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            app.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : app.status === 'UNDER_REVIEW'
                              ? 'bg-amber-100 text-amber-800'
                              : app.status === 'INFO_REQUESTED'
                              ? 'bg-purple-100 text-purple-800'
                              : app.status === 'REJECTED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-mono text-[11px]">
                        {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => openReviewModal(app)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs transition shadow-xs cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL: COMPREHENSIVE OFFICER REVIEW & DECISION SCREEN */}
        {reviewModalOpen && selectedApp && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
              {/* Modal Header */}
              <div className="bg-[#0B2545] text-white p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                      {selectedApp.applicationNumber}
                    </span>
                    <span className="text-xs text-slate-300">
                      Targeting Survey {selectedApp.surveyNumber} ({selectedApp.village})
                    </span>
                  </div>
                  <h3 className="text-lg font-black mt-1">
                    {selectedApp.serviceTypeTitle} — Scrutiny & Sanction
                  </h3>
                </div>

                <button
                  onClick={() => setReviewModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {actionSuccessMsg ? (
                <div className="p-12 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-black text-slate-900">{actionSuccessMsg}</h4>
                  <p className="text-xs text-slate-500">Updating departmental records...</p>
                </div>
              ) : (
                <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
                  {/* Cadastral & Applicant Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                        Applicant Dossier
                      </span>
                      <p className="text-sm font-bold text-slate-900">{selectedApp.applicantName}</p>
                      <p className="text-slate-600">{selectedApp.applicantEmail}</p>
                      <p className="text-slate-600">{selectedApp.applicantPhone}</p>
                    </div>

                    <div className="space-y-1.5">
                      <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                        Target Land Parcel
                      </span>
                      <p className="text-sm font-bold text-slate-900">
                        Survey No. {selectedApp.surveyNumber} • {selectedApp.village}
                      </p>
                      <p className="text-slate-600 font-mono">ULPIN: {selectedApp.ulpin}</p>
                      <p className="text-slate-600">Current Use: {selectedApp.currentLandUse || 'Residential'}</p>
                    </div>
                  </div>

                  {/* Service Specific Parameters Inspection */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Submitted Technical Specifications
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {selectedApp.builtUpAreaSqM && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px]">Proposed Built-Up Area</span>
                          <span className="font-bold text-slate-800 text-sm">
                            {selectedApp.builtUpAreaSqM} m²
                          </span>
                        </div>
                      )}
                      {selectedApp.buildingHeightM && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px]">Building Height</span>
                          <span className="font-bold text-slate-800 text-sm">
                            {selectedApp.buildingHeightM} m
                          </span>
                        </div>
                      )}
                      {selectedApp.proposedLandUse && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px]">Proposed Land Use</span>
                          <span className="font-bold text-slate-800 text-sm">
                            {selectedApp.proposedLandUse}
                          </span>
                        </div>
                      )}
                      {selectedApp.waterConnectionType && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-slate-400 block text-[11px]">Connection Type</span>
                          <span className="font-bold text-slate-800 text-sm">
                            {selectedApp.waterConnectionType}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Applicant Remarks */}
                  {selectedApp.remarks && (
                    <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-blue-950">Applicant Remarks:</span>
                      <p className="text-slate-700">{selectedApp.remarks}</p>
                    </div>
                  )}

                  {/* Attached Documents */}
                  {selectedApp.documents && selectedApp.documents.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Attached Cadastral Documents ({selectedApp.documents.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {selectedApp.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                                {doc.fileName}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                              Verified
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OFFICER DECISION FORM */}
                  <form onSubmit={handleDecisionSubmit} className="space-y-4 pt-4 border-t border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0B2545]" />
                      <span>Officer Scrutiny Determination</span>
                    </h4>

                    {/* 4 Action Decision Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setQuickComment('Sanction granted in compliance with PMRDA development regulations.', 'APPROVE')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                          decisionAction === 'APPROVE'
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                            : 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>APPROVE</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickComment('Application marked under active departmental site inspection.', 'START_REVIEW')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                          decisionAction === 'START_REVIEW'
                            ? 'bg-amber-500 text-white border-amber-500 shadow-md'
                            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        <Clock className="w-4 h-4" />
                        <span>UNDER REVIEW</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickComment('Please upload updated structural stability certificate and fire NOC.', 'REQUEST_INFO')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                          decisionAction === 'REQUEST_INFO'
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                            : 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>REQUEST INFO</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setQuickComment('Proposal exceeds permissible FSI for specified cadastral zone.', 'REJECT')}
                        className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                          decisionAction === 'REJECT'
                            ? 'bg-red-600 text-white border-red-600 shadow-md'
                            : 'bg-red-50 text-red-900 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <XCircle className="w-4 h-4" />
                        <span>REJECT</span>
                      </button>
                    </div>

                    {/* Officer Comment text */}
                    <div className="space-y-1 text-xs">
                      <label className="font-bold text-slate-700 block">
                        Official Decision Reasoning / Remarks (Mandatory):
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={decisionComment}
                        onChange={(e) => setDecisionComment(e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                        placeholder="State technical justification, bye-law references, or specific clarifications needed..."
                      />
                    </div>

                    {/* Submit Action */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setReviewModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmittingDecision}
                        className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isSubmittingDecision ? 'Submitting...' : 'Sign & Submit Decision'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
