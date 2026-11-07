const Content = require('../models/Content');
const ContentVersion = require('../models/ContentVersion');
const Finding = require('../models/Finding');
const Guideline = require('../models/Guideline');
const Terminology = require('../models/Terminology');

// @desc    Get aggregated overview analytics
// @route   GET /api/analytics/overview
// @access  Private
const getOverviewAnalytics = async (req, res, next) => {
  try {
    const totalSubmissions = await Content.countDocuments();
    const approvedSubmissions = await Content.countDocuments({ status: 'approved' });
    const inReviewSubmissions = await Content.countDocuments({ status: { $in: ['in_review', 'ai_reviewed'] } });
    const changesRequested = await Content.countDocuments({ status: 'changes_requested' });
    const draftSubmissions = await Content.countDocuments({ status: 'draft' });

    const totalFindings = await Finding.countDocuments();
    const dismissedFindings = await Finding.countDocuments({ decision: 'dismissed' });
    const acceptedFindings = await Finding.countDocuments({ decision: 'accepted' });

    // Calculate average governance score from versions
    const scoreAgg = await ContentVersion.aggregate([
      { $match: { governanceScore: { $ne: null } } },
      { $group: { _id: null, avgScore: { $avg: '$governanceScore' } } }
    ]);
    const averageScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 85;

    res.json({
      success: true,
      stats: {
        totalSubmissions,
        approvedSubmissions,
        inReviewSubmissions,
        changesRequested,
        draftSubmissions,
        totalFindings,
        dismissedFindings,
        acceptedFindings,
        averageGovernanceScore: averageScore
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get findings grouped by category and severity
// @route   GET /api/analytics/findings
// @access  Private
const getFindingsAnalytics = async (req, res, next) => {
  try {
    const byCategory = await Finding.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { category: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    const bySeverity = await Finding.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } },
      { $project: { severity: '$_id', count: 1, _id: 0 } }
    ]);

    const byEvidenceStatus = await Finding.aggregate([
      { $group: { _id: '$evidenceStatus', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);

    const byDecision = await Finding.aggregate([
      { $group: { _id: '$decision', count: { $sum: 1 } } },
      { $project: { decision: '$_id', count: 1, _id: 0 } }
    ]);

    res.json({
      success: true,
      byCategory,
      bySeverity,
      byEvidenceStatus,
      byDecision
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get most frequently triggered rules and dismissed findings
// @route   GET /api/analytics/rules
// @access  Private
const getRulesAnalytics = async (req, res, next) => {
  try {
    const triggeredRules = await Finding.aggregate([
      { $unwind: '$sourceIds' },
      { $group: { _id: '$sourceIds', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Attach rule title/details
    const ruleIds = triggeredRules.map(r => r._id);
    const guidelines = await Guideline.find({ guidelineId: { $in: ruleIds } });
    const terminology = await Terminology.find({ terminologyId: { $in: ruleIds } });

    const formattedRules = triggeredRules.map(r => {
      const g = guidelines.find(item => item.guidelineId === r._id);
      const t = terminology.find(item => item.terminologyId === r._id);
      return {
        ruleId: r._id,
        count: r.count,
        title: g ? g.title : (t ? `Terminology: ${t.preferredTerm}` : r._id),
        category: g ? g.category : (t ? 'Brand Terminology' : 'General')
      };
    });

    const dismissedFindings = await Finding.find({ decision: 'dismissed' })
      .select('category excerpt dismissalReason createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      frequentlyTriggeredRules: formattedRules,
      recentDismissals: dismissedFindings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOverviewAnalytics,
  getFindingsAnalytics,
  getRulesAnalytics
};
