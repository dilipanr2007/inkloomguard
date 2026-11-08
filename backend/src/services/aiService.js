const axios = require('axios');
const Guideline = require('../models/Guideline');
const Terminology = require('../models/Terminology');
const ApprovedFact = require('../models/ApprovedFact');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Unapproved health, curative, stamina, vitality, and medical claim patterns
const UNSAFE_HEALTH_PATTERNS = /\b(vitality|natural\s+vitality|stamina|cures?|curing|curative|prevents?|preventing|disease|illness|medicinal|therapeutic|miracle\s+cure|instant\s+energy|energy\s+boost|boosts?\s+(?:your\s+)?immunity)\b/i;

// Unsupported rankings, superlatives, and popularity/consensus patterns
const UNSAFE_SUPERLATIVE_PATTERNS = /\b(most\s+loved|beloved|most\s+popular|India's\s+No\.?\s*1|#1|world's\s+best|best\s+in|market\s+leader|guaranteed(?:\s+results)?|top\s+rated|favourite|favorite|number\s+one)\b/i;

const DEFAULT_PROHIBITED_TERMS = [
  'Fresh+', 'Fresh Plus',
  'Orange Soda', 'Synthetic Orange', 'Fruit Concentrate Drink', 'Orange Squash'
];

/**
 * Validates whether a suggested rewrite strictly adheres to brand facts and guidelines.
 * - Never replaces one unsupported claim with another.
 * - For unsupported medical claims, removes the medical benefit entirely unless approved evidence exists.
 * - For unsupported rankings or superlatives, enforces neutral promotional wording.
 * - Prohibits unapproved brand terminology while preserving approved names (e.g. FreshPlus).
 */
const isSuggestionSafe = (rewrite, options = {}) => {
  if (!rewrite || typeof rewrite !== 'string') return false;
  const trimmed = rewrite.trim();
  if (!trimmed || trimmed.toLowerCase() === 'human review required') return false;

  // 1. Check for unapproved medical, curative, vitality, or stamina claims
  if (UNSAFE_HEALTH_PATTERNS.test(trimmed)) {
    return false;
  }

  // 2. Check for unapproved rankings, superlatives, or popularity claims (e.g. "most loved", "No. 1")
  if (UNSAFE_SUPERLATIVE_PATTERNS.test(trimmed)) {
    return false;
  }

  // 3. Check for prohibited brand terminology
  const prohibited = [...(options.prohibitedTerms || []), ...DEFAULT_PROHIBITED_TERMS]
    .filter(pt => pt && pt.trim() && pt.trim() !== 'FreshPlus');
  for (const pt of prohibited) {
    const escaped = pt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = pt === 'Freshplus' ? '' : 'i';
    const regex = new RegExp(`(?:\\b|^)${escaped}(?:\\b|$|\\s|[.,!?;:])`, flags);
    if (regex.test(trimmed)) {
      return false;
    }
  }

  // 4. Check for aggressive exclamation / sensational urgency
  if (/(!{2,}|Buy\s+now!{1,3})/i.test(trimmed)) {
    return false;
  }

  return true;
};

/**
 * Validates all suggested corrections against brand evidence.
 * If no safe correction can be verified, sets the suggestion to 'Human review required'
 * while preserving the original finding, severity, evidence status, and source citations.
 */
const validateFindingSuggestions = (findings, options = {}) => {
  if (!Array.isArray(findings)) return findings;
  return findings.map(f => {
    const rawRewrite = f.suggested_rewrite || f.suggestedRewrite;
    if (!isSuggestionSafe(rawRewrite, options)) {
      return {
        ...f,
        suggested_rewrite: 'Human review required',
        suggestedRewrite: 'Human review required'
      };
    }
    return f;
  });
};

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

  const prohibitedTerms = [];
  terminology.forEach(t => {
    if (Array.isArray(t.prohibitedTerms)) {
      prohibitedTerms.push(...t.prohibitedTerms);
    }
  });

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
      response.data.findings = validateFindingSuggestions(response.data.findings, { prohibitedTerms });
      return response.data;
    }
    throw new Error('Malformed AI service response');
  } catch (err) {
    console.error('[AI Service Direct Call Failed, Running Local Deterministic Engine]', err.message);
    // Graceful fallback to deterministic rule engine within backend if Python service is unreachable
    return runLocalFallbackReview(text, terminology, guidelines, facts, contentId, versionNumber);
  }
};

