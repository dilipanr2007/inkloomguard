const axios = require('axios');
const Guideline = require('../models/Guideline');
const Terminology = require('../models/Terminology');
const ApprovedFact = require('../models/ApprovedFact');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

/**
 * Sync active brand knowledge base to AI Service's vector retrieval index
 */
const syncAiKnowledgeBase = async () => {
  try {
    const guidelines = await Guideline.find({ status: 'active' });
    const terminology = await Terminology.find({ status: 'active' });
    const facts = await ApprovedFact.find({ status: 'active' });

    const payload = {
      guidelines: guidelines.map(g => ({
        id: g.guidelineId,
        title: g.title,
        text: g.description,
        category: g.category,
        severity: g.severity
      })),
      terminology: terminology.map(t => ({
        id: t.terminologyId,
        preferred_term: t.preferredTerm,
        prohibited_terms: t.prohibitedTerms,
        explanation: t.explanation,
        severity: t.severity,
        case_sensitive: t.caseSensitive
      })),
      facts: facts.map(f => ({
        id: f.factId,
        statement: f.statement,
        source: f.sourceDoc,
        category: f.category
      }))
    };

    const res = await axios.post(`${AI_SERVICE_URL}/v1/index`, payload, { timeout: 10000 });
    return res.data;
  } catch (error) {
    console.warn('[AI Service Sync Notice]', error.message);
    return null;
  }
};

/**
 * Call FastAPI AI Review Pipeline
 */
const requestAiReview = async ({ contentId, versionNumber, text, contentType }) => {
  // Fetch active knowledge records to ensure AI service has fresh context
  const guidelines = await Guideline.find({ status: 'active' });
  const terminology = await Terminology.find({ status: 'active' });
  const facts = await ApprovedFact.find({ status: 'active' });

  const payload = {
    content_id: contentId.toString(),
    version_number: versionNumber,
    submitted_text: text,
    content_type: contentType || 'General Marketing',
    knowledge: {
      guidelines: guidelines.map(g => ({
        id: g.guidelineId,
        title: g.title,
        text: g.description,
        category: g.category,
        severity: g.severity
      })),
      terminology: terminology.map(t => ({
        id: t.terminologyId,
        preferred_term: t.preferredTerm,
        prohibited_terms: t.prohibitedTerms,
        explanation: t.explanation,
        severity: t.severity,
        case_sensitive: t.caseSensitive
      })),
      facts: facts.map(f => ({
        id: f.factId,
        statement: f.statement,
        source: f.sourceDoc,
        category: f.category
      }))
    }
  };

  try {
    const response = await axios.post(`${AI_SERVICE_URL}/v1/review`, payload, {
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data && response.data.findings) {
      return response.data;
    }
    throw new Error('Malformed AI service response');
  } catch (err) {
    console.error('[AI Service Direct Call Failed, Running Local Deterministic Engine]', err.message);
    // Graceful fallback to deterministic rule engine within backend if Python service is unreachable
    return runLocalFallbackReview(text, terminology, guidelines, facts);
  }
};

/**
 * Local deterministic fallback engine so the platform is 100% resilient
 */
const runLocalFallbackReview = (text, terminology, guidelines, facts) => {
  const findings = [];

  // 1. Terminology checks
  terminology.forEach(term => {
    term.prohibitedTerms.forEach(prohibited => {
      const regex = new RegExp(`\\b${prohibited.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, term.caseSensitive ? 'g' : 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        findings.push({
          category: 'Brand Terminology',
          severity: term.severity || 'high',
          excerpt: match[0],
          reason: term.explanation || `The term "${match[0]}" violates brand guidelines. Use "${term.preferredTerm}" instead.`,
          evidence_status: 'contradicted',
          source_ids: [term.terminologyId],
          source_excerpt: `Preferred product name is "${term.preferredTerm}". Prohibited: ${term.prohibitedTerms.join(', ')}.`,
          suggested_rewrite: term.preferredTerm,
          confidence: 0.98
        });
      }
    });
  });

  // 2. Health claim / curative claims heuristic check
  const healthMatches = text.match(/(cures?|prevents?|instant(ly)?|fatigue|disease|miracle)/gi);
  if (healthMatches) {
    const guide02 = guidelines.find(g => g.guidelineId === 'GUIDE-002') || { guidelineId: 'GUIDE-002', description: 'Do not use unsupported health benefit claims.' };
    const excerptMatch = text.match(/cures?\s+fatigue(\s+instantly)?/i) || [healthMatches[0]];
    findings.push({
      category: 'Unsupported Claim',
      severity: 'high',
      excerpt: excerptMatch[0],
      reason: 'Health or medical outcome claim identified without substantiating clinical facts in the brand library.',
      evidence_status: 'unsupported',
      source_ids: [guide02.guidelineId],
      source_excerpt: guide02.description,
      suggested_rewrite: 'supports daily refreshment and active hydration',
      confidence: 0.92
    });
  }

  // 3. Superlative promotional claims heuristic check
  const superlativeMatches = text.match(/(India's\s+No\.?\s*1|world's\s+best|#1\s+juice|guaranteed)/gi);
  if (superlativeMatches) {
    const guide03 = guidelines.find(g => g.guidelineId === 'GUIDE-003') || { guidelineId: 'GUIDE-003', description: 'Promotional superlatives require approved verification.' };
    findings.push({
      category: 'Promotional Claim',
      severity: 'medium',
      excerpt: superlativeMatches[0],
      reason: 'Promotional superlative claim requires explicit verification documentation.',
      evidence_status: 'unsupported',
      source_ids: [guide03.guidelineId],
      source_excerpt: guide03.description,
      suggested_rewrite: 'one of India’s most loved fruit juices',
      confidence: 0.89
    });
  }

  // 4. Tone / Punctuation check (excessive exclamation marks)
  const toneMatches = text.match(/(!{2,}|Buy now!{1,3})/i);
  if (toneMatches) {
    const guide04 = guidelines.find(g => g.guidelineId === 'GUIDE-004') || { guidelineId: 'GUIDE-004', description: 'Use a professional, friendly, and informative tone.' };
    findings.push({
      category: 'Brand Tone',
      severity: 'advisory',
      excerpt: toneMatches[0],
      reason: 'Aggressive promotional punctuation conflicts with our friendly, professional brand tone.',
      evidence_status: 'advisory',
      source_ids: [guide04.guidelineId],
      source_excerpt: guide04.description,
      suggested_rewrite: 'Experience the freshness today.',
      confidence: 0.85
    });
  }

  // Calculate governance score (0 - 100)
  const penalty = findings.reduce((acc, f) => {
    if (f.severity === 'high') return acc + 25;
    if (f.severity === 'medium') return acc + 15;
    if (f.severity === 'low') return acc + 8;
    return acc + 4;
  }, 0);
  const score = Math.max(10, 100 - penalty);

  return {
    content_id: contentId,
    version_number: versionNumber,
    governance_score: score,
    findings,
    processing_metadata: {
      engine: 'deterministic_fallback',
      total_findings: findings.length
    }
  };
};

module.exports = {
  syncAiKnowledgeBase,
  requestAiReview
};
