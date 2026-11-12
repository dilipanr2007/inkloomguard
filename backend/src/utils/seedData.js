require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Guideline = require('../models/Guideline');
const Terminology = require('../models/Terminology');
const ApprovedFact = require('../models/ApprovedFact');
const BrandAsset = require('../models/BrandAsset');
const Content = require('../models/Content');
const ContentVersion = require('../models/ContentVersion');
const Finding = require('../models/Finding');
const Comment = require('../models/Comment');
const AuditLog = require('../models/AuditLog');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/inkloom';

    // Priority 2 Demo Isolation Guard: Never allow unconditional wiping of remote or production databases
    const isProduction = process.env.NODE_ENV === 'production';
    const isRemoteDb = mongoUri && !mongoUri.includes('localhost') && !mongoUri.includes('127.0.0.1');

    if (isProduction && process.env.ALLOW_DEMO_SEED !== 'true') {
      console.error('[Seed Aborted] Refusing to run seed script in production environment without explicit ALLOW_DEMO_SEED=true.');
      process.exit(1);
    }

    if (isRemoteDb && process.env.ALLOW_DEMO_SEED !== 'true') {
      console.error('[Seed Aborted] Target MongoDB is a remote/cloud cluster. To prevent accidental data loss, you must explicitly set ALLOW_DEMO_SEED=true to seed this environment.');
      process.exit(1);
    }

    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seed] Clearing existing demo collections...');
    await Promise.all([
      User.deleteMany({}),
      Guideline.deleteMany({}),
      Terminology.deleteMany({}),
      ApprovedFact.deleteMany({}),
      BrandAsset.deleteMany({}),
      Content.deleteMany({}),
      ContentVersion.deleteMany({}),
      Finding.deleteMany({}),
      Comment.deleteMany({}),
      AuditLog.deleteMany({})
    ]);

    console.log('[Seed] Creating demo users...');
    const creator = await User.create({
      name: 'Priya Sharma (Creator)',
      email: 'creator@freshplus.io',
      password: 'Creator123!',
      role: 'creator',
      organization: 'FreshPlus Global',
      department: 'Creative & Social Media',
      onboarding: { completed: false, skipped: false, version: 1 }
    });

    const reviewer = await User.create({
      name: 'Arjun Mehta (Reviewer)',
      email: 'reviewer@freshplus.io',
      password: 'Reviewer123!',
      role: 'reviewer',
      organization: 'FreshPlus Global',
      department: 'Legal & Compliance',
      onboarding: { completed: false, skipped: false, version: 1 }
    });

    const manager = await User.create({
      name: 'Rohan Deshmukh (Manager)',
      email: 'manager@freshplus.io',
      password: 'Manager123!',
      role: 'manager',
      organization: 'FreshPlus Global',
      department: 'Global Brand Governance',
      onboarding: { completed: false, skipped: false, version: 1 }
    });

    console.log('[Seed] Seeding brand guidelines & regulatory knowledge...');
    // Internal Brand Guidelines
    await Guideline.create([
      {
        guidelineId: 'GUIDE-001',
        title: 'Approved Product Name Spelling & Capitalization',
        description: 'The preferred and legally registered product name is "FreshPlus". It must always be written in CamelCase as a single word. Never separate the words ("Fresh Plus") or substitute the plus sign "+" ("Fresh+").',
        category: 'Brand Terminology',
        severity: 'high',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-002',
        title: 'Prohibition of Unsupported Health & Curative Claims',
        description: 'Do not use unsupported health benefit claims. All statements asserting curative, medicinal, disease prevention, or instant stamina outcomes (e.g. "cures fatigue", "boosts immunity by 50%") are strictly prohibited unless substantiated by an approved clinical fact in the brand repository.',
        category: 'Unsupported Claim',
        severity: 'high',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-003',
        title: 'Promotional Superlatives & Market Dominance Claims',
        description: 'Promotional superlatives such as "India\'s No. 1", "Best in the world", or market leadership claims require documented, verified sales or audit evidence in the brand repository before publication.',
        category: 'Promotional Claim',
        severity: 'medium',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-004',
        title: 'Brand Tone: Warm, Professional, and Informative',
        description: 'Maintain a clean, premium, and trustworthy editorial voice. Avoid multiple exclamation marks (e.g. "Buy now!!!"), aggressive clickbait, alarmist urgency, and hyperbolic slang.',
        category: 'Brand Tone',
        severity: 'advisory',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-005',
        title: 'Ingredient Transparency & Everyday Refreshment',
        description: 'All copy must communicate everyday natural fruit freshness, transparent sourcing, and balanced lifestyle hydration. Never depict fresh juice as a pharmaceutical replacement for balanced meals or medical treatments.',
        category: 'Messaging Consistency',
        severity: 'medium',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-006',
        title: 'Environmental & Recyclable Packaging Claims',
        description: 'Sustainability communications must accurately reflect our 100% rPET recyclable packaging standards. Do not make vague "100% green" claims without citing our recycled plastic materials.',
        category: 'Messaging Consistency',
        severity: 'advisory',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-007',
        title: 'Mandatory Packaging Artwork Declarations',
        description: 'Every commercial packaging asset must display the mandatory FSSAI license number, full nutritional table per 100ml, batch and manufacturing dates, and the green vegetarian logo.',
        category: 'Brand Tone',
        severity: 'high',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-008',
        title: 'Influencer Marketing & Endorsement Transparency',
        description: 'All paid creator collaborations, gifted samples, or digital influencer content must feature prominent upfront disclosure tags (#ad, #FreshPlusCollab) in the first two lines of text.',
        category: 'Promotional Claim',
        severity: 'high',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        guidelineId: 'GUIDE-009',
        title: 'Reviewer Escalation & Final Sign-Off Matrix',
        description: 'Claims involving quantitative nutritional percentages or comparative superiority require Manager-level sign-off. Routine social media posts and promotional banners may be signed off by Reviewers.',
        category: 'Messaging Consistency',
        severity: 'medium',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      // Traceable Official Regulatory Knowledge (FSSAI / ASCI / CCPA)
      {
        guidelineId: 'REG-FSSAI-001',
        title: 'FSSAI Prohibition on Disease Prevention, Treatment, and Cure Claims',
        description: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018 — Regulations 7, 10(1) & Schedule III: Prohibits claims that a food product can prevent, treat, mitigate, or cure any disease or medical disorder without statutory approval.',
        category: 'Unsupported Claim',
        severity: 'high',
        status: 'active',
        version: '2018 (Effective 1 July 2019, amended 2021)',
        createdBy: manager._id
      },
      {
        guidelineId: 'REG-FSSAI-002',
        title: 'FSSAI Standards for "Natural", "Fresh", and "Pure" Representations',
        description: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018 — Regulation 9(2) & Schedule V: "Fresh" is restricted to raw or minimally processed foods where processing does not extend normal shelf-life, and non-qualifying brand names must carry a statutory trademark disclaimer under Regulation 4(7).',
        category: 'Messaging Consistency',
        severity: 'high',
        status: 'active',
        version: '2018 (Effective 1 July 2019)',
        createdBy: manager._id
      },
      {
        guidelineId: 'REG-FSSAI-003',
        title: 'FSSAI Sugar-Free Thresholds & Non-Addition of Sugars Requirements',
        description: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018 — Regulation 5(3), Schedule I & Regulation 6(1): "Sugar-Free" is a separate nutrient content claim restricted to <= 0.5g total sugars per 100g/ml under Schedule I. Under Regulation 6(1), "No Added Sugar" claims require: (1) no sugars of any type have been added; (2) no ingredients containing sugars are present; (3) no ingredients containing sugars used as substitutes for added sugars are present; (4) sugar content has not been increased through other means, including enzymatic hydrolysis; and (5) where sugars are naturally present, the mandatory statement "CONTAINS NATURALLY OCCURRING SUGARS" must be declared.',
        category: 'Brand Terminology',
        severity: 'high',
        status: 'active',
        version: '2018 (Effective 1 July 2019)',
        createdBy: manager._id
      },
      {
        guidelineId: 'REG-FSSAI-004',
        title: 'FSSAI Comparative Nutrition Claims & Disclaimer Legibility Standards',
        description: 'Food Safety and Standards (Advertising and Claims) Regulations, 2018 — Regulation 5(4), Regulation 5(5), Regulation 4(7), Regulation 4(8) & Regulation 4(14): Regulates nutrient comparative claims (requiring >=30% difference for energy/macronutrients and >=10% RDA difference for micronutrients) and mandates that all disclaimers must be conspicuous, legible, and consistent with product labels, with prescribed font scales applied to trademark disclaimers under Regulation 4(7).',
        category: 'Brand Tone',
        severity: 'medium',
        status: 'active',
        version: '2018 (Effective 1 July 2019)',
        createdBy: manager._id
      },
      {
        guidelineId: 'REG-ASCI-001',
        title: 'ASCI Truthful Substantiation & Non-Misleading Representation',
        description: 'ASCI Code for Self-Regulation in Advertising — Chapter I, Clause 1.1 & Clause 1.4: All claims of objectively ascertainable facts must be capable of substantiation (Clause 1.1) and prohibits advertisements that distort facts or mislead consumers through exaggeration, omissions, or ambiguities (Clause 1.4).',
        category: 'Promotional Claim',
        severity: 'high',
        status: 'active',
        version: '2023 Code Edition',
        createdBy: manager._id
      },
      {
        guidelineId: 'REG-ASCI-002',
        title: 'ASCI Upfront Disclosure Requirements for Digital Influencer Content',
        description: 'ASCI Guidelines for Influencer Advertising in Digital Media (2021) — Commercial influencer content and creator collaborations must feature clear, upfront, and prominent disclosure labels (#ad, #sponsored, #collab) to ensure commercial partnerships are transparent to consumers.',
        category: 'Promotional Claim',
        severity: 'high',
        status: 'active',
        version: '2021 (Effective 14 June 2021, updated 2023)',
        createdBy: manager._id
      },
      {
        guidelineId: 'REG-CCPA-001',
        title: 'CCPA Conditions for Non-Misleading Advertisements & Valid Endorsements',
        description: 'Guidelines for Prevention of Misleading Advertisements, 2022 — Guideline 4: Establishes conditions for valid, non-misleading advertisements under Guideline 4 and requires that professional and expert endorsements be substantiated by competent, verifiable evaluation.',
        category: 'Promotional Claim',
        severity: 'high',
        status: 'active',
        version: 'Notified 9 June 2022',
        createdBy: manager._id
      },
      {
        guidelineId: 'REG-CCPA-002',
        title: 'CCPA Disclaimers, Substantiation Duties & Disclosure of Material Connection',
        description: 'Guidelines for Prevention of Misleading Advertisements, 2022 — Guideline 11 (Disclaimers), Guideline 12 (Substantiation Duties) & Guideline 14 (Material Connection): Mandates that disclaimers must be legible and not contradict the primary claim (Guideline 11), requires advertisers to substantiate claims of fact (Guideline 12), and requires clear disclosure of material connections in endorsements (Guideline 14).',
        category: 'Promotional Claim',
        severity: 'high',
        status: 'active',
        version: 'Notified 9 June 2022',
        createdBy: manager._id
      }
    ]);

    console.log('[Seed] Seeding terminology rules...');
    await Terminology.create([
      {
        terminologyId: 'TERM-001',
        preferredTerm: 'FreshPlus',
        prohibitedTerms: ['Fresh+', 'Fresh Plus', 'FRESH+', 'Freshplus'],
        explanation: 'The brand name must always be formatted in CamelCase as "FreshPlus". The symbol "+" is forbidden in marketing copy.',
        category: 'Product Name',
        severity: 'high',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        terminologyId: 'TERM-002',
        preferredTerm: '100% Pure Pasteurized Juice',
        prohibitedTerms: ['Orange Soda', 'Synthetic Orange', 'Fruit Concentrate Drink', 'Orange Squash'],
        explanation: 'FreshPlus is 100% pure pasteurized juice, not a diluted concentrate or synthetic carbonated soda.',
        category: 'Ingredient Quality',
        severity: 'high',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        terminologyId: 'TERM-003',
        preferredTerm: 'Zero Added Cane Sugar',
        prohibitedTerms: ['Diet Drink', 'Zero Calorie', 'Sugar Free'],
        explanation: 'Our products contain natural fruit sugars; "Sugar Free" violates statutory FSSAI and CCPA consumer standards.',
        category: 'Nutritional Messaging',
        severity: 'high',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        terminologyId: 'TERM-004',
        preferredTerm: 'Cold-Pasteurized',
        prohibitedTerms: ['Raw Unprocessed Juice', 'Boiled Juice'],
        explanation: 'FreshPlus uses flash cold-pasteurization at 72°C to ensure micro-biological food safety while preserving fresh fruit taste.',
        category: 'Processing Standards',
        severity: 'medium',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      }
    ]);

    console.log('[Seed] Seeding approved facts...');
    await ApprovedFact.create([
      {
        factId: 'FACT-001',
        statement: 'FreshPlus Valencia Orange juice contains 100% pure pasteurized fruit juice with zero added refined cane sugars or synthetic preservatives.',
        category: 'Ingredients',
        sourceDoc: 'Internal Lab Formulation Spec #FP-SPEC-2025-01 (Fictional Demo Spec)',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        factId: 'FACT-002',
        statement: 'FreshPlus Orange Juice delivers 24mg of natural Vitamin C per 100ml serving, satisfying 60% of daily recommended nutritional intake under Indian ICMR standards.',
        category: 'Nutrition',
        sourceDoc: 'Internal Nutritional Quality Profile #FP-NUTR-2025-02 (Fictional Demo Spec)',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        factId: 'FACT-003',
        statement: 'FreshPlus bottles are crafted from 100% recycled food-grade rPET and are fully recyclable across India.',
        category: 'Packaging',
        sourceDoc: 'Packaging Sustainability Specification #FP-PKG-2025-03 (Fictional Demo Spec)',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        factId: 'FACT-004',
        statement: 'FreshPlus Crisp Himalayan Apple juice contains 100% pure apple juice with natural pectin and zero synthetic preservatives.',
        category: 'Ingredients',
        sourceDoc: 'Internal Orchard Batch Specification #FP-APL-2025-04 (Fictional Demo Spec)',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        factId: 'FACT-005',
        statement: 'Cold-pasteurization occurs at 72°C for 15 seconds to eliminate harmful microbes while preserving delicate natural fruit aroma and vitamins.',
        category: 'Operations',
        sourceDoc: 'Thermal Processing SOP #FP-SOP-2025-05 (Fictional Demo Spec)',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      },
      {
        factId: 'FACT-006',
        statement: 'FreshPlus Alphonso Mango Nectar contains 40% authentic fruit pulp with authentic Alphonso mango aroma, with no synthetic yellow dyes.',
        category: 'Ingredients',
        sourceDoc: 'Mango Pulp Standard Formulation #FP-MNG-2025-06 (Fictional Demo Spec)',
        status: 'active',
        version: '1.0',
        createdBy: manager._id
      }
    ]);

    console.log('[Seed] Seeding brand assets...');
    await BrandAsset.create([
      {
        assetId: 'ASSET-001',
        name: 'FreshPlus Core Palette',
        type: 'Color Palette',
        details: {
          primary: '#FF6B35',
          secondary: '#2EC4B6',
          neutralDark: '#1E293B',
          neutralLight: '#F8FAFC',
          accent: '#FFA62B'
        },
        createdBy: manager._id
      },
      {
        assetId: 'ASSET-002',
        name: 'Official Typography Suite',
        type: 'Typography',
        details: {
          displayFont: 'Plus Jakarta Sans',
          bodyFont: 'Inter',
          weights: ['400 (Regular)', '500 (Medium)', '600 (SemiBold)', '700 (Bold)']
        },
        createdBy: manager._id
      }
    ]);

    console.log('[Seed] Seeding Submissions...');
    // Submission 1: Social Teaser
    const sub1 = await Content.create({
      title: 'Summer Launch Campaign - Social Teaser',
      contentType: 'Social Media Post',
      campaign: 'Summer Launch 2026',
      creator: creator._id,
      currentVersion: 1,
      status: 'ai_reviewed',
      lastReviewedAt: new Date(Date.now() - 3600000 * 2),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create([
      {
        contentId: sub1._id,
        versionNumber: 1,
        rawText: "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!",
        submittedBy: creator._id,
        changeNotes: 'Initial draft submitted for pre-publication governance review',
        aiReviewCompleted: true,
        governanceScore: 42,
        totalFindings: 4
      },
      {
        contentId: sub1._id,
        versionNumber: 2,
        rawText: "FreshPlus delivers refreshing daily refreshment! Our refreshing fruit juice is finally here. Shop now.",
        submittedBy: creator._id,
        changeNotes: 'Revised copy applying AI governance suggestions and removing ungrounded claims',
        aiReviewCompleted: true,
        governanceScore: 96,
        totalFindings: 0
      }
    ]);

    await Finding.create([
      {
        contentId: sub1._id,
        versionNumber: 1,
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
        contentId: sub1._id,
        versionNumber: 1,
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
        contentId: sub1._id,
        versionNumber: 1,
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
        contentId: sub1._id,
        versionNumber: 1,
        category: 'Brand Tone',
        severity: 'advisory',
        excerpt: 'Buy now!!!',
        reason: 'Multiple exclamation points (!!!) and aggressive promotional shouting violate our refined editorial voice standards.',
        evidenceStatus: 'advisory',
        sourceIds: ['GUIDE-004'],
        sourceExcerpt: 'Maintain a clean, premium, trustworthy editorial voice. Avoid multiple exclamation marks and aggressive clickbait.',
        suggestedRewrite: 'Shop now.',
        confidence: 0.89,
        decision: 'pending'
      }
    ]);

    await Comment.create({
      contentId: sub1._id,
      versionNumber: 1,
      author: reviewer._id,
      role: 'reviewer',
      comment: 'Priya, please adopt the approved "FreshPlus" spelling, remove the instant cure claim, and tone down the promotional superlatives before we can approve this for publication.'
    });

    // Submission 2: Advertising Copy
    const sub2 = await Content.create({
      title: 'Valencia Orange - Morning Energy Ad Copy',
      contentType: 'Advertising Copy',
      campaign: 'Daily Nutrition 2026',
      creator: creator._id,
      currentVersion: 1,
      status: 'in_review',
      lastReviewedAt: new Date(Date.now() - 86400000 * 1),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create({
      contentId: sub2._id,
      versionNumber: 1,
      rawText: "Drink FreshPlus every morning for guaranteed 100% natural energy. The best juice in India to power through workdays.",
      submittedBy: creator._id,
      changeNotes: 'Initial draft for Q2 digital campaign',
      aiReviewCompleted: true,
      governanceScore: 74,
      totalFindings: 2
    });

    await Finding.create([
      {
        contentId: sub2._id,
        versionNumber: 1,
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
        contentId: sub2._id,
        versionNumber: 1,
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
    ]);

    await Comment.create({
      contentId: sub2._id,
      versionNumber: 1,
      author: reviewer._id,
      role: 'reviewer',
      comment: 'Please soften the "guaranteed" wording and reference our approved FACT-002 (24mg natural Vitamin C) instead of calling it the best juice in India.'
    });

    // Submission 3: Packaging Description (Approved)
    const sub3 = await Content.create({
      title: 'Pure Valencia Orange - Retail Pack Description',
      contentType: 'Packaging Description',
      campaign: 'Retail Packaging 2026',
      creator: creator._id,
      currentVersion: 2,
      status: 'approved',
      reviewedBy: reviewer._id,
      lastReviewedAt: new Date(Date.now() - 86400000 * 2),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create([
      {
        contentId: sub3._id,
        versionNumber: 1,
        rawText: "Fresh Plus pure juice with natural energy.",
        submittedBy: creator._id,
        changeNotes: 'First draft',
        aiReviewCompleted: true,
        governanceScore: 78,
        totalFindings: 1
      },
      {
        contentId: sub3._id,
        versionNumber: 2,
        rawText: "FreshPlus 100% Pure Pasteurized Orange Juice contains zero added sugar and delivers 24mg of natural Vitamin C per 100ml. Bottled in 100% recyclable rPET.",
        submittedBy: creator._id,
        changeNotes: 'Corrected terminology to FreshPlus and cited verified facts',
        aiReviewCompleted: true,
        governanceScore: 98,
        totalFindings: 0
      }
    ]);

    await Comment.create({
      contentId: sub3._id,
      versionNumber: 2,
      author: reviewer._id,
      role: 'reviewer',
      comment: '[APPROVED]: Fully verified against GUIDE-001, FACT-001, FACT-002, and FACT-003. Approved for commercial retail packaging.'
    });

    // Submission 4: Influencer Promotion (Changes Requested)
    const sub4 = await Content.create({
      title: 'Fitness Creator Reel Caption - Mango Nectar',
      contentType: 'Influencer Promotion',
      campaign: 'Active Lifestyle Influencers 2026',
      creator: creator._id,
      currentVersion: 1,
      status: 'changes_requested',
      lastReviewedAt: new Date(Date.now() - 86400000 * 2),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create({
      contentId: sub4._id,
      versionNumber: 1,
      rawText: "My secret post-workout drink is FreshPlus Alphonso Mango Nectar! Gives you miraculous stamina recovery after heavy gym sessions.",
      submittedBy: creator._id,
      changeNotes: 'Draft caption submitted for creator collaboration',
      aiReviewCompleted: true,
      governanceScore: 62,
      totalFindings: 2
    });

    await Finding.create([
      {
        contentId: sub4._id,
        versionNumber: 1,
        category: 'Promotional Claim',
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
        contentId: sub4._id,
        versionNumber: 1,
        category: 'Unsupported Claim',
        severity: 'high',
        excerpt: 'miraculous stamina recovery',
        reason: 'Unsubstantiated therapeutic or stamina promises violate FSSAI Regulations 7 & 10(1) and internal health claims policies.',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-002', 'REG-FSSAI-001'],
        sourceExcerpt: 'Statements asserting curative, stamina, or medical outcomes are strictly prohibited.',
        suggestedRewrite: 'refreshing fruit hydration',
        confidence: 0.94,
        decision: 'pending'
      }
    ]);

    await Comment.create({
      contentId: sub4._id,
      versionNumber: 1,
      author: reviewer._id,
      role: 'reviewer',
      comment: 'Changes requested: Must include #ad disclosure upfront and remove the "miraculous stamina" phrasing.'
    });

    // Submission 5: Website Product Page (Approved)
    const sub5 = await Content.create({
      title: 'Crisp Himalayan Apple Juice - E-Commerce Landing Copy',
      contentType: 'Website Product Page',
      campaign: 'Direct-to-Consumer Launch',
      creator: creator._id,
      currentVersion: 1,
      status: 'approved',
      reviewedBy: manager._id,
      lastReviewedAt: new Date(Date.now() - 86400000 * 3),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create({
      contentId: sub5._id,
      versionNumber: 1,
      rawText: "FreshPlus Crisp Himalayan Apple Juice is pressed from handpicked apples with no added sugar or artificial preservatives. Each 200ml bottle delivers crisp, refreshing hydration.",
      submittedBy: creator._id,
      changeNotes: 'E-commerce product description',
      aiReviewCompleted: true,
      governanceScore: 100,
      totalFindings: 0
    });

    await Comment.create({
      contentId: sub5._id,
      versionNumber: 1,
      author: manager._id,
      role: 'manager',
      comment: 'Exemplary copy. Grounded in FACT-004 and fully compliant with FSSAI Regulation 5.'
    });

    // Submission 6: Promotional Banner (Rejected)
    const sub6 = await Content.create({
      title: 'Mega Supermarket Display - Monsoon Health Banner',
      contentType: 'Promotional Banner',
      campaign: 'Retail In-Store Visibility',
      creator: creator._id,
      currentVersion: 1,
      status: 'rejected',
      lastReviewedAt: new Date(Date.now() - 86400000 * 4),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create({
      contentId: sub6._id,
      versionNumber: 1,
      rawText: "Fresh Plus completely prevents seasonal viral flu and cold! 100% Sugar Free guarantee. Drink daily or get sick!",
      submittedBy: creator._id,
      changeNotes: 'Submitted for retail point-of-sale banner',
      aiReviewCompleted: true,
      governanceScore: 35,
      totalFindings: 3
    });

    await Finding.create([
      {
        contentId: sub6._id,
        versionNumber: 1,
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
        contentId: sub6._id,
        versionNumber: 1,
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
        contentId: sub6._id,
        versionNumber: 1,
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
    ]);

    await Comment.create({
      contentId: sub6._id,
      versionNumber: 1,
      author: reviewer._id,
      role: 'reviewer',
      comment: 'REJECTED: Severe statutory non-compliance. Direct medical prevention claims invite heavy regulatory penalties under FSSAI. Do not print.'
    });

    console.log('[Seed] Seeding audit logs...');
    await AuditLog.create([
      {
        user: reviewer._id,
        userEmail: reviewer.email,
        role: 'reviewer',
        action: 'CONTENT_APPROVED',
        targetResource: 'Content',
        targetId: sub3._id.toString(),
        details: { title: sub3.title, campaign: sub3.campaign }
      },
      {
        user: reviewer._id,
        userEmail: reviewer.email,
        role: 'reviewer',
        action: 'CHANGES_REQUESTED',
        targetResource: 'Content',
        targetId: sub4._id.toString(),
        details: { comment: 'Requested #ad disclosure and removal of stamina claim' }
      },
      {
        user: reviewer._id,
        userEmail: reviewer.email,
        role: 'reviewer',
        action: 'CONTENT_REJECTED',
        targetResource: 'Content',
        targetId: sub6._id.toString(),
        details: { note: 'Severe statutory non-compliance with FSSAI Regulations 7 & 10(1)' }
      },
      {
        user: creator._id,
        userEmail: creator.email,
        role: 'creator',
        action: 'SUBMIT_CONTENT',
        targetResource: 'Content',
        targetId: sub1._id.toString(),
        details: { title: sub1.title, version: 1 }
      }
    ]);

    console.log('=======================================================');
    console.log('  INKLOOM AI - Demo Database Seeded Successfully!       ');
    console.log('=======================================================');
    console.log('Demo Accounts:');
    console.log('  Creator:  creator@freshplus.io  / Creator123!');
    console.log('  Reviewer: reviewer@freshplus.io / Reviewer123!');
    console.log('  Manager:  manager@freshplus.io  / Manager123!');
    console.log('=======================================================');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
