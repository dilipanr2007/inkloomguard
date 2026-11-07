import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  BookOpen,
  BarChart3,
  History,
  ShieldAlert,
  Sparkles,
  Layers
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['creator', 'reviewer', 'manager']
    },
    {
      label: role === 'reviewer' ? 'Review Queue' : 'Content Submissions',
      path: '/content',
      icon: FileText,
      roles: ['creator', 'reviewer', 'manager']
    },
    {
      label: 'Submit Content',
      path: '/content/new',
      icon: PlusCircle,
      roles: ['creator', 'manager']
    },
    {
      label: 'Brand Knowledge',
      path: '/guidelines',
      icon: BookOpen,
      roles: ['creator', 'reviewer', 'manager'],
      badge: role === 'manager' ? 'Editor' : 'Library'
    },
    {
      label: 'Governance Analytics',
      path: '/analytics',
      icon: BarChart3,
      roles: ['reviewer', 'manager']
    },
    {
      label: 'Audit Trail',
      path: '/audit',
      icon: History,
      roles: ['manager']
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)] border-r border-slate-800">
      {/* Workspace Context */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Layers className="w-3.5 h-3.5 text-brand-400" />
          <span>Brand Workspace</span>
        </div>
        <p className="text-sm font-bold text-white mt-1 tracking-tight">FreshPlus Global</p>
        <p className="text-[11px] text-slate-400">CodeNexus 2026 Demo Scope</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems
          .filter((item) => item.roles.includes(role))
          .map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
      </nav>

      {/* Governance Philosophy Footer */}
      <div className="p-3.5 m-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-slate-400 text-[11px] space-y-1.5">
        <div className="flex items-center space-x-1.5 text-brand-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Human-in-the-Loop</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          AI assists with citations & suggestions. Humans hold final publication authority.
        </p>
      </div>
    </aside>
  );
}
