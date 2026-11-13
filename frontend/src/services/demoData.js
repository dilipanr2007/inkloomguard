// Public Demo Mode Data
// Source-Grounded Brand Governance Engine for FreshPlus Global

export const DEMO_USERS = {
  manager: {
    _id: 'demo-manager-id',
    name: 'Rohan Deshmukh (Manager)',
    email: 'manager@freshplus.io',
    role: 'manager',
    organization: 'FreshPlus Global',
    department: 'Global Brand Governance',
    isDemo: true,
    onboarding: {
      completed: false,
      skipped: false,
      version: 1
    }
  },
  reviewer: {
    _id: 'demo-reviewer-id',
    name: 'Arjun Mehta (Reviewer)',
    email: 'reviewer@freshplus.io',
    role: 'reviewer',
    organization: 'FreshPlus Global',
    department: 'Legal & Compliance',
    isDemo: true,
    onboarding: {
      completed: false,
      skipped: false,
      version: 1
    }
  },
  creator: {
    _id: 'demo-creator-id',
    name: 'Priya Sharma (Creator)',
    email: 'creator@freshplus.io',
    role: 'creator',
    organization: 'FreshPlus Global',
    department: 'Creative & Social Media',
    isDemo: true,
    onboarding: {
      completed: false,
      skipped: false,
      version: 1
    }
  }
};

// Accurately reflects the 14 curated demo submissions across all marketing channels:
// 6 Approved, 4 In Review / AI Reviewed, 3 Changes Requested, 1 Rejected
export const DEMO_STATS = {
  totalSubmissions: 14,
  approvedSubmissions: 6,
  inReviewSubmissions: 4,
  changesRequested: 3,
  rejectedSubmissions: 1,
  draftSubmissions: 0,
  totalFindings: 17,
  highSeverityFlags: 6,
  mediumSeverityFlags: 8,
  lowSeverityFlags: 3,
  dismissedFindings: 2,
  acceptedFindings: 11,
  averageGovernanceScore: 78,
  // Backward compatibility property aliases
  pendingReview: 4,
  approvedCount: 6,
  changesRequestedCount: 3,
  aiFlaggedIssues: 17,
  complianceRate: 78
};

// Structured Company Knowledge: Fictional Product Lineup clearly labelled as fictional demo products
export const DEMO_PRODUCTS = [
  {
    _id: 'prod-1',
    productId: 'PROD-001',
    name: 'FreshPlus Valencia Orange',
    category: '100% Pure Pasteurized Fruit Juice',
    fictionalDisclaimer: 'Fictional demo FMCG product specification',
    ingredients: '100% Valencia orange juice, filtered water. 0g added refined cane sugar.',
    nutritionPer100ml: 'Energy: 44 kcal, Carbohydrates: 10.2g (natural fruit sugars), Protein: 0.7g, Fat: 0.1g, Vitamin C: 24mg (60% Indian RDA).',
    packaging: '200ml and 1L bottles made of 100% recycled food-grade rPET.',
    status: 'active'
  },
  {
    _id: 'prod-2',
    productId: 'PROD-002',
    name: 'FreshPlus Alphonso Mango Nectar',
    category: 'Fruit Beverage & Nectar',
    fictionalDisclaimer: 'Fictional demo FMCG product specification',
    ingredients: 'Alphonso mango pulp (40%), water, natural lemon juice. No synthetic yellow colorants.',
    nutritionPer100ml: 'Energy: 52 kcal, Carbohydrates: 12.8g (natural fruit sugars), Vitamin A: 180mcg.',
    packaging: '250ml glass bottles & 100% recyclable rPET containers.',
    status: 'active'
  },
  {
    _id: 'prod-3',
    productId: 'PROD-003',
    name: 'FreshPlus Crisp Himalayan Apple',
    category: '100% Pure Cold-Pressed Juice',
    fictionalDisclaimer: 'Fictional demo FMCG product specification',
    ingredients: '100% Himalayan apple juice, natural ascorbic acid (antioxidant). No added sugar.',
    nutritionPer100ml: 'Energy: 48 kcal, Carbohydrates: 11.5g, Natural Pectin: 0.8g.',
    packaging: '300ml glass bottle and 100% rPET single-serve.',
    status: 'active'
  },
  {
    _id: 'prod-4',
    productId: 'PROD-004',
    name: 'FreshPlus Guava Glow',
    category: 'Tropical Fruit Beverage',
    fictionalDisclaimer: 'Fictional demo FMCG product specification',
    ingredients: 'Pink guava pulp (35%), natural fruit extracts. No high-fructose corn syrup.',
    nutritionPer100ml: 'Energy: 46 kcal, Dietary Fiber: 1.4g, Vitamin C: 45mg (100%+ daily RDA).',
    packaging: '200ml recyclable tetra pack & rPET bottle.',
    status: 'active'
  }
];

// Curated internal brand guidelines
export const DEMO_INTERNAL_GUIDELINES = [
  {
    _id: 'g1',
    guidelineId: 'GUIDE-001',
    title: 'Approved Product Name Spelling & Capitalization',
    description: 'The preferred and legally registered product name is "FreshPlus". It must always be written in CamelCase as a single word. Never separate the words ("Fresh Plus") or substitute the plus sign "+" ("Fresh+").',
    category: 'Brand Terminology',
    severity: 'high',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g2',
    guidelineId: 'GUIDE-002',
    title: 'Prohibition of Unsupported Health & Curative Claims',
    description: 'Do not use unsupported health benefit claims. All statements asserting curative, medicinal, disease prevention, or instant stamina outcomes (e.g. "cures fatigue", "boosts immunity by 50%") are strictly prohibited unless substantiated by an approved clinical fact in the brand repository.',
    category: 'Unsupported Claim',
    severity: 'high',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g3',
    guidelineId: 'GUIDE-003',
    title: 'Promotional Superlatives & Market Dominance Claims',
    description: 'Promotional superlatives such as "India\'s No. 1", "Best in the world", or market leadership claims require documented, verified sales or audit evidence in the brand repository before publication. In the absence of proof, use objective descriptive phrasing.',
    category: 'Promotional Claim',
    severity: 'medium',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g4',
    guidelineId: 'GUIDE-004',
    title: 'Brand Tone: Warm, Professional, and Informative',
    description: 'Maintain a clean, premium, and trustworthy editorial voice. Avoid multiple exclamation marks (e.g. "Buy now!!!"), aggressive clickbait, alarmist urgency, and hyperbolic slang.',
    category: 'Brand Style & Tone',
    severity: 'low',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g5',
    guidelineId: 'GUIDE-005',
    title: 'Ingredient Transparency & Everyday Refreshment',
    description: 'All copy must communicate everyday natural fruit freshness, transparent sourcing, and balanced lifestyle hydration. Never depict fresh juice as a pharmaceutical replacement for balanced meals or medical treatments.',
    category: 'Messaging Consistency',
    severity: 'medium',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g6',
    guidelineId: 'GUIDE-006',
    title: 'Environmental & Recyclable Packaging Claims',
    description: 'Sustainability communications must accurately reflect our 100% rPET recyclable packaging standards. Do not make vague "100% green" claims without citing our recycled plastic materials.',
    category: 'Messaging Consistency',
    severity: 'low',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g7',
    guidelineId: 'GUIDE-007',
    title: 'Mandatory Packaging Artwork Declarations',
    description: 'Every commercial packaging asset must display the mandatory FSSAI license number, full nutritional table per 100ml, batch and manufacturing dates, and the green vegetarian logo.',
    category: 'Packaging & Labelling',
    severity: 'high',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g8',
    guidelineId: 'GUIDE-008',
    title: 'Influencer Marketing & Endorsement Transparency',
    description: 'All paid creator collaborations, gifted samples, or digital influencer content must feature prominent upfront disclosure tags (#ad, #FreshPlusCollab) in the first two lines of text or superimposed on video assets.',
    category: 'Influencer Marketing',
    severity: 'high',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'g9',
    guidelineId: 'GUIDE-009',
    title: 'Reviewer Escalation & Final Sign-Off Matrix',
    description: 'Claims involving quantitative nutritional percentages or comparative superiority require Manager-level sign-off. Routine social media posts and promotional banners may be signed off by Reviewers.',
    category: 'Approval Policy',
    severity: 'medium',
    status: 'active',
    version: '1.0'
  }
];

