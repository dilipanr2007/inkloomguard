import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_DEMO_MODE } from '../services/api';
import { ShieldAlert, Sparkles, Lock, Eye } from 'lucide-react';

export default function AppLayout({ requireAuth = true }) {
  const { user, isAuthenticated, loading, switchDemoRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Loading Inkloom AI Workspace...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Requirement 8: Visible Public Demo Mode Banner */}
      {PUBLIC_DEMO_MODE && (
        <aside aria-label="Demo Mode Indicator" className="bg-slate-900 border-b border-amber-500/50 text-amber-200 px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="font-bold uppercase tracking-wider text-[11px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60 flex items-center space-x-1">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>Public Demo Mode</span>
            </span>
            <span className="text-slate-300 hidden md:inline">
              CodeNexus India 2026 Evaluation • Read-Only Brand Governance Baseline
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 hidden lg:inline text-[11px]">Judge Perspective:</span>
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => switchDemoRole('creator')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  user?.role === 'creator'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Switch to Creator demo perspective"
              >
                Creator
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole('reviewer')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  user?.role === 'reviewer'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Switch to Reviewer demo perspective"
              >
                Reviewer
              </button>
              <button
                type="button"
                onClick={() => switchDemoRole('manager')}
                className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all ${
                  user?.role === 'manager'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Switch to Manager demo perspective"
              >
                Manager
              </button>
            </div>
            <span className="px-2 py-0.5 bg-amber-900/40 text-amber-300 text-[10px] font-medium rounded border border-amber-700/50 hidden sm:inline-flex items-center space-x-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Mutations Paused</span>
            </span>
          </div>
        </aside>
      )}

      <Navbar />
      <div className="flex flex-1">
        {isAuthenticated && <Sidebar />}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
