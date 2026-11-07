const express = require('express');
const router = express.Router();
const {
  createContent,
  getContents,
  getContentById,
  triggerReview,
  submitRevision,
  compareVersions
} = require('../controllers/contentController');
const { getFindings } = require('../controllers/findingController');
const { addComment, requestChanges, approveContent, getContentHistory } = require('../controllers/workflowController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .post(protect, createContent)
  .get(protect, getContents);

router.get('/:id/compare', protect, compareVersions);
router.get('/:id/findings', protect, getFindings);
router.get('/:id/history', protect, getContentHistory);

router.post('/:id/review', protect, triggerReview);
router.post('/:id/revisions', protect, submitRevision);
router.post('/:id/comments', protect, addComment);
router.post('/:id/request-changes', protect, authorize('reviewer', 'manager'), requestChanges);
router.post('/:id/approve', protect, authorize('reviewer', 'manager'), approveContent);

router.route('/:id')
  .get(protect, getContentById);

module.exports = router;
