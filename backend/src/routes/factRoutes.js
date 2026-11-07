const express = require('express');
const router = express.Router();
const {
  getFacts,
  getFactById,
  createFact,
  updateFact,
  deleteFact
} = require('../controllers/factController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');

router.route('/')
  .get(protect, getFacts)
  .post(protect, authorize('manager'), createFact);

router.route('/:id')
  .get(protect, getFactById)
  .put(protect, authorize('manager'), updateFact)
  .delete(protect, authorize('manager'), deleteFact);

module.exports = router;
