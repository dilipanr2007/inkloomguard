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
    // Create demo users (plain text password passed to trigger pre('save') bcrypt hashing once)
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
      description: 'Use a professional, friendly, and informative tone. Avoid sensationalist punctuation, aggressive urgency (e.g., multiple exclamation marks, "Buy now!!!"), and hyperbole.',
      category: 'Brand Tone',
      severity: 'advisory',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    const g5 = await Guideline.create({
      guidelineId: 'GUIDE-005',
      title: 'Messaging Consistency & Ingredient Transparency',
      description: 'All copy must communicate everyday natural freshness, transparent sourcing, and balanced lifestyle benefits. Never depict fresh juice as a chemical replacement for balanced meals.',
      category: 'Messaging Consistency',
      severity: 'medium',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    console.log('[Seed] Seeding terminology rules...');
    const t1 = await Terminology.create({
      terminologyId: 'TERM-001',
      preferredTerm: 'FreshPlus',
      prohibitedTerms: ['Fresh+', 'Fresh Plus', 'fresh plus', 'Freshplus'],
      explanation: 'The brand name must always be formatted in CamelCase as "FreshPlus". The symbol "+" is forbidden in marketing copy.',
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
      explanation: 'FreshPlus is 100% pure pasteurized juice, not a diluted concentrate or carbonated soda.',
      category: 'Trademark',
      severity: 'high',
      status: 'active',
      version: '1.0',
      createdBy: manager._id
    });

    console.log('[Seed] Seeding approved facts...');
    const f1 = await ApprovedFact.create({
      factId: 'FACT-001',
      statement: 'FreshPlus Orange Juice contains 100% pasteurized orange juice and pure filtered water. Contains 0g added refined sugars.',
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

    console.log('[Seed] Seeding test case submission (from Hackathon Master Prompt)...');
    // Content 1: The exact test case from Prompt Section 9
    const testContentText = "Fresh+ cures fatigue instantly! India's No. 1 juice is finally here. Buy now!!!";
    const testContent = await Content.create({
      title: 'Summer Launch Campaign - Social Teaser',
      contentType: 'Social Media Post',
      campaign: 'Summer Launch 2026',
      creator: creator._id,
      currentVersion: 1,
      status: 'ai_reviewed',
      lastReviewedAt: new Date(),
      organization: 'FreshPlus Global'
    });

    const testVersion = await ContentVersion.create({
      contentId: testContent._id,
      versionNumber: 1,
      rawText: testContentText,
      submittedBy: creator._id,
      changeNotes: 'Initial draft submitted for pre-publication governance review',
      aiReviewCompleted: true,
      governanceScore: 42,
      totalFindings: 4
    });

    // Findings matching Section 9 exactly:
    await Finding.create([
      {
        contentId: testContent._id,
        versionNumber: 1,
        category: 'Brand Terminology',
        severity: 'high',
        excerpt: 'Fresh+',
        reason: 'The prohibited term "Fresh+" violates brand guidelines. The approved name is "FreshPlus".',
        evidenceStatus: 'contradicted',
        sourceIds: ['GUIDE-001', 'TERM-001'],
        sourceExcerpt: 'Preferred product name is "FreshPlus". Prohibited: Fresh+, Fresh Plus.',
        suggestedRewrite: 'FreshPlus',
        confidence: 0.98,
        decision: 'pending'
      },
      {
        contentId: testContent._id,
        versionNumber: 1,
        category: 'Unsupported Claim',
        severity: 'high',
        excerpt: 'cures fatigue instantly',
        reason: 'Health or medical curative claim made without substantiating clinical facts. Do not claim it cures fatigue or acts instantly without approved factual documentation.',
        evidenceStatus: 'unsupported',
        sourceIds: ['GUIDE-002'],
        sourceExcerpt: 'Do not use unsupported health benefit claims. All statements asserting curative or instant stamina outcomes are prohibited.',
        suggestedRewrite: 'supports daily refreshment and natural energy',
        confidence: 0.94,
        decision: 'pending'
      },
      {
        contentId: testContent._id,
        versionNumber: 1,
        category: 'Promotional Claim',
        severity: 'medium',
        excerpt: "India's No. 1",
        reason: 'Promotional superlative "India\'s No. 1" requires approved verification documentation in the facts repository.',
        evidenceStatus: 'unsupported',
        sourceIds: ['GUIDE-003'],
        sourceExcerpt: 'Promotional superlatives such as "India\'s No. 1" require documented, verified evidence in the brand repository.',
        suggestedRewrite: 'one of India’s most loved fruit juices',
        confidence: 0.91,
        decision: 'pending'
      },
      {
        contentId: testContent._id,
        versionNumber: 1,
        category: 'Brand Tone',
        severity: 'advisory',
        excerpt: 'Buy now!!!',
        reason: 'Excessive punctuation and aggressive commercial urgency conflicts with the friendly, informative brand tone.',
        evidenceStatus: 'advisory',
        sourceIds: ['GUIDE-004'],
        sourceExcerpt: 'Use a professional, friendly, and informative tone. Avoid sensationalist punctuation and aggressive urgency ("Buy now!!!").',
        suggestedRewrite: 'Try FreshPlus today.',
        confidence: 0.88,
        decision: 'pending'
      }
    ]);

    await Comment.create({
      contentId: testContent._id,
      versionNumber: 1,
      author: reviewer._id,
      role: 'reviewer',
      comment: 'Please address the terminology violation ("Fresh+") and remove the curative health claim before we can approve.'
    });

    console.log('[Seed] Seeding secondary approved submission...');
    // Content 2: Approved submission to demonstrate approved state and history
    const approvedContentText = "Start your morning with FreshPlus 100% pure orange juice. Delivers 24mg of natural Vitamin C per serving to keep you naturally refreshed.";
    const approvedContent = await Content.create({
      title: 'Morning Sunshine - Newsletter Email',
      contentType: 'Marketing Email',
      campaign: 'Daily Nutrition 2026',
      creator: creator._id,
      currentVersion: 2,
      status: 'approved',
      reviewedBy: reviewer._id,
      lastReviewedAt: new Date(Date.now() - 3600000 * 4),
      organization: 'FreshPlus Global'
    });

    await ContentVersion.create([
      {
        contentId: approvedContent._id,
        versionNumber: 1,
        rawText: "Start your morning with Fresh Plus juice. Contains high Vitamin C.",
        submittedBy: creator._id,
        changeNotes: 'First draft',
        aiReviewCompleted: true,
        governanceScore: 78,
        totalFindings: 1
      },
      {
        contentId: approvedContent._id,
        versionNumber: 2,
        rawText: approvedContentText,
        submittedBy: creator._id,
        changeNotes: 'Corrected terminology to FreshPlus and cited verified 24mg Vitamin C fact',
        aiReviewCompleted: true,
        governanceScore: 98,
        totalFindings: 0
      }
    ]);

    await Comment.create({
      contentId: approvedContent._id,
      versionNumber: 2,
      author: reviewer._id,
      role: 'reviewer',
      comment: '[APPROVED]: Perfect compliance with GUIDE-001 and FACT-002. Approved for dispatch.'
    });

    console.log('[Seed] Seeding audit logs...');
    await AuditLog.create([
      {
        user: creator._id,
        userEmail: creator.email,
        role: 'creator',
        action: 'SUBMIT_CONTENT',
        targetResource: 'Content',
        targetId: testContent._id.toString(),
        details: { title: testContent.title, version: 1 }
      },
      {
        user: reviewer._id,
        userEmail: reviewer.email,
        role: 'reviewer',
        action: 'AI_REVIEW_COMPLETED',
        targetResource: 'Content',
        targetId: testContent._id.toString(),
        details: { findingsCount: 4, score: 42 }
      },
      {
        user: reviewer._id,
        userEmail: reviewer.email,
        role: 'reviewer',
        action: 'APPROVE_CONTENT',
        targetResource: 'Content',
        targetId: approvedContent._id.toString(),
        details: { version: 2, comment: 'Approved for dispatch' }
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
