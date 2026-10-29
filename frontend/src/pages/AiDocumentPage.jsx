import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OcrDigitizer from '../components/ai/OcrDigitizer';
import {
  Sparkles,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Info,
  ArrowRight,
  Database,
  Cpu,
} from 'lucide-react';

export default function AiDocumentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialParcelId = searchParams.get('parcelId');

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 to-transparent pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Cadastral Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Document Digitization & OCR Extraction
            </h1>

            <p className="text-sm text-slate-200 leading-relaxed">
              Upload physical land records (7/12 Satbara Extracts, Registered Sale Deeds, or Building Sanctions).
              Our optical character recognition pipeline parses Devnagari/English script, extracts cadastral metadata with confidence metrics, and links directly to the parcel GIS geometry.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Cpu className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tesseract OCR Engine</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Confidence Scoring</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Database className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Auto-Parcel Matching</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Human-In-The-Loop Verification</span>
            </div>
          </div>
        </div>

        {/* OCR Digitizer Core Module */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Single-Window Document Ingestion
              </h2>
              <p className="text-xs text-slate-500">
                Select a local file or trigger our 1-click sample property record for instant project demonstration.
              </p>
            </div>

            {initialParcelId && (
              <span className="text-xs bg-blue-50 text-blue-900 px-3 py-1 rounded-full font-bold border border-blue-200">
                Targeting Parcel ID: #{initialParcelId}
              </span>
            )}
          </div>

          <OcrDigitizer
            initialParcelId={initialParcelId}
            onVerified={() => {
              // Notification or optional redirection
            }}
          />
        </div>

        {/* Technical Architecture Info Box */}
        <div className="rounded-2xl bg-amber-50/60 border border-amber-200/80 p-5 flex items-start gap-3.5">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 space-y-1">
            <p className="font-bold">Project Guide Demonstration Note:</p>
            <p className="text-slate-700 leading-normal">
              The AI module utilizes Tess4J with automated fallback to our regex-based cadastral parser. This ensures the demo runs reliably across native OS environments while parsing authentic Revenue Department documents containing Gat/Survey numbers, ULPIN identifiers, and Taluka/District administrative hierarchies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
