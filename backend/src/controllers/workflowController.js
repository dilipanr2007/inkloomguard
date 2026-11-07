const Content = require('../models/Content');
const Comment = require('../models/Comment');
const AuditLog = require('../models/AuditLog');
const { logAudit } = require('../utils/auditLogger');

// @desc    Add review comment
// @route   POST /api/content/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { comment, findingId } = req.body;
    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    const newComment = await Comment.create({
      contentId: content._id,
      versionNumber: content.currentVersion,
      author: req.user._id,
      role: req.user.role,
      comment: comment.trim(),
      findingId: findingId || null
    });

    const populated = await newComment.populate('author', 'name email role');

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'ADD_COMMENT',
      targetResource: 'Content',
      targetId: content._id,
      details: { comment: newComment.comment, version: content.currentVersion }
    });

    res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Request changes on submission
// @route   POST /api/content/:id/request-changes
// @access  Private (Reviewer, Manager)
const requestChanges = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Reason for requesting changes is required' });
    }

    const content = await Content.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    content.status = 'changes_requested';
    content.reviewedBy = req.user._id;
    content.lastReviewedAt = new Date();
    await content.save();

    const comment = await Comment.create({
      contentId: content._id,
      versionNumber: content.currentVersion,
      author: req.user._id,
      role: req.user.role,
      comment: `[CHANGES REQUESTED]: ${reason.trim()}`
    });

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'REQUEST_CHANGES',
      targetResource: 'Content',
      targetId: content._id,
      details: { reason: reason.trim(), version: content.currentVersion }
    });

    res.json({
      success: true,
      message: 'Changes requested successfully',
      content,
      comment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve submission
// @route   POST /api/content/:id/approve
// @access  Private (Reviewer, Manager ONLY - Creators forbidden)
const approveContent = async (req, res, next) => {
  try {
    const { comment } = req.body;
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ success: false, message: 'Content not found' });
    }

    // Role check: Creators cannot approve any content
    if (req.user.role === 'creator') {
      return res.status(403).json({
        success: false,
        message: 'Creators cannot self-approve content. Only designated Reviewers or Managers can grant publication approval.'
      });
    }

    content.status = 'approved';
    content.reviewedBy = req.user._id;
    content.lastReviewedAt = new Date();
    await content.save();

    if (comment && comment.trim().length > 0) {
      await Comment.create({
        contentId: content._id,
        versionNumber: content.currentVersion,
        author: req.user._id,
        role: req.user.role,
        comment: `[APPROVED]: ${comment.trim()}`
      });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'APPROVE_CONTENT',
      targetResource: 'Content',
      targetId: content._id,
      details: {
        version: content.currentVersion,
        approvedBy: req.user.email,
        comment: comment || 'Approved for publication'
      }
    });

    res.json({
      success: true,
      message: 'Content approved for publication by human reviewer',
      content
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complete audit and workflow history for content
// @route   GET /api/content/:id/history
// @access  Private
const getContentHistory = async (req, res, next) => {
  try {
    const history = await AuditLog.find({
      targetResource: 'Content',
      targetId: req.params.id
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: history.length, history });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addComment,
  requestChanges,
  approveContent,
  getContentHistory
};