// Structured, traceable regulatory knowledge from verified Indian statutory authorities (FSSAI, ASCI, CCPA)
export const DEMO_REGULATORY = [
  {
    _id: 'reg-1',
    guidelineId: 'REG-FSSAI-001',
    title: 'FSSAI Prohibition on Disease Prevention, Treatment, and Cure Claims',
    regulatoryBody: 'FSSAI',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    sourceTitle: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018',
    sourceUrl: 'https://fssai.gov.in/food-law/regulations/amendments/advertising-claims',
    sourceClause: 'Regulations 7, 10(1) & Schedule III',
    applicability: 'All food and beverage advertisements, packaging labels, and commercial claims in India',
    supportedRequirement: 'No advertisement or label shall claim or imply that a food product can prevent, alleviate, treat, or cure any disease, disorder, or medical condition. Reduction of disease risk claims require strict compliance with Schedule III or prior FSSAI scientific approval.',
    description: 'Food business operators are strictly prohibited from making any claim that a food product can prevent, treat, cure, or alleviate human disease, medical disorders, or physiological fatigue unless expressly approved by standard national statutory authority under Schedule III.',
    category: 'Regulatory Compliance',
    severity: 'high',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: '2018 (Effective 1 July 2019, amended 2021)',
    verificationDate: '2026-11-11'
  },
  {
    _id: 'reg-2',
    guidelineId: 'REG-FSSAI-002',
    title: 'FSSAI Standards for "Natural", "Fresh", and "Pure" Representations',
    regulatoryBody: 'FSSAI',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    sourceTitle: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018',
    sourceUrl: 'https://fssai.gov.in/food-law/regulations/amendments/advertising-claims',
    sourceClause: 'Regulation 9(2) & Schedule V',
    applicability: 'Quality-descriptive adjectives on food labels, advertising copy, and commercial branding',
    supportedRequirement: 'Adjectives such as "natural", "fresh", and "pure" may only be used when satisfying Schedule V conditions. The term "fresh" applies only to foods that have not undergone processing other than washing, peeling, chilling, trimming, or minimal steps necessary for safety without extending shelf-life beyond the raw state. If a product does not meet Schedule V criteria, an unqualified "fresh" claim is prohibited, and any brand name containing the term requires a disclaimer under Regulation 4(7).',
    description: 'The terms "Natural", "Fresh", and "Pure" are governed by Regulation 9(2) and Schedule V. "Fresh" is restricted to raw or minimally processed foods where processing does not extend normal shelf-life, and non-qualifying brand names must carry a statutory trademark disclaimer under Regulation 4(7).',
    category: 'Regulatory Compliance',
    severity: 'high',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: '2018 (Effective 1 July 2019)',
    verificationDate: '2026-11-12'
  },
  {
    _id: 'reg-3',
    guidelineId: 'REG-FSSAI-003',
    title: 'FSSAI Sugar-Free Thresholds & Non-Addition of Sugars Requirements',
    regulatoryBody: 'FSSAI',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    sourceTitle: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018',
    sourceUrl: 'https://fssai.gov.in/food-law/regulations/amendments/advertising-claims',
    sourceClause: 'Regulation 5(3), Schedule I & Regulation 6(1)',
    applicability: 'Packaged fruit juices, nectars, and beverages making sugar-related nutritional or non-addition claims',
    supportedRequirement: '1. Sugar-Free Claim (Regulation 5(3) & Schedule I): Separate nutrient content claim permitted only if total sugars do not exceed 0.5g per 100g or 100ml. 2. No Added Sugar Claim (Regulation 6(1)): Permitted only if all 5 statutory conditions are met: (1) No sugars of any type have been added; (2) No ingredients containing sugars are present; (3) No ingredients containing sugars used as substitutes for added sugars are present; (4) Sugar content has not been increased through other means, including enzymatic hydrolysis; and (5) Where sugars are naturally present, the mandatory declaration "CONTAINS NATURALLY OCCURRING SUGARS" must appear.',
    description: 'Statutory FSSAI standards governing sugar claims: "Sugar-Free" is a separate nutrient content claim restricted to <= 0.5g total sugars per 100g/ml under Regulation 5(3) and Schedule I. Under Regulation 6(1), "No Added Sugar" claims require: (1) no sugars of any type have been added; (2) no ingredients containing sugars are present; (3) no ingredients containing sugars used as substitutes for added sugars are present; (4) sugar content has not been increased through other means, including enzymatic hydrolysis; and (5) where sugars are naturally present, the mandatory statement "CONTAINS NATURALLY OCCURRING SUGARS" must be declared.',
    category: 'Regulatory Compliance',
    severity: 'high',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: '2018 (Effective 1 July 2019)',
    verificationDate: '2026-11-12'
  },
  {
    _id: 'reg-4',
    guidelineId: 'REG-FSSAI-004',
    title: 'FSSAI Comparative Nutrition Claims & Disclaimer Legibility Standards',
    regulatoryBody: 'FSSAI',
    authority: 'Food Safety and Standards Authority of India (FSSAI)',
    sourceTitle: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018',
    sourceUrl: 'https://fssai.gov.in/food-law/regulations/amendments/advertising-claims',
    sourceClause: 'Regulation 5(4), Regulation 5(5), Regulation 4(7), Regulation 4(8) & Regulation 4(14)',
    applicability: 'Comparative nutrition claims and mandatory qualifying disclaimers in advertisements and packaging',
    supportedRequirement: 'Under Regulation 5(4), comparative claims require relative differences of at least 30% for energy/macronutrients and at least 10% of RDA per 100g/ml for micronutrients (other than sodium), with the reference food and exact difference stated in close proximity (Reg 5(5)). General disclaimers under Regulation 4(8) must be conspicuous and legible, and consistent with the label under Regulation 4(14); the 1.5mm to 3.0mm font size schedule applies specifically to trademark/brand-name disclaimers under Regulation 4(7).',
    description: 'Regulates nutrient comparative claims (requiring >=30% difference for energy/macronutrients and >=10% RDA difference for micronutrients) and mandates that all disclaimers must be conspicuous, legible, and consistent with product labels, with prescribed font scales applied to trademark disclaimers under Regulation 4(7).',
    category: 'Regulatory Compliance',
    severity: 'medium',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: '2018 (Effective 1 July 2019)',
    verificationDate: '2026-11-12'
  },
  {
    _id: 'reg-5',
    guidelineId: 'REG-ASCI-001',
    title: 'ASCI Truthful Substantiation & Non-Misleading Representation',
    regulatoryBody: 'ASCI',
    authority: 'Advertising Standards Council of India (ASCI)',
    sourceTitle: 'The ASCI Code for Self-Regulation of Advertising in India',
    sourceUrl: 'https://www.ascionline.in/the-asci-code-guidelines/',
    sourceClause: 'Chapter I, Clause 1.1 & Clause 1.4',
    applicability: 'All commercial advertisements across broadcast, print, outdoor, digital, and social media',
    supportedRequirement: 'Under Chapter I, Clause 1.1, all descriptions, claims, and comparisons relating to objectively ascertainable facts must be capable of substantiation by reliable documentary proof produced upon request. Under Clause 1.4, advertisements must not distort facts or mislead consumers through ambiguity, omission, or exaggeration.',
    description: 'The ASCI Code mandates that all claims of objectively ascertainable facts must be capable of substantiation (Clause 1.1) and prohibits advertisements that distort facts or mislead consumers through exaggeration, omissions, or ambiguities (Clause 1.4).',
    category: 'Promotional Claim',
    severity: 'high',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: '2023 Code Edition',
    verificationDate: '2026-11-12'
  },
  {
    _id: 'reg-6',
    guidelineId: 'REG-ASCI-002',
    title: 'ASCI Upfront Disclosure Requirements for Digital Influencer Content',
    regulatoryBody: 'ASCI',
    authority: 'Advertising Standards Council of India (ASCI)',
    sourceTitle: 'Guidelines for Influencer Advertising in Digital Media',
    sourceUrl: 'https://www.ascionline.in/the-asci-code-guidelines/',
    sourceClause: 'Guidelines for Influencer Advertising in Digital Media (2021) — Disclosure Guidelines',
    applicability: 'Influencer and creator promotions across digital platforms (Instagram, YouTube, X, Facebook, LinkedIn)',
    supportedRequirement: 'Whenever a material connection exists between an advertiser and an influencer (such as financial compensation, free products, gifts, trips, or discounts), the commercial content must carry a clear, upfront, and prominent disclosure label (e.g. #ad, #sponsored, #collab, or #partnership) that is readily noticeable to consumers without being buried or obscured.',
    description: 'Commercial influencer content and creator collaborations must feature clear, upfront, and prominent disclosure labels (#ad, #sponsored, #collab) to ensure commercial partnerships are transparent to consumers.',
    category: 'Influencer Marketing',
    severity: 'high',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: '2021 (Effective 14 June 2021, updated 2023)',
    verificationDate: '2026-11-12'
  },
  {
    _id: 'reg-7',
    guidelineId: 'REG-CCPA-001',
    title: 'CCPA Conditions for Non-Misleading Advertisements & Valid Endorsements',
    regulatoryBody: 'CCPA',
    authority: 'Central Consumer Protection Authority (Ministry of Consumer Affairs)',
    sourceTitle: 'Guidelines for Prevention of Misleading Advertisements and Endorsements for Misleading Advertisements, 2022',
    sourceUrl: 'https://ccpa.doca.gov.in/guidelines',
    sourceClause: 'Guidelines for Prevention of Misleading Advertisements, 2022 — Guideline 4',
    applicability: 'All manufacturers, service providers, advertising agencies, and endorsers in India',
    supportedRequirement: 'Under Guideline 4, an advertisement is valid and non-misleading only if it contains truthful representations and does not mislead regarding the nature, composition, performance, or benefits of products. Endorsements by professionals or experts must reflect genuine, verifiable authorization based on competent evaluation and adequate substantiation.',
    description: 'Establishes conditions for valid, non-misleading advertisements under Guideline 4 and requires that professional and expert endorsements be substantiated by competent, verifiable evaluation.',
    category: 'Regulatory Compliance',
    severity: 'high',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: 'Notified 9 June 2022 (F. No. J-25/14/2020-CCPA)',
    verificationDate: '2026-11-12'
  },
  {
    _id: 'reg-8',
    guidelineId: 'REG-CCPA-002',
    title: 'CCPA Disclaimers, Substantiation Duties & Disclosure of Material Connection',
    regulatoryBody: 'CCPA',
    authority: 'Central Consumer Protection Authority (Ministry of Consumer Affairs)',
    sourceTitle: 'Guidelines for Prevention of Misleading Advertisements and Endorsements for Misleading Advertisements, 2022',
    sourceUrl: 'https://ccpa.doca.gov.in/guidelines',
    sourceClause: 'Guideline 11 (Disclaimers), Guideline 12 (Substantiation Duties) & Guideline 14 (Material Connection)',
    applicability: 'All commercial advertisers, agencies, and endorsers publishing disclaimers or sponsored endorsements',
    supportedRequirement: 'Under Guideline 11, disclaimers must be clear and prominent and must not contradict, obscure, or negate the main claim, nor attempt to cure a misleading statement. Under Guideline 12, advertisers and agencies must be capable of substantiating all claims relating to objectively ascertainable facts and cite sources for independent research. Under Guideline 14, endorsers must fully disclose any material connection with the brand that is not reasonably expected by the audience.',
    description: 'Mandates that disclaimers must be legible and not contradict the primary claim (Guideline 11), requires advertisers to substantiate claims of fact (Guideline 12), and requires clear disclosure of material connections in endorsements (Guideline 14).',
    category: 'Influencer Marketing',
    severity: 'high',
    status: 'active',
    scope: 'Statutory Indian Regulation',
    version: 'Notified 9 June 2022',
    verificationDate: '2026-11-12'
  }
];

