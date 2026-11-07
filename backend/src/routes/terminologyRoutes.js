const express = require('express');
const router = express.Router();
const {
  getTerminology,
  getTerminologyById,
  createTerminology,
  updateTerminology,
  deleteTerminology
} = require('../controllers/terminologyController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getTerminology)
  .post(protect, authorize('manager'), createTerminology);

router.route('/:id')
  .get(protect, getTerminologyById)
  .put(protect, authorize('manager'), updateTerminology)
  .delete(protect, authorize('manager'), deleteTerminology);

module.exports = router;