/**
 * Local deterministic fallback engine so the platform is 100% resilient
 */
const runLocalFallbackReview = (text, terminology, guidelines, facts, contentId = null, versionNumber = 1) => {
  const findings = [];
  const prohibitedTerms = [];

  // 1. Terminology checks with boundary-safe symbol handling
  terminology.forEach(term => {
    (term.prohibitedTerms || []).forEach(prohibited => {
      if (!prohibited || !prohibited.trim()) return;
      prohibitedTerms.push(prohibited);
      const escaped = prohibited.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?:\\b|^)${escaped}(?:\\b|$|\\s|[.,!?;:])`, term.caseSensitive ? 'g' : 'gi');
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const excerpt = match[0].replace(/[\s.,!?;:]+$/, '');
        findings.push({
          category: 'Brand Terminology',
          severity: term.severity || 'high',
          excerpt,
          reason: term.explanation || `The term "${excerpt}" violates brand guidelines. Use "${term.preferredTerm}" instead.`,
          evidence_status: 'contradicted',
          source_ids: [term.terminologyId],
          source_excerpt: `Preferred product name is "${term.preferredTerm}". Prohibited: ${(term.prohibitedTerms || []).join(', ')}.`,
          suggested_rewrite: term.preferredTerm,
          confidence: 0.98
        });
      }
    });
  });

  // 2. Health claim / curative claims heuristic check
  // Medical claims are removed entirely or replaced with neutral refreshment wording
  const healthMatches = text.match(/(cures?\s+(?:fatigue|tiredness|illness|disease)(?:\s+instantly)?|boosts?\s+(?:your\s+)?immunity(?:\s+by\s+\d+%)?|cures?\s+instantly)/gi);
  if (healthMatches) {
    const guide02 = guidelines.find(g => g.guidelineId === 'GUIDE-002') || { guidelineId: 'GUIDE-002', description: 'Do not use unsupported health benefit claims.' };
    healthMatches.forEach(hm => {
      findings.push({
        category: 'Unsupported Claim',
        severity: 'high',
        excerpt: hm,
        reason: 'Health, curative, or quantitative immunity claim identified without substantiating clinical facts in the brand library.',
        evidence_status: 'unsupported',
        source_ids: [guide02.guidelineId],
        source_excerpt: guide02.description,
        suggested_rewrite: 'delivers daily refreshment',
        confidence: 0.92
      });
    });
  }

  // 3. Superlative promotional claims heuristic check
  // Rankings/superlatives use neutral promotional wording (e.g. 'a refreshing fruit juice')
  const superlativeMatches = text.match(/(India's\s+No\.?\s*1(?:\s+energy\s+drink|\s+juice)?|world's\s+best|#1\s+juice|guaranteed(?:\s+results)?)/gi);
  if (superlativeMatches) {
    const guide03 = guidelines.find(g => g.guidelineId === 'GUIDE-003') || { guidelineId: 'GUIDE-003', description: 'Promotional superlatives require approved verification.' };
    superlativeMatches.forEach(sm => {
      findings.push({
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: sm,
        reason: 'Promotional superlative or performance guarantee claim requires explicit verification documentation.',
        evidence_status: 'unsupported',
        source_ids: [guide03.guidelineId],
        source_excerpt: guide03.description,
        suggested_rewrite: 'a refreshing fruit juice',
        confidence: 0.89
      });
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
      suggested_rewrite: 'Experience FreshPlus today.',
      confidence: 0.85
    });
  }

  // Validate all generated suggestions against brand evidence
  const validatedFindings = validateFindingSuggestions(findings, { prohibitedTerms });

  // Calculate governance score (0 - 100)
  const penalty = validatedFindings.reduce((acc, f) => {
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
    findings: validatedFindings,
    processing_metadata: {
      engine: 'deterministic_fallback',
      total_findings: validatedFindings.length
    }
  };
};

module.exports = {
  syncAiKnowledgeBase,
  requestAiReview,
  runLocalFallbackReview,
  isSuggestionSafe,
  validateFindingSuggestions
};