// Unified guidelines list combining brand rules & statutory regulations
export const DEMO_GUIDELINES = [...DEMO_INTERNAL_GUIDELINES, ...DEMO_REGULATORY];

export const DEMO_TERMINOLOGY = [
  {
    _id: 't1',
    terminologyId: 'TERM-001',
    preferredTerm: 'FreshPlus',
    prohibitedTerms: ['Fresh+', 'Fresh Plus', 'FRESH+', 'Freshplus'],
    explanation: 'The brand name is a single camel-case word "FreshPlus" with capital F and capital P. The plus symbol "+" is prohibited in marketing copy.',
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
    explanation: 'Our juices contain natural fruit sugars; marketing them as "Sugar Free" violates statutory FSSAI and CCPA consumer standards.',
    category: 'Nutritional Messaging',
    severity: 'high'
  },
  {
    _id: 't4',
    terminologyId: 'TERM-004',
    preferredTerm: 'Cold-Pasteurized',
    prohibitedTerms: ['Raw Unprocessed Juice', 'Boiled Juice'],
    explanation: 'FreshPlus uses flash cold-pasteurization at 72°C to ensure micro-biological food safety while preserving fresh fruit taste.',
    category: 'Processing Standards',
    severity: 'medium'
  }
];

export const DEMO_FACTS = [
  {
    _id: 'fct-1',
    factId: 'FACT-001',
    statement: 'FreshPlus Valencia Orange juice contains 100% pure pasteurized fruit juice with zero added refined cane sugars or synthetic preservatives.',
    category: 'Ingredients',
    sourceDoc: 'Internal Lab Formulation Spec #FP-SPEC-2025-01 (Fictional Demo Spec)',
    isFictionalDemoFact: true,
    disclaimer: 'Fictional demo specification created for product demonstration. Not an actual government or independent laboratory certification.',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'fct-2',
    factId: 'FACT-002',
    statement: 'FreshPlus Orange Juice delivers 24mg of natural Vitamin C per 100ml serving, satisfying 60% of daily recommended nutritional intake under Indian ICMR standards.',
    category: 'Nutrition',
    sourceDoc: 'Internal Nutritional Quality Profile #FP-NUTR-2025-02 (Fictional Demo Spec)',
    isFictionalDemoFact: true,
    disclaimer: 'Fictional demo specification created for product demonstration. Not an actual government or independent laboratory certification.',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'fct-3',
    factId: 'FACT-003',
    statement: 'FreshPlus bottles are crafted from 100% recycled food-grade rPET and are fully recyclable across India.',
    category: 'Packaging',
    sourceDoc: 'Packaging Sustainability Specification #FP-PKG-2025-03 (Fictional Demo Spec)',
    isFictionalDemoFact: true,
    disclaimer: 'Fictional demo specification created for product demonstration. Not an actual government or independent laboratory certification.',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'fct-4',
    factId: 'FACT-004',
    statement: 'FreshPlus Crisp Himalayan Apple juice contains 100% pure apple juice with natural pectin and zero synthetic preservatives.',
    category: 'Ingredients',
    sourceDoc: 'Internal Orchard Batch Specification #FP-APL-2025-04 (Fictional Demo Spec)',
    isFictionalDemoFact: true,
    disclaimer: 'Fictional demo specification created for product demonstration. Not an actual government or independent laboratory certification.',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'fct-5',
    factId: 'FACT-005',
    statement: 'Cold-pasteurization occurs at 72°C for 15 seconds to eliminate harmful microbes while preserving delicate natural fruit aroma and vitamins.',
    category: 'Operations',
    sourceDoc: 'Thermal Processing SOP #FP-SOP-2025-05 (Fictional Demo Spec)',
    isFictionalDemoFact: true,
    disclaimer: 'Fictional demo specification created for product demonstration. Not an actual government or independent laboratory certification.',
    status: 'active',
    version: '1.0'
  },
  {
    _id: 'fct-6',
    factId: 'FACT-006',
    statement: 'FreshPlus Alphonso Mango Nectar contains 40% authentic fruit pulp with authentic Alphonso mango aroma, with no synthetic yellow dyes.',
    category: 'Ingredients',
    sourceDoc: 'Mango Pulp Standard Formulation #FP-MNG-2025-06 (Fictional Demo Spec)',
    isFictionalDemoFact: true,
    disclaimer: 'Fictional demo specification created for product demonstration. Not an actual government or independent laboratory certification.',
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

// 14 Curated Fictional Submissions across Channels and Governance States
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
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: 'demo-submission-2',
    title: 'Valencia Orange - Morning Energy Ad Copy',
    contentType: 'Advertising Copy',
    campaign: 'Daily Nutrition 2026',
    status: 'in_review',
    currentVersion: 1,
    governanceScore: 74,
    totalFindings: 2,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    _id: 'demo-submission-3',
    title: 'Pure Valencia Orange - Retail Pack Description',
    contentType: 'Packaging Description',
    campaign: 'Retail Packaging 2026',
    status: 'approved',
    currentVersion: 2,
    governanceScore: 98,
    totalFindings: 0,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'demo-submission-4',
    title: 'Fitness Creator Reel Caption - Mango Nectar',
    contentType: 'Influencer Promotion',
    campaign: 'Active Lifestyle Influencers 2026',
    status: 'changes_requested',
    currentVersion: 1,
    governanceScore: 62,
    totalFindings: 2,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    _id: 'demo-submission-5',
    title: 'Crisp Himalayan Apple Juice - E-Commerce Landing Copy',
    contentType: 'Website Product Page',
    campaign: 'Direct-to-Consumer Launch',
    status: 'approved',
    currentVersion: 1,
    governanceScore: 100,
    totalFindings: 0,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    _id: 'demo-submission-6',
    title: 'Mega Supermarket Display - Monsoon Health Banner',
    contentType: 'Promotional Banner',
    campaign: 'Retail In-Store Visibility',
    status: 'rejected',
    currentVersion: 1,
    governanceScore: 35,
    totalFindings: 3,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    _id: 'demo-submission-7',
    title: 'Sustainability Spotlight - Monthly Customer Newsletter',
    contentType: 'Email Campaign',
    campaign: 'Green Earth Initiative 2026',
    status: 'approved',
    currentVersion: 1,
    governanceScore: 95,
    totalFindings: 0,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    _id: 'demo-submission-8',
    title: 'Twitter / X Product Announcement - Guava Glow',
    contentType: 'Social Media Post',
    campaign: 'Tropical Range Launch',
    status: 'ai_reviewed',
    currentVersion: 1,
    governanceScore: 78,
    totalFindings: 1,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'demo-submission-9',
    title: 'Yoga Instructor Routine - Instagram Story Copy',
    contentType: 'Influencer Promotion',
    campaign: 'Active Lifestyle Influencers 2026',
    status: 'approved',
    currentVersion: 1,
    governanceScore: 98,
    totalFindings: 0,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    _id: 'demo-submission-10',
    title: 'Metro Station Billboard - Quick Breakfast Copy',
    contentType: 'Advertising Copy',
    campaign: 'Commuter Nutrition 2026',
    status: 'changes_requested',
    currentVersion: 1,
    governanceScore: 58,
    totalFindings: 2,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 6).toISOString()
  },
  {
    _id: 'demo-submission-11',
    title: 'Alphonso Mango Nectar - Nutritional Breakdown Page',
    contentType: 'Website Product Page',
    campaign: 'Product Transparency',
    status: 'in_review',
    currentVersion: 1,
    governanceScore: 85,
    totalFindings: 1,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    _id: 'demo-submission-12',
    title: 'E-Commerce Summer Header Banner',
    contentType: 'Promotional Banner',
    campaign: 'Summer Launch 2026',
    status: 'approved',
    currentVersion: 1,
    governanceScore: 96,
    totalFindings: 0,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString()
  },
  {
    _id: 'demo-submission-13',
    title: 'Corporate Wellness Partnership Email Pitch',
    contentType: 'Email Campaign',
    campaign: 'B2B Institutional Sales',
    status: 'changes_requested',
    currentVersion: 1,
    governanceScore: 68,
    totalFindings: 2,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 8).toISOString()
  },
  {
    _id: 'demo-submission-14',
    title: 'World Environment Day Celebration Post',
    contentType: 'Social Media Post',
    campaign: 'Green Earth Initiative 2026',
    status: 'approved',
    currentVersion: 1,
    governanceScore: 97,
    totalFindings: 0,
    creator: { name: 'Priya Sharma (Creator)', email: 'creator@freshplus.io' },
    organization: 'FreshPlus Global',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString()
  }
];

