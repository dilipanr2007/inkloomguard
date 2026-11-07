import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { BarChart3, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';

const COLORS = ['#ef4444', '#f59e0b', '#6366f1', '#10b981', '#8b5cf6', '#06b6d4'];

export default function AnalyticsPage() {
  const [findingsData, setFindingsData] = useState(null);
  const [rulesData, setRulesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [fRes, rRes] = await Promise.all([
          api.get('/analytics/findings'),
          api.get('/analytics/rules')
        ]);
        setFindingsData(fRes.data);
        setRulesData(rRes.data);
      } catch (err) {
        console.error('Failed to load analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const categoryChartData = (findingsData?.byCategory || []).map(item => ({
    name: item.category.replace('Brand ', '').replace(' Claim', ''),
    count: item.count
  }));

  const severityChartData = (findingsData?.bySeverity || []).map(item => ({
    name: item.severity.toUpperCase(),
    value: item.count
  }));

  const rulesChartData = (rulesData?.frequentlyTriggeredRules || []).map(item => ({
    name: item.ruleId,
    violations: item.count,
    title: item.title
  }));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-brand-600" />
          <span>Governance Analytics & Quality Metrics</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time aggregated metrics computed from verified database records.
        </p>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Findings by Category */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Violations by Brand Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip wrapperClassName="text-xs" />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Severity Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Findings by Severity Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {severityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperClassName="text-xs" />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Frequently Triggered Rules */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Most Frequently Triggered Brand Rules & Source Citations
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rulesChartData} layout="vertical">
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11 }} />
                <Tooltip
                  wrapperClassName="text-xs"
                  formatter={(val, name, props) => [`${val} violations`, props.payload.title]}
                />
                <Bar dataKey="violations" fill="#f59e0b" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Dismissed Findings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900">
            Recent Dismissed Findings & Written Justifications
          </h3>
          <p className="text-xs text-slate-500">
            Audit trail of human reviewer overrides to detect recurring false positives or guideline ambiguity.
          </p>
        </div>

        {rulesData?.recentDismissals && rulesData.recentDismissals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Flagged Excerpt</th>
                  <th className="py-3 px-4">Dismissal Reason / Justification</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rulesData.recentDismissals.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.category}</td>
                    <td className="py-3 px-4 font-mono text-rose-700">"{item.excerpt}"</td>
                    <td className="py-3 px-4 text-slate-700 italic">{item.dismissalReason || 'No reason provided'}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No dismissed findings recorded in database yet.
          </div>
        )}
      </div>
    </div>
  );
}
