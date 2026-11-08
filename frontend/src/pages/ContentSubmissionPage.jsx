import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { PUBLIC_DEMO_MODE } from '../services/api';
import { FileText, Sparkles, Send, ArrowLeft, AlertCircle } from 'lucide-react';

export default function ContentSubmissionPage() {
  const [formData, setFormData] = useState({
    title: '',
    contentType: 'Social Media Post',
    campaign: 'Summer Launch 2026',
    rawText: '',
    autoReview: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoadDemoSample = () => {
    setFormData({
      title: 'Summer Launch - High Energy Teaser',
      contentType: 'Social Media Post',
      campaign: 'Summer Launch 2026',
      rawText: "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!",
      autoReview: true
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.rawText.trim()) {
      setError('Please provide a title and submission text.');
      return;
    }

    setError('');
    setLoading(true);

    if (PUBLIC_DEMO_MODE) {
      setTimeout(() => {
        setLoading(false);
        navigate('/content/demo-submission-1');
      }, 400);
      return;
    }

    try {
      const res = await api.post('/content', formData);
      const newId = res.data.content._id;
      navigate(`/content/${newId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit content. Please check inputs.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Submit Content for Review</h1>
          <p className="text-xs text-slate-500 mt-1">
            Pre-publication governance checks your copy against approved guidelines, facts, and terminology.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadDemoSample}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold hover:bg-brand-100 transition-colors shadow-2xs"
          title="Fills the exact prompt demo scenario"
        >
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Load Hackathon Test Sample</span>
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Content Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Summer Launch Campaign - Instagram Reel Copy"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Content Type</label>
            <select
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            >
              <option value="Social Media Post">Social Media Post</option>
              <option value="Advertisement">Advertisement</option>
              <option value="Marketing Email">Marketing Email</option>
              <option value="Website Copy">Website Copy</option>
              <option value="Product Description">Product Description</option>
              <option value="General Marketing">General Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign</label>
            <input
              type="text"
              placeholder="e.g. Summer Launch 2026"
              value={formData.campaign}
              onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Content Text to Review <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400 font-mono">
              {formData.rawText.length} characters
            </span>
          </div>
          <textarea
            required
            rows={7}
            placeholder="Paste or write your marketing copy here..."
            value={formData.rawText}
            onChange={(e) => setFormData({ ...formData, rawText: e.target.value })}
            className="w-full px-3.5 py-2.5 text-sm font-sans bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 leading-relaxed"
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.autoReview}
              onChange={(e) => setFormData({ ...formData, autoReview: e.target.checked })}
              className="rounded text-brand-600 focus:ring-brand-500"
            />
            <span>Automatically trigger AI Review upon submission</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            {loading ? (
              <span>Processing AI Review...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit & Review</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