// Rich Review Studio Maps for All Submissions
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
        changeNotes: 'Applied AI governance safe rewrite suggestions and removed ungrounded claims',
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
        reason: 'The prohibited term "Fresh+" violates brand guidelines. The approved and legally registered name is "FreshPlus". Never substitute "+" for "Plus".',
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
        reason: 'Statutory FSSAI Regulations 7 & 10(1) strictly prohibit food advertisements from claiming that a beverage cures, treats, or relieves human disease or fatigue without clinical standard substantiation.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002', 'REG-FSSAI-001'],
        sourceExcerpt: 'FSSAI Advertising Regulations: Claims asserting curative, medicinal, or instant disease alleviation outcomes are strictly prohibited.',
        suggestedRewrite: 'delivers daily refreshment',
        confidence: 0.96,
        decision: 'pending'
      },
      {
        _id: 'f1-3',
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: "India's No. 1",
        reason: 'Promotional superlatives such as "India\'s No. 1" violate ASCI Chapter I (Clauses 1.1 and 1.4) and CCPA Guideline 4 unless supported by documented substantiation.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-003', 'REG-ASCI-001', 'REG-CCPA-001'],
        sourceExcerpt: 'Claims of fact must be capable of substantiation and must not mislead by exaggeration.',
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
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
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
        reason: 'Absolute performance guarantees violate fair advertising standards without verified clinical documentation in the brand repository.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-003', 'REG-FSSAI-001'],
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
        reason: 'Promotional superlatives such as "best juice in India" require documented, independently verified market share audit evidence before publication under ASCI Clause I.4.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-003', 'REG-ASCI-001'],
        sourceExcerpt: 'Promotional superlatives require documented, verified evidence in the brand repository before publication.',
        suggestedRewrite: 'a delicious citrus juice',
        confidence: 0.93,
        decision: 'pending'
      }
    ],
    comments: [
      {
        _id: 'comm-2-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
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
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: '[APPROVED]: Fully verified against GUIDE-001, FACT-001, FACT-002, and FACT-003. Approved for commercial retail packaging.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  'demo-submission-4': {
    content: DEMO_CONTENTS[3],
    currentVersion: {
      _id: 'ver-4-1',
      contentId: 'demo-submission-4',
      versionNumber: 1,
      rawText: "My secret post-workout drink is FreshPlus Alphonso Mango Nectar! Gives you miraculous stamina recovery after heavy gym sessions.",
      changeNotes: 'Draft caption submitted for creator collaboration',
      aiReviewCompleted: true,
      governanceScore: 62,
      totalFindings: 2,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    allVersions: [],
    findings: [
      {
        _id: 'f4-1',
        category: 'Influencer Marketing',
        severity: 'high',
        excerpt: 'My secret post-workout drink is FreshPlus',
        reason: 'Paid influencer endorsements must carry prominent upfront disclosure tags (#ad, #FreshPlusCollab) in the first two lines per ASCI Influencer Guidelines and CCPA Guideline 12.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-008', 'REG-ASCI-002', 'REG-CCPA-002'],
        sourceExcerpt: 'All paid creator content must feature prominent upfront disclosure tags (#ad, #FreshPlusCollab).',
        suggestedRewrite: '#ad My go-to post-workout drink is FreshPlus',
        confidence: 0.95,
        decision: 'pending'
      },
      {
        _id: 'f4-2',
        category: 'Unsupported Claim',
        severity: 'high',
        excerpt: 'miraculous stamina recovery',
        reason: 'Unsubstantiated therapeutic or stamina promises violate FSSAI Regulation 8(1) and internal health claims policies.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002', 'REG-FSSAI-001'],
        sourceExcerpt: 'Statements asserting curative, stamina, or medical outcomes are strictly prohibited.',
        suggestedRewrite: 'refreshing fruit hydration',
        confidence: 0.94,
        decision: 'pending'
      }
    ],
    comments: [
      {
        _id: 'comm-4-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: 'Changes requested: Must include #ad disclosure upfront and remove the "miraculous stamina" phrasing.',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ]
  },
  'demo-submission-5': {
    content: DEMO_CONTENTS[4],
    currentVersion: {
      _id: 'ver-5-1',
      contentId: 'demo-submission-5',
      versionNumber: 1,
      rawText: "FreshPlus Crisp Himalayan Apple Juice is pressed from handpicked apples with no added sugar or artificial preservatives. Each 200ml bottle delivers crisp, refreshing hydration.",
      changeNotes: 'E-commerce product description',
      aiReviewCompleted: true,
      governanceScore: 100,
      totalFindings: 0,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    allVersions: [],
    findings: [],
    comments: [
      {
        _id: 'comm-5-1',
        user: { _id: 'demo-manager-id', name: 'Rohan Deshmukh (Manager)', role: 'manager' },
        text: 'Exemplary copy. Grounded in FACT-004 and fully compliant with FSSAI Regulation 5.',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
      }
    ]
  },
  'demo-submission-6': {
    content: DEMO_CONTENTS[5],
    currentVersion: {
      _id: 'ver-6-1',
      contentId: 'demo-submission-6',
      versionNumber: 1,
      rawText: "Fresh Plus completely prevents seasonal viral flu and cold! 100% Sugar Free guarantee. Drink daily or get sick!",
      changeNotes: 'Submitted for retail point-of-sale banner',
      aiReviewCompleted: true,
      governanceScore: 35,
      totalFindings: 3,
      createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
    },
    allVersions: [],
    findings: [
      {
        _id: 'f6-1',
        category: 'Brand Terminology',
        severity: 'high',
        excerpt: 'Fresh Plus',
        reason: 'Prohibited brand spelling variation. The approved single-word name is "FreshPlus".',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-001', 'TERM-001'],
        sourceExcerpt: 'The approved single-word name is "FreshPlus".',
        suggestedRewrite: 'FreshPlus',
        confidence: 0.98,
        decision: 'pending'
      },
      {
        _id: 'f6-2',
        category: 'Unsupported Claim',
        severity: 'high',
        excerpt: 'completely prevents seasonal viral flu and cold!',
        reason: 'Direct viral disease prevention claim explicitly violates FSSAI Regulations 7 & 10(1) and CCPA statutory guidelines.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002', 'REG-FSSAI-001', 'REG-CCPA-001'],
        sourceExcerpt: 'Claims asserting disease prevention properties are strictly prohibited.',
        suggestedRewrite: 'Human review required',
        confidence: 0.99,
        decision: 'pending'
      },
      {
        _id: 'f6-3',
        category: 'Brand Terminology',
        severity: 'high',
        excerpt: '100% Sugar Free',
        reason: 'Calling natural fruit juice "Sugar Free" violates FSSAI Regulation 5(3) & Schedule I because fruit juices contain natural fruit fructose exceeding 0.5g/100ml. Claims of "No Added Sugar" must satisfy Regulation 6(1) all 5 conditions and declare "CONTAINS NATURALLY OCCURRING SUGARS".',
        evidenceStatus: 'contradicted',
        sourceIds: ['TERM-003', 'REG-FSSAI-003'],
        sourceExcerpt: 'FSSAI Regulation 5(3), Schedule I & Regulation 6(1): "Sugar-Free" requires total sugars <= 0.5g/100ml. "No Added Sugar" requires zero added sugars or substitutes, no enzymatic increase, and mandatory "CONTAINS NATURALLY OCCURRING SUGARS" declaration.',
        suggestedRewrite: 'Zero Added Cane Sugar',
        confidence: 0.95,
        decision: 'pending'
      }
    ],
    comments: [
      {
        _id: 'comm-6-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: 'REJECTED: Severe statutory non-compliance. Direct medical prevention claims invite heavy regulatory penalties under FSSAI. Do not print.',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ]
  },
  'demo-submission-7': {
    content: DEMO_CONTENTS[6],
    currentVersion: {
      _id: 'ver-7-1',
      contentId: 'demo-submission-7',
      versionNumber: 1,
      rawText: "At FreshPlus Global, our commitment to nature goes beyond pure fruit. Every bottle is crafted with 100% food-grade recycled rPET, reducing virgin plastic consumption across India.",
      changeNotes: 'Customer email dispatch',
      aiReviewCompleted: true,
      governanceScore: 95,
      totalFindings: 0,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    allVersions: [],
    findings: [],
    comments: [
      {
        _id: 'comm-7-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: 'Approved. Accurately references FACT-003 and GUIDE-006 sustainability standards.',
        createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
      }
    ]
  },
  'demo-submission-8': {
    content: DEMO_CONTENTS[7],
    currentVersion: {
      _id: 'ver-8-1',
      contentId: 'demo-submission-8',
      versionNumber: 1,
      rawText: "Say hello to FreshPlus Guava Glow! Packed with natural Vitamin C to give you an extraordinary immunity shield.",
      changeNotes: 'Social announcement draft',
      aiReviewCompleted: true,
      governanceScore: 78,
      totalFindings: 1,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    allVersions: [],
    findings: [
      {
        _id: 'f8-1',
        category: 'Unsupported Claim',
        severity: 'medium',
        excerpt: 'extraordinary immunity shield',
        reason: 'Quantitative or dramatic immunity promises violate FSSAI advertising standards without approved clinical trials.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002', 'REG-FSSAI-001'],
        sourceExcerpt: 'Quantitative medical claims violate FSSAI advertising standards without approved laboratory clinical trials.',
        suggestedRewrite: 'delivers daily natural Vitamin C',
        confidence: 0.93,
        decision: 'pending'
      }
    ],
    comments: []
  },
  'demo-submission-9': {
    content: DEMO_CONTENTS[8],
    currentVersion: {
      _id: 'ver-9-1',
      contentId: 'demo-submission-9',
      versionNumber: 1,
      rawText: "#ad Morning mindfulness paired with FreshPlus Valencia Orange Juice. Zero added cane sugar, pure cold-pasteurized fruit freshness to start your routine.",
      changeNotes: 'Influencer campaign post',
      aiReviewCompleted: true,
      governanceScore: 98,
      totalFindings: 0,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    allVersions: [],
    findings: [],
    comments: [
      {
        _id: 'comm-9-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: 'Approved. Complies with ASCI influencer disclosure (#ad) and fact FACT-001.',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
      }
    ]
  },
  'demo-submission-10': {
    content: DEMO_CONTENTS[9],
    currentVersion: {
      _id: 'ver-10-1',
      contentId: 'demo-submission-10',
      versionNumber: 1,
      rawText: "Late for office? Fresh+ is the #1 choice of doctors for instant vitality on the go.",
      changeNotes: 'Metro billboard copy',
      aiReviewCompleted: true,
      governanceScore: 58,
      totalFindings: 2,
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
    },
    allVersions: [],
    findings: [
      {
        _id: 'f10-1',
        category: 'Brand Terminology',
        severity: 'high',
        excerpt: 'Fresh+',
        reason: 'Prohibited naming abbreviation. Registered name is FreshPlus.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-001', 'TERM-001'],
        sourceExcerpt: 'The preferred product name is "FreshPlus". Prohibited: Fresh+.',
        suggestedRewrite: 'FreshPlus',
        confidence: 0.98,
        decision: 'pending'
      },
      {
        _id: 'f10-2',
        category: 'Promotional Claim',
        severity: 'high',
        excerpt: '#1 choice of doctors for instant vitality',
        reason: 'Claiming professional doctor endorsement and instant vitality violates CCPA Guideline 4 and FSSAI Section 8(1) without verified medical survey data.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002', 'REG-CCPA-001'],
        sourceExcerpt: 'Endorsements and superlatives require documented independent substantiation.',
        suggestedRewrite: 'Human review required',
        confidence: 0.96,
        decision: 'pending'
      }
    ],
    comments: [
      {
        _id: 'comm-10-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: 'Cannot claim doctor endorsements without verified panel authorization. Please revise.',
        createdAt: new Date(Date.now() - 86400000 * 6).toISOString()
      }
    ]
  },
  'demo-submission-11': {
    content: DEMO_CONTENTS[10],
    currentVersion: {
      _id: 'ver-11-1',
      contentId: 'demo-submission-11',
      versionNumber: 1,
      rawText: "FreshPlus Alphonso Mango Nectar is made from pulp-rich Indian Alphonso mangoes. FSSAI License: 10019022009841. Delivers authentic tropical taste with no synthetic colors.",
      changeNotes: 'Website product specifications',
      aiReviewCompleted: true,
      governanceScore: 85,
      totalFindings: 1,
      createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
    },
    allVersions: [],
    findings: [
      {
        _id: 'f11-1',
        category: 'Packaging & Labelling',
        severity: 'low',
        excerpt: 'pulp-rich Indian Alphonso mangoes',
        reason: 'For nectar category beverages, FSSAI labeling recommends specifying minimum fruit pulp percentage (40%) per FACT-006.',
        evidenceStatus: 'advisory',
        sourceIds: ['GUIDE-007', 'FACT-006'],
        sourceExcerpt: 'Packaging declarations must specify fruit pulp percentages for nectars.',
        suggestedRewrite: '40% authentic Alphonso mango pulp',
        confidence: 0.88,
        decision: 'pending'
      }
    ],
    comments: []
  },
  'demo-submission-12': {
    content: DEMO_CONTENTS[11],
    currentVersion: {
      _id: 'ver-12-1',
      contentId: 'demo-submission-12',
      versionNumber: 1,
      rawText: "Beat the summer heat with FreshPlus 100% Pure Pasteurized Fruit Juices. Naturally refreshing citrus hydration.",
      changeNotes: 'Summer hero web banner',
      aiReviewCompleted: true,
      governanceScore: 96,
      totalFindings: 0,
      createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
    },
    allVersions: [],
    findings: [],
    comments: [
      {
        _id: 'comm-12-1',
        user: { _id: 'demo-manager-id', name: 'Rohan Deshmukh (Manager)', role: 'manager' },
        text: 'Approved for production banner rotation.',
        createdAt: new Date(Date.now() - 86400000 * 7).toISOString()
      }
    ]
  },
  'demo-submission-13': {
    content: DEMO_CONTENTS[12],
    currentVersion: {
      _id: 'ver-13-1',
      contentId: 'demo-submission-13',
      versionNumber: 1,
      rawText: "Replace coffee machines with Fresh Plus. 100% guaranteed to eliminate afternoon workplace fatigue permanently.",
      changeNotes: 'Corporate wellness sales email',
      aiReviewCompleted: true,
      governanceScore: 68,
      totalFindings: 2,
      createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
    },
    allVersions: [],
    findings: [
      {
        _id: 'f13-1',
        category: 'Brand Terminology',
        severity: 'high',
        excerpt: 'Fresh Plus',
        reason: 'Unapproved spacing. Must be single CamelCase word FreshPlus.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-001', 'TERM-001'],
        sourceExcerpt: 'The brand name is FreshPlus.',
        suggestedRewrite: 'FreshPlus',
        confidence: 0.98,
        decision: 'pending'
      },
      {
        _id: 'f13-2',
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: '100% guaranteed to eliminate afternoon workplace fatigue permanently',
        reason: 'Absolute fatigue elimination guarantees violate FSSAI Regulation 8(1) and internal health claims policies.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002', 'GUIDE-003', 'REG-FSSAI-001'],
        sourceExcerpt: 'Statements asserting curative or permanent fatigue elimination outcomes are prohibited.',
        suggestedRewrite: 'provides natural daily refreshment for your team',
        confidence: 0.94,
        decision: 'pending'
      }
    ],
    comments: [
      {
        _id: 'comm-13-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: 'Changes requested: Soften guarantee to everyday natural hydration and correct brand spelling.',
        createdAt: new Date(Date.now() - 86400000 * 8).toISOString()
      }
    ]
  },
  'demo-submission-14': {
    content: DEMO_CONTENTS[13],
    currentVersion: {
      _id: 'ver-14-1',
      contentId: 'demo-submission-14',
      versionNumber: 1,
      rawText: "Happy World Environment Day from FreshPlus! Join our circular economy journey: every FreshPlus bottle is 100% recyclable rPET. Enjoy freshness, recycle responsibly.",
      changeNotes: 'Environmental awareness post',
      aiReviewCompleted: true,
      governanceScore: 97,
      totalFindings: 0,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    allVersions: [],
    findings: [],
    comments: [
      {
        _id: 'comm-14-1',
        user: { _id: 'demo-reviewer-id', name: 'Arjun Mehta (Reviewer)', role: 'reviewer' },
        text: 'Approved. Perfect balance of brand identity and verifiable sustainability facts.',
        createdAt: new Date(Date.now() - 86400000 * 9).toISOString()
      }
    ]
  }
};

// Default fallback submission details
export const DEMO_SUBMISSION_DETAILS = DEMO_SUBMISSIONS_MAP['demo-submission-1'];

// Helper to look up submission details dynamically by ID
export const getDemoSubmissionDetails = (id) => {
  if (id && DEMO_SUBMISSIONS_MAP[id]) {
    return DEMO_SUBMISSIONS_MAP[id];
  }
  return DEMO_SUBMISSION_DETAILS;
};

export const DEMO_ANALYTICS_FINDINGS = {
  totalFindings: 17,
  byCategory: [
    { category: 'Brand Terminology', count: 5 },
    { category: 'Unsupported Claim', count: 4 },
    { category: 'Promotional Claim', count: 4 },
    { category: 'Influencer Marketing', count: 2 },
    { category: 'Brand Style & Tone', count: 1 },
    { category: 'Packaging & Labelling', count: 1 }
  ],
  bySeverity: [
    { severity: 'high', count: 6 },
    { severity: 'medium', count: 8 },
    { severity: 'low', count: 3 }
  ],
  byEvidenceStatus: [
    { status: 'contradicted', count: 13 },
    { status: 'flagged', count: 2 },
    { status: 'advisory', count: 2 }
  ],
  byDecision: [
    { decision: 'accepted', count: 11 },
    { decision: 'pending', count: 4 },
    { decision: 'dismissed', count: 2 }
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
    },
    {
      _id: 'df2',
      category: 'Promotional Claim',
      excerpt: 'Pure taste of the tropics',
      dismissReason: 'Generic sensory description, not an unverified market share superiority claim',
      dismissalReason: 'Generic sensory description, not an unverified market share superiority claim',
      dismissedBy: { name: 'Rohan Deshmukh (Manager)' },
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]
};

export const DEMO_ANALYTICS_RULES = {
  frequentlyTriggeredRules: [
    {
      ruleId: 'GUIDE-001',
      count: 5,
      title: 'Approved Product Name Spelling & Capitalization',
      category: 'Brand Terminology'
    },
    {
      ruleId: 'REG-FSSAI-001',
      count: 4,
      title: 'FSSAI Prohibition on Disease Prevention & Curative Claims',
      category: 'Regulatory Compliance'
    },
    {
      ruleId: 'GUIDE-003',
      count: 4,
      title: 'Promotional Superlatives & Market Dominance Claims',
      category: 'Promotional Claim'
    },
    {
      ruleId: 'REG-ASCI-002',
      count: 2,
      title: 'ASCI Guidelines for Influencer Advertising Disclosures',
      category: 'Influencer Marketing'
    },
    {
      ruleId: 'GUIDE-004',
      count: 1,
      title: 'Brand Tone: Warm, Professional, and Informative',
      category: 'Brand Style & Tone'
    },
    {
      ruleId: 'GUIDE-007',
      count: 1,
      title: 'Mandatory Packaging Artwork Declarations',
      category: 'Packaging & Labelling'
    }
  ],
  topTriggeredRules: [
    {
      guidelineId: 'GUIDE-001',
      title: 'Approved Product Name Spelling & Capitalization',
      triggerCount: 5,
      category: 'Brand Terminology'
    },
    {
      guidelineId: 'REG-FSSAI-001',
      title: 'FSSAI Prohibition on Disease Prevention & Curative Claims',
      triggerCount: 4,
      category: 'Regulatory Compliance'
    },
    {
      guidelineId: 'GUIDE-003',
      title: 'Promotional Superlatives & Market Dominance Claims',
      triggerCount: 4,
      category: 'Promotional Claim'
    },
    {
      guidelineId: 'REG-ASCI-002',
      title: 'ASCI Guidelines for Influencer Advertising Disclosures',
      triggerCount: 2,
      category: 'Influencer Marketing'
    }
  ],
  recentDismissals: [
    {
      _id: 'df1',
      category: 'Brand Style & Tone',
      excerpt: 'Naturally refreshing!',
      dismissalReason: 'Exclamation mark permitted for seasonal social taglines per marketing director approval',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      _id: 'df2',
      category: 'Promotional Claim',
      excerpt: 'Pure taste of the tropics',
      dismissalReason: 'Generic sensory description, not an unverified market share superiority claim',
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
    }
  ]
};

export const DEMO_AUDIT_LOGS = [
  {
    _id: 'log-1',
    userEmail: 'reviewer@freshplus.io',
    role: 'reviewer',
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
    action: 'CHANGES_REQUESTED',
    targetResource: 'Content',
    targetId: 'demo-submission-4',
    details: { comment: 'Requested #ad disclosure and removal of stamina claim' },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    _id: 'log-3',
    userEmail: 'system@inkloomguard.xyz',
    role: 'system',
    action: 'AI_REVIEW_COMPLETED',
    targetResource: 'Content',
    targetId: 'demo-submission-1',
    details: { totalFindings: 4, governanceScore: 42 },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: 'log-4',
    userEmail: 'reviewer@freshplus.io',
    role: 'reviewer',
    action: 'CONTENT_REJECTED',
    targetResource: 'Content',
    targetId: 'demo-submission-6',
    details: { note: 'Severe statutory non-compliance with FSSAI Reg. 8(1)' },
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    _id: 'log-5',
    userEmail: 'manager@freshplus.io',
    role: 'manager',
    action: 'GUIDELINE_CREATED',
    targetResource: 'Guideline',
    targetId: 'REG-CCPA-002',
    details: { title: 'CCPA Mandatory Disclosure of Material Connection in Endorsements' },
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  }
];

// Helper to record demo audit events
export const recordDemoAuditLog = ({ action, user, targetId, details }) => {
  const newLog = {
    _id: `log-demo-${Date.now()}`,
    userEmail: user?.email || 'reviewer@freshplus.io',
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
      guideId: 'REG-FSSAI-003',
      termId: 'TERM-003',
      reason: 'Our juices contain natural fruit sugars exceeding 0.5g/100ml, violating FSSAI Regulation 5(3) Sugar-Free limits. Under Regulation 6(1), No Added Sugar claims must meet all 5 statutory conditions and declare "CONTAINS NATURALLY OCCURRING SUGARS".'
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

  // 2. Curative & Disease Claims (FSSAI Regs. 7 & 10(1))
  const healthPatterns = [
    {
      regex: /(cures?\s+(?:fatigue|tiredness|illness|disease)(?:\s+instantly)?)/i,
      reason: 'FSSAI Regulations 7 & 10(1) strictly prohibit food advertisements from claiming that a beverage cures, treats, or alleviates human disease or fatigue without clinical standard substantiation.',
      rewrite: 'delivers daily refreshment',
      sourceIds: ['GUIDE-002', 'REG-FSSAI-001']
    },
    {
      regex: /(completely\s+prevents?\s+(?:seasonal\s+viral\s+)?(?:flu|cold|disease))/i,
      reason: 'Direct disease prevention claims violate statutory FSSAI Regulations 7 & 10(1) and CCPA consumer protection standards.',
      rewrite: 'Human review required',
      sourceIds: ['GUIDE-002', 'REG-FSSAI-001', 'REG-CCPA-001']
    },
    {
      regex: /(boosts?\s+(?:your\s+)?immunity(?:\s+by\s+\d+%)?)/i,
      reason: 'Quantitative medical claims ("boosts immunity") violate FSSAI advertising standards without approved laboratory clinical trials.',
      rewrite: 'Human review required',
      sourceIds: ['GUIDE-002', 'REG-FSSAI-001']
    },
    {
      regex: /(miraculous\s+stamina\s+recovery|instant\s+cure)/i,
      reason: 'Therapeutic and curative promises violate regulatory brand compliance and statutory food advertising rules.',
      rewrite: 'refreshing fruit hydration',
      sourceIds: ['GUIDE-002', 'REG-FSSAI-001']
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
        sourceIds: hp.sourceIds,
        sourceExcerpt: 'FSSAI Regulations 7 & 10(1): All statements asserting curative, medicinal, or instant disease outcomes are strictly prohibited.',
        suggestedRewrite: hp.rewrite,
        confidence: 0.95,
        decision: 'pending'
      });
    }
  });

  // 3. Superlative & Guarantee Claims (ASCI Clause I.4 & CCPA Guideline 4)
  const superlativePatterns = [
    {
      regex: /(India's\s+No\.?\s*1(?:\s+energy\s+drink|\s+juice)?)/i,
      reason: 'Promotional superlatives such as "India\'s No. 1" or market dominance assertions require documented, independently verified market share audit evidence in the brand repository under ASCI Clause I.4.',
      rewrite: 'a refreshing fruit juice',
      sourceIds: ['GUIDE-003', 'REG-ASCI-001']
    },
    {
      regex: /(best\s+juice\s+in\s+India|world's\s+best\s+juice)/i,
      reason: 'Promotional superlatives such as "best juice in India" require documented, verified market share evidence in the brand repository before publication under ASCI and CCPA rules.',
      rewrite: 'a delicious citrus juice',
      sourceIds: ['GUIDE-003', 'REG-ASCI-001']
    },
    {
      regex: /(guaranteed\s+(?:100%\s+)?natural\s+energy|100%\s+guaranteed\s+to\s+eliminate\s+[^.]+fatigue)/i,
      reason: 'Absolute promotional guarantees violate fair advertising practice and brand communication standards.',
      rewrite: 'refreshing natural energy',
      sourceIds: ['GUIDE-003', 'REG-FSSAI-001']
    },
    {
      regex: /(#1\s+choice\s+of\s+doctors(?:\s+for\s+instant\s+vitality)?)/i,
      reason: 'Claiming professional doctor endorsements without verified medical panel authorization violates CCPA Guideline 4 and FSSAI advertising standards.',
      rewrite: 'Human review required',
      sourceIds: ['GUIDE-002', 'REG-CCPA-001']
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
        sourceIds: sp.sourceIds,
        sourceExcerpt: 'Promotional superlatives and performance guarantees require documented evidence in the brand repository before publication.',
        suggestedRewrite: sp.rewrite,
        confidence: 0.92,
        decision: 'pending'
      });
    }
  });

  // 4. Influencer Disclosure Missing Check (ASCI Influencer Guidelines & CCPA Guideline 12)
  if (text.toLowerCase().includes('influencer') || text.toLowerCase().includes('reel') || text.toLowerCase().includes('post-workout drink')) {
    if (!/#(?:ad|sponsored|collab|freshpluscollab|partnership)\b/i.test(text)) {
      findings.push({
        _id: `f-demo-${findings.length + 1}`,
        category: 'Influencer Marketing',
        severity: 'high',
        excerpt: text.slice(0, 40),
        reason: 'Paid creator partnerships and sponsored lifestyle posts must carry upfront disclosure tags (#ad, #FreshPlusCollab) in the opening lines per ASCI Digital Media Guidelines and CCPA Guideline 12.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-008', 'REG-ASCI-002', 'REG-CCPA-002'],
        sourceExcerpt: 'All digital creator endorsements must prominently feature upfront disclosure tags (#ad, #sponsored, #collab).',
        suggestedRewrite: `#ad ${text.slice(0, 40)}`,
        confidence: 0.96,
        decision: 'pending'
      });
    }
  }

  // 5. Brand Tone & Aggressive Punctuation
  const toneMatch = text.match(/(!{2,}|Buy now!{1,3}|Drink daily or get sick!)/i);
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
