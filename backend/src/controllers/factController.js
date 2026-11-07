const ApprovedFact = require('../models/ApprovedFact');
const { logAudit } = require('../utils/auditLogger');
const { syncAiKnowledgeBase } = require('../services/aiService');

// @desc    Get all approved facts
// @route   GET /api/facts
// @access  Private
const getFacts = async (req, res, next) => {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { factId: { $regex: search, $options: 'i' } },
        { statement: { $regex: search, $options: 'i' } },
        { sourceDoc: { $regex: search, $options: 'i' } }
      ];
    }

    const facts = await ApprovedFact.find(query).sort({ factId: 1 });
    res.json({ success: true, count: facts.length, facts });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approved fact by ID
// @route   GET /api/facts/:id
// @access  Private
const getFactById = async (req, res, next) => {
  try {
    const fact = await ApprovedFact.findById(req.params.id);
    if (!fact) {
      return res.status(404).json({ success: false, message: 'Fact not found' });
    }
    res.json({ success: true, fact });
  } catch (error) {
    next(error);
  }
};

// @desc    Create approved fact (Manager only)
// @route   POST /api/facts
// @access  Private/Manager
const createFact = async (req, res, next) => {
  try {
    const { factId, statement, category, sourceDoc, verificationDate, status, version } = req.body;

    const existing = await ApprovedFact.findOne({ factId: factId.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: `Fact ID ${factId} already exists` });
    }

    const fact = await ApprovedFact.create({
      factId: factId.toUpperCase(),
      statement,
      category: category || 'Ingredients',
      sourceDoc,
      verificationDate: verificationDate || new Date(),
      status: status || 'active',
      version: version || '1.0',
      createdBy: req.user._id,
      organization: req.user.organization
    });

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'CREATE_APPROVED_FACT',
      targetResource: 'ApprovedFact',
      targetId: fact._id,
      details: { factId: fact.factId, statement: fact.statement }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.status(201).json({ success: true, fact });
  } catch (error) {
    next(error);
  }
};

// @desc    Update approved fact (Manager only)
// @route   PUT /api/facts/:id
// @access  Private/Manager
const updateFact = async (req, res, next) => {
  try {
    const fact = await ApprovedFact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!fact) {
      return res.status(404).json({ success: false, message: 'Fact not found' });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'UPDATE_APPROVED_FACT',
      targetResource: 'ApprovedFact',
      targetId: fact._id,
      details: { factId: fact.factId }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.json({ success: true, fact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete approved fact (Manager only)
// @route   DELETE /api/facts/:id
// @access  Private/Manager
const deleteFact = async (req, res, next) => {
  try {
    const fact = await ApprovedFact.findByIdAndDelete(req.params.id);
    if (!fact) {
      return res.status(404).json({ success: false, message: 'Fact not found' });
    }

    await logAudit({
      user: req.user,
      role: req.user.role,
      action: 'DELETE_APPROVED_FACT',
      targetResource: 'ApprovedFact',
      targetId: fact._id,
      details: { factId: fact.factId }
    });

    syncAiKnowledgeBase().catch(err => console.error('[AI Sync Error]', err.message));

    res.json({ success: true, message: 'Fact deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFacts,
  getFactById,
  createFact,
  updateFact,
  deleteFact
};
