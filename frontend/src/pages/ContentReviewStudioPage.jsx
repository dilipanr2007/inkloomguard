import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { PUBLIC_DEMO_MODE } from '../services/api';
import {
  recordDemoAuditLog,
  updateDemoContentStatus,
  analyzeDemoText
} from '../services/demoData';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileCheck2,
  Edit3,
  MessageSquare,
  Sparkles,
  History,
  ArrowLeft,
  BookOpen,
  Info,
  Check,
  Send,
  CornerDownRight,
  Lock,
  Clock
} from 'lucide-react';

export default function ContentReviewStudioPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFindingId, setActiveFindingId] = useState(null);
  const [toastNotice, setToastNotice] = useState(null);

  // Modals state
  const [dismissModal, setDismissModal] = useState({ open: false, findingId: null, reason: '' });
  const [editModal, setEditModal] = useState({ open: false, findingId: null, rewrite: '' });
  const [changesModal, setChangesModal] = useState({ open: false, reason: '' });
  const [rejectModal, setRejectModal] = useState({ open: false, reason: '' });
  const [revisionMode, setRevisionMode] = useState(false);
  const [revisedText, setRevisedText] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');

  // Comment input
  const [newComment, setNewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      const res = await api.get(`/content/${id}`);
      setData(res.data);
      setRevisedText(res.data.currentVersion?.rawText || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load content submission');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerReReview = async () => {
    setActionLoading(true);
    if (PUBLIC_DEMO_MODE) {
      setTimeout(() => {
        const text = data?.currentVersion?.rawText || '';
        const analysis = analyzeDemoText(text);
        setData((prev) => ({
          ...prev,
          content: { ...prev.content, status: 'ai_reviewed' },
          currentVersion: {
            ...prev.currentVersion,
            aiReviewCompleted: true,
            governanceScore: analysis.score,
            totalFindings: analysis.findings.length
          },
          findings: analysis.findings
        }));
        setActionLoading(false);
        setToastNotice({
          type: 'info',
          title: 'AI Governance Scan Completed (Demo Mode)',
          message: `Demo Scan: Analyzed copy against 5 brand guidelines and 3 facts. Found ${analysis.findings.length} findings with governance score ${analysis.score}/100. (Demo action — not saved to production).`
        });
      }, 500);
      return;
    }
    try {
      await api.post(`/content/${id}/review`);
      await fetchContent();
    } catch (err) {
      alert(`AI Review failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecision = async (findingId, action, extra = {}) => {
    if (PUBLIC_DEMO_MODE) {
      setData((prev) => {
        if (!prev) return prev;
        const updatedFindings = (prev.findings || []).map((f) => {
          if (f._id === findingId) {
            return {
              ...f,
              decision: action,
              dismissReason: extra.reason || f.dismissReason,
              editedRewrite: extra.rewrite || f.editedRewrite
            };
          }
          return f;
        });
        return { ...prev, findings: updatedFindings };
      });
      if (dismissModal.open) setDismissModal({ open: false, findingId: null, reason: '' });
      if (editModal.open) setEditModal({ open: false, findingId: null, rewrite: '' });
      return;
    }

    try {
      await api.patch(`/findings/${findingId}/decision`, {
        action,
        ...extra
      });
      await fetchContent();
      if (dismissModal.open) setDismissModal({ open: false, findingId: null, reason: '' });
      if (editModal.open) setEditModal({ open: false, findingId: null, rewrite: '' });
    } catch (err) {
      alert(`Failed to record decision: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleApplyAcceptedSuggestions = () => {
    if (!data?.currentVersion || !data?.findings) return;
    let updated = data.currentVersion.rawText;

    // Apply accepted and edited suggestions
    data.findings.forEach((f) => {
      if (f.decision === 'accepted' && f.suggestedRewrite) {
        updated = updated.split(f.excerpt).join(f.suggestedRewrite);
      } else if (f.decision === 'edited' && f.editedRewrite) {
        updated = updated.split(f.excerpt).join(f.editedRewrite);
      }
    });

    setRevisedText(updated);
    setRevisionMode(true);
  };

  const handleSubmitRevision = async (e) => {
    e.preventDefault();
    if (!revisedText.trim()) return;
    setActionLoading(true);

    if (PUBLIC_DEMO_MODE) {
      setTimeout(() => {
        const nextVerNumber = (data?.content?.currentVersion || 1) + 1;
        const analysis = analyzeDemoText(revisedText);
        const newVersion = {
          _id: `ver-${nextVerNumber}`,
          versionNumber: nextVerNumber,
          rawText: revisedText,
          changeNotes: revisionNotes || 'Applied suggested brand rewrites',
          aiReviewCompleted: true,
          governanceScore: analysis.score,
          totalFindings: analysis.findings.length,
          createdAt: new Date().toISOString()
        };

        setData((prev) => ({
          ...prev,
          content: { ...prev.content, currentVersion: nextVerNumber, status: 'in_review' },
          currentVersion: newVersion,
          allVersions: [...(prev.allVersions || []), newVersion],
          findings: analysis.findings
        }));

        recordDemoAuditLog({
          action: 'REVISION_SUBMITTED (Demo)',
          user,
          targetId: id,
          details: { version: nextVerNumber, changeNotes: newVersion.changeNotes }
        });

        setRevisionMode(false);
        setRevisionNotes('');
        setActionLoading(false);
        setToastNotice({
          type: 'info',
          title: `Draft Version ${nextVerNumber} Created`,
          message: `Demo Action Recorded: Version ${nextVerNumber} generated with updated governance score ${analysis.score}/100. (Demo action — not saved to production).`
        });
      }, 500);
      return;
    }

    try {
      await api.post(`/content/${id}/revisions`, {
        rawText: revisedText,
        changeNotes: revisionNotes || `Applied AI suggestions for v${(data?.content?.currentVersion || 1) + 1}`,
        autoReview: true
      });
      setRevisionMode(false);
      setRevisionNotes('');
      await fetchContent();
    } catch (err) {
      alert(`Revision submission failed: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    if (PUBLIC_DEMO_MODE) {
      updateDemoContentStatus(id, 'approved');
      recordDemoAuditLog({
        action: 'CONTENT_APPROVED (Demo)',
        user,
        targetId: id,
        details: { title: data?.content?.title, note: 'Approved in Demo Mode' }
      });
      setData((prev) => ({
        ...prev,
        content: { ...prev.content, status: 'approved' }
      }));
      setToastNotice({
        type: 'success',
        title: 'Content Approved for Publication',
        message: 'Demo action recorded: Content marked as Approved. (Demo action — not saved to production).'
      });
      return;
    }

    if (!window.confirm('Confirm publication approval for this version?')) return;
    setActionLoading(true);
    try {
      await api.post(`/content/${id}/approve`, {
        comment: 'Content verified against approved brand guidelines and verified facts.'
      });
      await fetchContent();
    } catch (err) {
      alert(`Approval error: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestChanges = async () => {
    if (!changesModal.reason.trim()) {
      alert('Please state what changes are required.');
      return;
    }

    if (PUBLIC_DEMO_MODE) {
      updateDemoContentStatus(id, 'changes_requested');
      recordDemoAuditLog({
        action: 'CHANGES_REQUESTED (Demo)',
        user,
        targetId: id,
        details: { title: data?.content?.title, reason: changesModal.reason }
      });
      const reviewerComment = {
        _id: `comm-demo-${Date.now()}`,
        author: { name: user?.name || 'Judge (Reviewer)', role: user?.role || 'reviewer' },
        comment: `[Changes Requested]: ${changesModal.reason}`,
        versionNumber: data?.content?.currentVersion || 1,
        createdAt: new Date().toISOString()
      };
      setData((prev) => ({
        ...prev,
        content: { ...prev.content, status: 'changes_requested' },
        comments: [reviewerComment, ...(prev.comments || [])]
      }));
      setChangesModal({ open: false, reason: '' });
      setToastNotice({
        type: 'warning',
        title: 'Changes Requested',
        message: 'Demo action recorded: Submission status set to Changes Requested. (Demo action — not saved to production).'
      });
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/content/${id}/request-changes`, { reason: changesModal.reason });
      setChangesModal({ open: false, reason: '' });
      await fetchContent();
    } catch (err) {
      alert(`Failed to request changes: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.reason.trim()) {
      alert('Please state the reason for rejection.');
      return;
    }

    if (PUBLIC_DEMO_MODE) {
      updateDemoContentStatus(id, 'rejected');
      recordDemoAuditLog({
        action: 'CONTENT_REJECTED (Demo)',
        user,
        targetId: id,
        details: { title: data?.content?.title, reason: rejectModal.reason }
      });
      const reviewerComment = {
        _id: `comm-demo-${Date.now()}`,
        author: { name: user?.name || 'Judge (Reviewer)', role: user?.role || 'reviewer' },
        comment: `[Rejected]: ${rejectModal.reason}`,
        versionNumber: data?.content?.currentVersion || 1,
        createdAt: new Date().toISOString()
      };
      setData((prev) => ({
        ...prev,
        content: { ...prev.content, status: 'rejected' },
        comments: [reviewerComment, ...(prev.comments || [])]
      }));
      setRejectModal({ open: false, reason: '' });
      setToastNotice({
        type: 'error',
        title: 'Content Rejected',
        message: 'Demo action recorded: Submission rejected from publication queue. (Demo action — not saved to production).'
      });
      return;
    }

    setActionLoading(true);
    try {
      await api.post(`/content/${id}/reject`, { reason: rejectModal.reason });
      setRejectModal({ open: false, reason: '' });
      await fetchContent();
    } catch (err) {
      alert(`Failed to reject content: ${err.response?.data?.message || err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (PUBLIC_DEMO_MODE) {
      const demoComment = {
        _id: `comm-${Date.now()}`,
        user: {
          name: user?.name || 'Judge (Demo Reviewer)',
          role: user?.role || 'reviewer'
        },
        text: newComment,
        createdAt: new Date().toISOString()
      };
      setData((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), demoComment]
      }));
      setNewComment('');
      return;
    }

    try {
      await api.post(`/content/${id}/comments`, { comment: newComment });
      setNewComment('');
      await fetchContent();
    } catch (err) {
      alert(`Failed to post comment: ${err.response?.data?.message || err.message}`);
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">High Severity</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300">Low</span>;
      case 'advisory':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-300">Advisory</span>;
    }
  };

  const getEvidenceBadge = (status) => {
    switch (status) {
      case 'contradicted':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">Contradicted</span>;
      case 'unsupported':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-200">Unsupported</span>;
      case 'supported':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">Supported</span>;
      case 'advisory':
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">Advisory</span>;
    }
  };

  const getDecisionBadge = (decision) => {
    switch (decision) {
      case 'accepted':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">Accepted</span>;
      case 'edited':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">Edited</span>;
      case 'dismissed':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200 text-slate-700">Dismissed</span>;
      case 'pending':
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">Pending Action</span>;
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-rose-600 font-semibold">{error || 'Submission not found'}</p>
        <Link to="/content" className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Submissions</span>
        </Link>
      </div>
    );
  }

  const { content, currentVersion, allVersions, findings, comments } = data;
  const isReviewerOrManager = user?.role === 'reviewer' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Studio Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <Link to="/content" className="hover:text-slate-800 flex items-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Submissions</span>
              </Link>
              <span>/</span>
              <span className="font-semibold text-slate-700">{content.campaign}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
              <span>{content.title}</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                v{content.currentVersion}
              </span>
            </h1>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Link
              to={`/content/${content._id}/compare?v1=1&v2=${content.currentVersion}`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
            >
              <History className="w-3.5 h-3.5" />
              <span>Version History ({allVersions?.length || 1})</span>
            </Link>

            <button
              onClick={handleTriggerReReview}
              disabled={actionLoading}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Re-run AI Review</span>
            </button>

            {/* Human Authority Approval Buttons */}
            {isReviewerOrManager && content.status !== 'approved' && content.status !== 'rejected' && (
              <>
                <button
                  type="button"
                  onClick={() => setChangesModal({ open: true, reason: '' })}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => setRejectModal({ open: true, reason: '' })}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                >
                  Reject Content
                </button>
                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Content</span>
                </button>
              </>
            )}

            {content.status === 'approved' && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Approved for Publication</span>
              </div>
            )}

            {content.status === 'rejected' && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Rejected from Publication Queue</span>
              </div>
            )}

            {content.status === 'changes_requested' && !isReviewerOrManager && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Changes Requested</span>
              </div>
            )}
          </div>
        </div>

        {/* Metadata bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100 gap-2">
          <div className="flex items-center space-x-4">
            <span>Type: <strong className="text-slate-800">{content.contentType}</strong></span>
            <span>Creator: <strong className="text-slate-800">{content.creator?.name}</strong></span>
            <span>Status: <strong className="text-slate-800 capitalize">{content.status.replace('_', ' ')}</strong></span>
          </div>

          <div className="flex items-center space-x-2">
            <span>Governance Health:</span>
            <span className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
              (currentVersion?.governanceScore || 100) >= 80
                ? 'bg-emerald-100 text-emerald-800'
                : (currentVersion?.governanceScore || 100) >= 60
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800'
            }`}>
              {currentVersion?.governanceScore !== null ? currentVersion?.governanceScore : '—'}/100
            </span>
          </div>
        </div>
      </div>

      {/* Requirement 6: Visible Demo Action Notification */}
      {toastNotice && (
        <div
          role="alert"
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-200 ${
            toastNotice.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : toastNotice.type === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : toastNotice.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-blue-50 border-blue-300 text-blue-950'
          }`}
        >
          <div className="flex items-start space-x-3">
            {toastNotice.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toastNotice.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />}
            {toastNotice.type === 'error' && <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {toastNotice.type === 'info' && <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
            <div>
              <p className="text-xs font-bold flex items-center space-x-1.5">
                <span>{toastNotice.title}</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-black/10">In-Memory Demo</span>
              </p>
              <p className="text-xs mt-0.5 font-medium opacity-90">{toastNotice.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setToastNotice(null)}
            className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-black/5"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Review Workspace: 2-Column Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Submitted Content & Highlight Viewer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
                <FileCheck2 className="w-4 h-4 text-brand-600" />
                <span>Submitted Content Excerpt View</span>
              </h3>
              <span className="text-[11px] text-slate-400">Version {content.currentVersion}</span>
            </div>

            {/* Content text with interactive highlights */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed font-sans min-h-[180px]">
              {currentVersion?.rawText}
            </div>

            {/* Quick helper note */}
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200/60 text-blue-900 text-[11px] space-y-1">
              <p className="font-semibold flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-blue-600" />
                <span>Human-in-the-Loop Governance</span>
              </p>
              <p className="text-blue-800 leading-normal">
                AI highlights problematic phrases based on brand evidence. You can accept suggestions, customize them, or dismiss with written reasons.
              </p>
            </div>

            {/* Creator Revision Trigger Button */}
            {!revisionMode && content.status !== 'approved' && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleApplyAcceptedSuggestions}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800"
                >
                  Apply Accepted Suggestions to Editor
                </button>
                <button
                  type="button"
                  onClick={() => setRevisionMode(true)}
                  className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors shadow-2xs"
                >
                  Create Revised Version
                </button>
              </div>
            )}
          </div>

          {/* Revision Editor Drawer */}
          {revisionMode && (
            <div className="bg-white p-5 rounded-xl border-2 border-brand-400 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Drafting Version {content.currentVersion + 1}
                </h4>
                <button
                  type="button"
                  onClick={() => setRevisionMode(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>

              <textarea
                rows={6}
                value={revisedText}
                onChange={(e) => setRevisedText(e.target.value)}
                className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 font-sans leading-relaxed"
                placeholder="Make your revisions here..."
              ></textarea>

              <input
                type="text"
                placeholder="Revision notes (e.g. Corrected prohibited trademark to FreshPlus)"
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              />

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRevisionMode(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleSubmitRevision}
                  className="px-4 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 shadow-xs"
                >
                  Submit Revision (v{content.currentVersion + 1})
                </button>
              </div>
            </div>
          )}

          {/* Review Discussion & Comments */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-brand-600" />
              <span>Review Comments & Activity ({comments?.length || 0})</span>
            </h3>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Leave review note..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
              >
                Post
              </button>
            </form>

            <div className="space-y-3 max-h-60 overflow-y-auto pt-2">
              {comments && comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c._id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-800">{c.author?.name} ({c.role})</span>
                      <span>v{c.versionNumber}</span>
                    </div>
                    <p className="text-slate-700 font-sans">{c.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">No review comments yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: AI Findings Cards & Evidence Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">
                AI Findings & Source Citations ({findings?.length || 0})
              </h3>
            </div>
            <span className="text-xs text-slate-500">Strictly Source-Grounded</span>
          </div>

          {/* Guard against displaying zero violations when AI review has not actually completed */}
          {(!currentVersion?.aiReviewCompleted || content.status === 'draft' || content.status === 'pending') ? (
            <div className="p-10 text-center bg-amber-50/70 rounded-xl border border-amber-200 shadow-2xs space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 mx-auto">
                <Clock className="w-6 h-6 text-amber-600 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">AI Governance Review Pending</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                This content version has not yet completed automated pre-publication governance analysis. Click below to scan against brand guidelines, approved facts, and terminology.
              </p>
              <button
                type="button"
                onClick={handleTriggerReReview}
                disabled={actionLoading}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>{actionLoading ? 'Analyzing Content...' : 'Run AI Governance Review'}</span>
              </button>
            </div>
          ) : findings && findings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-slate-900">Zero Governance Violations Detected!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Content successfully scanned and fully verified against all approved brand guidelines, terminology, and facts.
              </p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {findings?.map((f) => (
                <div
                  key={f._id}
                  className={`bg-white p-5 rounded-xl border transition-all ${
                    f.decision === 'accepted'
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : f.decision === 'dismissed'
                      ? 'border-slate-300 opacity-60 bg-slate-50'
                      : 'border-slate-200 shadow-xs hover:border-brand-300'
                  }`}
                >
                  {/* Finding Header */}
                  <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-semibold text-xs text-slate-900">{f.category}</span>
                      {getSeverityBadge(f.severity)}
                      {getEvidenceBadge(f.evidenceStatus)}
                    </div>
                    <div>{getDecisionBadge(f.decision)}</div>
                  </div>

                  {/* Problematic Excerpt */}
                  <div className="mt-3 bg-rose-50/70 p-2.5 rounded-lg border border-rose-200/80">
                    <p className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">Identified Excerpt:</p>
                    <p className="text-sm font-mono text-rose-950 font-bold mt-0.5">"{f.excerpt}"</p>
                  </div>

                  {/* Explanation Reason */}
                  <div className="mt-3 text-xs text-slate-700 leading-relaxed font-sans">
                    <strong className="text-slate-900">Reason: </strong>
                    {f.reason}
                  </div>

                  {/* Verified Evidence & Source Citations */}
                  <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-slate-600 font-semibold text-[11px]">
                      <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                      <span>Approved Source Evidence:</span>
                      <span className="font-mono text-brand-700">[{f.sourceIds?.join(', ')}]</span>
                    </div>
                    {f.sourceExcerpt && (
                      <p className="text-slate-600 italic text-[11px] bg-white p-2 rounded border border-slate-100">
                        "{f.sourceExcerpt}"
                      </p>
                    )}
                  </div>

                  {/* Suggested Rewrite */}
                  {f.suggestedRewrite && (
                    <div className="mt-3 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 space-y-1">
                      <p className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Suggested Correction:</span>
                      </p>
                      <p className="text-xs font-semibold text-emerald-950">
                        {f.decision === 'edited' && f.editedRewrite ? f.editedRewrite : f.suggestedRewrite}
                      </p>
                    </div>
                  )}

                  {/* Dismissal Reason Note if already dismissed */}
                  {f.decision === 'dismissed' && f.dismissalReason && (
                    <div className="mt-3 p-2 rounded bg-slate-200/60 text-slate-700 text-xs">
                      <strong>Dismissal Reason: </strong>{f.dismissalReason}
                    </div>
                  )}

                  {/* Human Action Controls */}
                  {content.status !== 'approved' && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2 text-xs">
                      <button
                        type="button"
                        onClick={() => handleDecision(f._id, 'accepted')}
                        className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          f.decision === 'accepted'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Suggestion</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditModal({ open: true, findingId: f._id, rewrite: f.editedRewrite || f.suggestedRewrite })}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDismissModal({ open: true, findingId: f._id, reason: '' })}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 font-semibold transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Dismiss...</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dismissal Reason Modal */}
      {dismissModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Provide Dismissal Reason</h3>
            <p className="text-xs text-slate-500">
              Governance compliance requires documented justification before bypassing an identified brand violation.
            </p>
            <textarea
              rows={3}
              required
              placeholder="e.g. Legal exception granted for this regional event / Fictional context..."
              value={dismissModal.reason}
              onChange={(e) => setDismissModal({ ...dismissModal, reason: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            ></textarea>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setDismissModal({ open: false, findingId: null, reason: '' })}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDecision(dismissModal.findingId, 'dismissed', { dismissalReason: dismissModal.reason })}
                disabled={!dismissModal.reason.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50"
              >
                Confirm Dismissal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Suggestion Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Customise Suggested Phrasing</h3>
            <p className="text-xs text-slate-500">
              Modify the proposed rewrite to fit your creative voice while keeping it compliant.
            </p>
            <input
              type="text"
              required
              value={editModal.rewrite}
              onChange={(e) => setEditModal({ ...editModal, rewrite: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setEditModal({ open: false, findingId: null, rewrite: '' })}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDecision(editModal.findingId, 'edited', { editedRewrite: editModal.rewrite })}
                disabled={!editModal.rewrite.trim()}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                Save Custom Rewrite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Changes Modal */}
      {changesModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Request Revisions from Creator</h3>
            <p className="text-xs text-slate-500">
              Specify what edits or evidence updates the creator must make before re-submitting.
            </p>
            <textarea
              rows={4}
              required
              placeholder="e.g. Please replace 'Fresh+' with 'FreshPlus' and remove the instant fatigue cure claim..."
              value={changesModal.reason}
              onChange={(e) => setChangesModal({ ...changesModal, reason: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            ></textarea>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setChangesModal({ open: false, reason: '' })}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestChanges}
                disabled={!changesModal.reason.trim()}
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-50"
              >
                Send Change Request
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Reject Content Modal */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center space-x-2 text-rose-600 font-bold text-sm">
              <XCircle className="w-5 h-5" />
              <span>Reject Content Submission</span>
            </div>
            <p className="text-xs text-slate-500">
              State the reason why this draft is rejected from the publication pipeline.
            </p>
            <textarea
              rows={4}
              required
              placeholder="e.g. Fundamental non-compliance with brand standards and regulatory claims..."
              value={rejectModal.reason}
              onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-500"
            ></textarea>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModal({ open: false, reason: '' })}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={!rejectModal.reason.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 disabled:opacity-50 shadow-xs"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
