import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Shield, Phone, Mail, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B2545] text-slate-300 pt-12 pb-8 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <Logo light={true} />
            <p className="text-xs text-slate-400 leading-relaxed">
              Bhumisetu is an integrated GIS-based land information and single-window citizen land service platform. Designed to eliminate department silos, prevent land fraud, and automate municipal clearances.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4" />
              <span>DILRMP & PostGIS Compliant</span>
            </div>
          </div>

          {/* Col 2: Citizen Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Single-Window Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link to="/map" className="hover:text-amber-400 transition">
                  1. Building Permission (PMRDA/PMC)
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-amber-400 transition">
                  2. Non-Agricultural (NA) Land Conversion
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-amber-400 transition">
                  3. Water & Sewerage Connection
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-amber-400 transition">
                  4. Track Application Status
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-amber-400 transition">
                  5. Smart OCR Document Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Government Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Integrated Portals
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Mahabhulekh 7/12 Land Records</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>PMRDA Building Sanction Portal</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Pune Municipal Corporation (PMC)</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>IGRMaharashtra Property Registration</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white">
                <ExternalLink className="w-3 h-3 text-slate-400" />
                <span>Digital India Land Records (DILRMP)</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Helpdesk & Academic Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
              Support & Information
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Toll-Free Helpline: 1800-233-0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@bhumisetu.in</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-400 leading-normal border-t border-white/10">
                <span className="font-semibold text-slate-200">TE Major Project Demonstration:</span>
                <br />
                Sample Seeded Zone: Pune Metropolitan (Hinjewadi, Baner, Wakad, Wagholi, Hadapsar, Kharadi).
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-3">
          <p>© 2026 Bhumisetu Integrated Land Platform. Open-source prototype.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-red-400 fill-red-400" /> for Smart Governance in India
          </p>
        </div>
      </div>
    </footer>
  );
}
