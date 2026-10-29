import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import MapPage from './pages/MapPage';

// Protected Route wrappers
export function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B2545]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user?.role)) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 font-bold text-lg">
            ✕
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-xs text-slate-500 max-w-md">
            This module requires <span className="font-semibold">{roles.join(' or ')}</span> authorization.
            Citizens cannot approve or review internal department workflows.
          </p>
        </div>
      );
    }
  }

  return children;
}

// Router shell
function AppRoutes() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Map and Parcel routes - implemented in next phases */}
          <Route path="/map" element={<MapPage />} />
          <Route path="/parcel/:id" element={<div className="p-8 text-center text-slate-500">Parcel Dossier Loading...</div>} />
          <Route path="/search" element={<div className="p-8 text-center text-slate-500">Smart Search Loading...</div>} />
          <Route path="/track" element={<div className="p-8 text-center text-slate-500">Application Tracking Loading...</div>} />
          <Route path="/track/:appNumber" element={<div className="p-8 text-center text-slate-500">Application Tracking Loading...</div>} />
          <Route path="/apply" element={<div className="p-8 text-center text-slate-500">Application Wizard Loading...</div>} />
          <Route path="/dashboard" element={<div className="p-8 text-center text-slate-500">Citizen Dashboard Loading...</div>} />
          <Route path="/officer" element={<div className="p-8 text-center text-slate-500">Officer Review Queue Loading...</div>} />
          <Route path="/admin" element={<div className="p-8 text-center text-slate-500">Admin Analytics Loading...</div>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
