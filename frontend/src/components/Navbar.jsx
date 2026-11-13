import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PUBLIC_DEMO_MODE } from '../services/api';
import {
  ShieldCheck,
  LogOut,
  UserCircle,
  Globe,
  ChevronDown,
  CheckCircle2,
  Compass,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, switchDemoRole, startTour } = useAuth();
  const navigate = useNavigate();

  const handleRoleSwitch = async (role) => {
    try {
      await switchDemoRole(role);
      navigate('/dashboard');
    } catch (err) {
      console.error('Role switch failed', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'manager':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reviewer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'creator':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between shadow-xs">
      {/* Brand & Identity */}
      <div className="flex items-center space-x-3">
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white shadow-sm group-hover:bg-brand-700 transition-colors">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-base tracking-tight font-sans">InkloomGuard</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                Inkloom AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Intelligent Brand Governance</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center space-x-1 ml-4 px-2.5 py-1 bg-slate-100 rounded-full text-xs text-slate-600 border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <a href="https://inkloomguard.xyz" target="_blank" rel="noreferrer" className="hover:text-brand-600 transition-colors">
            inkloomguard.xyz
          </a>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Replay Guided Tour Button */}
        {user && (
          <button
            type="button"
            onClick={startTour}
            data-tour="tour-replay"
            className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-200 text-xs font-semibold transition-all shadow-2xs"
            title="Launch Interactive Tour (Guided Onboarding)"
          >
            <Compass className="w-3.5 h-3.5 text-brand-600" />
            <span>Tour</span>
          </button>
        )}

        {/* Role Perspective Quick Switcher */}
        {user && (
          <div data-tour="role-switcher" className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase px-2 hidden sm:inline">Role:</span>
            <button
              onClick={() => handleRoleSwitch('creator')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                user.role === 'creator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Creator demo view"
            >
              Creator
            </button>
            <button
              onClick={() => handleRoleSwitch('reviewer')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                user.role === 'reviewer'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Reviewer demo view"
            >
              Reviewer
            </button>
            <button
              onClick={() => handleRoleSwitch('manager')}
              className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                user.role === 'manager'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Switch to Manager demo view"
            >
              Manager
            </button>
          </div>
        )}

        {/* User Profile & Logout */}
        {user ? (
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">{user.name}</p>
              <div className="flex items-center justify-end space-x-1.5 mt-0.5">
                <span className={`text-[10px] font-medium uppercase px-1.5 py-0.2 rounded-full border ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
                <span className="text-[10px] text-slate-400">| {user.organization}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-slate-200 hover:border-rose-200"
              title="Log Out"
              aria-label="Log Out"
            >
              <LogOut className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="text-xs font-medium px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-xs"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
