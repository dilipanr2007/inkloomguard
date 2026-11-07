const express = require('express');
const router = express.Router();
const {
  getGuidelines,
  getGuidelineById,
  createGuideline,
  updateGuideline,
  deleteGuideline
} = require('../controllers/guidelineController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getGuidelines)
  .post(protect, authorize('manager'), createGuideline);

router.route('/:id')
  .get(protect, getGuidelineById)
  .put(protect, authorize('manager'), updateGuideline)
  .delete(protect, authorize('manager'), deleteGuideline);

module.exports = router;
