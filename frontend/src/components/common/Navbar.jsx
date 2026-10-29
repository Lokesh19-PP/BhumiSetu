import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../../context/AuthContext';
import Logo from './Logo';
import {
  MapPin,
  Search,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  ChevronDown,
  User,
  Sparkles,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isCitizen, isOfficer, isAdmin, logout, quickLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleQuickSwitch = async (email) => {
    try {
      await quickLogin(email);
      setDemoDropdownOpen(false);
      setUserDropdownOpen(false);
      // Navigate to appropriate landing based on role
      if (email.includes('admin')) navigate('/admin');
      else if (email.includes('citizen')) navigate('/dashboard');
      else navigate('/officer');
    } catch (e) {
      console.error('Quick switch failed', e);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top E-Governance strip */}
      <div className="bg-[#0B2545] text-slate-300 px-4 py-1 text-[11px] flex justify-between items-center border-b border-navy-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-amber-400">महाराष्ट्र शासन</span>
          <span className="text-slate-500">|</span>
          <span>Government of Maharashtra Land Records Portal</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            ULPIN Cadastral Grid Live
          </span>
          <span className="hidden sm:inline text-slate-400">Pune Metro GIS v1.0</span>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
            <Link
              to="/map"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/map')
                  ? 'bg-blue-50 text-[#0B2545] font-semibold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#0B2545]" />
              <span>GIS Map</span>
            </Link>

            <Link
              to="/search"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/search')
                  ? 'bg-blue-50 text-[#0B2545] font-semibold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Search className="w-4 h-4 text-[#F59E0B]" />
              <span>Smart Search</span>
            </Link>

            <Link
              to="/digitize"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/digitize')
                  ? 'bg-blue-50 text-[#0B2545] font-semibold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Digitize</span>
            </Link>

            <Link
              to="/track"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                isActive('/track')
                  ? 'bg-blue-50 text-[#0B2545] font-semibold'
                  : 'hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Track Application</span>
            </Link>

            {/* Role-specific link */}
            {isAuthenticated && isCitizen && (
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-emerald-50 text-emerald-800 font-semibold'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>My Dashboard</span>
              </Link>
            )}

            {isAuthenticated && isOfficer && (
              <Link
                to="/officer"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/officer')
                    ? 'bg-amber-50 text-amber-800 font-semibold'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Officer Queue</span>
              </Link>
            )}

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/admin')
                    ? 'bg-purple-50 text-purple-800 font-semibold'
                    : 'hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Admin Analytics</span>
              </Link>
            )}
          </nav>

          {/* Right Action buttons / Demo Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50/80 text-amber-900 hover:bg-amber-100 transition shadow-xs"
                title="Quick 1-Click Role Switcher for Academic Demo"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="hidden sm:inline">Demo Switcher</span>
                <span className="sm:hidden">Roles</span>
                <ChevronDown className="w-3 h-3 text-amber-700" />
              </button>

              {demoDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Persona (1-Click Login)
                  </div>
                  {DEMO_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.email}
                      onClick={() => handleQuickSwitch(cred.email)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{cred.name}</div>
                        <div className="text-[11px] text-slate-400">{cred.email}</div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cred.badge}`}>
                        {cred.label}
                      </span>
                    </button>
                  ))}
                  <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-[10px] text-slate-400">
                    Password for all accounts: <span className="font-mono text-slate-600">Demo@123</span>
                  </div>
                </div>
              )}
            </div>

            {isAuthenticated ? (
              /* User Profile & Logout */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 transition text-slate-700 text-xs font-semibold"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#0B2545] text-white flex items-center justify-center font-bold text-xs">
                    {user?.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left hidden lg:block leading-tight">
                    <div className="text-slate-900 font-bold">{user?.fullName?.split(' ')[0]}</div>
                    <div className="text-[10px] text-slate-500 font-medium capitalize">
                      {user?.role?.replace('_', ' ').toLowerCase()}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
                      <p className="text-[11px] text-slate-500">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800">
                        {user?.role}
                      </span>
                    </div>

                    <Link
                      to={isCitizen ? '/dashboard' : isOfficer ? '/officer' : '/admin'}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-slate-700 hover:bg-slate-50"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      <span>Dashboard</span>
                    </Link>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 border-t border-slate-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Sign In / Sign Up */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold px-3.5 py-2 rounded-lg bg-[#0B2545] text-white hover:bg-[#134074] shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
