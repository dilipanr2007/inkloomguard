import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  BarChart2,
  BookOpen,
  Compass
} from 'lucide-react';

export default function DashboardPage() {
  const { user, startTour } = useAuth();
  const [stats, setStats] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [overviewRes, contentRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/content?limit=6')
        ]);
        setStats(overviewRes.data.stats);
        setSubmissions(contentRes.data.contents || []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Approved</span>;
      case 'rejected':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">Rejected</span>;
      case 'changes_requested':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">Changes Requested</span>;
      case 'ai_reviewed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">AI Reviewed</span>;
      case 'in_review':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">In Human Review</span>;
      case 'draft':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Draft</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Workspace: <span className="font-semibold text-slate-700">{user?.organization}</span> • Role: <span className="font-semibold capitalize text-brand-600">{user?.role}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={startTour}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-2xs"
            title="Replay Interactive Tour"
          >
            <Compass className="w-4 h-4 text-brand-600" />
            <span>Interactive Tour</span>
          </button>

          {user?.role !== 'reviewer' && (
            <Link
              to="/content/new"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Content</span>
            </Link>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500">Total Submissions</p>
          <p className="text-2xl font-bold text-slate-900">{stats?.totalSubmissions || 0}</p>
          <p className="text-[11px] text-slate-400">Across campaigns</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500">Pending Review</p>
          <p className="text-2xl font-bold text-purple-600">{stats?.inReviewSubmissions || 0}</p>
          <p className="text-[11px] text-purple-600/80 font-medium">Awaiting decision</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500">Approved for Publishing</p>
          <p className="text-2xl font-bold text-emerald-600">{stats?.approvedSubmissions || 0}</p>
          <p className="text-[11px] text-emerald-600/80 font-medium">Human sign-off complete</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <p className="text-xs font-medium text-slate-500">Avg Governance Score</p>
          <p className="text-2xl font-bold text-brand-600">{stats?.averageGovernanceScore || 85}<span className="text-xs font-normal text-slate-400">/100</span></p>
          <p className="text-[11px] text-brand-600/80 font-medium">Brand health index</p>
        </div>
      </div>

      {/* Role-Specific Focus Section */}
      {user?.role === 'manager' && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-purple-900 uppercase tracking-wider">Manager Quick Actions</p>
            <p className="text-xs text-purple-700">
              Manage approved product names, facts, and guidelines to update the AI review retrieval engine.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              to="/guidelines"
              className="px-3 py-1.5 rounded-lg bg-white border border-purple-300 text-purple-900 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              Knowledge Library
            </Link>
            <Link
              to="/analytics"
              className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
            >
              Analytics
            </Link>
          </div>
        </div>
      )}

      {/* Recent Submissions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              {user?.role === 'reviewer' ? 'Pending Review Queue' : 'Recent Content Submissions'}
            </h3>
          </div>
          <Link to="/content" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {submissions.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No submissions found in this workspace yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Title & Campaign</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Version</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Creator</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.campaign}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{item.contentType}</td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        v{item.currentVersion}
                      </span>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                    <td className="py-3 px-4 text-slate-600">{item.creator?.name || 'Creator'}</td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/content/${item._id}`}
                        className="inline-flex items-center space-x-1 font-semibold text-brand-600 hover:text-brand-800"
                      >
                        <span>Review</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
