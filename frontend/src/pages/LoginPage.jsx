import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import Logo from '../components/common/Logo';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { login, quickLogin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'CITIZEN') navigate('/dashboard');
      else navigate('/officer');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  const handleSelectDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo@123');
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-100">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side: Branding & Quick Demo Credentials */}
        <div className="bg-gradient-to-br from-[#0B2545] via-[#102A43] to-[#134074] text-white p-8 flex flex-col justify-between">
          <div>
            <Logo light={true} />
            <h2 className="text-xl font-extrabold mt-6 mb-2">
              Single-Window Access Portal
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Secure RBAC authentication for Maharashtra Citizens, Municipal Town Planners, and Revenue Officers.
            </p>

            {/* Quick Demo Switcher Cards */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Demo Accounts (Click to fill)</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {DEMO_CREDENTIALS.map((demo) => (
                  <button
                    key={demo.email}
                    type="button"
                    onClick={() => handleSelectDemo(demo.email)}
                    className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${
                      email === demo.email
                        ? 'bg-white/20 border-amber-400 text-white font-bold'
                        : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{demo.name}</div>
                      <div className="text-[10px] text-slate-400">{demo.email}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${demo.badge}`}>
                      {demo.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>256-bit JWT Encryption • PostGIS RBAC Protected</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Sign In</h3>
            <p className="text-xs text-slate-500 mt-1">
              Enter your credentials to manage parcels and applications
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@bhumisetu.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545] focus:border-transparent"
                />
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[10px] text-slate-400">Default for all demo accounts: Demo@123</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0B2545] hover:bg-[#134074] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#0B2545] hover:underline">
              Create Citizen Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
