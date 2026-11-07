import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { History, ArrowLeft, ArrowRight, GitCommit, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function VersionHistoryPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [content, setContent] = useState(null);
  const [versions, setVersions] = useState([]);
  const [v1Data, setV1Data] = useState(null);
  const [v2Data, setV2Data] = useState(null);
  const [loading, setLoading] = useState(true);

  const v1Param = parseInt(searchParams.get('v1')) || 1;
  const v2Param = parseInt(searchParams.get('v2')) || 1;

  useEffect(() => {
    fetchVersionHistory();
  }, [id, v1Param, v2Param]);

  const fetchVersionHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/content/${id}`);
      setContent(res.data.content);
      setVersions(res.data.allVersions || []);

      if (res.data.allVersions?.length > 1) {
        const compareRes = await api.get(`/content/${id}/compare?v1=${v1Param}&v2=${v2Param}`);
        setV1Data(compareRes.data.v1);
        setV2Data(compareRes.data.v2);
      } else {
        setV1Data(res.data.currentVersion);
        setV2Data(res.data.currentVersion);
      }
    } catch (err) {
      console.error('Failed to load version history', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <Link to={`/content/${id}`} className="hover:text-slate-800 flex items-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Review Studio</span>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <History className="w-6 h-6 text-brand-600" />
            <span>Version Audit & Revision History</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Audit trail of revisions, governance scores, and copy changes for <strong>{content?.title}</strong>.
          </p>
        </div>
      </div>

      {/* Version Progression Pills */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Versions to Compare:</p>
        <div className="flex flex-wrap items-center gap-3">
          {versions.map((v) => (
            <div
              key={v.versionNumber}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                v.versionNumber === v2Param
                  ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
              onClick={() => setSearchParams({ v1: Math.max(1, v.versionNumber - 1).toString(), v2: v.versionNumber.toString() })}
            >
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-slate-900 text-sm">v{v.versionNumber}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                  (v.governanceScore || 100) >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {v.governanceScore || '—'}/100
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">{v.changeNotes || 'Revision snapshot'}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">{new Date(v.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baseline (v1) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Prior Baseline (Version {v1Data?.versionNumber || 1})
            </span>
            <span className="text-xs font-mono text-slate-500">
              Score: {v1Data?.governanceScore !== null ? v1Data?.governanceScore : '—'}/100
            </span>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 leading-relaxed min-h-[200px] whitespace-pre-wrap">
            {v1Data?.rawText || 'No prior version.'}
          </div>
        </div>

        {/* Revised (v2) */}
        <div className="bg-white p-5 rounded-xl border border-brand-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-brand-900 uppercase tracking-wider flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
              <span>Current Revision (Version {v2Data?.versionNumber || 1})</span>
            </span>
            <span className="text-xs font-mono font-bold text-brand-700">
              Score: {v2Data?.governanceScore !== null ? v2Data?.governanceScore : '—'}/100
            </span>
          </div>
          <div className="p-4 rounded-lg bg-emerald-50/40 border border-emerald-200 text-xs font-sans text-slate-800 leading-relaxed min-h-[200px] whitespace-pre-wrap">
            {v2Data?.rawText || 'Select a version.'}
          </div>
        </div>
      </div>
    </div>
  );
}
