import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api, { PUBLIC_DEMO_MODE } from '../services/api';
import {
  BookOpen,
  PlusCircle,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Tag,
  Palette,
  Edit,
  Trash2,
  ShieldCheck,
  RefreshCw,
  Scale,
  ExternalLink,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';

export default function BrandKnowledgePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('guidelines'); // 'guidelines' | 'regulatory' | 'products' | 'terminology' | 'assets'
  const [guidelines, setGuidelines] = useState([]);
  const [regulatory, setRegulatory] = useState([]);
  const [products, setProducts] = useState([]);
  const [terminology, setTerminology] = useState([]);
  const [facts, setFacts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGuideline, setNewGuideline] = useState({
    guidelineId: '',
    title: '',
    description: '',
    category: 'Brand Terminology',
    severity: 'high'
  });
  const [newTerm, setNewTerm] = useState({
    terminologyId: '',
    preferredTerm: '',
    prohibitedTerms: '',
    explanation: '',
    category: 'Product Name',
    severity: 'high'
  });
  const [newFact, setNewFact] = useState({
    factId: '',
    statement: '',
    category: 'Ingredients',
    sourceDoc: ''
  });

  const isManager = user?.role === 'manager';

  useEffect(() => {
    fetchKnowledgeData();
  }, [activeTab]);

  const fetchKnowledgeData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'guidelines') {
        const res = await api.get('/guidelines');
        setGuidelines(res.data.internalGuidelines || res.data.guidelines || []);
      } else if (activeTab === 'regulatory') {
        const res = await api.get('/regulatory');
        setRegulatory(res.data.regulatory || []);
      } else if (activeTab === 'products') {
        const [prodRes, factRes] = await Promise.all([
          api.get('/products'),
          api.get('/facts')
        ]);
        setProducts(prodRes.data.products || []);
        setFacts(factRes.data.facts || []);
      } else if (activeTab === 'terminology') {
        const res = await api.get('/terminology');
        setTerminology(res.data.terminology || []);
      } else if (activeTab === 'assets') {
        const res = await api.get('/assets');
        setAssets(res.data.assets || []);
      }
    } catch (err) {
      console.error('Failed to fetch knowledge records', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuideline = async (e) => {
    e.preventDefault();
    if (PUBLIC_DEMO_MODE) {
      alert('Demo Mode (Read-Only): Adding guidelines is disabled to preserve baseline demo data.');
      setShowAddModal(false);
      return;
    }
    try {
      await api.post('/guidelines', newGuideline);
      setShowAddModal(false);
      setNewGuideline({ guidelineId: '', title: '', description: '', category: 'Brand Terminology', severity: 'high' });
      fetchKnowledgeData();
    } catch (err) {
      alert(`Error creating guideline: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreateTerminology = async (e) => {
    e.preventDefault();
    if (PUBLIC_DEMO_MODE) {
      alert('Demo Mode (Read-Only): Adding terminology rules is disabled to preserve baseline demo data.');
      setShowAddModal(false);
      return;
    }
    try {
      await api.post('/terminology', newTerm);
      setShowAddModal(false);
      setNewTerm({ terminologyId: '', preferredTerm: '', prohibitedTerms: '', explanation: '', category: 'Product Name', severity: 'high' });
      fetchKnowledgeData();
    } catch (err) {
      alert(`Error creating terminology: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleCreateFact = async (e) => {
    e.preventDefault();
    if (PUBLIC_DEMO_MODE) {
      alert('Demo Mode (Read-Only): Adding approved facts is disabled to preserve baseline demo data.');
      setShowAddModal(false);
      return;
    }
    try {
      await api.post('/facts', newFact);
      setShowAddModal(false);
      setNewFact({ factId: '', statement: '', category: 'Ingredients', sourceDoc: '' });
      fetchKnowledgeData();
    } catch (err) {
      alert(`Error creating approved fact: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteItem = async (endpoint, id) => {
    if (PUBLIC_DEMO_MODE) {
      alert('Demo Mode (Read-Only): Record deletion is disabled in demo mode.');
      return;
    }
    if (!window.confirm('Delete this approved knowledge record from the governance index?')) return;
    try {
      await api.delete(`/${endpoint}/${id}`);
      fetchKnowledgeData();
    } catch (err) {
      alert(`Failed to delete record: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-brand-600" />
            <span>Brand Knowledge & Regulatory Library</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Ground-truth rules, official statutory regulations (FSSAI, ASCI, CCPA), and approved product facts.
          </p>
        </div>

        {isManager && (
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 shadow-xs transition-colors self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>
              {activeTab === 'guidelines' ? 'Add Guideline' : activeTab === 'terminology' ? 'Add Terminology Rule' : 'Add Approved Fact'}
            </span>
          </button>
        )}
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'guidelines', label: 'Brand Guidelines', icon: ShieldCheck },
            { id: 'regulatory', label: 'Regulatory Standards (FSSAI/ASCI/CCPA)', icon: Scale },
            { id: 'products', label: 'Products & Facts', icon: Package },
            { id: 'terminology', label: 'Terminology Rules', icon: Tag },
            { id: 'assets', label: 'Assets & Palette', icon: Palette }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white font-semibold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-60">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search library..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Tab 1: Internal Brand Guidelines */}
      {activeTab === 'guidelines' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="w-7 h-7 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {guidelines
                .filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()) || g.description.toLowerCase().includes(searchTerm.toLowerCase()) || g.guidelineId.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((g) => (
                  <div key={g._id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                          {g.guidelineId}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">{g.title}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase bg-slate-100 text-slate-700">
                          {g.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          g.severity === 'high' ? 'bg-rose-100 text-rose-800' : g.severity === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {g.severity} severity
                        </span>
                        {isManager && (
                          <button
                            onClick={() => handleDeleteItem('guidelines', g._id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Delete Rule"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{g.description}</p>
                    <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                      <span>Status: <strong className="text-emerald-600 uppercase font-semibold">{g.status}</strong></span>
                      <span>Version: v{g.version}</span>
                      <span>Scope: Internal Brand Policy</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Regulatory Standards (FSSAI / ASCI / CCPA) */}
      {activeTab === 'regulatory' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="w-7 h-7 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              <div className="p-4 bg-amber-50/60 border-b border-amber-200/70 text-xs text-amber-900 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Scale className="w-4 h-4 text-amber-700" />
                  <span>
                    <strong>Statutory Regulatory Knowledge:</strong> Traceable clauses from FSSAI, ASCI, and CCPA governing fruit juice advertising, health claims, and influencer promotions in India.
                  </span>
                </div>
                <span className="text-[11px] text-amber-800 font-semibold uppercase">Official Sources</span>
              </div>

              {regulatory
                .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()) || r.guidelineId.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((r) => (
                  <div key={r._id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          {r.guidelineId}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">{r.title}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-900 text-white">
                          {r.regulatoryBody}
                        </span>
                      </div>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        r.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {r.severity} severity
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-sans">{r.description}</p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                      <p className="text-slate-600 font-medium">
                        <strong>Verified Legal Clause:</strong> {r.sourceClause}
                      </p>
                      {r.supportedRequirement && (
                        <p className="text-slate-600">
                          <strong>Supported Requirement:</strong> {r.supportedRequirement}
                        </p>
                      )}
                      {r.applicability && (
                        <p className="text-slate-500 text-[11px]">
                          <strong>Applicability:</strong> {r.applicability}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-1 text-[11px] border-t border-slate-200/60">
                        <span className="text-slate-400">Effective: {r.version} {r.verificationDate ? `• Verified ${r.verificationDate}` : ''}</span>
                        <a
                          href={r.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-brand-600 hover:text-brand-700 font-semibold inline-flex items-center space-x-1"
                        >
                          <span>Official Gazette / Law Source</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Products Catalogue & Approved Facts */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Fictional Product Catalogue Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">FreshPlus Product Catalogue</h3>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Fictional FMCG Lineup for Demo
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {products.map((p) => (
                <div key={p._id} className="p-5 space-y-2 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {p.productId}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">{p.category}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{p.name}</h4>
                  <p className="text-xs text-slate-600"><strong>Ingredients:</strong> {p.ingredients}</p>
                  <p className="text-xs text-slate-600"><strong>Nutritional Breakdown:</strong> {p.nutritionPer100ml}</p>
                  <p className="text-xs text-slate-500"><strong>Packaging Spec:</strong> {p.packaging}</p>
                  <p className="text-[10px] text-amber-700 italic pt-1">
                    * {p.fictionalDisclaimer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Approved Facts Section */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">Approved Nutritional & Ingredient Facts</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Grounded Knowledge Retrieval Source</span>
            </div>

            <div className="divide-y divide-slate-100">
              {facts
                .filter(f => f.statement.toLowerCase().includes(searchTerm.toLowerCase()) || f.factId.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((f) => (
                  <div key={f._id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {f.factId}
                        </span>
                        <span className="text-xs font-bold text-slate-700 uppercase">{f.category}</span>
                      </div>
                      {isManager && (
                        <button
                          onClick={() => handleDeleteItem('facts', f._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-900 leading-relaxed font-sans">"{f.statement}"</p>
                    <div className="flex flex-col space-y-0.5 text-[11px] text-slate-500">
                      <span><strong>Document Reference:</strong> {f.sourceDoc}</span>
                      {f.disclaimer && (
                        <span className="text-amber-700 italic">{f.disclaimer}</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Terminology List */}
      {activeTab === 'terminology' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="w-7 h-7 border-3 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {terminology
                .filter(t => t.preferredTerm.toLowerCase().includes(searchTerm.toLowerCase()) || t.terminologyId.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((t) => (
                  <div key={t._id} className="p-5 hover:bg-slate-50/70 transition-colors space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {t.terminologyId}
                        </span>
                        <span className="font-bold text-slate-900 text-sm">Preferred: "{t.preferredTerm}"</span>
                      </div>
                      {isManager && (
                        <button
                          onClick={() => handleDeleteItem('terminology', t._id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-semibold text-rose-700">Prohibited Variations:</span>
                      <div className="flex flex-wrap gap-1">
                        {t.prohibitedTerms?.map((term, i) => (
                          <span key={i} className="font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 line-through">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{t.explanation}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Assets & Palette */}
      {activeTab === 'assets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assets.map((asset) => (
            <div key={asset._id} className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-brand-700">{asset.assetId}</span>
                <span className="text-xs font-semibold text-slate-500">{asset.type}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{asset.name}</h3>
              <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono text-slate-700 overflow-x-auto">
                <pre>{JSON.stringify(asset.details, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal for Manager */}
      {showAddModal && isManager && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">
              {activeTab === 'guidelines' ? 'Create New Brand Guideline' : activeTab === 'terminology' ? 'Add Terminology Rule' : 'Add Approved Fact'}
            </h3>

            {activeTab === 'guidelines' && (
              <form onSubmit={handleCreateGuideline} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Guideline ID</label>
                  <input
                    type="text"
                    required
                    placeholder="GUIDE-010"
                    value={newGuideline.guidelineId}
                    onChange={(e) => setNewGuideline({ ...newGuideline, guidelineId: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sustainable Packaging Messaging"
                    value={newGuideline.title}
                    onChange={(e) => setNewGuideline({ ...newGuideline, title: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Rule Description</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Clear description of what content must or must not say..."
                    value={newGuideline.description}
                    onChange={(e) => setNewGuideline({ ...newGuideline, description: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Create & Index</button>
                </div>
              </form>
            )}

            {activeTab === 'terminology' && (
              <form onSubmit={handleCreateTerminology} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Terminology ID</label>
                  <input
                    type="text"
                    required
                    placeholder="TERM-005"
                    value={newTerm.terminologyId}
                    onChange={(e) => setNewTerm({ ...newTerm, terminologyId: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Preferred Brand Term</label>
                  <input
                    type="text"
                    required
                    placeholder="FreshPlus"
                    value={newTerm.preferredTerm}
                    onChange={(e) => setNewTerm({ ...newTerm, preferredTerm: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Prohibited Variations (comma-separated)</label>
                  <input
                    type="text"
                    required
                    placeholder="Fresh+, Fresh Plus, fresh plus"
                    value={newTerm.prohibitedTerms}
                    onChange={(e) => setNewTerm({ ...newTerm, prohibitedTerms: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Explanation</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Reason why the term is preferred..."
                    value={newTerm.explanation}
                    onChange={(e) => setNewTerm({ ...newTerm, explanation: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Save Rule</button>
                </div>
              </form>
            )}

            {activeTab === 'facts' && (
              <form onSubmit={handleCreateFact} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700">Fact ID</label>
                  <input
                    type="text"
                    required
                    placeholder="FACT-007"
                    value={newFact.factId}
                    onChange={(e) => setNewFact({ ...newFact, factId: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Verified Statement</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Verified factual statement..."
                    value={newFact.statement}
                    onChange={(e) => setNewFact({ ...newFact, statement: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  ></textarea>
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Source Verification Document</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FSSAI Certification #2026-99"
                    value={newFact.sourceDoc}
                    onChange={(e) => setNewFact({ ...newFact, sourceDoc: e.target.value })}
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700">Index Fact</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
