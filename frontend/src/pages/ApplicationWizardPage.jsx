import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { parcelApi, applicationApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Building,
  FileText,
  Droplets,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export default function ApplicationWizardPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialParcelId = searchParams.get('parcelId');
  const initialService = searchParams.get('service');
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [parcels, setParcels] = useState([]);
  const [loadingParcels, setLoadingParcels] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [createdApplication, setCreatedApplication] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [selectedService, setSelectedService] = useState(initialService || 'BUILDING_PERMISSION');
  const [selectedParcelId, setSelectedParcelId] = useState(initialParcelId || '');
  const [formData, setFormData] = useState({
    remarks: 'Application submitted for sanction in compliance with municipal norms.',
    proposedLandUse: 'COMMERCIAL',
    buildingHeightM: 15.0,
    builtUpAreaSqM: 1200.0,
    waterConnectionType: 'DOMESTIC',
    declared: true,
  });

  useEffect(() => {
    async function loadParcels() {
      try {
        const res = await parcelApi.getAll();
        const list = res.data || [];
        setParcels(list);
        if (!selectedParcelId && list.length > 0) {
          setSelectedParcelId(list[0].id);
        }
      } catch (err) {
        console.error('Failed to load parcels for wizard', err);
      } finally {
        setLoadingParcels(false);
      }
    }
    loadParcels();
  }, []);

  const selectedParcel = parcels.find((p) => String(p.id) === String(selectedParcelId));

  const getDepartmentDetails = () => {
    switch (selectedService) {
      case 'BUILDING_PERMISSION':
        return { name: 'Town Planning & Municipal Sanctions', officer: 'Planning Officer', color: 'blue' };
      case 'LAND_USE_CHANGE':
        return { name: 'Revenue & Land Records (Collectorate)', officer: 'Revenue Officer (Tahsildar)', color: 'amber' };
      case 'WATER_CONNECTION':
        return { name: 'Water Supply & Public Utilities', officer: 'Utility Officer', color: 'cyan' };
      default:
        return { name: 'Municipal Authority', officer: 'Competent Authority', color: 'slate' };
    }
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1 && !selectedParcelId) {
      setErrorMsg('Please select a land parcel to proceed.');
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.declared) {
      setErrorMsg('Please accept the legal declaration before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        parcelId: Number(selectedParcelId),
        serviceType: selectedService,
        remarks: formData.remarks,
        proposedLandUse: selectedService === 'LAND_USE_CHANGE' ? formData.proposedLandUse : undefined,
        buildingHeightM: selectedService === 'BUILDING_PERMISSION' ? Number(formData.buildingHeightM) : undefined,
        builtUpAreaSqM: selectedService === 'BUILDING_PERMISSION' ? Number(formData.builtUpAreaSqM) : undefined,
        waterConnectionType: selectedService === 'WATER_CONNECTION' ? formData.waterConnectionType : undefined,
      };

      const res = await applicationApi.create(payload);
      setCreatedApplication(res.data);
    } catch (err) {
      console.error('Submission failed', err);
      setErrorMsg(err.response?.data?.message || 'Submission failed. Please check inputs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const dept = getDepartmentDetails();

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-900 text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Single-Window Citizen Service Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Apply for Land & Municipal Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
            Applications are automatically routed to the responsible department officer with end-to-end workflow transparency.
          </p>
        </div>

        {/* 3-Step Stepper Header */}
        {!createdApplication && (
          <div className="flex items-center justify-center max-w-lg mx-auto">
            <div className="flex items-center w-full">
              {/* Step 1 */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step >= 1 ? 'bg-[#0B2545] text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  1
                </div>
                <span className="text-[11px] font-semibold text-slate-700 mt-1 whitespace-nowrap">
                  Service & Parcel
                </span>
              </div>

              <div
                className={`flex-1 h-0.5 mx-2 transition ${step >= 2 ? 'bg-[#0B2545]' : 'bg-slate-200'}`}
              ></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step >= 2 ? 'bg-[#0B2545] text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  2
                </div>
                <span className="text-[11px] font-semibold text-slate-700 mt-1 whitespace-nowrap">
                  Parameters
                </span>
              </div>

              <div
                className={`flex-1 h-0.5 mx-2 transition ${step >= 3 ? 'bg-[#0B2545]' : 'bg-slate-200'}`}
              ></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    step >= 3 ? 'bg-[#0B2545] text-white shadow-md' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  3
                </div>
                <span className="text-[11px] font-semibold text-slate-700 mt-1 whitespace-nowrap">
                  Review & Submit
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SUCCESS CARD UPON SUBMISSION */}
        {createdApplication ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg text-center space-y-6 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Application Submitted Successfully
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Application #{createdApplication.applicationNumber}
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your application has been logged and automatically routed to the{' '}
                <span className="font-bold text-slate-800">{createdApplication.departmentName}</span>.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 max-w-md mx-auto text-left text-xs space-y-2.5 border border-slate-200 font-medium">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <span className="font-bold text-slate-900">{createdApplication.serviceTypeTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Land Parcel:</span>
                <span className="font-bold text-slate-900">
                  Survey {createdApplication.surveyNumber} ({createdApplication.village})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {createdApplication.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Submission Timestamp:</span>
                <span className="text-slate-700 font-mono">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to={`/track/${createdApplication.applicationNumber}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Track Status Timeline</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
              >
                Go to My Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* MULTI-STEP WIZARD FORM */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            {/* STEP 1: SERVICE & PARCEL SELECTION */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Step 1: Choose Service & Land Parcel
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select the municipal service and the registered parcel in Pune jurisdiction.
                  </p>
                </div>

                {/* 3 Service Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Service 1 */}
                  <div
                    onClick={() => setSelectedService('BUILDING_PERMISSION')}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer space-y-2.5 ${
                      selectedService === 'BUILDING_PERMISSION'
                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Building Permission</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        FSI Sanctions, G+4 structures, municipal architectural approvals.
                      </p>
                    </div>
                    <span className="inline-block text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                      Town Planning Dept
                    </span>
                  </div>

                  {/* Service 2 */}
                  <div
                    onClick={() => setSelectedService('LAND_USE_CHANGE')}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer space-y-2.5 ${
                      selectedService === 'LAND_USE_CHANGE'
                        ? 'border-amber-600 bg-amber-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Land-Use Change</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Agricultural to Non-Agricultural (NA) conversion & zoning change.
                      </p>
                    </div>
                    <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                      Revenue Dept
                    </span>
                  </div>

                  {/* Service 3 */}
                  <div
                    onClick={() => setSelectedService('WATER_CONNECTION')}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer space-y-2.5 ${
                      selectedService === 'WATER_CONNECTION'
                        ? 'border-cyan-600 bg-cyan-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center">
                      <Droplets className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Water Connection</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Municipal pipeline sanction & domestic/commercial meter setup.
                      </p>
                    </div>
                    <span className="inline-block text-[10px] font-bold text-cyan-700 bg-cyan-100/60 px-2 py-0.5 rounded">
                      Utility Dept
                    </span>
                  </div>
                </div>

                {/* Parcel Selection Dropdown */}
                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Select Cadastral Land Parcel:
                  </label>
                  {loadingParcels ? (
                    <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-500">
                      Loading parcels...
                    </div>
                  ) : (
                    <select
                      value={selectedParcelId}
                      onChange={(e) => setSelectedParcelId(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 bg-white font-medium text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                    >
                      {parcels.map((p) => (
                        <option key={p.id} value={p.id}>
                          Survey No. {p.surveyNumber} — {p.village}, {p.taluka} (ULPIN: {p.ulpin}) — {p.areaSqM} m² [{p.landUse}]
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Selected Parcel Quick Summary Preview */}
                {selectedParcel && (
                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                        <MapPin className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">
                          Survey {selectedParcel.surveyNumber} • {selectedParcel.village}
                        </div>
                        <div className="text-slate-500 font-mono text-[11px]">
                          ULPIN: {selectedParcel.ulpin} • {selectedParcel.areaSqM?.toLocaleString()} m² • Current Use: {selectedParcel.landUse}
                        </div>
                      </div>
                    </div>
                    <Link
                      to={`/parcel/${selectedParcel.id}`}
                      target="_blank"
                      className="text-blue-700 hover:underline font-bold text-[11px] flex items-center gap-1"
                    >
                      <span>View Full Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Parameters</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: SERVICE SPECIFIC PARAMETERS */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Step 2: Service Parameters & Specifications
                  </h3>
                  <p className="text-xs text-slate-500">
                    Provide engineering and zoning details for {dept.name}.
                  </p>
                </div>

                {/* Building Permission Inputs */}
                {selectedService === 'BUILDING_PERMISSION' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Proposed Built-up Area (Sq. Meters)
                      </label>
                      <input
                        type="number"
                        value={formData.builtUpAreaSqM}
                        onChange={(e) => setFormData({ ...formData, builtUpAreaSqM: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                        placeholder="e.g. 1200"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Building Height (Meters)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.buildingHeightM}
                        onChange={(e) => setFormData({ ...formData, buildingHeightM: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                        placeholder="e.g. 15.0"
                      />
                    </div>
                  </div>
                )}

                {/* Land Use Change Inputs */}
                {selectedService === 'LAND_USE_CHANGE' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Proposed New Land-Use Category
                      </label>
                      <select
                        value={formData.proposedLandUse}
                        onChange={(e) => setFormData({ ...formData, proposedLandUse: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                      >
                        <option value="RESIDENTIAL">Residential (NA)</option>
                        <option value="COMMERCIAL">Commercial (NA)</option>
                        <option value="INDUSTRIAL">Industrial (NA)</option>
                        <option value="MIXED_USE">Mixed Commercial/Residential</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Town Planning Master Plan Sector
                      </label>
                      <input
                        type="text"
                        defaultValue="Pune Metropolitan Region (PMRDA Zone 2)"
                        disabled
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-semibold text-slate-600"
                      />
                    </div>
                  </div>
                )}

                {/* Water Connection Inputs */}
                {selectedService === 'WATER_CONNECTION' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Connection Pipe Type
                      </label>
                      <select
                        value={formData.waterConnectionType}
                        onChange={(e) => setFormData({ ...formData, waterConnectionType: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                      >
                        <option value="DOMESTIC">Domestic (15mm Connection)</option>
                        <option value="COMMERCIAL">Commercial (25mm Connection)</option>
                        <option value="INDUSTRIAL">Industrial (50mm Bulk Supply)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">
                        Nearest Municipal Main Line
                      </label>
                      <input
                        type="text"
                        defaultValue="Hinjewadi-Baner Express Main Line"
                        disabled
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-100 font-semibold text-slate-600"
                      />
                    </div>
                  </div>
                )}

                {/* Remarks & Justification */}
                <div className="text-xs space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Applicant Remarks / Project Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                    placeholder="Provide details about the proposed development or connection requirements..."
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & SUBMIT */}
            {step === 3 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Step 3: Review Dossier & Final Submission
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verify application details before submitting to the single-window system.
                  </p>
                </div>

                {/* Review Card */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-semibold">Service Type:</span>
                      <span className="font-bold text-slate-900 text-sm">{selectedService.replace(/_/g, ' ')}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">Routing Authority:</span>
                      <span className="font-bold text-blue-900">{dept.name}</span>
                      <span className="text-[11px] text-slate-500 block">Assigned Officer: {dept.officer}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-semibold">Target Parcel:</span>
                      <span className="font-bold text-slate-900">
                        Survey No. {selectedParcel?.surveyNumber} ({selectedParcel?.village})
                      </span>
                      <span className="text-slate-500 block font-mono text-[11px]">
                        ULPIN: {selectedParcel?.ulpin}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-semibold">Applicant:</span>
                      <span className="font-bold text-slate-900">{user?.fullName || 'Citizen User'}</span>
                      <span className="text-slate-500 block">{user?.email}</span>
                    </div>
                  </div>

                  {/* Service Specific Summary */}
                  <div>
                    <span className="text-slate-400 block font-semibold mb-1">Specifications:</span>
                    <p className="text-slate-800 bg-white p-3 rounded-xl border border-slate-200">
                      {formData.remarks}
                    </p>
                  </div>
                </div>

                {/* Declaration Checkbox */}
                <label className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formData.declared}
                    onChange={(e) => setFormData({ ...formData, declared: e.target.checked })}
                    className="mt-0.5 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <div className="text-xs text-slate-700 leading-normal">
                    <span className="font-bold text-slate-900">Citizen Undertaking:</span> I hereby declare that the particulars submitted are true to my knowledge and correspond to valid cadastral ownership records registered in the State of Maharashtra.
                  </div>
                </label>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{submitting ? 'Submitting Application...' : 'Confirm & Submit to Department'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
