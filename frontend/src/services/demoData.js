// Public Demo Mode Data for CodeNexus India 2026 Judging
// Source-grounded Brand Governance for FreshPlus Global

export const DEMO_USERS = {
  manager: {
    _id: 'demo-manager-id',
    name: 'Rohan Deshmukh (Manager)',
    email: 'manager@freshplus.io',
    role: 'manager',
    organization: 'FreshPlus Global',
    department: 'Global Brand Governance',
    isDemo: true
  },
  reviewer: {
    _id: 'demo-reviewer-id',
    name: 'Arjun Mehta (Reviewer)',
    email: 'reviewer@freshplus.io',
    role: 'reviewer',
    organization: 'FreshPlus Global',
    department: 'Legal & Compliance',
    isDemo: true
  },
  creator: {
    _id: 'demo-creator-id',
    name: 'Priya Sharma (Creator)',
    email: 'creator@freshplus.io',
    role: 'creator',
    organization: 'FreshPlus Global',
    department: 'Creative & Social Media',
    isDemo: true
  }
};

// Accurately reflects the curated demo submissions: 1 approved, 2 in review (1 ai_reviewed + 1 in_review)
export const DEMO_STATS = {
  totalSubmissions: 3,
  approvedSubmissions: 1,
  inReviewSubmissions: 2,
  changesRequested: 0,
  draftSubmissions: 0,
  totalFindings: 6,
  highSeverityFlags: 2,
  dismissedFindings: 1,
  acceptedFindings: 0,
  averageGovernanceScore: 71,
  // Backward compatibility aliases
  pendingReview: 2,
  approvedCount: 1,
  changesRequestedCount: 0,
  aiFlaggedIssues: 6,
  complianceRate: 71
};

