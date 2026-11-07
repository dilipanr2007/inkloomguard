const Terminology = require('../models/Terminology');
const { logAudit } = require('../utils/auditLogger');
const { syncAiKnowledgeBase } = require('../services/aiService');

// @desc    Get all terminology rules
// @route   GET /api/terminology
// @access  Private
const getTerminology = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { terminologyId: { $regex: search, $options: 'i' } },
        { preferredTerm: { $regex: search, $options: 'i' } },
        { prohibitedTerms: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const items = await Terminology.find(query).sort({ terminologyId: 1 });
    res.json({ success: true, count: items.length, terminology: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Get terminology by ID
// @route   GET /api/terminology/:id
// @access  Private
const getTerminologyById = async (req, res, next) => {
  try {
    const item = await Terminology.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Terminology entry not found' });
    }
    res.json({ success: true, terminology: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Create terminology rule (Manager only)
// @route   POST /api/terminology
// @access  Private/Manager
const createTerminology = async (req, res, next) => {
  try {
    const { terminologyId, preferredTerm, prohibitedTerms, explanation, category, severity, caseSensitive, status } = req.body;

    const existing = await Terminology.findOne({ terminologyId: terminologyId.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Terminology ID ${terminologyId} already exists` });
    }

    const item = await Terminology.create({
      terminologyId: terminologyId.toUpperCase(),
      preferredTerm,
      prohibitedTerms: Array.isArray(prohibitedTerms) ? prohibitedTerms : prohibitedTerms.split(',').map(s => s.trim()),
      explanation,
      category: category || 'Product Name',
      severity: severity || 'high',
      caseSensitive: !!caseSensitive,
      status: status || 'active',
      createdBy: req.user._id,
      organization: req.user.organization
    });

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'CREATE_TERMINOLOGY',
      targetResource: 'Terminology',
      targetId: item._id,
      details: { terminologyId: item.terminologyId, preferred: item.preferredTerm }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.status(201).json({ success: true, terminology: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Update terminology rule (Manager only)
// @route   PUT /api/terminology/:id
// @access  Private/Manager
const updateTerminology = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (updates.prohibitedTerms && typeof updates.prohibitedTerms === 'string') {
      updates.prohibitedTerms = updates.prohibitedTerms.split(',').map(s => s.trim());
    }

    const item = await Terminology.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!item) {
      return res.status(404).json({ success: false, message: 'Terminology entry not found' });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'UPDATE_TERMINOLOGY',
      targetResource: 'Terminology',
      targetId: item._id,
      details: { terminologyId: item.terminologyId }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.json({ success: true, terminology: item });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete terminology rule (Manager only)
// @route   DELETE /api/terminology/:id
// @access  Private/Manager
const deleteTerminology = async (req, res, next) => {
  try {
    const item = await Terminology.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Terminology entry not found' });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'DELETE_TERMINOLOGY',
      targetResource: 'Terminology',
      targetId: item._id,
      details: { terminologyId: item.terminologyId }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.json({ success: true, message: 'Terminology entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTerminology,
  getTerminologyById,
  createTerminology,
  updateTerminology,
  deleteTerminology
};
