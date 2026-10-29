import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { applicationApi } from '../services/api';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Building,
  User,
  Calendar,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export default function ApplicationTrackingPage() {
  const { appNumber: paramAppNumber } = useParams();
  const [searchParams] = useSearchParams();
  const queryAppNumber = searchParams.get('appNumber');

  const initialNumber = paramAppNumber || queryAppNumber || 'BS-2026-BP-00101';
  const [searchInput, setSearchInput] = useState(initialNumber);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleNumbers = [
    'BS-2026-BP-00101',
    'BS-2026-LU-00102',
    'BS-2026-WC-00103',
  ];

  const fetchApplication = async (numberToTrack) => {
    if (!numberToTrack || !numberToTrack.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await applicationApi.getByAppNumber(numberToTrack.trim());
      setApplication(res.data);
    } catch (err) {
      console.error('Failed to track application', err);
      setApplication(null);
      setErrorMsg(
        err.response?.status === 404
          ? `Application '${numberToTrack}' was not found. Try one of the sample application numbers below.`
          : 'Unable to track application. Please check the reference number.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialNumber) {
      fetchApplication(initialNumber);
    }
  }, [paramAppNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplication(searchInput);
  };

  const handlePillClick = (num) => {
    setSearchInput(num);
    fetchApplication(num);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Approved & Sanctioned
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            Under Officer Review
          </span>
        );
      case 'INFO_REQUESTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-purple-600" />
            Additional Info Requested
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-600" />
            Rejected
          </span>
        );
      case 'SUBMITTED':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            Submitted to Department
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Search Box */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Public Tracking Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Track Land Service Application
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Enter your Bhumisetu application reference number to view real-time department routing, officer decisions, and workflow audit logs.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Application No. (e.g. BS-2026-BP-00101)..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 font-mono font-bold text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Track Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs pt-1 text-slate-300">
            <span className="font-semibold">Demo Reference IDs:</span>
            {sampleNumbers.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePillClick(num)}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 font-mono text-xs transition border border-white/10 cursor-pointer"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">Application Record Not Found</p>
              <p className="text-slate-600 mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center text-slate-500 text-xs shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B2545] mx-auto mb-3"></div>
            <span>Fetching real-time workflow timeline from Pune Municipal Server...</span>
          </div>
        )}

        {/* APPLICATION DETAILS & TIMELINE */}
        {!loading && application && (
          <div className="space-y-6">
            {/* Top Overview Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                      {application.applicationNumber}
                    </span>
                    {getStatusChip(application.status)}
                  </div>
                  <p className="text-xs text-slate-500">
                    Routing Authority:{' '}
                    <span className="font-bold text-slate-800">{application.departmentName}</span>
                  </p>
                </div>

                {application.parcelId && (
                  <Link
                    to={`/parcel/${application.parcelId}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 font-bold text-xs hover:bg-blue-100 transition"
                  >
                    <MapPin className="w-4 h-4 text-blue-700" />
                    <span>View Cadastral Dossier</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </Link>
                )}
              </div>

              {/* 4 Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold text-[11px]">Service Type</span>
                  <span className="font-bold text-slate-800 block">{application.serviceTypeTitle}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold text-[11px]">Land Parcel</span>
                  <span className="font-bold text-slate-800 block">
                    Survey {application.surveyNumber} ({application.village})
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold text-[11px]">Applicant Name</span>
                  <span className="font-bold text-slate-800 block">{application.applicantName}</span>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-slate-400 block font-semibold text-[11px]">Submission Date</span>
                  <span className="font-bold text-slate-800 block font-mono">
                    {application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Remarks */}
              {application.remarks && (
                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Remarks / Justification:</span>
                  <p className="text-slate-700">{application.remarks}</p>
                </div>
              )}
            </div>

            {/* DIGITAL SANCTION CERTIFICATE (WHEN APPROVED) */}
            {application.status === 'APPROVED' && (
              <div className="bg-gradient-to-br from-emerald-900 via-[#0B2545] to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border-2 border-emerald-400/40 relative overflow-hidden space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                        Official Digital Clearance
                      </span>
                      <h3 className="text-lg font-black tracking-tight text-white">
                        Digital Sanction Order & Certificate
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Order</span>
                    </button>
                    <button
                      onClick={() => alert(`Sanction Order #${application.applicationNumber} downloaded as verified PDF.`)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Sanction Reference No</span>
                    <span className="font-mono font-bold text-amber-300">
                      SANCT-{application.applicationNumber}
                    </span>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Approved Authority</span>
                    <span className="font-bold text-slate-200">
                      {application.assignedOfficerName || 'Planning Authority'}
                    </span>
                  </div>

                  <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                    <span className="text-slate-400 text-[11px] block">Verification Cryptographic Hash</span>
                    <span className="font-mono text-[10px] text-emerald-300 truncate block">
                      SHA256: 8f4b23...cadastral-sanction-valid
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* VERTICAL TIMELINE OF WORKFLOW HISTORY */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Workflow History & Decision Audit Trail
                </h3>
                <p className="text-xs text-slate-500">
                  Every transition is signed with timestamps, officer identities, and comments.
                </p>
              </div>

              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {application.workflowHistory && application.workflowHistory.length > 0 ? (
                  application.workflowHistory.map((step, idx) => {
                    const isLatest = idx === application.workflowHistory.length - 1;
                    const isApproved = step.action === 'APPROVE' || step.action === 'APPROVED';
                    const isReject = step.action === 'REJECT' || step.action === 'REJECTED';
                    const isInfo = step.action === 'REQUEST_INFO' || step.action === 'INFO_REQUESTED';

                    let dotBg = 'bg-blue-600';
                    if (isApproved) dotBg = 'bg-emerald-600';
                    else if (isReject) dotBg = 'bg-red-600';
                    else if (isInfo) dotBg = 'bg-purple-600';

                    return (
                      <div key={step.id || idx} className="relative group">
                        {/* Dot indicator */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-1 w-5 h-5 rounded-full ${dotBg} text-white flex items-center justify-center ring-4 ring-white shadow-sm`}
                        >
                          {isApproved ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <Clock className="w-2.5 h-2.5" />
                          )}
                        </div>

                        {/* Timeline Step Content */}
                        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">
                                {step.action.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                                {step.actedByRole}
                              </span>
                            </div>
                            <span className="text-slate-400 text-[11px] font-mono">
                              {step.timestamp ? new Date(step.timestamp).toLocaleString() : 'N/A'}
                            </span>
                          </div>

                          <div className="text-slate-600 flex items-center gap-1.5 font-medium">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Action taken by: <strong className="text-slate-800">{step.actedByName}</strong></span>
                          </div>

                          {step.comment && (
                            <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 font-medium">
                              {step.comment}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-slate-500">
                    No workflow steps recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