export const DEMO_CONTENTS = [
  {
    _id: 'demo-submission-1',
    title: 'Summer Launch Campaign - Social Teaser',
    contentType: 'Social Media Post',
    campaign: 'Summer Launch 2026',
    status: 'ai_reviewed',
    currentVersion: 1,
    governanceScore: 42,
    totalFindings: 4,
    creator: {
      name: 'Priya Sharma (Creator)',
      email: 'creator@freshplus.io'
    },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'demo-submission-2',
    title: 'Valencia Orange - Morning Energy Ad Copy',
    contentType: 'Marketing Ad Copy',
    campaign: 'Daily Nutrition 2026',
    status: 'in_review',
    currentVersion: 1,
    governanceScore: 74,
    totalFindings: 2,
    creator: {
      name: 'Priya Sharma (Creator)',
      email: 'creator@freshplus.io'
    },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    _id: 'demo-submission-3',
    title: 'Pure Valencia Orange - Retail Pack Description',
    contentType: 'Packaging Copy',
    campaign: 'Retail Packaging 2026',
    status: 'approved',
    currentVersion: 2,
    governanceScore: 98,
    totalFindings: 0,
    creator: {
      name: 'Priya Sharma (Creator)',
      email: 'creator@freshplus.io'
    },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// Rich, realistic details for each submission in the review studio
export const DEMO_SUBMISSIONS_MAP = {
  'demo-submission-1': {
    content: DEMO_CONTENTS[0],
    currentVersion: {
      _id: 'ver-1-1',
      contentId: 'demo-submission-1',
      versionNumber: 1,
      rawText: "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!",
      changeNotes: 'Initial draft submitted for pre-publication governance review',
      aiReviewCompleted: true,
      governanceScore: 42,
      totalFindings: 4,
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    allVersions: [
      {
        _id: 'ver-1-1',
        versionNumber: 1,
        rawText: "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!",
        changeNotes: 'Initial draft submitted for pre-publication governance review',
        governanceScore: 42,
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        _id: 'ver-1-2',
        versionNumber: 2,
        rawText: "FreshPlus delivers refreshing daily refreshment! Our refreshing fruit juice is finally here. Shop now.",
        changeNotes: 'Revised copy applying AI governance suggestions and removing ungrounded claims',
        governanceScore: 96,
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ],
    findings: [
      {
        _id: 'f1-1',
        category: 'Brand Terminology',
        severity: 'high',
        excerpt: 'Fresh+',
        reason: 'The prohibited term "Fresh+" violates brand guidelines. The approved and legally registered name is "FreshPlus". Never separate the words or substitute "+" for "Plus".',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-001', 'TERM-001'],
        sourceExcerpt: 'The preferred and legally registered product name is "FreshPlus". Prohibited: Fresh+, Fresh Plus, FRESH+.',
        suggestedRewrite: 'FreshPlus',
        confidence: 0.98,
        decision: 'pending'
      },
      {
        _id: 'f1-2',
        category: 'Unsupported Claim',
        severity: 'high',
        excerpt: 'cures fatigue instantly!',
        reason: 'All statements asserting curative, medicinal, disease prevention, or instant stamina outcomes are strictly prohibited unless substantiated by an approved clinical fact in the brand repository.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002'],
        sourceExcerpt: 'Do not use unsupported health benefit claims. Curative, medicinal, or instant disease outcomes are strictly prohibited.',
        suggestedRewrite: 'delivers daily refreshment',
        confidence: 0.96,
        decision: 'pending'
      },
      {
        _id: 'f1-3',
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: "India's No. 1",
        reason: 'Promotional superlatives such as "India\'s No. 1" or market dominance assertions require documented, independently verified market share audit evidence in the brand repository before publication.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-003'],
        sourceExcerpt: 'Promotional superlatives and performance guarantees require documented evidence in the brand repository before publication.',
        suggestedRewrite: 'a refreshing fruit juice',
        confidence: 0.92,
        decision: 'pending'
      },
      {
        _id: 'f1-4',
        category: 'Brand Style & Tone',
        severity: 'low',
        excerpt: 'Buy now!!!',
        reason: 'Multiple exclamation points (!!!) and aggressive promotional shouting violate our refined editorial voice standards.',
        evidenceStatus: 'flagged',
        sourceIds: ['GUIDE-004'],
        sourceExcerpt: 'Maintain a clean, premium, trustworthy editorial voice. Avoid multiple exclamation marks and aggressive clickbait.',
        suggestedRewrite: 'Shop now.',
        confidence: 0.89,
        decision: 'pending'
      }
    ],
    comments: [
      {
        _id: 'comm-1-1',
        user: {
          _id: 'demo-reviewer-id',
          name: 'Arjun Mehta (Reviewer)',
          role: 'reviewer'
        },
        text: 'Priya, please adopt the approved "FreshPlus" spelling, remove the instant cure claim, and tone down the promotional superlatives before we can approve this for publication.',
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
      }
    ]
  },
  'demo-submission-2': {
    content: DEMO_CONTENTS[1],
    currentVersion: {
      _id: 'ver-2-1',
      contentId: 'demo-submission-2',
      versionNumber: 1,
      rawText: "Drink FreshPlus every morning for guaranteed 100% natural energy. The best juice in India to power through workdays.",
      changeNotes: 'Initial draft for Q2 digital campaign',
      aiReviewCompleted: true,
      governanceScore: 74,
      totalFindings: 2,
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    allVersions: [
      {
        _id: 'ver-2-1',
        versionNumber: 1,
        rawText: "Drink FreshPlus every morning for guaranteed 100% natural energy. The best juice in India to power through workdays.",
        changeNotes: 'Initial draft for Q2 digital campaign',
        governanceScore: 74,
        createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ],
    findings: [
      {
        _id: 'f2-1',
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: 'guaranteed 100% natural energy',
        reason: 'Promotional guarantees violate fair advertising standards without verified clinical documentation in the brand repository.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-003'],
        sourceExcerpt: 'Promotional superlatives and performance guarantees require documented evidence in the brand repository before publication.',
        suggestedRewrite: 'refreshing natural energy',
        confidence: 0.94,
        decision: 'pending'
      },
      {
        _id: 'f2-2',
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: 'best juice in India',
        reason: 'Promotional superlatives such as "best juice in India" require documented, independently verified market share audit evidence before publication.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-003'],
        sourceExcerpt: 'Promotional superlatives such as "India\'s No. 1", "Best in the world", or market leadership claims require documented, verified evidence in the brand repository before publication.',
        suggestedRewrite: 'a delicious citrus juice',
        confidence: 0.93,
        decision: 'pending'
      }
    ],
    comments: [
      {
        _id: 'comm-2-1',
        user: {
          _id: 'demo-reviewer-id',
          name: 'Arjun Mehta (Reviewer)',
          role: 'reviewer'
        },
        text: 'Please soften the "guaranteed" wording and reference our approved FACT-002 (24mg natural Vitamin C) instead of calling it the best juice in India.',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
      }
    ]
  },
  'demo-submission-3': {
    content: DEMO_CONTENTS[2],
    currentVersion: {
      _id: 'ver-3-2',
      contentId: 'demo-submission-3',
      versionNumber: 2,
      rawText: "FreshPlus 100% Pure Pasteurized Orange Juice contains zero added sugar and delivers 24mg of natural Vitamin C per 100ml. Bottled in 100% recyclable rPET.",
      changeNotes: 'Adopted approved facts FACT-001, FACT-002, and FACT-003',
      aiReviewCompleted: true,
      governanceScore: 98,
      totalFindings: 0,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    allVersions: [
      {
        _id: 'ver-3-1',
        versionNumber: 1,
        rawText: "Fresh Plus pure juice with natural energy.",
        changeNotes: 'First draft',
        governanceScore: 78,
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      },
      {
        _id: 'ver-3-2',
        versionNumber: 2,
        rawText: "FreshPlus 100% Pure Pasteurized Orange Juice contains zero added sugar and delivers 24mg of natural Vitamin C per 100ml. Bottled in 100% recyclable rPET.",
        changeNotes: 'Corrected terminology to FreshPlus and cited verified facts',
        governanceScore: 98,
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    findings: [],
    comments: [
      {
        _id: 'comm-3-1',
        user: {
          _id: 'demo-reviewer-id',
          name: 'Arjun Mehta (Reviewer)',
          role: 'reviewer'
        },
        text: '[APPROVED]: Fully verified against GUIDE-001, FACT-001, FACT-002, and FACT-003. Approved for commercial retail packaging.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  }
};

// Default submission details pointing to submission 1
export const DEMO_SUBMISSION_DETAILS = DEMO_SUBMISSIONS_MAP['demo-submission-1'];

// Helper to look up submission details dynamically by ID
export const getDemoSubmissionDetails = (id) => {
  if (id && DEMO_SUBMISSIONS_MAP[id]) {
    return DEMO_SUBMISSIONS_MAP[id];
  }
  return DEMO_SUBMISSION_DETAILS;
};

export const DEMO_GUIDELINES = [
  {
    _id: 'g1',
    guidelineId: 'GUIDE-001',
    title: 'Approved Product Name Spelling',
    description: 'The preferred and legally registered product name is "FreshPlus". Never separate the words or substitute the plus sign "+" for "Plus".',
    category: 'Brand Terminology',
    severity: 'high',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g2',
    guidelineId: 'GUIDE-002',
    title: 'Prohibition of Unsupported Health Claims',
    description: 'Do not use unsupported health benefit claims. All statements asserting curative, medicinal, disease prevention, or instant stamina outcomes are strictly prohibited unless substantiated by an approved clinical fact in the brand repository.',
    category: 'Unsupported Claim',
    severity: 'high',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g3',
    guidelineId: 'GUIDE-003',
    title: 'Promotional Superlatives and Market Dominance Claims',
    description: 'Promotional superlatives such as "India\'s No. 1", "Best in the world", or market leadership claims require documented, verified evidence in the brand repository before publication.',
    category: 'Promotional Claim',
    severity: 'medium',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g4',
    guidelineId: 'GUIDE-004',
    title: 'Brand Tone and Voice Consistency',
    description: 'Maintain a clean, premium, and trustworthy editorial voice. Avoid multiple exclamation marks (e.g. "Buy now!!!"), aggressive clickbait, and hyperbolic slang.',
    category: 'Brand Style & Tone',
    severity: 'low',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g5',
    guidelineId: 'GUIDE-005',
    title: 'Mandatory FSSAI Compliance and Packaging Disclaimers',
    description: 'Every promotional asset presenting nutritional benefits must incorporate official FSSAI licensing and reference 100% rPET recyclable packaging standards.',
    category: 'Regulatory Compliance',
    severity: 'high',
    status: 'active',
    version: '1.0'
  }
];

export const DEMO_TERMINOLOGY = [
  {
    _id: 't1',
    terminologyId: 'TERM-001',
    preferredTerm: 'FreshPlus',
    prohibitedTerms: ['Fresh+', 'Fresh Plus', 'FRESH+', 'Freshplus'],
    explanation: 'The brand name is a single camel-case word "FreshPlus" with capital F and capital P.',
    category: 'Product Name',
    severity: 'high'
  },
  {
    _id: 't2',
    terminologyId: 'TERM-002',
    preferredTerm: '100% Pure Pasteurized Juice',
    prohibitedTerms: ['Orange Soda', 'Synthetic Orange', 'Fruit Concentrate Drink', 'Orange Squash'],
    explanation: 'FreshPlus is 100% pure pasteurized juice, not a diluted concentrate or synthetic carbonated soda.',
    category: 'Ingredient Quality',
    severity: 'medium'
  },
  {
    _id: 't3',
    terminologyId: 'TERM-003',
    preferredTerm: 'Zero Added Cane Sugar',
    prohibitedTerms: ['Diet Drink', 'Zero Calorie', 'Sugar Free'],
    explanation: 'Our products contain natural fruit sugars; "Sugar Free" violates consumer protection standards.',
    category: 'Nutritional Messaging',
    severity: 'high'
  }
];

export const DEMO_FACTS = [
  {
    _id: 'fct-1',
    factId: 'FACT-001',
    statement: 'FreshPlus Valencia Orange juice contains 100% pure fruit juice with zero added refined sugars or artificial preservatives.',
    category: 'Ingredients',
    sourceDoc: 'FSSAI Certified Lab Analysis #FP-2025-08',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'fct-2',
    factId: 'FACT-002',
    statement: 'FreshPlus Orange Juice delivers 24mg of natural Vitamin C per 100ml serving, satisfying 60% of daily recommended nutritional intake.',
    category: 'Nutrition',
    sourceDoc: 'National Institute of Nutrition Analysis #NIN-2025-41',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'fct-3',
    factId: 'FACT-003',
    statement: 'FreshPlus bottles are crafted from 100% recycled rPET and are fully recyclable across India.',
    category: 'Packaging',
    sourceDoc: 'CPCB Green Packaging Certification #CPCB-9941',
    status: 'active',
    version: '1.0'
  }
];

export const DEMO_ASSETS = [
  {
    _id: 'ast-1',
    assetId: 'ASSET-001',
    name: 'FreshPlus Core Palette',
    type: 'Color Palette',
    details: {
      primary: '#FF6B35',
      secondary: '#2EC4B6',
      neutralDark: '#1E293B',
      neutralLight: '#F8FAFC',
      accent: '#FFA62B'
    }
  },
  {
    _id: 'ast-2',
    assetId: 'ASSET-002',
    name: 'Official Typography Suite',
    type: 'Typography',
    details: {
      displayFont: 'Plus Jakarta Sans',
      bodyFont: 'Inter',
      weights: ['400 (Regular)', '500 (Medium)', '600 (SemiBold)', '700 (Bold)']
    }
  }
];

export const DEMO_ANALYTICS_FINDINGS = {
  totalFindings: 6,
  byCategory: [
    { category: 'Brand Terminology', count: 1 },
    { category: 'Unsupported Claim', count: 1 },
    { category: 'Promotional Claim', count: 3 },
    { category: 'Brand Style & Tone', count: 1 }
  ],
  bySeverity: [
    { severity: 'high', count: 2 },
    { severity: 'medium', count: 3 },
    { severity: 'low', count: 1 }
  ],
  byEvidenceStatus: [
    { status: 'contradicted', count: 4 },
    { status: 'flagged', count: 2 }
  ],
  byDecision: [
    { decision: 'pending', count: 5 },
    { decision: 'dismissed', count: 1 }
  ],
  dismissedFindings: [
    {
      _id: 'df1',
      category: 'Brand Style & Tone',
      excerpt: 'Naturally refreshing!',
      dismissReason: 'Exclamation mark permitted for seasonal social taglines per marketing director approval',
      dismissalReason: 'Exclamation mark permitted for seasonal social taglines per marketing director approval',
      dismissedBy: { name: 'Arjun Mehta (Reviewer)' },
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ]
};

export const DEMO_ANALYTICS_RULES = {
  frequentlyTriggeredRules: [
    {
      ruleId: 'GUIDE-003',
      count: 3,
      title: 'Promotional Superlatives and Market Dominance Claims',
      category: 'Promotional Claim'
    },
    {
      ruleId: 'GUIDE-001',
      count: 1,
      title: 'Approved Product Name Spelling',
      category: 'Brand Terminology'
    },
    {
      ruleId: 'GUIDE-002',
      count: 1,
      title: 'Prohibition of Unsupported Health Claims',
      category: 'Unsupported Claim'
    },
    {
      ruleId: 'GUIDE-004',
      count: 1,
      title: 'Brand Tone and Voice Consistency',
      category: 'Brand Style & Tone'
    }
  ],
  topTriggeredRules: [
    {
      guidelineId: 'GUIDE-003',
      title: 'Promotional Superlatives and Market Dominance Claims',
      triggerCount: 3,
      category: 'Promotional Claim'
    },
    {
      guidelineId: 'GUIDE-001',
      title: 'Approved Product Name Spelling',
      triggerCount: 1,
      category: 'Brand Terminology'
    },
    {
      guidelineId: 'GUIDE-002',
      title: 'Prohibition of Unsupported Health Claims',
      triggerCount: 1,
      category: 'Unsupported Claim'
    },
    {
      guidelineId: 'GUIDE-004',
      title: 'Brand Tone and Voice Consistency',
      triggerCount: 1,
      category: 'Brand Style & Tone'
    }
  ],
  recentDismissals: [
    {
      _id: 'df1',
      category: 'Brand Style & Tone',
      excerpt: 'Naturally refreshing!',
      dismissalReason: 'Exclamation mark permitted for seasonal social taglines per marketing director approval',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ]
};

export const DEMO_AUDIT_LOGS = [
  {
    _id: 'log-1',
    userEmail: 'manager@freshplus.io',
    role: 'manager',
    action: 'CONTENT_APPROVED',
    targetResource: 'Content',
    targetId: 'demo-submission-3',
    details: { title: 'Pure Valencia Orange - Retail Pack Description', campaign: 'Retail Packaging 2026' },
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    _id: 'log-2',
    userEmail: 'reviewer@freshplus.io',
    role: 'reviewer',
    action: 'COMMENT_ADDED',
    targetResource: 'Content',
    targetId: 'demo-submission-2',
    details: { comment: 'Requested softening of promotional guarantee' },
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    _id: 'log-3',
    userEmail: 'system@inkloomguard.xyz',
    role: 'system',
    action: 'AI_REVIEW_COMPLETED',
    targetResource: 'Content',
    targetId: 'demo-submission-1',
    details: { totalFindings: 4, governanceScore: 42 },
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'log-4',
    userEmail: 'creator@freshplus.io',
    role: 'creator',
    action: 'CONTENT_SUBMITTED',
    targetResource: 'Content',
    targetId: 'demo-submission-1',
    details: { title: 'Summer Launch Campaign - Social Teaser', campaign: 'Summer Launch 2026' },
    createdAt: new Date(Date.now() - 3600000 * 2.1).toISOString()
  },
  {
    _id: 'log-5',
    userEmail: 'manager@freshplus.io',
    role: 'manager',
    action: 'GUIDELINE_CREATED',
    targetResource: 'Guideline',
    targetId: 'GUIDE-005',
    details: { title: 'Mandatory FSSAI Compliance and Packaging Disclaimers' },
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

// Helper to record demo-mode audit events without database mutations
export const recordDemoAuditLog = ({ action, user, targetId, details }) => {
  const newLog = {
    _id: `log-demo-${Date.now()}`,
    userEmail: user?.email || 'judge@freshplus.io',
    role: user?.role || 'reviewer',
    action,
    targetResource: 'Content',
    targetId: targetId || 'demo-submission-1',
    details: details || {},
    createdAt: new Date().toISOString()
  };
  DEMO_AUDIT_LOGS.unshift(newLog);
  return newLog;
};

// Helper to update demo content status in memory across records
export const updateDemoContentStatus = (id, newStatus) => {
  const match = DEMO_CONTENTS.find(c => c._id === id);
  if (match) {
    match.status = newStatus;
    match.updatedAt = new Date().toISOString();
  }
  if (DEMO_SUBMISSIONS_MAP[id]?.content) {
    DEMO_SUBMISSIONS_MAP[id].content.status = newStatus;
  }
  if (DEMO_SUBMISSION_DETAILS.content && DEMO_SUBMISSION_DETAILS.content._id === id) {
    DEMO_SUBMISSION_DETAILS.content.status = newStatus;
  }
};

// Validates whether a suggested rewrite strictly adheres to brand facts and guidelines.
export const isSuggestionSafe = (suggestedRewrite) => {
  if (!suggestedRewrite || typeof suggestedRewrite !== 'string') return false;
  const trimmed = suggestedRewrite.trim();
  if (!trimmed || trimmed.toLowerCase() === 'human review required') return false;

  // 1. Unapproved health, curative, stamina, vitality, or medical claims
  const unsafeHealthRegex = /\b(vitality|natural\s+vitality|stamina|cures?|curing|curative|prevents?|preventing|disease|illness|medicinal|therapeutic|miracle\s+cure|instant\s+energy|energy\s+boost|boosts?\s+(?:your\s+)?immunity)\b/i;
  if (unsafeHealthRegex.test(trimmed)) return false;

  // 2. Unsupported rankings, superlatives, or popularity/consensus claims
  const unsafeSuperlativeRegex = /\b(most\s+loved|beloved|most\s+popular|India's\s+No\.?\s*1|#1|world's\s+best|best\s+in|market\s+leader|guaranteed(?:\s+results)?|top\s+rated|favourite|favorite|number\s+one)\b/i;
  if (unsafeSuperlativeRegex.test(trimmed)) return false;

  // 3. Prohibited brand terminology
  const prohibitedTermRegex = /(?:\b|^)(?:Fresh\+|Fresh\s+Plus|fresh\s+plus|Freshplus|Orange\s+Soda|Synthetic\s+Orange)(?:\b|$|\s|[.,!?;:])/i;
  if (prohibitedTermRegex.test(trimmed)) return false;

  // 4. Sensational punctuation or aggressive urgency
  if (/(!{2,}|Buy\s+now!{1,3})/i.test(trimmed)) return false;

  return true;
};

// Client-side source-grounded demo AI reviewer for dynamic submitted text
export const analyzeDemoText = (text) => {
  const findings = [];
  if (!text) return { findings: [], score: 100, completed: true };

  // 1. Prohibited terminology checks
  const termRules = [
    {
      prohibited: 'Fresh+',
      preferred: 'FreshPlus',
      category: 'Brand Terminology',
      severity: 'high',
      guideId: 'GUIDE-001',
      termId: 'TERM-001',
      reason: 'The prohibited term "Fresh+" violates brand guidelines. The approved and legally registered name is "FreshPlus". Never separate the words or substitute "+" for "Plus".'
    },
    {
      prohibited: 'Fresh Plus',
      preferred: 'FreshPlus',
      category: 'Brand Terminology',
      severity: 'high',
      guideId: 'GUIDE-001',
      termId: 'TERM-001',
      reason: 'The prohibited variation "Fresh Plus" violates brand standards. The approved single-word name is "FreshPlus".'
    },
    {
      prohibited: 'Processed Drink',
      preferred: '100% Pure Pasteurized Juice',
      category: 'Brand Terminology',
      severity: 'medium',
      guideId: 'GUIDE-001',
      termId: 'TERM-002',
      reason: 'Emphasize pure pasteurized extraction technique and raw fruit purity.'
    },
    {
      prohibited: 'Sugar Free',
      preferred: 'Zero Added Cane Sugar',
      category: 'Brand Terminology',
      severity: 'high',
      guideId: 'GUIDE-001',
      termId: 'TERM-003',
      reason: 'Our products contain natural fruit sugars; "Sugar Free" violates consumer protection standards.'
    }
  ];

  termRules.forEach((rule) => {
    const escaped = rule.prohibited.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?:\\b|^)${escaped}(?:\\b|$|\\s|[.,!?;:])`, 'gi');
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const excerpt = match[0].replace(/[\s.,!?;:]+$/, '');
      findings.push({
        _id: `f-demo-${findings.length + 1}`,
        category: rule.category,
        severity: rule.severity,
        excerpt,
        reason: rule.reason,
        evidenceStatus: 'contradicted',
        sourceIds: [rule.guideId, rule.termId],
        sourceExcerpt: `The preferred and legally registered product name is "${rule.preferred}". Prohibited: ${rule.prohibited}.`,
        suggestedRewrite: rule.preferred,
        confidence: 0.98,
        decision: 'pending'
      });
    }
  });

  // 2. Curative & Health Claims
  const healthPatterns = [
    {
      regex: /(cures?\s+(?:fatigue|tiredness|illness|disease)(?:\s+instantly)?)/i,
      reason: 'All statements asserting curative, medicinal, disease prevention, or instant stamina outcomes are strictly prohibited unless substantiated by an approved clinical fact in the brand repository.',
      rewrite: 'delivers daily refreshment',
      sourceId: 'GUIDE-002'
    },
    {
      regex: /(boosts?\s+(?:your\s+)?immunity(?:\s+by\s+\d+%)?)/i,
      reason: 'Quantitative medical claims ("boosts immunity") violate FSSAI advertising standards without approved laboratory clinical trials.',
      rewrite: 'Human review required',
      sourceId: 'GUIDE-002'
    },
    {
      regex: /\b(cures?\s+instantly|instant\s+cure)\b/i,
      reason: 'Therapeutic and curative promises violate regulatory brand compliance.',
      rewrite: 'delivers daily refreshment',
      sourceId: 'GUIDE-002'
    }
  ];

  healthPatterns.forEach((hp) => {
    const match = text.match(hp.regex);
    if (match) {
      findings.push({
        _id: `f-demo-${findings.length + 1}`,
        category: 'Unsupported Claim',
        severity: 'high',
        excerpt: match[0],
        reason: hp.reason,
        evidenceStatus: 'contradicted',
        sourceIds: [hp.sourceId],
        sourceExcerpt: 'Do not use unsupported health benefit claims. Curative, medicinal, or instant disease outcomes are strictly prohibited.',
        suggestedRewrite: hp.rewrite,
        confidence: 0.95,
        decision: 'pending'
      });
    }
  });

  // 3. Superlative & Guarantee Claims
  const superlativePatterns = [
    {
      regex: /(India's\s+No\.?\s*1(?:\s+energy\s+drink|\s+juice)?)/i,
      reason: 'Promotional superlatives such as "India\'s No. 1" or market dominance assertions require documented, independently verified market share audit evidence in the brand repository before publication.',
      rewrite: 'a refreshing fruit juice',
      sourceId: 'GUIDE-003'
    },
    {
      regex: /(best\s+juice\s+in\s+India|world's\s+best\s+juice)/i,
      reason: 'Promotional superlatives such as "best juice in India" require documented, verified market share evidence in the brand repository before publication.',
      rewrite: 'a delicious citrus juice',
      sourceId: 'GUIDE-003'
    },
    {
      regex: /(guaranteed\s+(?:100%\s+)?natural\s+energy|guaranteed\s+results?!?)/i,
      reason: 'Absolute promotional guarantees violate fair advertising practice and brand communication standards.',
      rewrite: 'refreshing natural energy',
      sourceId: 'GUIDE-003'
    }
  ];

  superlativePatterns.forEach((sp) => {
    const match = text.match(sp.regex);
    if (match) {
      findings.push({
        _id: `f-demo-${findings.length + 1}`,
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: match[0],
        reason: sp.reason,
        evidenceStatus: 'contradicted',
        sourceIds: [sp.sourceId],
        sourceExcerpt: 'Promotional superlatives and performance guarantees require documented evidence in the brand repository before publication.',
        suggestedRewrite: sp.rewrite,
        confidence: 0.92,
        decision: 'pending'
      });
    }
  });

  // 4. Brand Tone & Aggressive Punctuation
  const toneMatch = text.match(/(!{2,}|Buy now!{1,3})/i);
  if (toneMatch) {
    findings.push({
      _id: `f-demo-${findings.length + 1}`,
      category: 'Brand Style & Tone',
      severity: 'low',
      excerpt: toneMatch[0],
      reason: 'Multiple exclamation points (!!!) and aggressive promotional shouting violate our refined editorial voice standards.',
      evidenceStatus: 'flagged',
      sourceIds: ['GUIDE-004'],
      sourceExcerpt: 'Maintain a clean, premium, trustworthy editorial voice. Avoid multiple exclamation marks and aggressive clickbait.',
      suggestedRewrite: '.',
      confidence: 0.89,
      decision: 'pending'
    });
  }

  // Validate suggestions against approved brand guidelines and facts
  findings.forEach((f) => {
    if (!isSuggestionSafe(f.suggestedRewrite)) {
      f.suggestedRewrite = 'Human review required';
    }
  });

  // Calculate score
  const penalty = findings.reduce((acc, f) => {
    if (f.severity === 'high') return acc + 22;
    if (f.severity === 'medium') return acc + 12;
    return acc + 6;
  }, 0);
  const score = Math.max(15, 100 - penalty);

  return { findings, score, completed: true };
};

// Helper to store a custom demo submission in memory
export const saveCustomDemoSubmission = (formData) => {
  const analysis = analyzeDemoText(formData.rawText);
  const newSubmission = {
    _id: `demo-submission-${Date.now()}`,
    title: formData.title || 'Custom Campaign Draft',
    contentType: formData.contentType || 'Social Media Post',
    campaign: formData.campaign || 'Summer Launch 2026',
    status: formData.autoReview ? 'ai_reviewed' : 'draft',
    currentVersion: 1,
    governanceScore: formData.autoReview ? analysis.score : null,
    totalFindings: formData.autoReview ? analysis.findings.length : 0,
    creator: {
      name: 'Priya Sharma (Creator)',
      email: 'creator@freshplus.io'
    },
    organization: 'FreshPlus Global',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  DEMO_CONTENTS.unshift(newSubmission);

  const customDetails = {
    content: newSubmission,
    currentVersion: {
      _id: `ver-${Date.now()}`,
      contentId: newSubmission._id,
      versionNumber: 1,
      rawText: formData.rawText,
      changeNotes: 'Submitted for pre-publication governance review',
      aiReviewCompleted: !!formData.autoReview,
      governanceScore: formData.autoReview ? analysis.score : null,
      totalFindings: formData.autoReview ? analysis.findings.length : 0,
      createdAt: new Date().toISOString()
    },
    allVersions: [],
    findings: formData.autoReview ? analysis.findings : [],
    comments: []
  };
  customDetails.allVersions = [customDetails.currentVersion];

  DEMO_SUBMISSIONS_MAP[newSubmission._id] = customDetails;

  recordDemoAuditLog({
    action: 'CONTENT_SUBMITTED (Demo)',
    targetId: newSubmission._id,
    details: { title: newSubmission.title, version: 1 }
  });

  return newSubmission;
};
