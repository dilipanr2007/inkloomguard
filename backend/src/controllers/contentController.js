const Content = require('../models/Content');
const ContentVersion = require('../models/ContentVersion');
const Finding = require('../models/Finding');
const Comment = require('../models/Comment');
const { logAudit } = require('../utils/auditLogger');
const { requestAiReview } = require('../services/aiService');

// @desc    Submit new content
// @route   POST /api/content
// @access  Private (Creator, Manager)
const createContent = async (req, res, next) => {
  try {
    const { title, contentType, campaign, rawText, autoReview } = req.body;

    if (!title || !rawText) {
      return res.status(400).json({ success: false, message: 'Title and content text are required' });
    }

    const content = await Content.create({
      title,
      contentType: contentType || 'General Marketing',
      campaign: campaign || 'General Campaign',
      creator: req.user._id,
      currentVersion: 1,
      status: 'draft',
      organization: req.user.organization
    });

    const version = await ContentVersion.create({
      contentId: content._id,
      versionNumber: 1,
      rawText,
      submittedBy: req.user._id,
      changeNotes: 'Initial draft submission'
    });

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'SUBMIT_CONTENT',
      targetResource: 'Content',
      targetId: content._id,
      details: { title: content.title, version: 1 }
    });

    // If autoReview requested, immediately run AI review
    if (autoReview) {
      const aiResult = await requestAiReview({
        contentId: content._id,
        versionNumber: 1,
        text: rawText,
        contentType: content.contentType
      });

      // Save findings
      if (aiResult.findings && aiResult.findings.length > 0) {
        const findingDocs = aiResult.findings.map(f => ({
          contentId: content._id,
          versionNumber: 1,
          category: f.category,
          severity: f.severity,
          excerpt: f.excerpt,
          reason: f.reason,
          evidenceStatus: f.evidence_status,
          sourceIds: f.source_ids || [],
          sourceExcerpt: f.source_excerpt || '',
          suggestedRewrite: f.suggested_rewrite || '',
          confidence: f.confidence || 0.9,
          decision: 'pending'
        }));
        await Finding.insertMany(findingDocs);
      }

      version.aiReviewCompleted = true;
      version.governanceScore = aiResult.governance_score || 85;
      version.totalFindings = aiResult.findings ? aiResult.findings.length : 0;
      await version.save();

      content.status = 'ai_reviewed';
      content.lastReviewedAt = new Date();
      await content.save();
    }

    res.status(201).json({
      success: true,
      content,
      version
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all content submissions
// @route   GET /api/content
// @access  Private
const getContents = async (req, res, next) => {
  try {
    const { status, contentType, myOnly, search } = req.query;
    const query = {};

    if (status && status !== 'all') query.status = status;
    if (contentType) query.contentType = contentType;
    if (myOnly === 'true' || req.user.role === 'creator') {
      query.creator = req.user._id;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { campaign: { $regex: search, $options: 'i' } }
      ];
    }

    const contents = await Content.find(query)
      .populate('creator', 'name email role')
      .populate('reviewedBy', 'name email role')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: contents.length, contents });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single content with current version, findings, and comments
// @route   GET /api/content/:id
// @access  Private
const getContentById = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('creator', 'name email role')
      .populate('reviewedBy', 'name email role');

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    // Role check: creators can only access their own content unless reviewer or manager
    if (req.user.role === 'creator' && content.creator._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied to this submission' });
    }

    const currentVersionDoc = await ContentVersion.findOne({
      contentId: content._id,
      versionNumber: content.currentVersion
    });

    const allVersions = await ContentVersion.find({ contentId: content._id })
      .select('versionNumber createdAt governanceScore totalFindings changeNotes')
      .sort({ versionNumber: -1 });

    const findings = await Finding.find({
      contentId: content._id,
      versionNumber: content.currentVersion
    }).sort({ severity: 1 });

    const comments = await Comment.find({ contentId: content._id })
      .populate('author', 'name email role')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      content,
      currentVersion: currentVersionDoc,
      allVersions,
      findings,
      comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trigger AI Review on specific content version
// @route   POST /api/content/:id/review
// @access  Private
const triggerReview = async (req, res, next) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const versionDoc = await ContentVersion.findOne({
      contentId: content._id,
      versionNumber: content.currentVersion
    });

    if (!versionDoc) {
      return res.status(404).json({ success: false, message: 'Current version text not found' });
    }

    // Remove old findings for this version before re-reviewing
    await Finding.deleteMany({ contentId: content._id, versionNumber: content.currentVersion });

    const aiResult = await requestAiReview({
      contentId: content._id,
      versionNumber: content.currentVersion,
      text: versionDoc.rawText,
      contentType: content.contentType
    });

    let findingDocs = [];
    if (aiResult.findings && aiResult.findings.length > 0) {
      findingDocs = aiResult.findings.map(f => ({
        contentId: content._id,
        versionNumber: content.currentVersion,
        category: f.category,
        severity: f.severity,
        excerpt: f.excerpt,
        reason: f.reason,
        evidenceStatus: f.evidence_status,
        sourceIds: f.source_ids || [],
        sourceExcerpt: f.source_excerpt || '',
        suggestedRewrite: f.suggested_rewrite || '',
        confidence: f.confidence || 0.9,
        decision: 'pending'
      }));
      await Finding.insertMany(findingDocs);
    }

    versionDoc.aiReviewCompleted = true;
    versionDoc.governanceScore = aiResult.governance_score || 85;
    versionDoc.totalFindings = findingDocs.length;
    await versionDoc.save();

    content.status = 'ai_reviewed';
    content.lastReviewedAt = new Date();
    await content.save();

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'AI_REVIEW_COMPLETED',
      targetResource: 'Content',
      targetId: content._id,
      details: {
        version: content.currentVersion,
        findingsCount: findingDocs.length,
        score: versionDoc.governanceScore
      }
    });

    res.json({
      success: true,
      message: 'AI review completed successfully',
      findings: findingDocs,
      governanceScore: versionDoc.governanceScore
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a new revision of existing content
// @route   POST /api/content/:id/revisions
// @access  Private (Creator, Manager)
const submitRevision = async (req, res, next) => {
  try {
    const { rawText, changeNotes, autoReview } = req.body;
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    if (req.user.role === 'creator' && content.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this submission' });
    }

    const nextVersionNumber = content.currentVersion + 1;

    const newVersion = await ContentVersion.create({
      contentId: content._id,
      versionNumber: nextVersionNumber,
      rawText,
      submittedBy: req.user._id,
      changeNotes: changeNotes || `Revision submitted for v${nextVersionNumber}`
    });

    content.currentVersion = nextVersionNumber;
    content.status = 'draft';
    await content.save();

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'SUBMIT_REVISION',
      targetResource: 'Content',
      targetId: content._id,
      details: { version: nextVersionNumber, changeNotes }
    });

    // Optionally auto-run AI review on new revision
    if (autoReview !== false) {
      const aiResult = await requestAiReview({
        contentId: content._id,
        versionNumber: nextVersionNumber,
        text: rawText,
        contentType: content.contentType
      });

      if (aiResult.findings && aiResult.findings.length > 0) {
        const findingDocs = aiResult.findings.map(f => ({
          contentId: content._id,
          versionNumber: nextVersionNumber,
          category: f.category,
          severity: f.severity,
          excerpt: f.excerpt,
          reason: f.reason,
          evidenceStatus: f.evidence_status,
          sourceIds: f.source_ids || [],
          sourceExcerpt: f.source_excerpt || '',
          suggestedRewrite: f.suggested_rewrite || '',
          confidence: f.confidence || 0.9,
          decision: 'pending'
        }));
        await Finding.insertMany(findingDocs);
      }

      newVersion.aiReviewCompleted = true;
      newVersion.governanceScore = aiResult.governance_score || 90;
      newVersion.totalFindings = aiResult.findings ? aiResult.findings.length : 0;
      await newVersion.save();

      content.status = 'ai_reviewed';
      content.lastReviewedAt = new Date();
      await content.save();
    }

    res.status(201).json({
      success: true,
      message: `Version ${nextVersionNumber} created successfully`,
      content,
      version: newVersion
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Compare two versions of content
// @route   GET /api/content/:id/compare
// @access  Private
const compareVersions = async (req, res, next) => {
  try {
    const { v1, v2 } = req.query;
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ success: false, message: 'Content not found' });

    const ver1 = await ContentVersion.findOne({ contentId: content._id, versionNumber: parseInt(v1) });
    const ver2 = await ContentVersion.findOne({ contentId: content._id, versionNumber: parseInt(v2) });

    if (!ver1 || !ver2) {
      return res.status(404).json({ success: false, message: 'One or both versions not found' });
    }

    res.json({
      success: true,
      v1: ver1,
      v2: ver2
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createContent,
  getContents,
  getContentById,
  triggerReview,
  submitRevision,
  compareVersions
};
