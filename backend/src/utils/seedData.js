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
      department: 'Creative & Social Media'
    });

    const reviewer = await User.create({
      name: 'Arjun Mehta (Reviewer)',
      email: 'reviewer@freshplus.io',
      password: 'Reviewer123!',
      role: 'reviewer',
      organization: 'FreshPlus Global',
      department: 'Legal & Compliance'
    });

    const manager = await User.create({
      name: 'Rohan Deshmukh (Manager)',
      email: 'manager@freshplus.io',
      password: 'Manager123!',
      role: 'manager',
      organization: 'FreshPlus Global',
      department: 'Global Brand Governance'
    });

    console.log('[Seed] Seeding brand guidelines...');
    const g1 = await Guideline.create({
      guidelineId: 'GUIDE-001',
      title: 'Approved Product Name Spelling',
      description: 'The preferred and legally registered product name is "FreshPlus". Never separate the words or substitute the plus sign "+" for "Plus".',
      category: 'Brand Terminology',
      severity: 'high',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const g2 = await Guideline.create({
      guidelineId: 'GUIDE-002',
      title: 'Prohibition of Unsupported Health Claims',
      description: 'Do not use unsupported health benefit claims. All statements asserting curative, medicinal, disease prevention, or instant stamina outcomes are strictly prohibited unless substantiated by an approved clinical fact in the brand repository.',
      category: 'Unsupported Claim',
      severity: 'high',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const g3 = await Guideline.create({
      guidelineId: 'GUIDE-003',
      title: 'Promotional Superlatives and Market Dominance Claims',
      description: 'Promotional superlatives such as "India\'s No. 1", "Best in the world", or market leadership claims require documented, verified evidence in the brand repository before publication.',
      category: 'Promotional Claim',
      severity: 'medium',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const g4 = await Guideline.create({
      guidelineId: 'GUIDE-004',
      title: 'Brand Tone: Professional, Friendly, and Informative',
      description: 'Maintain a clean, premium, and trustworthy editorial voice. Avoid multiple exclamation marks (e.g. "Buy now!!!"), aggressive clickbait, and hyperbolic slang.',
      category: 'Brand Style & Tone',
      severity: 'low',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const g5 = await Guideline.create({
      guidelineId: 'GUIDE-005',
      title: 'Mandatory FSSAI Compliance and Packaging Disclaimers',
      description: 'Every promotional asset presenting nutritional benefits must incorporate official FSSAI licensing and reference 100% rPET recyclable packaging standards.',
      category: 'Regulatory Compliance',
      severity: 'high',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    console.log('[Seed] Seeding terminology rules...');
    const t1 = await Terminology.create({
      terminologyId: 'TERM-001',
      preferredTerm: 'FreshPlus',
      prohibitedTerms: ['Fresh+', 'Fresh Plus', 'FRESH+', 'Freshplus'],
      explanation: 'The brand name is a single camel-case word "FreshPlus" with capital F and capital P.',
      category: 'Product Name',
      severity: 'high',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const t2 = await Terminology.create({
      terminologyId: 'TERM-002',
      preferredTerm: '100% Pure Pasteurized Juice',
      prohibitedTerms: ['Orange Soda', 'Synthetic Orange', 'Fruit Concentrate Drink', 'Orange Squash'],
      explanation: 'FreshPlus is 100% pure pasteurized juice, not a diluted concentrate or synthetic carbonated soda.',
      category: 'Ingredient Quality',
      severity: 'medium',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const t3 = await Terminology.create({
      terminologyId: 'TERM-003',
      preferredTerm: 'Zero Added Cane Sugar',
      prohibitedTerms: ['Diet Drink', 'Zero Calorie', 'Sugar Free'],
      explanation: 'Our products contain natural fruit sugars; "Sugar Free" violates consumer protection standards.',
      category: 'Nutritional Messaging',
      severity: 'high',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    console.log('[Seed] Seeding approved facts...');
    const f1 = await ApprovedFact.create({
      factId: 'FACT-001',
      statement: 'FreshPlus Valencia Orange juice contains 100% pure fruit juice with zero added refined sugars or artificial preservatives.',
      category: 'Ingredients',
      sourceDoc: 'FSSAI Certified Lab Analysis #FP-2025-08',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const f2 = await ApprovedFact.create({
      factId: 'FACT-002',
      statement: 'FreshPlus Orange Juice delivers 24mg of natural Vitamin C per 100ml serving, satisfying 60% of daily recommended nutritional intake.',
      category: 'Nutrition',
      sourceDoc: 'National Institute of Nutrition Analysis #NIN-2025-41',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const f3 = await ApprovedFact.create({
      factId: 'FACT-003',
      statement: 'FreshPlus bottles are crafted from 100% recycled rPET and are fully recyclable across India.',
      category: 'Packaging',
      sourceDoc: 'CPCB Green Packaging Certification #CPCB-9941',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

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

    console.log('[Seed] Seeding Submission 1: Social Teaser (Unsupported health claim + Promotional superlative)...');
    const content1Text = "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!";
    const content1 = await Content.create({
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
        contentId: content1._id,
        versionNumber: 1,
        rawText: content1Text,
        submittedBy: creator._id,
        changeNotes: 'Initial draft submitted for pre-publication governance review',
        aiReviewCompleted: true,
        governanceScore: 42,
        totalFindings: 4
      },
      {
        contentId: content1._id,
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
        contentId: content1._id,
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
        contentId: content1._id,
        versionNumber: 1,
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
        contentId: content1._id,
        versionNumber: 1,
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
        contentId: content1._id,
        versionNumber: 1,
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
    ]);

    await Comment.create({
      contentId: content1._id,
      versionNumber: 1,
      author: reviewer._id,
      role: 'reviewer',
      comment: 'Priya, please adopt the approved "FreshPlus" spelling, remove the instant cure claim, and tone down the promotional superlatives before we can approve this for publication.'
    });

    console.log('[Seed] Seeding Submission 2: Marketing Ad Copy (Promotional superlatives & guarantees)...');
    const content2Text = "Drink FreshPlus every morning for guaranteed 100% natural energy. The best juice in India to power through workdays.";
    const content2 = await Content.create({
      title: 'Valencia Orange - Morning Energy Ad Copy',
      contentType: 'Marketing Ad Copy',
      campaign: 'Daily Nutrition 2026',
      creator: creator._id,
      currentVersion: 1,
      status: 'in_review',
      lastReviewedAt: new Date(Date.now() - 86400000 * 1),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create({
      contentId: content2._id,
      versionNumber: 1,
      rawText: content2Text,
      submittedBy: creator._id,
      changeNotes: 'Initial draft for Q2 digital campaign',
      aiReviewCompleted: true,
      governanceScore: 74,
      totalFindings: 2
    });

    await Finding.create([
      {
        contentId: content2._id,
        versionNumber: 1,
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
        contentId: content2._id,
        versionNumber: 1,
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
    ]);

    await Comment.create({
      contentId: content2._id,
      versionNumber: 1,
      author: reviewer._id,
      role: 'reviewer',
      comment: 'Please soften the "guaranteed" wording and reference our approved FACT-002 (24mg natural Vitamin C) instead of calling it the best juice in India.'
    });

    console.log('[Seed] Seeding Submission 3: Retail Pack Description (Approved baseline)...');
    const content3Text = "FreshPlus 100% Pure Pasteurized Orange Juice contains zero added sugar and delivers 24mg of natural Vitamin C per 100ml. Bottled in 100% recyclable rPET.";
    const content3 = await Content.create({
      title: 'Pure Valencia Orange - Retail Pack Description',
      contentType: 'Packaging Copy',
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
        contentId: content3._id,
        versionNumber: 1,
        rawText: "Fresh Plus pure juice with natural energy.",
        submittedBy: creator._id,
        changeNotes: 'First draft',
        aiReviewCompleted: true,
        governanceScore: 78,
        totalFindings: 1
      },
      {
        contentId: content3._id,
        versionNumber: 2,
        rawText: content3Text,
        submittedBy: creator._id,
        changeNotes: 'Corrected terminology to FreshPlus and cited verified facts',
        aiReviewCompleted: true,
        governanceScore: 98,
        totalFindings: 0
      }
    ]);

    await Comment.create({
      contentId: content3._id,
      versionNumber: 2,
      author: reviewer._id,
      role: 'reviewer',
      comment: '[APPROVED]: Fully verified against GUIDE-001, FACT-001, FACT-002, and FACT-003. Approved for commercial retail packaging.'
    });

    console.log('[Seed] Seeding audit logs...');
    await AuditLog.create([
      {
        user: manager._id,
        userEmail: manager.email,
        role: 'manager',
        action: 'CONTENT_APPROVED',
        targetResource: 'Content',
        targetId: content3._id.toString(),
        details: { title: content3.title, campaign: content3.campaign }
      },
      {
        user: reviewer._id,
        userEmail: reviewer.email,
        role: 'reviewer',
        action: 'COMMENT_ADDED',
        targetResource: 'Content',
        targetId: content2._id.toString(),
        details: { comment: 'Requested softening of promotional guarantee' }
      },
      {
        user: reviewer._id,
        userEmail: reviewer.email,
        role: 'reviewer',
        action: 'AI_REVIEW_COMPLETED',
        targetResource: 'Content',
        targetId: content1._id.toString(),
        details: { findingsCount: 4, score: 42 }
      },
      {
        user: creator._id,
        userEmail: creator.email,
        role: 'creator',
        action: 'SUBMIT_CONTENT',
        targetResource: 'Content',
        targetId: content1._id.toString(),
        details: { title: content1.title, version: 1 }
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
