import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import {
  ShieldCheck,
  Building,
  Users,
  FileText,
  Clock,
  Layers,
  Sparkles,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState('analytics'); // analytics, users, audit
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, auditRes] = await Promise.all([
        adminApi.getAnalytics(),
        adminApi.getUsers(),
        adminApi.getAuditLogs(),
      ]);
      setAnalytics(analyticsRes.data);
      setUsers(usersRes.data || []);
      setAuditLogs(auditRes.data || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Non-admin fallback
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Clearance Required</h2>
        <p className="text-xs text-slate-500 max-w-md mb-6 leading-relaxed">
          The analytics and audit console requires <strong>ADMIN</strong> credentials.
          Please click on <strong>Demo Switcher</strong> at the top right and select <strong>System Admin</strong>.
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-xl bg-[#0B2545] text-white text-xs font-bold transition shadow-md"
        >
          Return to Portal
        </Link>
      </div>
    );
  }

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q)
    );
  });

  const filteredAuditLogs = auditLogs.filter((log) => {
    if (auditActionFilter !== 'ALL' && !log.action?.includes(auditActionFilter)) {
      return false;
    }
    if (!auditSearch) return true;
    const q = auditSearch.toLowerCase();
    return (
      log.userEmail?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.entity?.toLowerCase().includes(q) ||
      log.details?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0B2545] via-[#134074] to-[#0B2545] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-400/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Executive Command & Oversight Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrative & Municipal Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-200">
              Real-time monitoring of cadastral parcels, departmental clearance velocity, cross-service bottlenecks, and immutable security audit logs.
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            <button
              onClick={fetchData}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition border border-white/20 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>

        {/* 4 Summary KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Digitized Parcels</span>
              <Layers className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {analytics?.totalParcels ?? 25}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Pune jurisdiction GIS polygons</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>Total Applications</span>
              <FileText className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {analytics?.totalApplications ?? 15}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Across 3 municipal services</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>System Users</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {analytics?.totalUsers ?? 6}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Citizens, Officers, Admins</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-semibold">
              <span>Avg Processing Time</span>
              <Clock className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {analytics?.averageTurnaroundDays ?? 4.2} <span className="text-xs font-bold text-slate-400">days</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Single-window efficiency index</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#0B2545] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Visual Analytics & Charts</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-[#0B2545] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-[#0B2545] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Immutable Audit Logs</span>
          </button>
        </div>

        {/* TAB 1: VISUAL ANALYTICS & CHARTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Applications by Service (Donut/Pie Chart) */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                    Applications by Municipal Service
                  </h3>
                  <p className="text-xs text-slate-500">Distribution across single-window service channels</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics?.applicationsByService || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(analytics?.applicationsByService || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B2545',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Status Breakdown (Bar Chart) */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Workflow Status Distribution
                  </h3>
                  <p className="text-xs text-slate-500">Real-time status breakdown across all active queues</p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics?.applicationsByStatus || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748B' }} />
                      <YAxis tick={{ fontSize: 10, fill: '#64748B' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0B2545',
                          borderRadius: '12px',
                          border: 'none',
                          color: '#fff',
                          fontSize: '11px',
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                        {(analytics?.applicationsByStatus || []).map((entry, index) => (
                          <Cell key={`bar-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Chart 3: Department Workload Comparison */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0B2545]" />
                  <span>Departmental Workload & Throughput</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Total applications routed vs approved vs in-progress pending review
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.departmentWorkload || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="department" tick={{ fontSize: 11, fontWeight: 600, fill: '#334155' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B2545',
                        borderRadius: '12px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '11px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                    <Bar dataKey="total" name="Total Ingested" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="approved" name="Sanctioned" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending Review" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT DIRECTORY */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">System Users Directory</h2>
                <p className="text-xs text-slate-500">
                  Role-based access credentials configured for Maharashtra Land Record Portal.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Filter users..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-6">Full Name</th>
                    <th className="py-3 px-6">Email Address</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Assigned Role</th>
                    <th className="py-3 px-6 text-right">Registered</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-400">#{u.id}</td>
                      <td className="py-4 px-6 font-bold text-slate-900">{u.fullName}</td>
                      <td className="py-4 px-6 font-mono text-slate-600">{u.email}</td>
                      <td className="py-4 px-6 text-slate-500">{u.phone || 'N/A'}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            u.role === 'ADMIN'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'CITIZEN'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: IMMUTABLE AUDIT LOG VIEWER */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Immutable Security & Workflow Audit Trail</h2>
                <p className="text-xs text-slate-500">
                  Cryptographically trackable log of document uploads, applications, and officer sanctions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={auditActionFilter}
                  onChange={(e) => setAuditActionFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50"
                >
                  <option value="ALL">All Actions</option>
                  <option value="LOGIN">Logins</option>
                  <option value="SUBMIT">Submissions</option>
                  <option value="DECISION">Officer Decisions</option>
                  <option value="OCR">OCR Digitizations</option>
                </select>

                <div className="relative w-48 sm:w-64">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    placeholder="Search audit trail..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-6">Timestamp</th>
                    <th className="py-3 px-6">Action</th>
                    <th className="py-3 px-6">Actor Email</th>
                    <th className="py-3 px-6">Entity</th>
                    <th className="py-3 px-6">Details</th>
                    <th className="py-3 px-6 text-right">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono font-bold text-slate-800 text-[11px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-900">
                        {log.userEmail || 'system'}
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                          {log.entity} #{log.entityId}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 max-w-xs truncate" title={log.details}>
                        {log.details || '—'}
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-400 text-[11px]">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
