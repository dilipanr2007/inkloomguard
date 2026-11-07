const Guideline = require('../models/Guideline');
const { logAudit } = require('../utils/auditLogger');
const { syncAiKnowledgeBase } = require('../services/aiService');

// @desc    Get all guidelines
// @route   GET /api/guidelines
// @access  Private
const getGuidelines = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { guidelineId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const guidelines = await Guideline.find(query).sort({ guidelineId: 1 });
    res.json({ success: true, count: guidelines.length, guidelines });
  } catch (error) {
    next(error);
  }
};

// @desc    Get guideline by ID
// @route   GET /api/guidelines/:id
// @access  Private
const getGuidelineById = async (req, res, next) => {
  try {
    const guideline = await Guideline.findById(req.params.id);
    if (!guideline) {
      return res.status(404).json({ success: false, message: 'Guideline not found' });
    }
    res.json({ success: true, guideline });
  } catch (error) {
    next(error);
  }
};

// @desc    Create guideline (Manager only)
// @route   POST /api/guidelines
// @access  Private/Manager
const createGuideline = async (req, res, next) => {
  try {
    const { guidelineId, title, description, category, severity, version, status } = req.body;

    const existing = await Guideline.findOne({ guidelineId: guidelineId.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Guideline ID ${guidelineId} already exists` });
    }

    const guideline = await Guideline.create({
      guidelineId: guidelineId.toUpperCase(),
      title,
      description,
      category,
      severity: severity || 'medium',
      version: version || '1.0',
      status: status || 'active',
      createdBy: req.user._id,
      organization: req.user.organization
    });

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'CREATE_GUIDELINE',
      targetResource: 'Guideline',
      targetId: guideline._id,
      details: { guidelineId: guideline.guidelineId, title: guideline.title }
    });

    // Asynchronously notify AI service to update RAG index
    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.status(201).json({ success: true, guideline });
  } catch (error) {
    next(error);
  }
};

// @desc    Update guideline (Manager only)
// @route   PUT /api/guidelines/:id
// @access  Private/Manager
const updateGuideline = async (req, res, next) => {
  try {
    const guideline = await Guideline.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!guideline) {
      return res.status(404).json({ success: false, message: 'Guideline not found' });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'UPDATE_GUIDELINE',
      targetResource: 'Guideline',
      targetId: guideline._id,
      details: { guidelineId: guideline.guidelineId, title: guideline.title }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.json({ success: true, guideline });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete guideline (Manager only)
// @route   DELETE /api/guidelines/:id
// @access  Private/Manager
const deleteGuideline = async (req, res, next) => {
  try {
    const guideline = await Guideline.findByIdAndDelete(req.params.id);
    if (!guideline) {
      return res.status(404).json({ success: false, message: 'Guideline not found' });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'DELETE_GUIDELINE',
      targetResource: 'Guideline',
      targetId: guideline._id,
      details: { guidelineId: guideline.guidelineId }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.json({ success: true, message: 'Guideline deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGuidelines,
  getGuidelineById,
  createGuideline,
  updateGuideline,
  deleteGuideline
};
